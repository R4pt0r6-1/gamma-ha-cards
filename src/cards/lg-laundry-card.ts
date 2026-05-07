import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';

type HassEntity = {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    icon?: string;
    options?: string[];
    unit_of_measurement?: string;
    event_type?: string | null;
    [key: string]: unknown;
  };
};

type HomeAssistant = {
  states: Record<string, HassEntity | undefined>;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ) => Promise<unknown> | void;
};

type ApplianceKind = 'washer' | 'dryer';

interface LgLaundryCardConfig {
  type?: string;
  entity: string;
  kind?: ApplianceKind;
  name?: string;
  image?: string;
  power_entity?: string;
  operation_entity?: string;
  remaining_time_entity?: string;
  total_time_entity?: string;
  remote_start_entity?: string;
  delayed_start_entity?: string;
  notification_entity?: string;
  error_entity?: string;
  energy_entity?: string;
  cycles_entity?: string;
  detail_entities?: string[];
  width?: string;
  fill_container?: boolean;
  border_radius?: string;
  background?: string;
  running_color?: string;
  complete_color?: string;
  paused_color?: string;
  error_color?: string;
  off_color?: string;
  show_details?: boolean;
  animated?: boolean;
}

type ConfigElement = HTMLInputElement & {
  checked?: boolean;
  configValue?: keyof LgLaundryCardConfig;
};

const DEFAULT_CONFIG: Omit<LgLaundryCardConfig, 'entity'> = {
  kind: 'washer',
  width: '100%',
  fill_container: true,
  border_radius: '24px',
  background: '#101722',
  running_color: '#39c6ff',
  complete_color: '#45d158',
  paused_color: '#ffb020',
  error_color: '#ff3b5c',
  off_color: '#697382',
  show_details: false,
  animated: true,
};

const KIND_OPTIONS: ApplianceKind[] = ['washer', 'dryer'];

const RUNNING_STATES = new Set([
  'add_drain',
  'cooling',
  'detecting',
  'detergent_amount',
  'dispensing',
  'drying',
  'frozen_prevent_running',
  'prewash',
  'refreshing',
  'rinsing',
  'running',
  'soaking',
  'spinning',
  'steam_softening',
  'wrinkle_care',
]);

const COMPLETE_STATES = new Set(['end']);
const PAUSED_STATES = new Set(['pause', 'reserved', 'rinse_hold']);
const OFF_STATES = new Set(['power_off', 'initial']);
const ERROR_STATES = new Set(['error']);

function fireConfigChanged(
  element: HTMLElement,
  config: Partial<LgLaundryCardConfig>,
): void {
  element.dispatchEvent(
    new CustomEvent('config-changed', {
      detail: { config },
      bubbles: true,
      composed: true,
    }),
  );
}

function isUnavailable(entity?: HassEntity): boolean {
  return !entity || ['unavailable', 'unknown'].includes(entity.state);
}

function humanize(value: string | undefined): string {
  if (!value || value === 'unknown' || value === 'unavailable') {
    return 'Unknown';
  }

  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toNumber(value: unknown): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatDuration(minutes: number | undefined): string {
  if (minutes === undefined || minutes < 0) {
    return '--';
  }

  const rounded = Math.ceil(minutes);
  const hours = Math.floor(rounded / 60);
  const mins = rounded % 60;

  if (hours <= 0) {
    return `${mins}m`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

function formatEntityState(entity: HassEntity | undefined): string {
  if (isUnavailable(entity)) {
    return 'Unknown';
  }

  const unit = entity?.attributes.unit_of_measurement;
  const eventType = entity?.attributes.event_type;
  const raw = eventType || entity?.state || '';
  const value = humanize(raw);
  return unit ? `${value} ${unit}` : value;
}

function minutesUntil(timestamp: string): number | undefined {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return Math.max(0, (date.getTime() - Date.now()) / 60000);
}

export class LgLaundryCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    detailsOpen: { state: true },
    optimisticOperation: { state: true },
  };

  public hass?: HomeAssistant;
  private config!: LgLaundryCardConfig;
  private detailsOpen = false;
  private optimisticOperation?: string;
  private optimisticTimer?: number;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --laundry-card-width: 100%;
        --laundry-card-radius: 24px;
        --laundry-background: #101722;

        display: block;
        max-width: var(--laundry-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .laundry-card {
        background:
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--laundry-background) 90%, #ffffff 8%),
            color-mix(in srgb, var(--laundry-background) 88%, #000000 18%)
          );
        border: 1px solid color-mix(in srgb, var(--laundry-state-color) 24%, transparent);
        border-radius: var(--laundry-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 10%),
          inset 0 0 0 1px rgb(255 255 255 / 3%),
          0 18px 36px rgb(0 0 0 / 26%),
          0 0 var(--laundry-glow-size)
            color-mix(in srgb, var(--laundry-state-color) 16%, transparent);
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        container-type: inline-size;
        display: grid;
        gap: 16px;
        overflow: hidden;
        padding: 16px;
        position: relative;
      }

      .laundry-card::before {
        background:
          linear-gradient(120deg, rgb(255 255 255 / 12%), transparent 42%),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--laundry-state-color) 16%, transparent),
            transparent 48%,
            color-mix(in srgb, var(--laundry-contrast-color) 13%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--laundry-active-opacity);
        pointer-events: none;
        position: absolute;
      }

      .top {
        display: grid;
        gap: 16px;
        grid-template-columns: minmax(116px, 34%) minmax(0, 1fr);
        position: relative;
        z-index: 1;
      }

      .image-wrap {
        align-items: center;
        aspect-ratio: 1 / 1.15;
        background:
          linear-gradient(145deg, rgb(255 255 255 / 10%), rgb(255 255 255 / 2%)),
          color-mix(in srgb, var(--laundry-state-color) 7%, transparent);
        border: 1px solid rgb(255 255 255 / 12%);
        border-radius: 20px;
        display: grid;
        justify-items: center;
        min-width: 0;
        overflow: hidden;
        padding: 8px;
      }

      .appliance-image {
        filter: drop-shadow(0 20px 18px rgb(0 0 0 / 28%));
        height: 100%;
        max-height: 210px;
        object-fit: contain;
        width: 100%;
      }

      .fallback-machine {
        aspect-ratio: 0.86;
        background:
          linear-gradient(145deg, #eff4f9, #6f7782 54%, #252a31),
          #8b94a0;
        border: 1px solid rgb(255 255 255 / 38%);
        border-radius: 22px;
        box-shadow:
          inset 0 2px 7px rgb(255 255 255 / 42%),
          inset 0 -18px 26px rgb(0 0 0 / 28%),
          0 18px 18px rgb(0 0 0 / 24%);
        position: relative;
        width: min(100%, 150px);
      }

      .fallback-machine::before {
        background:
          radial-gradient(circle, #10151d 0 36%, #9facbb 38% 42%, #26313d 44% 62%, #0b0f15 64%),
          linear-gradient(145deg, rgb(255 255 255 / 18%), transparent);
        border-radius: 999px;
        box-shadow:
          inset 0 0 16px rgb(255 255 255 / 14%),
          0 8px 16px rgb(0 0 0 / 30%);
        content: '';
        height: 52%;
        left: 50%;
        position: absolute;
        top: 27%;
        transform: translateX(-50%);
        width: 72%;
      }

      .fallback-machine::after {
        background: rgb(12 17 23 / 66%);
        border-radius: 999px;
        content: '';
        height: 8px;
        position: absolute;
        right: 17px;
        top: 16px;
        width: 34px;
      }

      .summary {
        display: grid;
        gap: 12px;
        min-width: 0;
      }

      .header {
        align-items: start;
        display: grid;
        gap: 8px;
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .title {
        display: grid;
        gap: 4px;
        min-width: 0;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: clamp(20px, 12cqi, 28px);
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1.05;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status-line {
        align-items: center;
        color: var(--secondary-text-color, #b7c0ce);
        display: inline-flex;
        font-size: 13px;
        gap: 8px;
        min-width: 0;
      }

      .status-dot {
        background: var(--laundry-state-color);
        border-radius: 999px;
        box-shadow: 0 0 16px color-mix(in srgb, var(--laundry-state-color) 52%, transparent);
        height: 8px;
        opacity: var(--laundry-status-opacity);
        width: 8px;
      }

      .status-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .timer {
        background:
          linear-gradient(145deg, rgb(255 255 255 / 9%), rgb(255 255 255 / 3%));
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 18px;
        display: grid;
        gap: 8px;
        padding: 14px;
      }

      .timer-label {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 11px;
        font-weight: 650;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .timer-value {
        color: var(--primary-text-color, #f4f7fb);
        font-size: clamp(32px, 18cqi, 48px);
        font-weight: 750;
        letter-spacing: 0;
        line-height: 0.95;
      }

      .timer-subtext {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.25;
      }

      .progress {
        background: rgb(255 255 255 / 9%);
        border-radius: 999px;
        height: 9px;
        overflow: hidden;
      }

      .progress-bar {
        background:
          linear-gradient(90deg, var(--laundry-state-color), var(--laundry-contrast-color));
        border-radius: inherit;
        box-shadow: 0 0 16px color-mix(in srgb, var(--laundry-state-color) 42%, transparent);
        height: 100%;
        transition: width 240ms ease;
        width: var(--laundry-progress);
      }

      .stats {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .stat {
        background: rgb(255 255 255 / 6%);
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 14px;
        display: grid;
        gap: 3px;
        min-width: 0;
        padding: 9px 10px;
      }

      .stat-label {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 10px;
        font-weight: 650;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .stat-value {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 13px;
        font-weight: 650;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .controls {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        position: relative;
        z-index: 1;
      }

      .control,
      .details-toggle {
        align-items: center;
        background:
          linear-gradient(145deg, rgb(255 255 255 / 10%), rgb(255 255 255 / 4%));
        border: 1px solid rgb(255 255 255 / 11%);
        border-radius: 15px;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        gap: 8px;
        justify-content: center;
        min-height: 44px;
        min-width: 0;
        padding: 0 10px;
        transition:
          background 160ms ease,
          border-color 160ms ease,
          opacity 160ms ease,
          transform 160ms ease;
      }

      .control ha-icon,
      .details-toggle ha-icon {
        --mdc-icon-size: 19px;
        color: currentColor;
      }

      .control.primary {
        background:
          linear-gradient(
            145deg,
            color-mix(in srgb, var(--laundry-state-color) 36%, rgb(255 255 255 / 10%)),
            color-mix(in srgb, var(--laundry-state-color) 14%, rgb(255 255 255 / 4%))
          );
        border-color: color-mix(in srgb, var(--laundry-state-color) 44%, transparent);
        box-shadow: 0 0 26px color-mix(in srgb, var(--laundry-state-color) 14%, transparent);
      }

      .control.warning {
        color: #ffccd4;
      }

      .control:focus-visible,
      .details-toggle:focus-visible {
        outline: 2px solid var(--laundry-state-color);
        outline-offset: 2px;
      }

      .control:not(:disabled):active,
      .details-toggle:not(:disabled):active {
        transform: scale(0.98);
      }

      .control:disabled {
        cursor: default;
        opacity: 0.38;
      }

      .details-toggle {
        justify-self: end;
        min-height: 36px;
      }

      .details {
        border-top: 1px solid rgb(255 255 255 / 10%);
        display: grid;
        gap: 10px;
        padding-top: 12px;
        position: relative;
        z-index: 1;
      }

      .detail-header {
        align-items: center;
        display: flex;
        justify-content: space-between;
      }

      .detail-title {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 13px;
        font-weight: 700;
      }

      .detail-grid {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }

      .detail-row {
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 14px;
        display: grid;
        gap: 7px;
        min-width: 0;
        padding: 10px;
      }

      .detail-main {
        align-items: center;
        background: transparent;
        border: 0;
        color: inherit;
        cursor: pointer;
        display: grid;
        gap: 8px;
        grid-template-columns: 24px minmax(0, 1fr);
        padding: 0;
        text-align: left;
      }

      .detail-main ha-icon {
        --mdc-icon-size: 18px;
        color: var(--laundry-state-color);
      }

      .detail-name,
      .detail-state {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .detail-name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 12px;
        font-weight: 650;
      }

      .detail-state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 11px;
        margin-top: 2px;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .chip {
        background: rgb(255 255 255 / 8%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        cursor: pointer;
        font-size: 11px;
        line-height: 1;
        padding: 6px 8px;
      }

      .chip.active {
        background: color-mix(in srgb, var(--laundry-state-color) 20%, transparent);
        border-color: color-mix(in srgb, var(--laundry-state-color) 42%, transparent);
        color: var(--primary-text-color, #f4f7fb);
      }

      @media (max-width: 560px) {
        .top {
          grid-template-columns: 1fr;
        }

        .image-wrap {
          aspect-ratio: 16 / 8;
        }

        .controls {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    `;
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement('lg-laundry-card-editor');
  }

  public static getStubConfig(_: unknown, entities: string[]) {
    const [statusEntity] = entities.filter(
      (entity) =>
        entity.startsWith('sensor.') &&
        (entity.includes('washer_current_status') ||
          entity.includes('dryer_current_status')),
    );

    const kind = statusEntity?.includes('dryer') ? 'dryer' : 'washer';

    return {
      entity: statusEntity ?? '',
      kind,
    };
  }

  public setConfig(config: LgLaundryCardConfig): void {
    if (!config?.entity) {
      throw new Error('Entity is required');
    }

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
    this.detailsOpen = Boolean(this.config.show_details);

    this.style.setProperty(
      '--laundry-card-width',
      this.config.fill_container ? '100%' : this.config.width ?? '100%',
    );
    this.style.setProperty(
      '--laundry-card-radius',
      this.config.border_radius ?? '24px',
    );
    this.style.setProperty('--laundry-background', this.config.background ?? '#101722');
  }

  public getCardSize(): number {
    return this.detailsOpen ? 6 : 4;
  }

  public getGridOptions() {
    return {
      rows: 'auto',
      columns: 6,
      min_rows: 4,
      max_rows: 10,
      min_columns: 4,
      max_columns: 12,
    };
  }

  private entity(entityId?: string): HassEntity | undefined {
    return entityId ? this.hass?.states[entityId] : undefined;
  }

  private get statusEntity(): HassEntity | undefined {
    return this.entity(this.config.entity);
  }

  private get kind(): ApplianceKind {
    return this.config.kind ?? (this.config.entity.includes('dryer') ? 'dryer' : 'washer');
  }

  private get displayName(): string {
    return (
      this.config.name ||
      this.statusEntity?.attributes.friendly_name?.replace(' Current status', '') ||
      (this.kind === 'dryer' ? 'Dryer' : 'Washer')
    );
  }

  private get rawStatus(): string {
    if (this.optimisticOperation) {
      return this.optimisticOperation;
    }

    return this.statusEntity?.state ?? 'unknown';
  }

  private get statusLabel(): string {
    if (isUnavailable(this.statusEntity)) {
      return 'Unavailable';
    }

    if (this.rawStatus === 'end') {
      return 'Complete';
    }

    return humanize(this.rawStatus);
  }

  private get stateGroup(): 'running' | 'complete' | 'paused' | 'error' | 'off' {
    const status = this.rawStatus;

    if (ERROR_STATES.has(status) || this.entity(this.config.error_entity)?.attributes.event_type) {
      return 'error';
    }

    if (RUNNING_STATES.has(status)) {
      return 'running';
    }

    if (COMPLETE_STATES.has(status)) {
      return 'complete';
    }

    if (PAUSED_STATES.has(status)) {
      return 'paused';
    }

    if (OFF_STATES.has(status) || this.entity(this.config.power_entity)?.state === 'off') {
      return 'off';
    }

    return 'off';
  }

  private get stateColor(): string {
    const colors = {
      running: this.config.running_color ?? '#39c6ff',
      complete: this.config.complete_color ?? '#45d158',
      paused: this.config.paused_color ?? '#ffb020',
      error: this.config.error_color ?? '#ff3b5c',
      off: this.config.off_color ?? '#697382',
    };

    return colors[this.stateGroup];
  }

  private get remainingMinutes(): number | undefined {
    const remaining = this.entity(this.config.remaining_time_entity);

    if (isUnavailable(remaining)) {
      return undefined;
    }

    return minutesUntil(remaining?.state ?? '');
  }

  private get totalMinutes(): number | undefined {
    return toNumber(this.entity(this.config.total_time_entity)?.state);
  }

  private get progress(): number {
    if (this.stateGroup === 'complete') {
      return 100;
    }

    if (this.stateGroup !== 'running' && this.stateGroup !== 'paused') {
      return 0;
    }

    const total = this.totalMinutes;
    const remaining = this.remainingMinutes;

    if (!total || remaining === undefined) {
      return this.stateGroup === 'running' ? 18 : 0;
    }

    return Math.min(100, Math.max(0, ((total - remaining) / total) * 100));
  }

  private get timeDisplay(): string {
    if (this.stateGroup === 'complete') {
      return 'Done';
    }

    if (this.stateGroup === 'off') {
      return '--';
    }

    return formatDuration(this.remainingMinutes);
  }

  private get timeSubtext(): string {
    const remaining = this.entity(this.config.remaining_time_entity);

    if (this.stateGroup === 'complete') {
      return 'Cycle complete';
    }

    if (this.stateGroup === 'off') {
      const total = formatDuration(this.totalMinutes);
      return total === '--' ? 'Ready for next cycle' : `${total} default cycle`;
    }

    if (!isUnavailable(remaining) && remaining) {
      const date = new Date(remaining.state);
      if (!Number.isNaN(date.getTime())) {
        return `Finishes around ${date.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        })}`;
      }
    }

    return 'Waiting for LG update';
  }

  private hasOperation(option: string): boolean {
    const operation = this.entity(this.config.operation_entity);
    return Boolean(operation?.attributes.options?.includes(option));
  }

  private isRemoteStartReady(): boolean {
    const remoteStart = this.entity(this.config.remote_start_entity);
    return !remoteStart || remoteStart.state === 'on';
  }

  private setOptimisticOperation(operation: string): void {
    window.clearTimeout(this.optimisticTimer);
    this.optimisticOperation = operation;
    this.optimisticTimer = window.setTimeout(() => {
      this.optimisticOperation = undefined;
    }, 2200);
  }

  private trackServiceResult(result: Promise<unknown> | void): void {
    if (result && typeof result.catch === 'function') {
      result.catch(() => {
        window.clearTimeout(this.optimisticTimer);
        this.optimisticOperation = undefined;
      });
    }
  }

  private callOperation(option: string): void {
    if (!this.config.operation_entity || !this.hasOperation(option)) {
      return;
    }

    this.setOptimisticOperation(option === 'start' ? 'running' : option);
    this.trackServiceResult(
      this.hass?.callService('select', 'select_option', {
        entity_id: this.config.operation_entity,
        option,
      }),
    );
  }

  private setPower(on: boolean): void {
    const powerEntity = this.entity(this.config.power_entity);

    this.setOptimisticOperation(on ? 'initial' : 'power_off');

    if (this.config.power_entity && !isUnavailable(powerEntity)) {
      this.trackServiceResult(
        this.hass?.callService('switch', on ? 'turn_on' : 'turn_off', {
          entity_id: this.config.power_entity,
        }),
      );
      return;
    }

    const operation = on ? 'power_on' : 'power_off';
    if (this.hasOperation(operation)) {
      this.callOperation(operation);
    }
  }

  private toggleDetails(): void {
    this.detailsOpen = !this.detailsOpen;
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

  private configuredDetailEntities(): string[] {
    const entities = [
      ...(this.config.detail_entities ?? []),
      this.config.power_entity,
      this.config.operation_entity,
      this.config.remote_start_entity,
      this.config.delayed_start_entity,
      this.config.remaining_time_entity,
      this.config.total_time_entity,
      this.config.cycles_entity,
      this.config.energy_entity,
      this.config.notification_entity,
      this.config.error_entity,
    ].filter((entityId): entityId is string => Boolean(entityId));

    return [...new Set(entities)];
  }

  private renderImage(): TemplateResult {
    if (this.config.image) {
      return html`
        <img
          class="appliance-image"
          alt=${this.displayName}
          src=${this.config.image}
          loading="lazy"
        />
      `;
    }

    return html`<div class="fallback-machine" aria-hidden="true"></div>`;
  }

  private renderStat(label: string, entityId?: string): TemplateResult {
    const entity = this.entity(entityId);
    return html`
      <div class="stat">
        <span class="stat-label">${label}</span>
        <span class="stat-value">${formatEntityState(entity)}</span>
      </div>
    `;
  }

  private renderControl(
    label: string,
    icon: string,
    handler: () => void,
    disabled: boolean,
    className = '',
  ): TemplateResult {
    return html`
      <button
        type="button"
        class="control ${className}"
        ?disabled=${disabled}
        @click=${handler}
      >
        <ha-icon icon=${icon}></ha-icon>
        <span>${label}</span>
      </button>
    `;
  }

  private renderDetailEntity(entityId: string): TemplateResult {
    const entity = this.entity(entityId);
    const options = entity?.attributes.options ?? [];
    const isSelect = entityId.startsWith('select.');

    return html`
      <div class="detail-row">
        <button
          type="button"
          class="detail-main"
          @click=${() => this.dispatchMoreInfo(entityId)}
        >
          <ha-icon icon=${entity?.attributes.icon ?? 'mdi:tune-variant'}></ha-icon>
          <span>
            <span class="detail-name">
              ${entity?.attributes.friendly_name ?? entityId}
            </span>
            <span class="detail-state">${formatEntityState(entity)}</span>
          </span>
        </button>
        ${options.length
          ? html`
              <div class="chips">
                ${options.map(
                  (option) => html`
                    <button
                      type="button"
                      class="chip ${entity?.state === option ? 'active' : ''}"
                      @click=${(event: Event) => {
                        event.stopPropagation();
                        if (isSelect) {
                          this.hass?.callService('select', 'select_option', {
                            entity_id: entityId,
                            option,
                          });
                        }
                      }}
                    >
                      ${humanize(option)}
                    </button>
                  `,
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  protected render(): TemplateResult {
    if (!this.config) {
      return html``;
    }

    const powerEntity = this.entity(this.config.power_entity);
    const operationEntity = this.entity(this.config.operation_entity);
    const operationUnavailable = isUnavailable(operationEntity);
    const startDisabled =
      operationUnavailable || !this.hasOperation('start') || !this.isRemoteStartReady();
    const stopDisabled = operationUnavailable || !this.hasOperation('stop');
    const powerOnDisabled =
      isUnavailable(powerEntity) && !this.hasOperation('power_on');
    const powerOffDisabled =
      isUnavailable(powerEntity) && !this.hasOperation('power_off');
    const contrastColor = this.kind === 'dryer' ? '#ff8a1c' : '#45d1a8';

    return html`
      <ha-card>
        <article
          class="laundry-card ${this.config.animated ? 'animated' : ''}"
          style="
            --laundry-state-color: ${this.stateColor};
            --laundry-contrast-color: ${contrastColor};
            --laundry-progress: ${this.progress}%;
            --laundry-active-opacity: ${this.stateGroup === 'off' ? '0.2' : '0.72'};
            --laundry-status-opacity: ${this.stateGroup === 'off' ? '0.38' : '1'};
            --laundry-glow-size: ${this.stateGroup === 'off' ? '0' : '62px'};
          "
        >
          <div class="top">
            <div class="image-wrap">${this.renderImage()}</div>
            <div class="summary">
              <div class="header">
                <div class="title">
                  <span class="name">${this.displayName}</span>
                  <span class="status-line">
                    <span class="status-dot"></span>
                    <span class="status-text">${this.statusLabel}</span>
                  </span>
                </div>
                <button
                  type="button"
                  class="details-toggle"
                  @click=${this.toggleDetails}
                >
                  <ha-icon
                    icon=${this.detailsOpen ? 'mdi:chevron-up' : 'mdi:tune-variant'}
                  ></ha-icon>
                  <span>Settings</span>
                </button>
              </div>

              <div class="timer">
                <span class="timer-label">Est time left</span>
                <span class="timer-value">${this.timeDisplay}</span>
                <span class="timer-subtext">${this.timeSubtext}</span>
                <div class="progress" aria-hidden="true">
                  <div class="progress-bar"></div>
                </div>
              </div>

              <div class="stats">
                ${this.renderStat('Total', this.config.total_time_entity)}
                ${this.renderStat('Remote', this.config.remote_start_entity)}
                ${this.renderStat('Energy', this.config.energy_entity)}
              </div>
            </div>
          </div>

          <div class="controls">
            ${this.renderControl(
              'Power',
              'mdi:power',
              () => this.setPower(true),
              powerOnDisabled,
            )}
            ${this.renderControl(
              'Start',
              'mdi:play',
              () => this.callOperation('start'),
              startDisabled,
              'primary',
            )}
            ${this.renderControl(
              'Stop',
              'mdi:stop',
              () => this.callOperation('stop'),
              stopDisabled,
            )}
            ${this.renderControl(
              'Off',
              'mdi:power-standby',
              () => this.setPower(false),
              powerOffDisabled,
              'warning',
            )}
          </div>

          ${this.detailsOpen
            ? html`
                <section class="details">
                  <div class="detail-header">
                    <span class="detail-title">Available settings</span>
                  </div>
                  <div class="detail-grid">
                    ${this.configuredDetailEntities().map((entityId) =>
                      this.renderDetailEntity(entityId),
                    )}
                  </div>
                </section>
              `
            : nothing}
        </article>
      </ha-card>
    `;
  }
}

if (!customElements.get('lg-laundry-card')) {
  customElements.define('lg-laundry-card', LgLaundryCard);
}

class LgLaundryCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  public hass?: HomeAssistant;
  private config: Partial<LgLaundryCardConfig> = {};

  static get styles(): CSSResultGroup {
    return css`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
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
      ha-textfield,
      ha-select {
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

  public setConfig(config: LgLaundryCardConfig): void {
    this.config = { ...config };
  }

  private updateConfig(patch: Partial<LgLaundryCardConfig>): void {
    const next = { ...this.config, ...patch };
    Object.keys(next).forEach((key) => {
      const typedKey = key as keyof LgLaundryCardConfig;
      if (next[typedKey] === '') {
        delete next[typedKey];
      }
    });
    this.config = next;
    fireConfigChanged(this, next);
  }

  private formChanged(event: Event): void {
    const customEvent = event as CustomEvent<{
      value?: Partial<LgLaundryCardConfig>;
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
    } as Partial<LgLaundryCardConfig>);
  }

  private renderTextInput(
    label: string,
    key: keyof LgLaundryCardConfig,
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

  private renderSwitch(
    label: string,
    key: keyof LgLaundryCardConfig,
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
    key: keyof LgLaundryCardConfig,
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

  private renderEntityForm(): TemplateResult {
    const schema = [
      {
        name: 'entity',
        required: true,
        selector: { entity: { domain: 'sensor' } },
      },
      { name: 'power_entity', selector: { entity: { domain: 'switch' } } },
      { name: 'operation_entity', selector: { entity: { domain: 'select' } } },
      {
        name: 'remaining_time_entity',
        selector: { entity: { domain: 'sensor' } },
      },
      { name: 'total_time_entity', selector: { entity: { domain: 'sensor' } } },
      {
        name: 'remote_start_entity',
        selector: { entity: { domain: 'binary_sensor' } },
      },
      { name: 'notification_entity', selector: { entity: { domain: 'event' } } },
      { name: 'error_entity', selector: { entity: { domain: 'event' } } },
      { name: 'energy_entity', selector: { entity: { domain: 'sensor' } } },
    ];
    const labels: Record<string, string> = {
      entity: 'Status Sensor',
      power_entity: 'Power Switch',
      operation_entity: 'Operation Select',
      remaining_time_entity: 'Remaining Time',
      total_time_entity: 'Total Time',
      remote_start_entity: 'Remote Start',
      notification_entity: 'Notification Event',
      error_entity: 'Error Event',
      energy_entity: 'Energy Sensor',
    };

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{
          entity: this.config.entity,
          power_entity: this.config.power_entity,
          operation_entity: this.config.operation_entity,
          remaining_time_entity: this.config.remaining_time_entity,
          total_time_entity: this.config.total_time_entity,
          remote_start_entity: this.config.remote_start_entity,
          notification_entity: this.config.notification_entity,
          error_entity: this.config.error_entity,
          energy_entity: this.config.energy_entity,
        }}
        .schema=${schema}
        .computeLabel=${(schemaItem: { name: string }) =>
          labels[schemaItem.name] ?? schemaItem.name}
        @value-changed=${this.formChanged}
      ></ha-form>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput('Name', 'name', 'Washer')}
            ${this.renderSelect('Kind', 'kind', KIND_OPTIONS, 'washer')}
            ${this.renderTextInput('Image URL', 'image', '/hacsfiles/gamma-ha-cards/assets/laundry-washer.svg')}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput('Width', 'width', '100%')}
            ${this.renderTextInput('Radius', 'border_radius', '24px')}
            ${this.renderTextInput('Background', 'background', '#101722')}
            ${this.renderTextInput('Running Color', 'running_color', '#39c6ff')}
            ${this.renderTextInput('Complete Color', 'complete_color', '#45d158')}
            ${this.renderTextInput('Paused Color', 'paused_color', '#ffb020')}
            ${this.renderTextInput('Error Color', 'error_color', '#ff3b5c')}
            ${this.renderTextInput('Off Color', 'off_color', '#697382')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Fill Container', 'fill_container', true)}
            ${this.renderSwitch('Show Details Open', 'show_details', false)}
            ${this.renderSwitch('Animated Glow', 'animated', true)}
          </div>
        </section>
      </div>
    `;
  }
}

if (!customElements.get('lg-laundry-card-editor')) {
  customElements.define('lg-laundry-card-editor', LgLaundryCardEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    'lg-laundry-card': LgLaundryCard;
    'lg-laundry-card-editor': LgLaundryCardEditor;
  }

  interface Window {
    customCards?: unknown[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  preview: true,
  type: 'lg-laundry-card',
  name: 'LG Laundry Card',
  description: 'A polished LG ThinQ washer and dryer dashboard card.',
});
