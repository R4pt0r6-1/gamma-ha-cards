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

interface SmartPetFeederCardConfig {
  type?: string;
  feed_entity: string;
  feeding_entity?: string;
  battery_entity?: string;
  last_amount_entity?: string;
  name?: string;
  pet_name?: string;
  icon?: string;
  width?: string;
  fill_container?: boolean;
  height?: string;
  border_radius?: string;
  accent_color?: string;
  off_color?: string;
  background?: string;
  show_battery?: boolean;
  show_last_amount?: boolean;
  animated?: boolean;
}

type ConfigElement = HTMLInputElement & {
  checked?: boolean;
  configValue?: keyof SmartPetFeederCardConfig;
};

const DEFAULT_CONFIG: Omit<SmartPetFeederCardConfig, 'feed_entity'> = {
  icon: 'mdi:food-drumstick',
  width: '320px',
  fill_container: false,
  height: '148px',
  border_radius: '20px',
  accent_color: '#ff9f2f',
  off_color: '#778392',
  background: '#101722',
  show_battery: true,
  show_last_amount: true,
  animated: true,
};

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
        --pet-feeder-height: 148px;
        --pet-feeder-radius: 20px;
        --pet-feeder-accent: #ff9f2f;
        --pet-feeder-off: #778392;
        --pet-feeder-background: #101722;

        display: block;
        max-width: var(--pet-feeder-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
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
        padding: 12px;
        position: relative;
        width: 100%;
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
        display: grid;
        gap: 9px;
        position: relative;
        z-index: 1;
      }

      .head {
        align-items: center;
        display: grid;
        gap: 10px;
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
        gap: 10px;
        grid-template-columns: 38px minmax(0, 1fr);
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
        border-radius: 13px;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 8%);
        color: var(--pet-feeder-state-color);
        display: inline-flex;
        height: 34px;
        justify-content: center;
        width: 36px;
      }

      .icon-shell ha-icon {
        height: 20px;
        width: 20px;
      }

      .title-block {
        display: grid;
        gap: 2px;
        min-width: 0;
      }

      .name {
        font-size: 17px;
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
        font-size: 12px;
        gap: 6px;
        min-width: 0;
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
        color: var(--pet-feeder-battery-color);
        cursor: pointer;
        display: inline-flex;
        font-family: inherit;
        font-size: 12px;
        font-weight: 720;
        gap: 6px;
        min-height: 29px;
        padding: 0 10px;
        white-space: nowrap;
      }

      .battery ha-icon {
        height: 16px;
        width: 16px;
      }

      .controls {
        align-items: center;
        display: grid;
        gap: 8px;
        grid-template-columns: 36px minmax(0, 1fr) 36px;
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
        background: rgb(255 255 255 / 7%);
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: 13px;
        height: 34px;
        width: 36px;
      }

      .step-button ha-icon {
        height: 18px;
        width: 18px;
      }

      .step-button:disabled,
      .feed-button:disabled {
        cursor: default;
        opacity: 0.42;
      }

      .dose {
        align-items: center;
        background:
          linear-gradient(
            180deg,
            rgb(255 255 255 / 8%),
            rgb(255 255 255 / 4%)
          );
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 16px;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 7%);
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        min-height: 34px;
        overflow: hidden;
        padding: 0 12px;
      }

      .dose-value {
        color: #ffffff;
        font-size: 25px;
        font-weight: 780;
        letter-spacing: 0;
        line-height: 1;
        min-width: 36px;
      }

      .dose-label {
        color: var(--secondary-text-color, #aeb8c6);
        font-size: 10px;
        font-weight: 720;
        letter-spacing: 0.08em;
        line-height: 1.1;
        text-transform: uppercase;
      }

      .bottom {
        align-items: center;
        display: grid;
        gap: 8px;
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .metrics {
        align-items: center;
        color: color-mix(in srgb, var(--primary-text-color, #f4f7fb) 76%, transparent);
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        font-weight: 650;
        gap: 7px 10px;
        min-width: 0;
      }

      .metric {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .metric b {
        color: var(--primary-text-color, #f4f7fb);
        font-weight: 780;
      }

      .feed-button {
        background:
          radial-gradient(
            circle at 50% 20%,
            color-mix(in srgb, #ffffff 22%, transparent),
            transparent 52%
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
        gap: 7px;
        height: 34px;
        min-width: 104px;
        padding: 0 14px;
        text-transform: uppercase;
      }

      .feed-button ha-icon {
        height: 17px;
        width: 17px;
      }

      .card.unavailable .feed-button {
        background: rgb(255 255 255 / 8%);
        border-color: rgb(255 255 255 / 10%);
        box-shadow: none;
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

      @media (max-width: 360px) {
        .card {
          padding: 12px;
        }

        .identity {
          grid-template-columns: 38px minmax(0, 1fr);
        }

        .icon-shell {
          border-radius: 12px;
          height: 34px;
          width: 36px;
        }

        .name {
          font-size: 15px;
        }

        .battery {
          min-height: 30px;
          padding: 0 9px;
        }

        .bottom {
          grid-template-columns: 1fr;
        }

        .feed-button {
          width: 100%;
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
    const [feedEntity] = entities.filter((entity) => entity.startsWith('number.'));
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

    return {
      feed_entity: feedEntity ?? '',
      ...(feedingEntity ? { feeding_entity: feedingEntity } : {}),
      ...(batteryEntity ? { battery_entity: batteryEntity } : {}),
      ...(lastAmountEntity ? { last_amount_entity: lastAmountEntity } : {}),
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
      '--pet-feeder-height',
      this.config.height ?? '148px',
    );
    this.style.setProperty(
      '--pet-feeder-radius',
      this.config.border_radius ?? '20px',
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
    return {
      rows: 2,
      columns: 6,
      min_rows: 2,
      max_rows: 3,
      min_columns: 4,
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

  private get isFeeding(): boolean {
    return this.pending || this.feedingEntity?.state === 'on';
  }

  private get cardUnavailable(): boolean {
    return isUnavailable(this.feedEntity);
  }

  private get displayName(): string {
    const friendly = this.feedEntity?.attributes.friendly_name;
    const feederName = friendly?.replace(/\s*feed\s*$/i, ' Feeder');
    return cleanName(this.config.name || this.config.pet_name || feederName, 'Pet Feeder');
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

  private renderMetrics(): TemplateResult | typeof nothing {
    const metrics: TemplateResult[] = [];

    if (this.config.show_last_amount && this.lastAmount !== undefined) {
      metrics.push(html`
        <span class="metric">Last <b>${formatAmount(this.lastAmount)}</b></span>
      `);
    }

    if (!this.cardUnavailable) {
      metrics.push(html`
        <span class="metric"
          >Range <b>${formatAmount(this.amountMin)}-${formatAmount(this.amountMax)}</b></span
        >
      `);
    }

    if (!metrics.length) {
      return nothing;
    }

    return html`<div class="metrics">${metrics}</div>`;
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
            : ''} ${this.config.animated ? 'animated' : ''}"
        >
          <div class="content">
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
                    ${this.statusText}
                  </span>
                </span>
              </button>
              ${this.renderBattery()}
            </div>

            <div class="controls">
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

            <div class="bottom">
              ${this.renderMetrics()}
              <button
                type="button"
                class="feed-button"
                ?disabled=${this.cardUnavailable || this.isFeeding}
                @click=${this.feedNow}
              >
                <ha-icon icon=${this.isFeeding ? 'mdi:progress-clock' : 'mdi:bowl'}></ha-icon>
                ${this.isFeeding ? 'Feeding' : `Feed ${formatAmount(amount)}`}
              </button>
            </div>
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
    const target = event.target as ConfigElement;
    const customEvent = event as CustomEvent<{ value?: string }>;

    if (!target.configValue) {
      return;
    }

    this.updateConfig({
      [target.configValue]:
        target.checked !== undefined
          ? target.checked
          : customEvent.detail?.value ?? target.value,
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
    ];
    const labels: Record<string, string> = {
      feed_entity: 'Feed Amount Entity',
      feeding_entity: 'Feeding State Entity',
      battery_entity: 'Battery Entity',
      last_amount_entity: 'Last Amount Entity',
    };

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{
          feed_entity: this.config.feed_entity,
          feeding_entity: this.config.feeding_entity,
          battery_entity: this.config.battery_entity,
          last_amount_entity: this.config.last_amount_entity,
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
            ${this.renderTextInput('Height', 'height', '148px')}
            ${this.renderTextInput('Radius', 'border_radius', '20px')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Fill Container', 'fill_container', false)}
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
