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

type LaundryPairControlAction =
  | 'power_on'
  | 'start'
  | 'stop'
  | 'power_off'
  | 'settings'
  | 'more_info'
  | 'toggle'
  | 'press'
  | 'select_option'
  | 'service';

type LaundryPairControlButtonConfig = {
  action?: LaundryPairControlAction;
  label?: string;
  icon?: string;
  entity?: string;
  option?: string;
  service?: string;
  service_data?: Record<string, unknown>;
  target?: Record<string, unknown>;
  className?: string;
};

type LaundryPairControlButton =
  | LaundryPairControlAction
  | LaundryPairControlButtonConfig;

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
  | 'delayed_start_entity'
  | 'notification_entity'
  | 'error_entity'
  | 'energy_entity'
  | 'running_color'
  | 'cycles_entity'
  | 'detail_entities'
  | 'complete_color'
  | 'paused_color'
  | 'error_color'
  | 'off_color'
> & {
  control_buttons?: LaundryPairControlButton[];
};

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
  show_stats: false,
  animated: true,
};

const DEFAULT_CONTROL_BUTTONS: LaundryPairControlButtonConfig[] = [
  { action: 'power_on', label: 'Power', icon: 'mdi:power' },
  { action: 'start', label: 'Start', icon: 'mdi:play', className: 'primary' },
  { action: 'stop', label: 'Stop', icon: 'mdi:stop' },
  {
    action: 'power_off',
    label: 'Off',
    icon: 'mdi:power-standby',
    className: 'warning',
  },
];

const CONTROL_PRESETS: Record<
  LaundryPairControlAction,
  Required<Pick<LaundryPairControlButtonConfig, 'label' | 'icon'>>
> = {
  power_on: { label: 'Power', icon: 'mdi:power' },
  start: { label: 'Start', icon: 'mdi:play' },
  stop: { label: 'Stop', icon: 'mdi:stop' },
  power_off: { label: 'Off', icon: 'mdi:power-standby' },
  settings: { label: 'Settings', icon: 'mdi:cog-outline' },
  more_info: { label: 'Info', icon: 'mdi:information-outline' },
  toggle: { label: 'Toggle', icon: 'mdi:toggle-switch-outline' },
  press: { label: 'Press', icon: 'mdi:gesture-tap-button' },
  select_option: { label: 'Select', icon: 'mdi:format-list-bulleted' },
  service: { label: 'Run', icon: 'mdi:flash' },
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
    settingsMachine: { state: true },
  };

  public hass?: HomeAssistant;
  private config!: LgLaundryPairCardConfig;
  private optimisticOperations: Partial<Record<ApplianceKind, string>> = {};
  private optimisticTimers: Partial<Record<ApplianceKind, number>> = {};
  private settingsMachine?: ApplianceKind;

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

      .settings-toggle {
        align-items: center;
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: 8px;
        color: var(--secondary-text-color, #c2ccd9);
        cursor: pointer;
        display: inline-flex;
        height: 28px;
        justify-content: center;
        padding: 0;
        transition:
          background 160ms ease,
          border-color 160ms ease,
          color 160ms ease,
          transform 160ms ease;
        width: 28px;
      }

      .machine-settings-toggle {
        height: 26px;
        width: 26px;
      }

      .settings-toggle ha-icon {
        --mdc-icon-size: 16px;
        color: currentColor;
      }

      .settings-toggle:hover {
        background: rgb(255 255 255 / 9%);
        border-color: rgb(255 255 255 / 14%);
        color: var(--primary-text-color, #f4f7fb);
      }

      .settings-toggle:focus-visible {
        outline: 2px solid color-mix(in srgb, #2f8cff 70%, #ff5a2f 30%);
        outline-offset: 2px;
      }

      .settings-toggle:active {
        transform: scale(0.96);
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
        column-gap: 11px;
        row-gap: 4px;
        grid-template-columns: 34px minmax(78px, 1fr) auto;
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

      .machine-actions {
        align-items: center;
        display: inline-flex;
        gap: 7px;
        justify-content: end;
        max-width: 94px;
        min-width: 0;
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
        max-width: 60px;
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
        grid-template-columns: repeat(auto-fit, minmax(44px, 1fr));
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

      .settings-overlay {
        align-items: center;
        background: rgb(0 0 0 / 48%);
        display: grid;
        inset: 0;
        justify-items: center;
        padding: 16px;
        position: fixed;
        z-index: 2147483647;
      }

      .settings-dialog {
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--laundry-pair-background) 90%, #ffffff 5%),
            color-mix(in srgb, var(--laundry-pair-background) 96%, #000000 12%)
          );
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 16px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 7%),
          0 20px 60px rgb(0 0 0 / 38%);
        color: var(--primary-text-color, #f4f7fb);
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        max-height: min(720px, calc(100vh - 32px));
        overflow: hidden;
        width: min(520px, calc(100vw - 28px));
      }

      .settings-dialog-header {
        align-items: center;
        border-bottom: 1px solid rgb(255 255 255 / 8%);
        display: flex;
        gap: 12px;
        justify-content: space-between;
        padding: 15px 16px 13px;
      }

      .settings-dialog-title {
        display: grid;
        gap: 3px;
        min-width: 0;
      }

      .settings-dialog-title span {
        color: var(--secondary-text-color, #9aa3b1);
        font-size: 10px;
        font-weight: 650;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .settings-dialog-title h2 {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 18px;
        font-weight: 750;
        letter-spacing: 0;
        line-height: 1.1;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .settings-dialog-close {
        align-items: center;
        background: rgb(255 255 255 / 6%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 9px;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: inline-flex;
        flex: 0 0 auto;
        height: 32px;
        justify-content: center;
        padding: 0;
        width: 32px;
      }

      .settings-dialog-close ha-icon {
        --mdc-icon-size: 17px;
      }

      .settings-panel {
        display: grid;
        gap: 11px;
        overflow: auto;
        padding: 12px;
      }

      .settings-group {
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--settings-accent) 8%, rgb(255 255 255 / 4%)),
            rgb(255 255 255 / 3%)
          );
        border: 1px solid rgb(255 255 255 / 7%);
        border-left: 3px solid color-mix(in srgb, var(--settings-accent) 82%, transparent);
        border-radius: 12px;
        display: grid;
        gap: 8px;
        padding: 10px;
      }

      .settings-group-title {
        align-items: center;
        color: var(--primary-text-color, #f4f7fb);
        display: flex;
        font-size: 13px;
        font-weight: 750;
        gap: 7px;
        letter-spacing: 0;
        line-height: 1.1;
        margin: 0;
      }

      .settings-group-title::before {
        background: var(--settings-accent);
        border-radius: 999px;
        content: '';
        height: 7px;
        width: 7px;
      }

      .settings-list {
        display: grid;
        gap: 6px;
      }

      .settings-row {
        align-items: center;
        background: rgb(0 0 0 / 11%);
        border: 1px solid rgb(255 255 255 / 6%);
        border-radius: 9px;
        display: grid;
        gap: 7px 9px;
        grid-template-columns: minmax(0, 1fr) auto;
        min-width: 0;
        padding: 8px;
      }

      .settings-row-main {
        align-items: center;
        background: transparent;
        border: 0;
        color: inherit;
        cursor: pointer;
        display: grid;
        font: inherit;
        gap: 9px;
        grid-template-columns: 20px minmax(0, 1fr);
        min-width: 0;
        padding: 0;
        text-align: left;
      }

      .settings-row-main ha-icon {
        --mdc-icon-size: 17px;
        color: color-mix(in srgb, var(--settings-accent) 72%, #ffffff 28%);
      }

      .settings-row-main:focus-visible {
        border-radius: 6px;
        outline: 2px solid var(--settings-accent);
        outline-offset: 2px;
      }

      .settings-row-label {
        display: grid;
        gap: 2px;
        min-width: 0;
      }

      .settings-row-name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 12px;
        font-weight: 650;
        letter-spacing: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .settings-row-state {
        color: var(--secondary-text-color, #aeb8c6);
        font-size: 10.5px;
        letter-spacing: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .settings-state {
        align-items: center;
        color: var(--secondary-text-color, #b7c0ce);
        display: inline-flex;
        font-size: 11px;
        gap: 2px;
        letter-spacing: 0;
        min-width: 0;
        white-space: nowrap;
      }

      .settings-state ha-icon {
        --mdc-icon-size: 16px;
      }

      .settings-row-button,
      .settings-chip {
        align-items: center;
        background: rgb(255 255 255 / 6%);
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: 7px;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 11px;
        font-weight: 650;
        justify-content: center;
        letter-spacing: 0;
        min-height: 26px;
        padding: 0 10px;
      }

      .settings-row-button:hover,
      .settings-chip:hover {
        background: rgb(255 255 255 / 10%);
      }

      .settings-options {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        grid-column: 1 / -1;
      }

      .settings-chip.active {
        background: color-mix(in srgb, var(--settings-accent) 36%, rgb(255 255 255 / 8%));
        border-color: color-mix(in srgb, var(--settings-accent) 50%, transparent);
      }

      .settings-row.unavailable {
        opacity: 0.62;
      }

      .settings-row ha-switch {
        --switch-checked-color: var(--settings-accent);
        --switch-checked-button-color: var(--settings-accent);
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
          column-gap: 10px;
          grid-template-columns: 32px minmax(68px, 1fr) auto;
        }

        .image-wrap {
          height: 32px;
          width: 32px;
        }

        .time-value {
          font-size: 18px;
        }

        .time-subtext {
          max-width: 52px;
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

        .machine-settings-toggle {
          height: 28px;
          width: 28px;
        }

        .machine-head {
          grid-template-columns: 32px minmax(0, 1fr) 28px;
        }

        .machine-actions {
          align-self: start;
        }

        .time {
          display: none;
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
    this.settingsMachine = undefined;

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
    return this.config.show_stats === false ? 4 : 6;
  }

  public getGridOptions() {
    return {
      rows: 'auto',
      columns: 5,
      min_rows: 4,
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

  private entityDomain(entityId: string): string {
    return entityId.split('.')[0] ?? '';
  }

  private entityIcon(entityId: string, entity?: HassEntity): string {
    if (entity?.attributes.icon) {
      return entity.attributes.icon;
    }

    switch (this.entityDomain(entityId)) {
      case 'binary_sensor':
        return 'mdi:radiobox-marked';
      case 'button':
        return 'mdi:gesture-tap-button';
      case 'event':
        return 'mdi:bell-outline';
      case 'number':
        return 'mdi:numeric';
      case 'select':
        return 'mdi:format-list-bulleted';
      case 'sensor':
        return 'mdi:chart-line';
      case 'switch':
        return 'mdi:toggle-switch-outline';
      default:
        return 'mdi:cog-outline';
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

  private openSettings(kind: ApplianceKind, event: Event): void {
    event.stopPropagation();
    this.settingsMachine = kind;
  }

  private closeSettings(event?: Event): void {
    event?.stopPropagation();
    this.settingsMachine = undefined;
  }

  private isEditorPreview(): boolean {
    return this.isInEditorPreviewTree(this);
  }

  private isInEditorPreviewTree(current: Node | null): boolean {
    while (current) {
      if (
        current instanceof Element &&
        current.matches(
          [
            'hui-card-preview',
            'hui-card-element-editor',
            'hui-dialog-edit-card',
            'hui-card-options',
          ].join(','),
        )
      ) {
        return true;
      }

      const root = current.getRootNode();

      if (root instanceof ShadowRoot) {
        current = root.host;
        continue;
      }

      current = current instanceof Element ? current.parentElement : null;
    }

    return false;
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
    const entity = this.entity(entityId);
    return html`
      <div class="stat">
        <span class="stat-label">${label}</span>
        <span class="stat-value">${isUnavailable(entity) ? '--' : formatEntityState(entity)}</span>
      </div>
    `;
  }

  private renderControl(
    label: string,
    icon: string,
    handler: (event: Event) => void,
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

  private configuredControlButtons(
    machine: LaundryPairMachineConfig,
  ): LaundryPairControlButtonConfig[] {
    const buttons = Array.isArray(machine.control_buttons) && machine.control_buttons.length
      ? machine.control_buttons
      : DEFAULT_CONTROL_BUTTONS;

    return buttons
      .map((button) =>
        typeof button === 'string' ? { action: button } : button,
      )
      .map((button) => {
        const action =
          button.action && button.action in CONTROL_PRESETS
            ? button.action
            : 'more_info';
        const preset = CONTROL_PRESETS[action];
        return {
          ...button,
          action,
          label: button.label ?? preset.label,
          icon: button.icon ?? preset.icon,
        };
      });
  }

  private callCustomService(
    button: LaundryPairControlButtonConfig,
    machine: LaundryPairMachineConfig,
  ): void {
    if (!button.service) {
      return;
    }

    const [domain, service] = button.service.split('.');
    if (!domain || !service) {
      return;
    }

    this.hass?.callService(
      domain,
      service,
      button.service_data ?? {},
      button.target ?? (button.entity ? { entity_id: button.entity } : undefined),
    );
  }

  private controlDisabled(
    kind: ApplianceKind,
    machine: LaundryPairMachineConfig,
    stateGroup: LaundryStateGroup,
    button: LaundryPairControlButtonConfig,
  ): boolean {
    const action = button.action ?? 'more_info';
    const powerEntity = this.entity(machine.power_entity);
    const operationEntity = this.entity(machine.operation_entity);
    const hasPowerSwitch = Boolean(machine.power_entity && powerEntity);
    const operationUnavailable = !operationEntity || operationEntity.state === 'unavailable';
    const isRunning = stateGroup === 'running';
    const isPausable = stateGroup === 'running' || stateGroup === 'paused';
    const operationOption = button.option ?? action;

    switch (action) {
      case 'power_on':
        return hasPowerSwitch
          ? isUnavailable(powerEntity) || powerEntity?.state === 'on'
          : !this.canCallOperation(machine, 'power_on');
      case 'start':
        return (
          operationUnavailable ||
          !this.canCallOperation(machine, operationOption) ||
          !this.isRemoteStartReady(machine) ||
          isRunning
        );
      case 'stop':
        return (
          operationUnavailable ||
          !this.canCallOperation(machine, operationOption) ||
          !isPausable
        );
      case 'power_off':
        return hasPowerSwitch
          ? isUnavailable(powerEntity) || powerEntity?.state === 'off'
          : !this.canCallOperation(machine, 'power_off');
      case 'toggle':
        return !button.entity || isUnavailable(this.entity(button.entity));
      case 'press':
        return !button.entity || isUnavailable(this.entity(button.entity));
      case 'select_option':
        return (
          !button.option ||
          isUnavailable(this.entity(button.entity ?? machine.operation_entity)) ||
          !this
            .entity(button.entity ?? machine.operation_entity)
            ?.attributes.options?.includes(button.option)
        );
      case 'service':
        return !button.service;
      case 'settings':
      case 'more_info':
      default:
        return false;
    }
  }

  private runControlButton(
    kind: ApplianceKind,
    machine: LaundryPairMachineConfig,
    button: LaundryPairControlButtonConfig,
    event: Event,
  ): void {
    event.stopPropagation();
    const action = button.action ?? 'more_info';

    switch (action) {
      case 'power_on':
        this.setPower(kind, machine, true);
        break;
      case 'start':
        this.callOperation(kind, machine, button.option ?? 'start');
        break;
      case 'stop':
        this.callOperation(kind, machine, button.option ?? 'stop');
        break;
      case 'power_off':
        this.setPower(kind, machine, false);
        break;
      case 'settings':
        this.openSettings(kind, event);
        break;
      case 'more_info':
        this.dispatchMoreInfo(button.entity ?? machine.entity);
        break;
      case 'toggle':
        if (button.entity) {
          this.toggleSwitch(button.entity);
        }
        break;
      case 'press':
        if (button.entity) {
          this.pressButton(button.entity);
        }
        break;
      case 'select_option':
        if (button.option) {
          this.selectOption(button.entity ?? machine.operation_entity ?? '', button.option);
        }
        break;
      case 'service':
        this.callCustomService(button, machine);
        break;
      default:
        break;
    }
  }

  private renderControlButton(
    kind: ApplianceKind,
    machine: LaundryPairMachineConfig,
    stateGroup: LaundryStateGroup,
    button: LaundryPairControlButtonConfig,
  ): TemplateResult {
    const action = button.action ?? 'more_info';
    const className =
      button.className ??
      (action === 'start' ? 'primary' : action === 'power_off' ? 'warning' : '');

    return this.renderControl(
      button.label ?? CONTROL_PRESETS[action].label,
      button.icon ?? CONTROL_PRESETS[action].icon,
      (event) => this.runControlButton(kind, machine, button, event),
      this.controlDisabled(kind, machine, stateGroup, button),
      className,
    );
  }

  private configuredSettingEntities(machine: LaundryPairMachineConfig): string[] {
    const entities = [
      machine.entity,
      machine.power_entity,
      machine.operation_entity,
      machine.remote_start_entity,
      machine.delayed_start_entity,
      machine.remaining_time_entity,
      machine.total_time_entity,
      machine.cycles_entity,
      machine.energy_entity,
      machine.notification_entity,
      machine.error_entity,
      ...(machine.detail_entities ?? []),
    ].filter((entityId): entityId is string => Boolean(entityId));

    return [...new Set(entities)].filter(
      (entityId) => !isUnavailable(this.entity(entityId)),
    );
  }

  private toggleSwitch(entityId: string): void {
    this.hass?.callService('switch', 'toggle', { entity_id: entityId });
  }

  private pressButton(entityId: string): void {
    this.hass?.callService('button', 'press', { entity_id: entityId });
  }

  private selectOption(entityId: string, option: string): void {
    this.hass?.callService('select', 'select_option', {
      entity_id: entityId,
      option,
    });
  }

  private renderSettingControl(entityId: string, entity?: HassEntity): TemplateResult {
    if (!entity || isUnavailable(entity)) {
      return html`
        <span class="settings-state">
          Unknown
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </span>
      `;
    }

    const domain = this.entityDomain(entityId);

    if (domain === 'switch') {
      return html`
        <ha-switch
          .checked=${entity.state === 'on'}
          @click=${(event: Event) => event.stopPropagation()}
          @change=${() => this.toggleSwitch(entityId)}
        ></ha-switch>
      `;
    }

    if (domain === 'button') {
      return html`
        <button
          type="button"
          class="settings-row-button"
          @click=${(event: Event) => {
            event.stopPropagation();
            this.pressButton(entityId);
          }}
        >
          Press
        </button>
      `;
    }

    return html`
      <span class="settings-state">
        ${formatEntityState(entity)}
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </span>
    `;
  }

  private renderSettingEntity(entityId: string): TemplateResult {
    const entity = this.entity(entityId);
    const options = entity?.attributes.options ?? [];
    const isSelect = this.entityDomain(entityId) === 'select';

    return html`
      <div class="settings-row ${!entity || isUnavailable(entity) ? 'unavailable' : ''}">
        <button
          type="button"
          class="settings-row-main"
          @click=${() => this.dispatchMoreInfo(entityId)}
        >
          <ha-icon icon=${this.entityIcon(entityId, entity)}></ha-icon>
          <span class="settings-row-label">
            <span class="settings-row-name">
              ${entity?.attributes.friendly_name ?? entityId}
            </span>
            <span class="settings-row-state">${formatEntityState(entity)}</span>
          </span>
        </button>
        ${this.renderSettingControl(entityId, entity)}
        ${isSelect && options.length
          ? html`
              <div class="settings-options">
                ${options.map(
                  (option) => html`
                    <button
                      type="button"
                      class="settings-chip ${entity?.state === option ? 'active' : ''}"
                      @click=${(event: Event) => {
                        event.stopPropagation();
                        this.selectOption(entityId, option);
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

  private renderSettingsSection(
    kind: ApplianceKind,
    machine: LaundryPairMachineConfig,
  ): TemplateResult {
    return html`
      <section
        class="settings-group"
        style="--settings-accent: ${kindColor(kind)};"
      >
        <h3 class="settings-group-title">${this.displayName(kind, machine)}</h3>
        <div class="settings-list">
          ${this.configuredSettingEntities(machine).map((entityId) =>
            this.renderSettingEntity(entityId),
          )}
        </div>
      </section>
    `;
  }

  private renderSettingsDialog(): TemplateResult | typeof nothing {
    if (!this.settingsMachine || this.isEditorPreview()) {
      return nothing;
    }

    const kind = this.settingsMachine;
    const machine = this.config[kind];

    return html`
      <div class="settings-overlay" @click=${this.closeSettings}>
        <section
          class="settings-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="${this.displayName(kind, machine)} settings"
          @click=${(event: Event) => event.stopPropagation()}
        >
          <div class="settings-dialog-header">
            <div class="settings-dialog-title">
              <span>${this.config.name ?? 'Laundry'}</span>
              <h2>${this.displayName(kind, machine)}</h2>
            </div>
            <button
              type="button"
              class="settings-dialog-close"
              aria-label="Close settings"
              @click=${this.closeSettings}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="settings-panel">
            ${this.renderSettingsSection(kind, machine)}
          </div>
        </section>
      </div>
    `;
  }

  private renderMachine(
    kind: ApplianceKind,
    machine: LaundryPairMachineConfig,
  ): TemplateResult {
    const stateGroup = this.stateGroup(kind, machine);
    const controlButtons = this.configuredControlButtons(machine);

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
          <div class="machine-actions">
            <div class="time">
              <span class="time-value">${this.timeDisplay(machine, stateGroup)}</span>
              <span class="time-subtext">${this.timeSubtext(machine, stateGroup)}</span>
            </div>
            <button
              type="button"
              class="settings-toggle machine-settings-toggle"
              aria-label="Open ${this.displayName(kind, machine)} settings"
              title="Settings"
              @click=${(event: Event) => this.openSettings(kind, event)}
            >
              <ha-icon icon="mdi:cog-outline"></ha-icon>
            </button>
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
                ${controlButtons.map((button) =>
                  this.renderControlButton(kind, machine, stateGroup, button),
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
          </header>
          <div class="machines">
            ${this.renderMachine('washer', this.config.washer)}
            ${this.renderMachine('dryer', this.config.dryer)}
          </div>
          ${this.renderSettingsDialog()}
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

  private controlButtonsValue(kind: ApplianceKind): string {
    const value = this.valueFor(`${kind}.control_buttons`);

    if (!Array.isArray(value)) {
      return '';
    }

    return value
      .map((button) =>
        typeof button === 'string'
          ? button
          : button?.action ?? button?.label ?? '',
      )
      .filter(Boolean)
      .join(', ');
  }

  private controlButtonsChanged(event: Event): void {
    const target = event.target as PairConfigElement;

    if (!target.configPath) {
      return;
    }

    const buttons = String(target.value ?? '')
      .split(',')
      .map((button) => button.trim())
      .filter(Boolean) as LaundryPairControlButton[];

    this.updatePath(target.configPath, buttons.length ? buttons : undefined);
  }

  private renderControlButtonsInput(kind: ApplianceKind): TemplateResult {
    const title = kind === 'dryer' ? 'Dryer' : 'Washer';

    return html`
      <ha-textfield
        .label=${`${title} Bottom Buttons`}
        .helper=${'Comma list: power_on, start, stop, power_off, settings, more_info'}
        .placeholder=${'power_on, start, stop, power_off'}
        .value=${this.controlButtonsValue(kind)}
        .configPath=${`${kind}.control_buttons`}
        @input=${this.controlButtonsChanged}
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
          ${this.renderTextInput(`${title} Delayed Start`, `${kind}.delayed_start_entity`, `number.${kind}_delayed_start`)}
          ${this.renderTextInput(`${title} Energy`, `${kind}.energy_entity`, `sensor.${kind}_energy_this_month`)}
          ${this.renderTextInput(`${title} Cycles`, `${kind}.cycles_entity`, `sensor.${kind}_cycles`)}
          ${this.renderTextInput(`${title} Notification Event`, `${kind}.notification_entity`, `event.${kind}_notification`)}
          ${this.renderTextInput(`${title} Error Event`, `${kind}.error_entity`, `event.${kind}_error`)}
          ${this.renderControlButtonsInput(kind)}
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
            ${this.renderSwitch('Show Stats', 'show_stats', false)}
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
