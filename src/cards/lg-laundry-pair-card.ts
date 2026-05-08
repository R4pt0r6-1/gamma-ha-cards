import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';
import {
  entityDurationMinutes,
  formatDuration,
  formatEntityState,
  humanize,
  isUnavailable,
  remainingEntityMinutes,
} from './lg-laundry-card';
import type {
  ApplianceKind,
  HassEntity,
  HomeAssistant,
  LgLaundryCardConfig,
} from './lg-laundry-card';

type LaundryPairMachineConfig = Pick<
  LgLaundryCardConfig,
  | 'entity'
  | 'name'
  | 'image'
  | 'power_entity'
  | 'operation_entity'
  | 'remaining_time_entity'
  | 'total_time_entity'
  | 'remote_start_entity'
  | 'notification_entity'
  | 'error_entity'
  | 'energy_entity'
  | 'running_color'
  | 'complete_color'
  | 'paused_color'
  | 'error_color'
  | 'off_color'
>;

interface LgLaundryPairCardConfig {
  type?: string;
  name?: string;
  washer: LaundryPairMachineConfig;
  dryer: LaundryPairMachineConfig;
  width?: string;
  fill_container?: boolean;
  border_radius?: string;
  background?: string;
  show_controls?: boolean;
  show_stats?: boolean;
  animated?: boolean;
}

type PairConfigElement = HTMLInputElement & {
  checked?: boolean;
  configPath?: string;
};

type LaundryStateGroup = 'running' | 'complete' | 'paused' | 'error' | 'off';

const DEFAULT_PAIR_CONFIG: Omit<LgLaundryPairCardConfig, 'washer' | 'dryer'> = {
  name: 'Laundry',
  width: '420px',
  fill_container: false,
  border_radius: '14px',
  background: '#101722',
  show_controls: true,
  show_stats: true,
  animated: true,
};

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

function firePairConfigChanged(
  element: HTMLElement,
  config: Partial<LgLaundryPairCardConfig>,
): void {
  element.dispatchEvent(
    new CustomEvent('config-changed', {
      detail: { config },
      bubbles: true,
      composed: true,
    }),
  );
}

function kindColor(kind: ApplianceKind): string {
  return kind === 'dryer' ? '#ff5a2f' : '#2f8cff';
}

function kindContrastColor(kind: ApplianceKind): string {
  return kind === 'dryer' ? '#ff9a1f' : '#4ad7ff';
}

function defaultImage(kind: ApplianceKind): string {
  return `/hacsfiles/gamma-ha-cards/assets/laundry-${kind}.svg`;
}

export class LgLaundryPairCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    optimisticOperations: { state: true },
  };

  public hass?: HomeAssistant;
  private config!: LgLaundryPairCardConfig;
  private optimisticOperations: Partial<Record<ApplianceKind, string>> = {};
  private optimisticTimers: Partial<Record<ApplianceKind, number>> = {};

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --laundry-pair-width: 100%;
        --laundry-pair-radius: 14px;
        --laundry-pair-background: #101722;

        display: block;
        max-width: var(--laundry-pair-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .pair-card {
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--laundry-pair-background) 94%, #ffffff 4%),
            var(--laundry-pair-background)
          );
        border: 1px solid rgb(255 255 255 / 7%);
        border-radius: var(--laundry-pair-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 5%),
          0 3px 10px rgb(0 0 0 / 16%);
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        container-type: inline-size;
        display: grid;
        gap: 9px;
        overflow: hidden;
        padding: 11px;
      }

      .pair-header {
        align-items: center;
        display: flex;
        gap: 10px;
        justify-content: space-between;
        min-width: 0;
      }

      .pair-title {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pair-badge {
        color: var(--secondary-text-color, #9aa3b1);
        flex: 0 0 auto;
        font-size: 10px;
      }

      .machines {
        display: grid;
        gap: 8px;
      }

      .machine {
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--machine-accent-color) 7%, rgb(255 255 255 / 4%)),
            rgb(255 255 255 / 3%)
          );
        border: 1px solid rgb(255 255 255 / 7%);
        border-left: 3px solid
          color-mix(in srgb, var(--machine-accent-color) 78%, transparent);
        border-radius: 11px;
        display: grid;
        gap: 7px;
        min-width: 0;
        overflow: hidden;
        padding: 8px;
        position: relative;
      }

      .machine::before {
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--machine-accent-color) 12%, transparent),
          transparent 62%
        );
        content: '';
        inset: 0;
        opacity: var(--machine-active-opacity);
        pointer-events: none;
        position: absolute;
      }

      .machine-head,
      .progress,
      .stats,
      .controls {
        position: relative;
        z-index: 1;
      }

      .machine-head {
        align-items: center;
        display: grid;
        gap: 8px;
        grid-template-columns: 34px minmax(0, 1fr) minmax(58px, auto);
        min-width: 0;
      }

      .image-wrap {
        align-items: center;
        background: rgb(255 255 255 / 4%);
        border: 1px solid rgb(255 255 255 / 7%);
        border-radius: 9px;
        display: grid;
        height: 34px;
        justify-items: center;
        overflow: hidden;
        padding: 3px;
        width: 34px;
      }

      .appliance-image {
        filter: drop-shadow(0 1px 1px rgb(0 0 0 / 22%));
        height: 100%;
        max-height: 27px;
        object-fit: contain;
        width: 100%;
      }

      .identity {
        display: grid;
        gap: 2px;
        min-width: 0;
      }

      .machine-name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 13.5px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status-line {
        align-items: center;
        color: var(--secondary-text-color, #b7c0ce);
        display: inline-flex;
        font-size: 10.5px;
        gap: 5px;
        min-width: 0;
      }

      .status-dot {
        background: var(--machine-state-color);
        border-radius: 999px;
        flex: 0 0 auto;
        height: 5px;
        opacity: var(--machine-status-opacity);
        width: 5px;
      }

      .status-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .time {
        display: grid;
        gap: 2px;
        justify-items: end;
        min-width: 0;
        text-align: right;
      }

      .time-value {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 19px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1;
      }

      .time-subtext {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 9.5px;
        line-height: 1.2;
        max-width: 96px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .progress {
        background: rgb(255 255 255 / 8%);
        border-radius: 999px;
        height: 3px;
        overflow: hidden;
      }

      .progress-bar {
        background: linear-gradient(
          90deg,
          var(--machine-state-color),
          var(--machine-contrast-color)
        );
        border-radius: inherit;
        height: 100%;
        transition: width 240ms ease;
        width: var(--machine-progress);
      }

      .stats {
        display: grid;
        gap: 5px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        min-width: 0;
      }

      .stat {
        background: rgb(255 255 255 / 4%);
        border-radius: 6px;
        display: grid;
        gap: 1px;
        min-width: 0;
        padding: 4px 7px;
      }

      .stat-label {
        color: var(--secondary-text-color, #9aa3b1);
        font-size: 8.5px;
        font-weight: 600;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .stat-value {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 10.5px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .controls {
        display: grid;
        gap: 5px;
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .control {
        align-items: center;
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 8px;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        justify-content: center;
        min-height: 29px;
        min-width: 0;
        padding: 0;
        transition:
          background 160ms ease,
          border-color 160ms ease,
          opacity 160ms ease,
          transform 160ms ease;
      }

      .control ha-icon {
        --mdc-icon-size: 15px;
        color: currentColor;
      }

      .control.primary {
        background: linear-gradient(
          145deg,
          color-mix(in srgb, var(--machine-state-color) 34%, rgb(255 255 255 / 8%)),
          color-mix(in srgb, var(--machine-state-color) 12%, rgb(255 255 255 / 3%))
        );
        border-color: color-mix(in srgb, var(--machine-state-color) 40%, transparent);
      }

      .control.warning {
        color: #ffccd4;
      }

      .control:hover:not(:disabled) {
        background: rgb(255 255 255 / 9%);
      }

      .control.primary:hover:not(:disabled) {
        background: linear-gradient(
          145deg,
          color-mix(in srgb, var(--machine-state-color) 42%, rgb(255 255 255 / 10%)),
          color-mix(in srgb, var(--machine-state-color) 20%, rgb(255 255 255 / 4%))
        );
      }

      .control:focus-visible {
        outline: 2px solid var(--machine-state-color);
        outline-offset: 2px;
      }

      .control:not(:disabled):active {
        transform: scale(0.97);
      }

      .control:disabled {
        cursor: default;
        opacity: 0.34;
      }

      @container (max-width: 360px) {
        .pair-card {
          gap: 8px;
          padding: 10px;
        }

        .machine {
          gap: 6px;
          padding: 7px;
        }

        .machine-head {
          grid-template-columns: 32px minmax(0, 1fr) minmax(52px, auto);
        }

        .image-wrap {
          height: 32px;
          width: 32px;
        }

        .time-value {
          font-size: 18px;
        }

        .time-subtext {
          max-width: 72px;
        }

        .stat {
          padding: 3px 5px;
        }

        .control {
          min-height: 28px;
        }
      }

      @container (max-width: 280px) {
        .pair-badge,
        .stat-label {
          display: none;
        }

        .machine-head {
          grid-template-columns: 32px minmax(0, 1fr);
        }

        .time {
          grid-column: 1 / -1;
          justify-items: start;
          text-align: left;
        }

        .time-subtext {
          max-width: 100%;
        }
      }
    `;
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement('lg-laundry-pair-card-editor');
  }

  public static getStubConfig(_: unknown, entities: string[]) {
    const washerEntity = entities.find(
      (entity) => entity.startsWith('sensor.') && entity.includes('washer_current_status'),
    );
    const dryerEntity = entities.find(
      (entity) => entity.startsWith('sensor.') && entity.includes('dryer_current_status'),
    );

    return {
      name: 'Laundry',
      washer: { entity: washerEntity ?? '', name: 'Washer' },
      dryer: { entity: dryerEntity ?? '', name: 'Dryer' },
    };
  }

  public setConfig(config: LgLaundryPairCardConfig): void {
    if (!config?.washer?.entity || !config?.dryer?.entity) {
      throw new Error('Washer and dryer status entities are required');
    }

    this.config = {
      ...DEFAULT_PAIR_CONFIG,
      ...config,
      washer: {
        name: 'Washer',
        ...config.washer,
      },
      dryer: {
        name: 'Dryer',
        ...config.dryer,
      },
    };

    this.style.setProperty(
      '--laundry-pair-width',
      this.config.fill_container ? '100%' : this.config.width ?? '100%',
    );
    this.style.setProperty(
      '--laundry-pair-radius',
      this.config.border_radius ?? '14px',
    );
    this.style.setProperty(
      '--laundry-pair-background',
      this.config.background ?? '#101722',
    );
  }

  public getCardSize(): number {
    return this.config.show_stats === false ? 5 : 6;
  }

  public getGridOptions() {
    return {
      rows: 'auto',
      columns: 5,
      min_rows: 5,
      max_rows: 10,
      min_columns: 3,
      max_columns: 8,
    };
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    Object.values(this.optimisticTimers).forEach((timer) => window.clearTimeout(timer));
  }

  private entity(entityId?: string): HassEntity | undefined {
    return entityId ? this.hass?.states[entityId] : undefined;
  }

  private rawStatus(kind: ApplianceKind, machine: LaundryPairMachineConfig): string {
    return this.optimisticOperations[kind] ?? this.entity(machine.entity)?.state ?? 'unknown';
  }

  private displayName(kind: ApplianceKind, machine: LaundryPairMachineConfig): string {
    const entity = this.entity(machine.entity);
    return (
      machine.name ||
      entity?.attributes.friendly_name?.replace(' Current status', '') ||
      (kind === 'dryer' ? 'Dryer' : 'Washer')
    );
  }

  private statusLabel(kind: ApplianceKind, machine: LaundryPairMachineConfig): string {
    if (isUnavailable(this.entity(machine.entity))) {
      return 'Unavailable';
    }

    const status = this.rawStatus(kind, machine);
    return status === 'end' ? 'Complete' : humanize(status);
  }

  private stateGroup(kind: ApplianceKind, machine: LaundryPairMachineConfig): LaundryStateGroup {
    const status = this.rawStatus(kind, machine);

    if (ERROR_STATES.has(status) || this.entity(machine.error_entity)?.attributes.event_type) {
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

    if (OFF_STATES.has(status) || this.entity(machine.power_entity)?.state === 'off') {
      return 'off';
    }

    return 'off';
  }

  private stateColor(
    kind: ApplianceKind,
    machine: LaundryPairMachineConfig,
    stateGroup: LaundryStateGroup,
  ): string {
    const colors = {
      running: machine.running_color ?? kindColor(kind),
      complete: machine.complete_color ?? kindColor(kind),
      paused: machine.paused_color ?? '#ff8a1c',
      error: machine.error_color ?? '#ff3b5c',
      off: machine.off_color ?? '#697382',
    };

    return colors[stateGroup];
  }

  private remainingMinutes(machine: LaundryPairMachineConfig): number | undefined {
    return remainingEntityMinutes(this.entity(machine.remaining_time_entity));
  }

  private totalMinutes(machine: LaundryPairMachineConfig): number | undefined {
    return entityDurationMinutes(this.entity(machine.total_time_entity));
  }

  private progress(
    kind: ApplianceKind,
    machine: LaundryPairMachineConfig,
    stateGroup: LaundryStateGroup,
  ): number {
    if (stateGroup === 'complete') {
      return 100;
    }

    if (stateGroup !== 'running' && stateGroup !== 'paused') {
      return 0;
    }

    const total = this.totalMinutes(machine);
    const remaining = this.remainingMinutes(machine);

    if (!total || remaining === undefined) {
      return stateGroup === 'running' ? 18 : 0;
    }

    return Math.min(100, Math.max(0, ((total - remaining) / total) * 100));
  }

  private timeDisplay(
    machine: LaundryPairMachineConfig,
    stateGroup: LaundryStateGroup,
  ): string {
    if (stateGroup === 'complete') {
      return 'Done';
    }

    if (stateGroup === 'off') {
      return '--';
    }

    return formatDuration(this.remainingMinutes(machine));
  }

  private timeSubtext(
    machine: LaundryPairMachineConfig,
    stateGroup: LaundryStateGroup,
  ): string {
    if (stateGroup === 'complete') {
      return 'Cycle complete';
    }

    if (stateGroup === 'off') {
      const total = formatDuration(this.totalMinutes(machine));
      return total === '--' ? 'Ready' : `${total} cycle`;
    }

    const duration = this.remainingMinutes(machine);
    return duration === undefined ? 'Waiting for LG' : `${formatDuration(duration)} left`;
  }

  private hasOperation(machine: LaundryPairMachineConfig, option: string): boolean {
    const operation = this.entity(machine.operation_entity);
    return Boolean(operation?.attributes.options?.includes(option));
  }

  private canCallOperation(machine: LaundryPairMachineConfig, option: string): boolean {
    const operation = this.entity(machine.operation_entity);
    return Boolean(operation && operation.state !== 'unavailable' && this.hasOperation(machine, option));
  }

  private isRemoteStartReady(machine: LaundryPairMachineConfig): boolean {
    const remoteStart = this.entity(machine.remote_start_entity);
    return !remoteStart || remoteStart.state === 'on';
  }

  private optimisticStatusForOperation(option: string): string {
    if (option === 'start') {
      return 'running';
    }

    if (option === 'stop') {
      return 'pause';
    }

    if (option === 'power_on') {
      return 'initial';
    }

    return option;
  }

  private setOptimisticOperation(kind: ApplianceKind, operation: string): void {
    window.clearTimeout(this.optimisticTimers[kind]);
    this.optimisticOperations = {
      ...this.optimisticOperations,
      [kind]: operation,
    };
    this.optimisticTimers[kind] = window.setTimeout(() => {
      const next = { ...this.optimisticOperations };
      delete next[kind];
      this.optimisticOperations = next;
    }, 2200);
  }

  private trackServiceResult(
    kind: ApplianceKind,
    result: Promise<unknown> | void,
  ): void {
    if (result && typeof result.catch === 'function') {
      result.catch(() => {
        window.clearTimeout(this.optimisticTimers[kind]);
        const next = { ...this.optimisticOperations };
        delete next[kind];
        this.optimisticOperations = next;
      });
    }
  }

  private callOperation(
    kind: ApplianceKind,
    machine: LaundryPairMachineConfig,
    option: string,
  ): void {
    if (!machine.operation_entity || !this.hasOperation(machine, option)) {
      return;
    }

    this.setOptimisticOperation(kind, this.optimisticStatusForOperation(option));
    this.trackServiceResult(
      kind,
      this.hass?.callService('select', 'select_option', {
        entity_id: machine.operation_entity,
        option,
      }),
    );
  }

  private setPower(
    kind: ApplianceKind,
    machine: LaundryPairMachineConfig,
    on: boolean,
  ): void {
    const powerEntity = this.entity(machine.power_entity);

    this.setOptimisticOperation(kind, on ? 'initial' : 'power_off');

    if (machine.power_entity && !isUnavailable(powerEntity)) {
      this.trackServiceResult(
        kind,
        this.hass?.callService('switch', on ? 'turn_on' : 'turn_off', {
          entity_id: machine.power_entity,
        }),
      );
      return;
    }

    const operation = on ? 'power_on' : 'power_off';
    if (this.hasOperation(machine, operation)) {
      this.callOperation(kind, machine, operation);
    }
  }

  private renderStat(label: string, entityId?: string): TemplateResult {
    return html`
      <div class="stat">
        <span class="stat-label">${label}</span>
        <span class="stat-value">${formatEntityState(this.entity(entityId))}</span>
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
        aria-label=${label}
        ?disabled=${disabled}
        title=${label}
        @click=${handler}
      >
        <ha-icon icon=${icon}></ha-icon>
      </button>
    `;
  }

  private renderMachine(
    kind: ApplianceKind,
    machine: LaundryPairMachineConfig,
  ): TemplateResult {
    const stateGroup = this.stateGroup(kind, machine);
    const powerEntity = this.entity(machine.power_entity);
    const operationEntity = this.entity(machine.operation_entity);
    const hasPowerSwitch = Boolean(machine.power_entity && powerEntity);
    const operationUnavailable = !operationEntity || operationEntity.state === 'unavailable';
    const isRunning = stateGroup === 'running';
    const isPausable = stateGroup === 'running' || stateGroup === 'paused';
    const startDisabled =
      operationUnavailable ||
      !this.canCallOperation(machine, 'start') ||
      !this.isRemoteStartReady(machine) ||
      isRunning;
    const stopDisabled =
      operationUnavailable || !this.canCallOperation(machine, 'stop') || !isPausable;
    const powerOnDisabled = hasPowerSwitch
      ? isUnavailable(powerEntity) || powerEntity?.state === 'on'
      : !this.canCallOperation(machine, 'power_on');
    const powerOffDisabled = hasPowerSwitch
      ? isUnavailable(powerEntity) || powerEntity?.state === 'off'
      : !this.canCallOperation(machine, 'power_off');

    return html`
      <section
        class="machine ${kind} ${stateGroup}"
        style="
          --machine-state-color: ${this.stateColor(kind, machine, stateGroup)};
          --machine-accent-color: ${kindColor(kind)};
          --machine-contrast-color: ${kindContrastColor(kind)};
          --machine-progress: ${this.progress(kind, machine, stateGroup)}%;
          --machine-active-opacity: ${stateGroup === 'off' ? '0.08' : '0.42'};
          --machine-status-opacity: ${stateGroup === 'off' ? '0.38' : '1'};
        "
      >
        <div class="machine-head">
          <div class="image-wrap">
            <img
              class="appliance-image"
              alt=${this.displayName(kind, machine)}
              src=${machine.image ?? defaultImage(kind)}
              loading="lazy"
            />
          </div>
          <div class="identity">
            <span class="machine-name">${this.displayName(kind, machine)}</span>
            <span class="status-line">
              <span class="status-dot"></span>
              <span class="status-text">${this.statusLabel(kind, machine)}</span>
            </span>
          </div>
          <div class="time">
            <span class="time-value">${this.timeDisplay(machine, stateGroup)}</span>
            <span class="time-subtext">${this.timeSubtext(machine, stateGroup)}</span>
          </div>
        </div>

        <div class="progress" aria-hidden="true">
          <div class="progress-bar"></div>
        </div>

        ${this.config.show_stats === false
          ? nothing
          : html`
              <div class="stats">
                ${this.renderStat('Total', machine.total_time_entity)}
                ${this.renderStat('Remote', machine.remote_start_entity)}
                ${this.renderStat('Energy', machine.energy_entity)}
              </div>
            `}

        ${this.config.show_controls === false
          ? nothing
          : html`
              <div class="controls">
                ${this.renderControl(
                  'Power',
                  'mdi:power',
                  () => this.setPower(kind, machine, true),
                  powerOnDisabled,
                )}
                ${this.renderControl(
                  'Start',
                  'mdi:play',
                  () => this.callOperation(kind, machine, 'start'),
                  startDisabled,
                  'primary',
                )}
                ${this.renderControl(
                  'Stop',
                  'mdi:stop',
                  () => this.callOperation(kind, machine, 'stop'),
                  stopDisabled,
                )}
                ${this.renderControl(
                  'Off',
                  'mdi:power-standby',
                  () => this.setPower(kind, machine, false),
                  powerOffDisabled,
                  'warning',
                )}
              </div>
            `}
      </section>
    `;
  }

  protected render(): TemplateResult {
    if (!this.config) {
      return html``;
    }

    return html`
      <ha-card>
        <article class="pair-card">
          <header class="pair-header">
            <span class="pair-title">${this.config.name ?? 'Laundry'}</span>
            <span class="pair-badge">Washer + Dryer</span>
          </header>
          <div class="machines">
            ${this.renderMachine('washer', this.config.washer)}
            ${this.renderMachine('dryer', this.config.dryer)}
          </div>
        </article>
      </ha-card>
    `;
  }
}

if (!customElements.get('lg-laundry-pair-card')) {
  customElements.define('lg-laundry-pair-card', LgLaundryPairCard);
}

class LgLaundryPairCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  public hass?: HomeAssistant;
  private config: Partial<LgLaundryPairCardConfig> = {};

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

      ha-textfield {
        width: 100%;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 14px;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }

  public setConfig(config: LgLaundryPairCardConfig): void {
    this.config = {
      ...DEFAULT_PAIR_CONFIG,
      ...config,
      washer: {
        name: 'Washer',
        ...config.washer,
      },
      dryer: {
        name: 'Dryer',
        ...config.dryer,
      },
    };
  }

  private updateConfig(config: Partial<LgLaundryPairCardConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
    firePairConfigChanged(this, this.config);
  }

  private updatePath(path: string, value: unknown): void {
    const [section, key] = path.split('.');

    if (!key) {
      this.updateConfig({ [section]: value } as Partial<LgLaundryPairCardConfig>);
      return;
    }

    const next = {
      ...this.config,
      [section]: {
        ...(this.config[section as 'washer' | 'dryer'] ?? {}),
        [key]: value,
      },
    };

    this.updateConfig(next as Partial<LgLaundryPairCardConfig>);
  }

  private valueChanged(event: Event): void {
    const target = event.target as PairConfigElement;
    const customEvent = event as CustomEvent<{ value?: string }>;

    if (!target.configPath) {
      return;
    }

    this.updatePath(
      target.configPath,
      target.checked !== undefined
        ? target.checked
        : customEvent.detail?.value ?? target.value,
    );
  }

  private valueFor(path: string): unknown {
    const [section, key] = path.split('.');

    if (!key) {
      return this.config[section as keyof LgLaundryPairCardConfig];
    }

    const machine = this.config[section as 'washer' | 'dryer'];
    return machine?.[key as keyof LaundryPairMachineConfig] ?? '';
  }

  private renderTextInput(label: string, path: string, placeholder = ''): TemplateResult {
    return html`
      <ha-textfield
        .label=${label}
        .placeholder=${placeholder}
        .value=${this.valueFor(path) ?? ''}
        .configPath=${path}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }

  private renderSwitch(
    label: string,
    path: keyof LgLaundryPairCardConfig,
    defaultValue: boolean,
  ): TemplateResult {
    return html`
      <label class="switch-row">
        <ha-switch
          .checked=${Boolean(this.config[path] ?? defaultValue)}
          .configPath=${path}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${label}</span>
      </label>
    `;
  }

  private renderMachineFields(kind: ApplianceKind): TemplateResult {
    const title = kind === 'dryer' ? 'Dryer' : 'Washer';
    return html`
      <section class="section">
        <h3>${title}</h3>
        <div class="grid">
          ${this.renderTextInput(`${title} Name`, `${kind}.name`, title)}
          ${this.renderTextInput(`${title} Status Sensor`, `${kind}.entity`, `sensor.${kind}_current_status`)}
          ${this.renderTextInput(`${title} Image URL`, `${kind}.image`, defaultImage(kind))}
          ${this.renderTextInput(`${title} Power Switch`, `${kind}.power_entity`, `switch.${kind}_power`)}
          ${this.renderTextInput(`${title} Operation Select`, `${kind}.operation_entity`, `select.${kind}_operation`)}
          ${this.renderTextInput(`${title} Remaining Time`, `${kind}.remaining_time_entity`, `sensor.${kind}_remaining_time`)}
          ${this.renderTextInput(`${title} Total Time`, `${kind}.total_time_entity`, `sensor.${kind}_total_time`)}
          ${this.renderTextInput(`${title} Remote Start`, `${kind}.remote_start_entity`, `binary_sensor.${kind}_remote_start`)}
          ${this.renderTextInput(`${title} Energy`, `${kind}.energy_entity`, `sensor.${kind}_energy_this_month`)}
          ${this.renderTextInput(`${title} Error Event`, `${kind}.error_entity`, `event.${kind}_error`)}
        </div>
      </section>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          <div class="grid">
            ${this.renderTextInput('Card Name', 'name', 'Laundry Room')}
            ${this.renderTextInput('Width', 'width', '420px')}
            ${this.renderTextInput('Radius', 'border_radius', '14px')}
            ${this.renderTextInput('Background', 'background', '#101722')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Fill Container', 'fill_container', false)}
            ${this.renderSwitch('Show Controls', 'show_controls', true)}
            ${this.renderSwitch('Show Stats', 'show_stats', true)}
            ${this.renderSwitch('Animated', 'animated', true)}
          </div>
        </section>

        ${this.renderMachineFields('washer')}
        ${this.renderMachineFields('dryer')}
      </div>
    `;
  }
}

if (!customElements.get('lg-laundry-pair-card-editor')) {
  customElements.define('lg-laundry-pair-card-editor', LgLaundryPairCardEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    'lg-laundry-pair-card': LgLaundryPairCard;
    'lg-laundry-pair-card-editor': LgLaundryPairCardEditor;
  }

  interface Window {
    customCards?: unknown[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  preview: true,
  type: 'lg-laundry-pair-card',
  name: 'LG Laundry Pair Card',
  description: 'One compact named LG ThinQ washer and dryer dashboard card.',
});
