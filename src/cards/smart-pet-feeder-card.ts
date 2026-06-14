import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';

type FeederEntity = {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    icon?: string;
    min?: number | string;
    max?: number | string;
    step?: number | string;
    unit_of_measurement?: string;
    device_class?: string;
    [key: string]: unknown;
  };
};

type HomeAssistant = {
  states: Record<string, FeederEntity | undefined>;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ) => Promise<unknown> | void;
};

type FeederLayout = 'auto' | 'horizontal' | 'vertical';

interface SmartPetFeederCardConfig {
  type?: string;
  feed_entity: string;
  feeding_entity?: string;
  battery_entity?: string;
  last_amount_entity?: string;
  last_fed_entity?: string;
  name?: string;
  pet_name?: string;
  icon?: string;
  width?: string;
  fill_container?: boolean;
  fill_height?: boolean;
  height?: string;
  border_radius?: string;
  layout?: FeederLayout;
  accent_color?: string;
  off_color?: string;
  background?: string;
  show_battery?: boolean;
  show_last_amount?: boolean;
  show_details?: boolean;
  animated?: boolean;
}

type ConfigElement = HTMLInputElement & {
  checked?: boolean;
  configValue?: keyof SmartPetFeederCardConfig;
};

const DEFAULT_CONFIG: Omit<SmartPetFeederCardConfig, 'feed_entity'> = {
  icon: 'mdi:food',
  width: '320px',
  fill_container: false,
  fill_height: true,
  height: '118px',
  border_radius: '18px',
  layout: 'auto',
  accent_color: '#ff9f2f',
  off_color: '#778392',
  background: '#101722',
  show_battery: true,
  show_last_amount: true,
  show_details: true,
  animated: true,
};

const LAYOUTS: FeederLayout[] = ['auto', 'horizontal', 'vertical'];

function fireConfigChanged(
  element: HTMLElement,
  config: Partial<SmartPetFeederCardConfig>,
): void {
  element.dispatchEvent(
    new CustomEvent('config-changed', {
      detail: { config },
      bubbles: true,
      composed: true,
    }),
  );
}

function isUnavailable(entity?: FeederEntity): boolean {
  return !entity || ['unavailable', 'unknown'].includes(entity.state);
}

function toNumber(value: unknown): number | undefined {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function formatAmount(value: number | undefined): string {
  if (value === undefined) {
    return '--';
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function cleanName(value: string | undefined, fallback: string): string {
  if (!value?.trim()) {
    return fallback;
  }

  return value.trim();
}

export class SmartPetFeederCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    selectedAmount: { state: true },
    pending: { state: true },
  };

  public hass?: HomeAssistant;
  private config!: SmartPetFeederCardConfig;
  private selectedAmount?: number;
  private pending = false;
  private pendingTimer?: number;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --pet-feeder-width: 320px;
        --pet-feeder-height: 118px;
        --pet-feeder-radius: 18px;
        --pet-feeder-accent: #ff9f2f;
        --pet-feeder-off: #778392;
        --pet-feeder-background: #101722;

        container-type: inline-size;
        display: block;
        height: var(--pet-feeder-host-height, auto);
        max-width: var(--pet-feeder-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        height: 100%;
        overflow: visible;
      }

      .card {
        background:
          radial-gradient(
            circle at 17% 18%,
            color-mix(in srgb, var(--pet-feeder-accent) 18%, transparent),
            transparent 38%
          ),
          linear-gradient(
            145deg,
            color-mix(in srgb, var(--pet-feeder-background) 88%, #ffffff 7%),
            color-mix(in srgb, var(--pet-feeder-background) 94%, #000000 17%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--pet-feeder-state-color) var(--pet-feeder-border-strength),
            transparent
          );
        border-radius: var(--pet-feeder-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 9%),
          0 14px 28px rgb(0 0 0 / 24%),
          0 0 var(--pet-feeder-outer-blur)
            color-mix(
              in srgb,
              var(--pet-feeder-state-color) var(--pet-feeder-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        min-height: var(--pet-feeder-height);
        overflow: hidden;
        padding: 10px;
        position: relative;
        width: 100%;
      }

      .card.fill-height {
        height: 100%;
      }

      .card::before {
        background:
          linear-gradient(
            120deg,
            rgb(255 255 255 / 11%),
            transparent 42%,
            rgb(255 255 255 / 4%) 72%,
            transparent
          ),
          radial-gradient(
            circle at 92% 18%,
            color-mix(in srgb, var(--pet-feeder-state-color) 18%, transparent),
            transparent 34%
          );
        content: "";
        inset: 0;
        opacity: var(--pet-feeder-sheen-opacity);
        pointer-events: none;
        position: absolute;
      }

      .card.feeding.animated::after {
        animation: pet-feeder-pulse 2.4s ease-in-out infinite;
      }

      .card::after {
        border: 1px solid
          color-mix(
            in srgb,
            var(--pet-feeder-state-color) var(--pet-feeder-ring-strength),
            transparent
          );
        border-radius: inherit;
        content: "";
        inset: 0;
        opacity: var(--pet-feeder-ring-opacity);
        pointer-events: none;
        position: absolute;
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 100%;
        position: relative;
        z-index: 1;
      }

      .card.fill-height.layout-vertical .content {
        justify-content: flex-start;
      }

      .top-group {
        display: grid;
        gap: 10px;
      }

      .card.fill-height.layout-vertical .top-group {
        margin-top: clamp(2px, 4cqi, 14px);
      }

      .head {
        align-items: center;
        display: grid;
        gap: 8px;
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .identity {
        align-items: center;
        appearance: none;
        background: transparent;
        border: 0;
        color: inherit;
        cursor: pointer;
        display: grid;
        font-family: inherit;
        gap: 8px;
        grid-template-columns: 34px minmax(0, 1fr);
        min-width: 0;
        padding: 0;
        text-align: left;
      }

      .icon-shell {
        align-items: center;
        background:
          radial-gradient(
            circle at 50% 35%,
            color-mix(in srgb, var(--pet-feeder-state-color) 16%, transparent),
            transparent 62%
          ),
          rgb(255 255 255 / 7%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 11px;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 8%);
        color: var(--pet-feeder-state-color);
        display: inline-flex;
        height: 34px;
        justify-content: center;
        width: 34px;
      }

      .icon-shell ha-icon {
        height: 19px;
        width: 19px;
      }

      .title-block {
        display: grid;
        gap: 2px;
        min-width: 0;
      }

      .name {
        font-size: 15px;
        font-weight: 760;
        letter-spacing: 0;
        line-height: 1.05;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status {
        align-items: center;
        color: var(--secondary-text-color, #aeb8c6);
        display: inline-flex;
        font-size: 11px;
        gap: 6px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dot {
        background: var(--pet-feeder-state-color);
        border-radius: 999px;
        box-shadow: 0 0 14px
          color-mix(in srgb, var(--pet-feeder-state-color) 58%, transparent);
        display: inline-block;
        height: 6px;
        width: 6px;
      }

      .battery {
        align-items: center;
        appearance: none;
        background: rgb(255 255 255 / 7%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        display: inline-flex;
        font-family: inherit;
        font-size: 11px;
        font-weight: 720;
        gap: 5px;
        line-height: 1;
        min-height: 26px;
        max-width: 108px;
        padding: 0 9px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .battery {
        color: var(--pet-feeder-battery-color);
        cursor: pointer;
      }

      .battery ha-icon {
        height: 14px;
        width: 14px;
      }

      .control-stack {
        align-items: center;
        display: grid;
        gap: 8px;
        grid-template-columns: minmax(0, 1fr) minmax(92px, 0.45fr);
      }

      .stepper {
        align-items: stretch;
        background:
          linear-gradient(
            180deg,
            rgb(255 255 255 / 8%),
            rgb(255 255 255 / 3%)
          );
        border: 1px solid rgb(255 255 255 / 11%);
        border-radius: 999px;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 7%);
        display: grid;
        grid-template-columns: 44px minmax(0, 1fr) 44px;
        min-height: 50px;
        overflow: hidden;
        position: relative;
      }

      .stepper::before,
      .stepper::after {
        background: rgb(255 255 255 / 9%);
        bottom: 14%;
        content: "";
        position: absolute;
        top: 14%;
        width: 1px;
      }

      .stepper::before {
        left: 44px;
      }

      .stepper::after {
        right: 44px;
      }

      .card.layout-vertical .control-stack {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .card.layout-vertical .stepper {
        grid-template-columns: 48px minmax(0, 1fr) 48px;
        min-height: 58px;
      }

      .card.layout-vertical .stepper::before {
        left: 48px;
      }

      .card.layout-vertical .stepper::after {
        right: 48px;
      }

      .card.layout-vertical .dose-value {
        font-size: clamp(26px, 11cqi, 34px);
      }

      .card.layout-vertical .feed-button,
      .card.layout-auto .feed-button {
        width: 100%;
      }

      .step-button,
      .feed-button {
        -webkit-tap-highlight-color: transparent;
        align-items: center;
        appearance: none;
        border: 0;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: inline-flex;
        font-family: inherit;
        justify-content: center;
      }

      .step-button {
        background: transparent;
        height: 100%;
        position: relative;
        transition: background 0.18s ease;
        width: 100%;
      }

      .step-button:hover:not(:disabled) {
        background: rgb(255 255 255 / 7%);
      }

      .step-button:active:not(:disabled) {
        background: rgb(255 255 255 / 12%);
      }

      .step-button ha-icon {
        height: 18px;
        width: 18px;
      }

      .step-button:disabled,
      .feed-button:disabled {
        cursor: default;
        opacity: 0.32;
      }

      .dose {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 0;
        box-shadow: none;
        display: flex;
        flex-direction: column;
        gap: 2px;
        justify-content: center;
        min-height: 0;
        overflow: hidden;
        padding: 0 10px;
      }

      .dose-value {
        color: #ffffff;
        font-size: clamp(22px, 10cqi, 30px);
        font-weight: 780;
        letter-spacing: 0;
        line-height: 1;
        text-align: center;
      }

      .dose-label {
        color: var(--secondary-text-color, #aeb8c6);
        font-size: 9px;
        font-weight: 720;
        letter-spacing: 0.12em;
        line-height: 1.1;
        text-transform: uppercase;
      }

      .feed-button {
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, #ffffff 18%, transparent),
            transparent 55%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--pet-feeder-state-color) 82%, #ffffff 4%),
            color-mix(in srgb, var(--pet-feeder-state-color) 70%, #000000 12%)
          );
        border: 1px solid
          color-mix(in srgb, var(--pet-feeder-state-color) 78%, #ffffff 12%);
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 18%),
          0 10px 20px
            color-mix(in srgb, var(--pet-feeder-state-color) 18%, transparent);
        font-size: 12px;
        font-weight: 800;
        height: 34px;
        min-width: 0;
        overflow: hidden;
        padding: 0 12px;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .card.unavailable .feed-button {
        background: rgb(255 255 255 / 8%);
        border-color: rgb(255 255 255 / 10%);
        box-shadow: none;
      }

      .info-strip {
        border-top: 1px solid rgb(255 255 255 / 9%);
        display: none;
        gap: 7px;
        margin-top: auto;
        padding-top: 10px;
      }

      .card.layout-vertical .info-strip {
        display: grid;
      }

      .info-row {
        align-items: center;
        color: var(--secondary-text-color, #aeb8c6);
        display: flex;
        font-size: 11px;
        font-weight: 650;
        gap: 10px;
        justify-content: space-between;
        min-width: 0;
      }

      .info-label {
        letter-spacing: 0.08em;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .info-value {
        color: var(--primary-text-color, #f4f7fb);
        font-weight: 780;
        overflow: hidden;
        text-align: right;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @keyframes pet-feeder-pulse {
        0%,
        100% {
          box-shadow:
            inset 0 1px 0 rgb(255 255 255 / 9%),
            0 14px 28px rgb(0 0 0 / 24%),
            0 0 28px color-mix(in srgb, var(--pet-feeder-state-color) 12%, transparent);
        }

        50% {
          box-shadow:
            inset 0 1px 0 rgb(255 255 255 / 10%),
            0 14px 28px rgb(0 0 0 / 24%),
            0 0 46px color-mix(in srgb, var(--pet-feeder-state-color) 22%, transparent);
        }
      }

      /* Auto layout: horizontal by default, vertical when container < 280px */
      @container (max-width: 280px) {
        .card.layout-auto {
          padding: 11px;
        }

        .card.layout-auto .head {
          gap: 6px;
        }

        .card.layout-auto .control-stack {
          gap: 10px;
          grid-template-columns: 1fr;
        }

        .card.layout-auto .stepper {
          grid-template-columns: 48px minmax(0, 1fr) 48px;
          min-height: 58px;
        }

        .card.layout-auto .stepper::before {
          left: 48px;
        }

        .card.layout-auto .stepper::after {
          right: 48px;
        }

        .card.layout-auto .dose-value {
          font-size: clamp(26px, 11cqi, 34px);
        }

        .card.layout-auto .info-strip {
          display: grid;
        }
      }

      /* Very narrow: tighten battery */
      @container (max-width: 220px) {
        .battery {
          font-size: 10px;
          min-height: 22px;
          padding: 0 6px;
        }

        .battery ha-icon {
          height: 12px;
          width: 12px;
        }

        .stepper,
        .card.layout-auto .stepper,
        .card.layout-vertical .stepper {
          grid-template-columns: 40px minmax(0, 1fr) 40px;
          min-height: 50px;
        }

        .card.layout-auto .stepper::before,
        .card.layout-vertical .stepper::before {
          left: 40px;
        }

        .card.layout-auto .stepper::after,
        .card.layout-vertical .stepper::after {
          right: 40px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .card.feeding.animated::after {
          animation: none;
        }
      }
    `;
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement('smart-pet-feeder-card-editor');
  }

  public static getStubConfig(_: unknown, entities: string[]) {
    const lower = (entity: string) => entity.toLowerCase();
    const feederNumberEntities = entities.filter((entity) => {
      const id = lower(entity);
      return (
        entity.startsWith('number.') &&
        (id.includes('feed') ||
          id.includes('feeder') ||
          id.includes('portion') ||
          id.includes('pet') ||
          id.includes('nova'))
      );
    });
    const [feedEntity] = feederNumberEntities;
    const [feedingEntity] = entities.filter(
      (entity) =>
        entity.startsWith('binary_sensor.') && lower(entity).includes('feeding'),
    );
    const [batteryEntity] = entities.filter(
      (entity) => entity.startsWith('sensor.') && lower(entity).includes('battery'),
    );
    const [lastAmountEntity] = entities.filter(
      (entity) =>
        entity.startsWith('sensor.') &&
        (lower(entity).includes('last_amount') ||
          (lower(entity).includes('last') && lower(entity).includes('amount'))),
    );
    const [lastFedEntity] = entities.filter(
      (entity) =>
        entity.startsWith('sensor.') &&
        lower(entity).includes('last') &&
        (lower(entity).includes('fed') || lower(entity).includes('feed')),
    );

    return {
      feed_entity: feedEntity ?? '',
      ...(feedingEntity ? { feeding_entity: feedingEntity } : {}),
      ...(batteryEntity ? { battery_entity: batteryEntity } : {}),
      ...(lastAmountEntity ? { last_amount_entity: lastAmountEntity } : {}),
      ...(lastFedEntity ? { last_fed_entity: lastFedEntity } : {}),
    };
  }

  public setConfig(config: SmartPetFeederCardConfig): void {
    if (!config?.feed_entity) {
      throw new Error('Entity is required');
    }

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    this.style.setProperty(
      '--pet-feeder-width',
      this.config.fill_container ? '100%' : this.config.width ?? '320px',
    );
    this.style.setProperty(
      '--pet-feeder-host-height',
      this.config.fill_height ? '100%' : 'auto',
    );
    this.style.setProperty(
      '--pet-feeder-height',
      this.config.height ?? '118px',
    );
    this.style.setProperty(
      '--pet-feeder-radius',
      this.config.border_radius ?? '18px',
    );
    this.style.setProperty(
      '--pet-feeder-accent',
      this.config.accent_color ?? '#ff9f2f',
    );
    this.style.setProperty(
      '--pet-feeder-off',
      this.config.off_color ?? '#778392',
    );
    this.style.setProperty(
      '--pet-feeder-background',
      this.config.background ?? '#101722',
    );
  }

  public getCardSize(): number {
    return 2;
  }

  public getGridOptions() {
    const vertical = this.config?.layout === 'vertical';

    return {
      rows: vertical ? 3 : 2,
      columns: 6,
      min_rows: 1,
      max_rows: 6,
      min_columns: 2,
      max_columns: 12,
    };
  }

  private get feedEntity(): FeederEntity | undefined {
    return this.hass?.states[this.config.feed_entity];
  }

  private get feedingEntity(): FeederEntity | undefined {
    return this.config.feeding_entity
      ? this.hass?.states[this.config.feeding_entity]
      : undefined;
  }

  private get batteryEntity(): FeederEntity | undefined {
    return this.config.battery_entity
      ? this.hass?.states[this.config.battery_entity]
      : undefined;
  }

  private get lastAmountEntity(): FeederEntity | undefined {
    return this.config.last_amount_entity
      ? this.hass?.states[this.config.last_amount_entity]
      : undefined;
  }

  private get lastFedEntity(): FeederEntity | undefined {
    return this.config.last_fed_entity
      ? this.hass?.states[this.config.last_fed_entity]
      : undefined;
  }

  private get amountMin(): number {
    return toNumber(this.feedEntity?.attributes.min) ?? 1;
  }

  private get amountMax(): number {
    return toNumber(this.feedEntity?.attributes.max) ?? 9;
  }

  private get amountStep(): number {
    return toNumber(this.feedEntity?.attributes.step) ?? 1;
  }

  private get entityAmount(): number | undefined {
    return isUnavailable(this.feedEntity) ? undefined : toNumber(this.feedEntity?.state);
  }

  private get amount(): number | undefined {
    return this.selectedAmount ?? this.entityAmount ?? this.amountMin;
  }

  private get batteryPercent(): number | undefined {
    return isUnavailable(this.batteryEntity)
      ? undefined
      : toNumber(this.batteryEntity?.state);
  }

  private get lastAmount(): number | undefined {
    return isUnavailable(this.lastAmountEntity)
      ? undefined
      : toNumber(this.lastAmountEntity?.state);
  }

  private get lastFedDisplay(): string | undefined {
    if (isUnavailable(this.lastFedEntity)) {
      return undefined;
    }

    const state = this.lastFedEntity?.state;

    if (!state) {
      return undefined;
    }

    const timestamp = Date.parse(state);

    if (Number.isFinite(timestamp)) {
      const elapsed = Date.now() - timestamp;

      if (elapsed >= 0 && elapsed < 60_000) {
        return 'Just now';
      }

      if (elapsed >= 0 && elapsed < 3_600_000) {
        return `${Math.max(1, Math.round(elapsed / 60_000))}m ago`;
      }

      if (elapsed >= 0 && elapsed < 86_400_000) {
        return `${Math.max(1, Math.round(elapsed / 3_600_000))}h ago`;
      }

      if (elapsed >= 0 && elapsed < 604_800_000) {
        return `${Math.max(1, Math.round(elapsed / 86_400_000))}d ago`;
      }

      return new Date(timestamp).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      });
    }

    const unit = this.lastFedEntity?.attributes.unit_of_measurement;
    return unit ? `${state} ${unit}` : state;
  }

  private get isFeeding(): boolean {
    return this.pending || this.feedingEntity?.state === 'on';
  }

  private get cardUnavailable(): boolean {
    return isUnavailable(this.feedEntity);
  }

  private get displayName(): string {
    const friendly = this.feedEntity?.attributes.friendly_name;

    if (this.config.name) {
      return cleanName(this.config.name, 'Pet Feeder');
    }

    if (this.config.pet_name) {
      return cleanName(`${this.config.pet_name} Feeder`, 'Pet Feeder');
    }

    if (friendly && /feed|feeder/i.test(friendly)) {
      return cleanName(friendly.replace(/\s*feed\s*$/i, ' Feeder'), 'Pet Feeder');
    }

    return 'Pet Feeder';
  }

  private get icon(): string {
    return (
      this.config.icon ||
      this.feedEntity?.attributes.icon ||
      DEFAULT_CONFIG.icon ||
      'mdi:food-drumstick'
    );
  }

  private get statusText(): string {
    if (this.cardUnavailable) {
      return 'Unavailable';
    }

    return this.isFeeding ? 'Feeding' : 'Ready';
  }

  private get statusLine(): string {
    const parts = [this.statusText];

    if (this.config.show_last_amount && this.lastAmount !== undefined) {
      parts.push(`Last ${formatAmount(this.lastAmount)}`);
    }

    return parts.join(' · ');
  }

  private get stateColor(): string {
    if (this.cardUnavailable) {
      return this.config.off_color ?? '#778392';
    }

    return this.config.accent_color ?? '#ff9f2f';
  }

  private get batteryColor(): string {
    const battery = this.batteryPercent;

    if (battery === undefined) {
      return this.config.off_color ?? '#778392';
    }

    if (battery <= 25) {
      return '#ff5a4f';
    }

    if (battery <= 55) {
      return '#f7b84b';
    }

    return '#62e58f';
  }

  private clampAmount(value: number): number {
    const min = this.amountMin;
    const max = this.amountMax;
    const step = this.amountStep || 1;
    const stepped = Math.round((value - min) / step) * step + min;
    const clamped = Math.min(max, Math.max(min, stepped));
    return Number(clamped.toFixed(3));
  }

  private adjustAmount(delta: number): void {
    if (this.cardUnavailable) {
      return;
    }

    const current = this.amount ?? this.amountMin;
    this.selectedAmount = this.clampAmount(current + delta);
  }

  private setPending(pending: boolean): void {
    window.clearTimeout(this.pendingTimer);
    this.pending = pending;

    if (pending) {
      this.pendingTimer = window.setTimeout(() => {
        this.pending = false;
        this.selectedAmount = undefined;
      }, 2400);
    }
  }

  private clearPending(): void {
    window.clearTimeout(this.pendingTimer);
    this.pending = false;
    this.selectedAmount = undefined;
  }

  private feedNow(): void {
    if (this.cardUnavailable || this.isFeeding || this.amount === undefined) {
      return;
    }

    const value = this.clampAmount(this.amount);
    this.setPending(true);
    const result = this.hass?.callService('number', 'set_value', {
      entity_id: this.config.feed_entity,
      value,
    });

    if (result && typeof result.then === 'function') {
      result.then(
        () => this.clearPending(),
        () => this.clearPending(),
      );
    }
  }

  private dispatchMoreInfo(entityId?: string): void {
    if (!entityId) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private renderBattery(): TemplateResult | typeof nothing {
    if (!this.config.show_battery || this.batteryPercent === undefined) {
      return nothing;
    }

    return html`
      <button
        type="button"
        class="battery"
        style="--pet-feeder-battery-color: ${this.batteryColor}"
        @click=${() => this.dispatchMoreInfo(this.config.battery_entity)}
      >
        <ha-icon icon="mdi:battery"></ha-icon>
        ${Math.round(this.batteryPercent)}%
      </button>
    `;
  }

  private renderInfoStrip(): TemplateResult | typeof nothing {
    if (!this.config.show_details) {
      return nothing;
    }

    const rows: TemplateResult[] = [];

    if (this.lastFedDisplay) {
      rows.push(html`
        <div class="info-row">
          <span class="info-label">Last fed</span>
          <span class="info-value">${this.lastFedDisplay}</span>
        </div>
      `);
    }

    if (this.config.show_last_amount && this.lastAmount !== undefined) {
      rows.push(html`
        <div class="info-row">
          <span class="info-label">Last amount</span>
          <span class="info-value">${formatAmount(this.lastAmount)} portions</span>
        </div>
      `);
    }

    if (this.config.show_battery && this.batteryPercent !== undefined) {
      rows.push(html`
        <div class="info-row">
          <span class="info-label">Battery</span>
          <span class="info-value">${Math.round(this.batteryPercent)}%</span>
        </div>
      `);
    }

    if (!rows.length) {
      return nothing;
    }

    return html`<div class="info-strip">${rows}</div>`;
  }

  protected render(): TemplateResult {
    if (!this.config) {
      return html``;
    }

    const amount = this.amount;
    const canDecrease =
      !this.cardUnavailable && amount !== undefined && amount > this.amountMin;
    const canIncrease =
      !this.cardUnavailable && amount !== undefined && amount < this.amountMax;

    return html`
      <ha-card
        style="
          --pet-feeder-state-color: ${this.stateColor};
          --pet-feeder-border-strength: ${this.cardUnavailable ? '13%' : '32%'};
          --pet-feeder-outer-blur: ${this.isFeeding ? '44px' : '16px'};
          --pet-feeder-outer-strength: ${this.isFeeding ? '14%' : '4%'};
          --pet-feeder-sheen-opacity: ${this.cardUnavailable ? '0.36' : '0.72'};
          --pet-feeder-ring-strength: ${this.isFeeding ? '24%' : '7%'};
          --pet-feeder-ring-opacity: ${this.cardUnavailable ? '0.35' : '1'};
        "
      >
        <div
          class="card ${this.isFeeding ? 'feeding' : ''} ${this.cardUnavailable
            ? 'unavailable'
            : ''} ${this.config.animated ? 'animated' : ''} ${this.config.fill_height
            ? 'fill-height'
            : ''} layout-${this.config.layout ??
            'auto'}"
        >
          <div class="content">
            <div class="top-group">
              <div class="head">
                <button
                  type="button"
                  class="identity"
                  @click=${() => this.dispatchMoreInfo(this.config.feed_entity)}
                >
                  <span class="icon-shell">
                    <ha-icon icon=${this.icon}></ha-icon>
                  </span>
                  <span class="title-block">
                    <span class="name">${this.displayName}</span>
                    <span class="status">
                      <span class="dot"></span>
                      ${this.statusLine}
                    </span>
                  </span>
                </button>
                ${this.renderBattery()}
              </div>

              <div class="control-stack">
                <div class="stepper">
                  <button
                    type="button"
                    class="step-button"
                    aria-label="Decrease portion"
                    ?disabled=${!canDecrease || this.isFeeding}
                    @click=${() => this.adjustAmount(-this.amountStep)}
                  >
                    <ha-icon icon="mdi:minus"></ha-icon>
                  </button>

                  <div class="dose">
                    <span class="dose-value">${formatAmount(amount)}</span>
                    <span class="dose-label">Portions</span>
                  </div>

                  <button
                    type="button"
                    class="step-button"
                    aria-label="Increase portion"
                    ?disabled=${!canIncrease || this.isFeeding}
                    @click=${() => this.adjustAmount(this.amountStep)}
                  >
                    <ha-icon icon="mdi:plus"></ha-icon>
                  </button>
                </div>

                <button
                  type="button"
                  class="feed-button"
                  ?disabled=${this.cardUnavailable || this.isFeeding}
                  @click=${this.feedNow}
                >
                  ${this.isFeeding ? 'Feeding' : 'Feed now'}
                </button>
              </div>
            </div>
            ${this.renderInfoStrip()}
          </div>
        </div>
      </ha-card>
    `;
  }
}

if (!customElements.get('smart-pet-feeder-card')) {
  customElements.define('smart-pet-feeder-card', SmartPetFeederCard);
}

class SmartPetFeederCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  public hass?: HomeAssistant;
  private config: Partial<SmartPetFeederCardConfig> = {};

  static get styles(): CSSResultGroup {
    return css`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 12px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-form,
      ha-icon-picker,
      ha-select,
      ha-textfield {
        width: 100%;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }

  public setConfig(config: SmartPetFeederCardConfig): void {
    this.config = { ...config };
  }

  private updateConfig(patch: Partial<SmartPetFeederCardConfig>): void {
    const next = { ...this.config, ...patch };
    Object.keys(next).forEach((key) => {
      const typedKey = key as keyof SmartPetFeederCardConfig;
      if (next[typedKey] === '') {
        delete next[typedKey];
      }
    });
    this.config = next;
    fireConfigChanged(this, next);
  }

  private formChanged(event: Event): void {
    const customEvent = event as CustomEvent<{
      value?: Partial<SmartPetFeederCardConfig>;
    }>;

    if (!customEvent.detail?.value) {
      return;
    }

    this.updateConfig(customEvent.detail.value);
  }

  private valueChanged(event: Event): void {
    const target = (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
    const customEvent = event as CustomEvent<{ value?: string }>;

    const configValue = (target as any).configValue || target?.dataset?.configValue;

    if (!configValue) {
      return;
    }

    const checked = (target as HTMLInputElement).checked;
    const value = checked !== undefined
      ? checked
      : customEvent.detail?.value ?? (target as any).value;

    this.updateConfig({
      [configValue]: value,
    } as Partial<SmartPetFeederCardConfig>);
  }

  private renderEntityForm(): TemplateResult {
    const schema = [
      {
        name: 'feed_entity',
        required: true,
        selector: { entity: { domain: 'number' } },
      },
      {
        name: 'feeding_entity',
        selector: { entity: { domain: 'binary_sensor' } },
      },
      {
        name: 'battery_entity',
        selector: { entity: { domain: 'sensor' } },
      },
      {
        name: 'last_amount_entity',
        selector: { entity: { domain: 'sensor' } },
      },
      {
        name: 'last_fed_entity',
        selector: { entity: { domain: ['sensor', 'input_datetime'] } },
      },
    ];
    const labels: Record<string, string> = {
      feed_entity: 'Feed Amount Entity',
      feeding_entity: 'Feeding State Entity',
      battery_entity: 'Battery Entity',
      last_amount_entity: 'Last Amount Entity',
      last_fed_entity: 'Last Fed Time Entity',
    };

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{
          feed_entity: this.config.feed_entity,
          feeding_entity: this.config.feeding_entity,
          battery_entity: this.config.battery_entity,
          last_amount_entity: this.config.last_amount_entity,
          last_fed_entity: this.config.last_fed_entity,
        }}
        .schema=${schema}
        .computeLabel=${(schemaItem: { name: string }) =>
          labels[schemaItem.name] ?? schemaItem.name}
        @value-changed=${this.formChanged}
      ></ha-form>
    `;
  }

  private renderTextInput(
    label: string,
    key: keyof SmartPetFeederCardConfig,
    placeholder = '',
  ): TemplateResult {
    return html`
      <ha-textfield
        .label=${label}
        .placeholder=${placeholder}
        .value=${this.config[key] ?? ''}
        .configValue=${key}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }

  private renderIconPicker(
    label: string,
    key: keyof SmartPetFeederCardConfig,
  ): TemplateResult {
    return html`
      <ha-icon-picker
        .hass=${this.hass}
        .label=${label}
        .value=${this.config[key] ?? ''}
        .configValue=${key}
        @value-changed=${this.valueChanged}
      ></ha-icon-picker>
    `;
  }

  private renderSwitch(
    label: string,
    key: keyof SmartPetFeederCardConfig,
    defaultValue: boolean,
  ): TemplateResult {
    return html`
      <label class="switch-row">
        <ha-switch
          .checked=${Boolean(this.config[key] ?? defaultValue)}
          .configValue=${key}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${label}</span>
      </label>
    `;
  }

  private renderSelect(
    label: string,
    key: keyof SmartPetFeederCardConfig,
    options: string[],
    value: string,
  ): TemplateResult {
    return html`
      <ha-select
        .label=${label}
        .value=${this.config[key] ?? value}
        .configValue=${key}
        @selected=${this.valueChanged}
        @closed=${(event: Event) => event.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${options.map(
          (option) => html`
            <mwc-list-item .value=${option}>${option}</mwc-list-item>
          `,
        )}
      </ha-select>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput('Name', 'name', 'Tommy Feeder')}
            ${this.renderTextInput('Pet Name', 'pet_name', 'Tommy')}
            ${this.renderIconPicker('Icon', 'icon')}
            ${this.renderTextInput('Width', 'width', '320px')}
            ${this.renderTextInput('Height', 'height', '118px')}
            ${this.renderTextInput('Radius', 'border_radius', '18px')}
            ${this.renderSelect('Layout', 'layout', LAYOUTS, 'auto')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Fill Container', 'fill_container', false)}
            ${this.renderSwitch('Fill Height', 'fill_height', true)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput('Accent Color', 'accent_color', '#ff9f2f')}
            ${this.renderTextInput('Off Color', 'off_color', '#778392')}
            ${this.renderTextInput('Background', 'background', '#101722')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Show Battery', 'show_battery', true)}
            ${this.renderSwitch('Show Last Amount', 'show_last_amount', true)}
            ${this.renderSwitch('Show Details', 'show_details', true)}
            ${this.renderSwitch('Animated Glow', 'animated', true)}
          </div>
        </section>
      </div>
    `;
  }
}

if (!customElements.get('smart-pet-feeder-card-editor')) {
  customElements.define('smart-pet-feeder-card-editor', SmartPetFeederCardEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    'smart-pet-feeder-card': SmartPetFeederCard;
    'smart-pet-feeder-card-editor': SmartPetFeederCardEditor;
  }

  interface Window {
    customCards?: unknown[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  preview: true,
  type: 'smart-pet-feeder-card',
  name: 'Smart Pet Feeder Card',
  description: 'A compact feeding card with portion, battery, and last-feed status.',
});
