import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';

type ClimateEntity = {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    icon?: string;
    current_temperature?: number;
    temperature?: number;
    target_temp_low?: number;
    target_temp_high?: number;
    min_temp?: number;
    max_temp?: number;
    temperature_unit?: string;
    hvac_action?: string;
    [key: string]: unknown;
  };
};

type HassEntity = {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    icon?: string;
    options?: string[];
    unit_of_measurement?: string;
    [key: string]: unknown;
  };
};

type HomeAssistant = {
  states: Record<string, HassEntity | ClimateEntity | undefined>;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ) => Promise<unknown> | void;
};

type ActionMode = 'more-info' | 'none';

interface GlowThermostatCardConfig {
  type?: string;
  entity: string;
  name?: string;
  icon?: string;
  width?: string;
  fill_container?: boolean;
  height?: string;
  border_radius?: string;
  show_state?: boolean;
  show_current?: boolean;
  show_controls?: boolean;
  show_mode_buttons?: boolean;
  show_features?: boolean;
  show_hvac_modes?: boolean;
  show_fan_modes?: boolean;
  show_swing_modes?: boolean;
  show_horizontal_swing_modes?: boolean;
  filter_entity?: string;
  problem_entity?: string;
  pm25_entity?: string;
  display_light_entity?: string;
  sleep_mode_entity?: string;
  vertical_position_entity?: string;
  horizontal_position_entity?: string;
  anti_frost_switch_entity?: string;
  anti_mildew_switch_entity?: string;
  eco_switch_entity?: string;
  health_switch_entity?: string;
  soft_wind_switch_entity?: string;
  sound_switch_entity?: string;
  temperature_step?: number;
  heat_color?: string;
  cool_color?: string;
  idle_color?: string;
  off_color?: string;
  background?: string;
  tap_action?: ActionMode;
  hold_action?: ActionMode;
  animated?: boolean;
}

type ConfigElement = HTMLInputElement & {
  checked?: boolean;
  configValue?: keyof GlowThermostatCardConfig;
};

const DEFAULT_CONFIG: Omit<GlowThermostatCardConfig, 'entity'> = {
  icon: 'mdi:thermostat',
  width: '320px',
  fill_container: false,
  border_radius: '18px',
  show_state: false,
  show_current: true,
  show_controls: true,
  show_mode_buttons: true,
  show_features: false,
  show_hvac_modes: true,
  show_fan_modes: true,
  show_swing_modes: true,
  show_horizontal_swing_modes: true,
  temperature_step: 1,
  heat_color: '#ff8a1c',
  cool_color: '#2f80ff',
  idle_color: '#45d158',
  off_color: '#697382',
  background: '#101722',
  tap_action: 'more-info',
  hold_action: 'more-info',
  animated: true,
};

const ACTIONS: ActionMode[] = ['more-info', 'none'];
const MODE_LABELS: Record<string, string> = {
  auto: 'Auto',
  cool: 'Cool',
  dry: 'Dry',
  fan_only: 'Fan',
  heat: 'Heat',
  heat_cool: 'Auto',
  off: 'Off',
};

function fireConfigChanged(
  element: HTMLElement,
  config: Partial<GlowThermostatCardConfig>,
): void {
  element.dispatchEvent(
    new CustomEvent('config-changed', {
      detail: { config },
      bubbles: true,
      composed: true,
    }),
  );
}

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function clampCssLength(
  value: string | undefined,
  fallback: string,
  minPixels: number,
): string {
  const length = value?.trim() || fallback;
  const pxMatch = /^(\d+(?:\.\d+)?)px$/.exec(length);

  if (pxMatch) {
    return `${Math.max(minPixels, Number(pxMatch[1]))}px`;
  }

  if (length === 'auto' || length === 'initial' || length === 'inherit') {
    return fallback;
  }

  return `max(${minPixels}px, ${length})`;
}

export class GlowThermostatCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    holdActive: { state: true },
    optimisticMode: { state: true },
    optimisticTemperature: { state: true },
  };

  public hass?: HomeAssistant;
  private config!: GlowThermostatCardConfig;
  private holdTimer?: number;
  private optimisticTimer?: number;
  private optimisticModeTimer?: number;
  private holdActive = false;
  private handledControlPointer = false;
  private optimisticMode?: string;
  private optimisticTemperature?: number;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --thermostat-card-width: 320px;
        --thermostat-card-height: auto;
        --thermostat-card-radius: 18px;
        --thermostat-heat-color: #ff8a1c;
        --thermostat-cool-color: #2f80ff;
        --thermostat-idle-color: #45d158;
        --thermostat-off-color: #697382;
        --thermostat-background: #101722;
        --thermostat-dial-size: 188px;

        display: block;
        height: var(--thermostat-card-height);
        max-width: var(--thermostat-card-width);
        min-height: 0;
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        height: var(--thermostat-card-height);
        min-height: 0;
        overflow: visible;
      }

      .thermostat {
        --thermostat-dial-size: clamp(180px, 66cqi, 214px);

        align-items: stretch;
        background:
          radial-gradient(circle at 50% 34%, color-mix(in srgb, var(--thermostat-state-color) 18%, transparent), transparent 42%),
          radial-gradient(circle at 12% 12%, rgb(255 255 255 / 7%), transparent 36%),
          linear-gradient(
            145deg,
            color-mix(in srgb, var(--thermostat-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--thermostat-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--thermostat-state-color) var(--thermostat-border-strength),
            transparent
          );
        border-radius: var(--thermostat-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--thermostat-inner-ring-width)
            color-mix(
              in srgb,
              var(--thermostat-state-color) var(--thermostat-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--thermostat-outer-blur)
            color-mix(
              in srgb,
              var(--thermostat-state-color) var(--thermostat-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        container-type: inline-size;
        display: grid;
        align-content: start;
        gap: 10px;
        grid-template-rows: auto auto auto auto;
        height: var(--thermostat-card-height);
        min-height: 0;
        overflow: hidden;
        padding: 22px 18px 18px;
        position: relative;
        text-align: center;
        width: 100%;
      }

      .thermostat.features-visible {
        --thermostat-dial-size: clamp(164px, 54cqi, 190px);

        gap: 8px;
        padding: 20px 18px 16px;
      }

      .thermostat::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--thermostat-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--thermostat-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--thermostat-warm-color) 10%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--thermostat-hot-color) 12%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--thermostat-glow-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .thermostat::after {
        border: 1px solid
          color-mix(in srgb, var(--thermostat-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--thermostat-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--thermostat-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--thermostat-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--thermostat-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--thermostat-glow-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .ambient-glow,
      .outline-glow {
        border-radius: inherit;
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--thermostat-state-color) 18%, transparent);
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--thermostat-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--thermostat-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--thermostat-state-color) 8%, transparent);
        inset: 2px;
        opacity: var(--thermostat-glow-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--thermostat-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
        inset: 7px;
        opacity: var(--thermostat-glow-opacity);
        z-index: 0;
      }

      .header,
      .dial,
      .controls,
      .mode-controls,
      .features {
        position: relative;
        z-index: 2;
      }

      .header {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 4px;
        justify-content: center;
        min-height: 30px;
        text-align: center;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 550;
        letter-spacing: 0;
        line-height: 1.16;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.25;
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dial {
        align-self: center;
        aspect-ratio: 1;
        background:
          radial-gradient(
            circle at 50% 44%,
            color-mix(in srgb, var(--thermostat-state-color) 20%, transparent),
            transparent 52%
          ),
          radial-gradient(circle at center, color-mix(in srgb, var(--thermostat-background) 94%, #ffffff 5%) 0 52%, transparent 53%),
          conic-gradient(
            from 215deg,
            color-mix(in srgb, var(--thermostat-state-color) 96%, #ffffff 12%) 0deg,
            var(--thermostat-state-color)
              calc(var(--thermostat-arc-degrees) * 0.72),
            color-mix(in srgb, var(--thermostat-state-color) 72%, #000000 16%)
              var(--thermostat-arc-degrees),
            rgb(255 255 255 / 11%) var(--thermostat-arc-degrees) 290deg,
            transparent 290deg 360deg
          );
        border-radius: 999px;
        box-shadow:
          inset 0 0 0 1px rgb(255 255 255 / 7%),
          inset 0 12px 26px rgb(255 255 255 / 5%),
          0 0 34px color-mix(in srgb, var(--thermostat-state-color) 18%, transparent);
        block-size: var(--thermostat-dial-size);
        display: grid;
        justify-self: center;
        inline-size: var(--thermostat-dial-size);
        min-block-size: 0;
        min-inline-size: 0;
        place-items: center;
        position: relative;
      }

      .dial::before {
        background:
          radial-gradient(
            circle at 50% 32%,
            color-mix(in srgb, var(--thermostat-state-color) 24%, transparent),
            transparent 58%
          ),
          linear-gradient(
            145deg,
            color-mix(in srgb, var(--thermostat-background) 84%, #ffffff 10%),
            color-mix(in srgb, var(--thermostat-background) 88%, #000000 24%)
          );
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: inherit;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 10%),
          inset 0 -16px 28px rgb(0 0 0 / 15%);
        content: '';
        inset: 21%;
        position: absolute;
        z-index: 1;
      }

      .dial-center {
        align-items: center;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 2;
      }

      .mode {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 13px;
        font-weight: 650;
        line-height: 1.1;
        margin-bottom: 9px;
      }

      .target {
        align-items: flex-start;
        color: var(--primary-text-color, #f4f7fb);
        display: inline-flex;
        font-size: 48px;
        font-weight: 700;
        line-height: 1;
        white-space: nowrap;
      }

      .unit {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 17px;
        font-weight: 650;
        line-height: 1;
        margin-left: 2px;
        padding-top: 5px;
      }

      .current {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.2;
        margin-top: 7px;
        white-space: nowrap;
      }

      .controls {
        align-self: end;
        background: transparent;
        border: 0;
        border-radius: 0;
        display: inline-grid;
        gap: 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        padding: 0;
        width: 100%;
      }

      .control {
        align-items: center;
        background: rgb(255 255 255 / 7%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 17px;
        font-weight: 650;
        height: 33px;
        justify-content: center;
        letter-spacing: 0;
        padding: 0;
        width: 100%;
      }

      .control:active {
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--thermostat-state-color) 22%, transparent),
            transparent 78%
          ),
          color-mix(in srgb, var(--thermostat-state-color) 22%, #ffffff 3%);
        color: var(--primary-text-color, #f4f7fb);
      }

      .mode-controls {
        align-self: end;
        background: rgb(0 0 0 / 18%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 5%);
        display: grid;
        gap: 2px;
        grid-auto-flow: column;
        grid-auto-columns: minmax(0, 1fr);
        min-height: 30px;
        overflow: hidden;
        padding: 2px;
        width: 100%;
      }

      .mode-button {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 11px;
        font-weight: 650;
        justify-content: center;
        letter-spacing: 0;
        line-height: 1;
        min-width: 0;
        padding: 0 8px;
        text-transform: none;
        white-space: nowrap;
      }

      .mode-button.active {
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--thermostat-state-color) 26%, transparent),
            transparent 86%
          ),
          color-mix(in srgb, var(--thermostat-state-color) 28%, #ffffff 4%);
        color: var(--primary-text-color, #f4f7fb);
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 9%);
      }

      .mode-button:disabled {
        cursor: default;
        opacity: 0.45;
      }

      .features,
      .feature-group {
        align-self: end;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        justify-content: stretch;
        overflow: visible;
        padding: 0;
        width: 100%;
      }

      .feature-button,
      .feature-status {
        align-items: center;
        background: rgb(0 0 0 / 16%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        box-sizing: border-box;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 6%);
        color: var(--primary-text-color, #f4f7fb);
        display: grid;
        flex: 1 1 118px;
        gap: 6px;
        grid-template-columns: 18px minmax(0, 1fr) auto;
        justify-content: center;
        justify-items: stretch;
        min-height: 32px;
        min-width: 0;
        padding: 0 10px;
        text-align: left;
      }

      .feature-button {
        appearance: none;
        cursor: pointer;
        font: inherit;
      }

      .feature-button.on {
        background:
          radial-gradient(circle at 20% 50%, color-mix(in srgb, var(--thermostat-state-color) 20%, transparent), transparent 62%),
          color-mix(in srgb, var(--thermostat-state-color) 14%, transparent);
      }

      .feature-button.problem,
      .feature-status.problem {
        border-color: color-mix(in srgb, #ff3b30 50%, transparent);
        color: #ffb3ad;
      }

      .feature-button.unavailable,
      .feature-status.unavailable {
        opacity: 0.55;
      }

      .feature-icon {
        flex: 0 0 auto;
        --mdc-icon-size: 18px;
        background: transparent;
        border: 0;
        border-radius: 0;
        box-shadow: none;
        color: color-mix(in srgb, var(--thermostat-state-color) 58%, #ffffff 42%);
        filter: drop-shadow(0 0 8px color-mix(in srgb, var(--thermostat-state-color) 18%, transparent));
        font-size: 18px;
        height: 18px;
        justify-self: center;
        line-height: 18px;
        padding: 0;
        transition:
          transform 140ms ease;
        width: 18px;
      }

      .feature-button.on .feature-icon {
        background: transparent;
        border: 0;
        box-shadow: none;
        color: #ffffff;
        filter: drop-shadow(0 0 12px color-mix(in srgb, var(--thermostat-state-color) 42%, transparent));
      }

      .feature-button:active .feature-icon {
        transform: scale(0.94);
      }

      .feature-text {
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }

      .feature-label {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 10px;
        font-weight: 700;
        line-height: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .feature-value {
        color: color-mix(in srgb, var(--secondary-text-color, #b7c0ce) 88%, transparent);
        font-size: 10px;
        font-weight: 650;
        justify-self: end;
        line-height: 1;
        max-width: 56px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: capitalize;
        white-space: nowrap;
      }

      .thermostat:focus-visible,
      .control:focus-visible,
      .mode-button:focus-visible,
      .feature-button:focus-visible {
        outline: 2px solid var(--thermostat-state-color);
        outline-offset: 3px;
      }

      .thermostat.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .thermostat.active.animated::after {
        animation: thermostat-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes thermostat-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .thermostat.active.animated::after {
          animation: none;
        }
      }
    `;
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement('glow-thermostat-card-editor');
  }

  public static getStubConfig(_: unknown, entities: string[]) {
    const [climateEntity] = entities.filter((entity) =>
      entity.startsWith('climate.'),
    );

    return {
      entity: climateEntity ?? '',
    };
  }

  public setConfig(config: GlowThermostatCardConfig): void {
    if (!config?.entity) {
      throw new Error('Entity is required');
    }

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      temperature_step: toNumber(config.temperature_step, 1),
    };

    this.style.setProperty(
      '--thermostat-card-width',
      this.config.fill_container ? '100%' : this.config.width ?? '320px',
    );
    this.style.setProperty(
      '--thermostat-card-height',
      clampCssLength(config.height, 'auto', 0),
    );
    this.style.setProperty(
      '--thermostat-card-radius',
      this.config.border_radius ?? '18px',
    );
    this.style.setProperty('--thermostat-heat-color', this.config.heat_color ?? '#ff8a1c');
    this.style.setProperty('--thermostat-cool-color', this.config.cool_color ?? '#2f80ff');
    this.style.setProperty('--thermostat-idle-color', this.config.idle_color ?? '#45d158');
    this.style.setProperty('--thermostat-off-color', this.config.off_color ?? '#697382');
    this.style.setProperty(
      '--thermostat-background',
      this.config.background ?? '#101722',
    );
  }

  public getCardSize(): number {
    return this.hasVisibleFeatureControls ? 7 : 6;
  }

  public getGridOptions() {
    const hasFeatures = this.hasVisibleFeatureControls;

    return {
      rows: hasFeatures ? 7 : 5,
      columns: 6,
      min_rows: hasFeatures ? 6 : 4,
      max_rows: 9,
      min_columns: 4,
      max_columns: 12,
    };
  }

  private get entity(): ClimateEntity | undefined {
    return this.hass?.states[this.config.entity] as ClimateEntity | undefined;
  }

  private getFeatureEntity(entityId?: string): HassEntity | undefined {
    if (!entityId) {
      return undefined;
    }

    return this.hass?.states[entityId] as HassEntity | undefined;
  }

  private get isUnavailable(): boolean {
    return !this.entity || ['unavailable', 'unknown'].includes(this.entity.state);
  }

  private get isOff(): boolean {
    return this.hvacMode === 'off';
  }

  private get hvacMode(): string {
    return this.optimisticMode ?? String(this.entity?.state || 'off');
  }

  private get hvacAction(): string {
    return String(this.entity?.attributes.hvac_action || this.hvacMode || 'idle');
  }

  private get isCooling(): boolean {
    return this.hvacAction === 'cooling' || this.hvacMode === 'cool';
  }

  private get isHeating(): boolean {
    return this.hvacAction === 'heating' || this.hvacMode === 'heat';
  }

  private get availableModes(): string[] {
    const modes = this.entity?.attributes.hvac_modes;

    if (!Array.isArray(modes)) {
      return [];
    }

    return modes
      .filter((mode): mode is string => typeof mode === 'string')
      .filter((mode, index, allModes) => allModes.indexOf(mode) === index);
  }

  private get unit(): string {
    return String(this.entity?.attributes.temperature_unit || '°');
  }

  private get currentTemperature(): number | undefined {
    const value = this.entity?.attributes.current_temperature;

    return typeof value === 'number' ? value : undefined;
  }

  private get minTemperature(): number {
    return toNumber(this.entity?.attributes.min_temp, 55);
  }

  private get maxTemperature(): number {
    return toNumber(this.entity?.attributes.max_temp, 85);
  }

  private get targetTemperature(): number {
    if (this.optimisticTemperature !== undefined) {
      return this.optimisticTemperature;
    }

    const temperature = this.entity?.attributes.temperature;

    if (typeof temperature === 'number') {
      return temperature;
    }

    const low = this.entity?.attributes.target_temp_low;
    const high = this.entity?.attributes.target_temp_high;

    if (typeof low === 'number' && typeof high === 'number') {
      return Math.round(((low + high) / 2) * 10) / 10;
    }

    return this.currentTemperature ?? 72;
  }

  private get displayName(): string {
    return (
      this.config.name ||
      this.entity?.attributes.friendly_name ||
      this.config.entity
    );
  }

  private get displayState(): string {
    if (this.isUnavailable) {
      return 'Unavailable';
    }

    if (this.isOff) {
      return 'Off';
    }

    const current =
      this.config.show_current && this.currentTemperature !== undefined
        ? `${this.formatTemperature(this.currentTemperature)} now`
        : this.hvacAction;

    return current;
  }

  private get modeLabel(): string {
    if (this.isUnavailable) {
      return 'Unavailable';
    }

    if (this.isOff) {
      return 'Off';
    }

    if (this.isCooling) {
      return 'Cool';
    }

    if (this.isHeating) {
      return 'Heat';
    }

    return 'Idle';
  }

  private get currentLabel(): string {
    if (this.currentTemperature === undefined) {
      return this.hvacAction;
    }

    return this.formatTemperature(this.currentTemperature);
  }

  private get stateColor(): string {
    if (this.isOff || this.isUnavailable) {
      return this.config.off_color ?? '#697382';
    }

    if (this.isCooling) {
      return this.config.cool_color ?? '#2f80ff';
    }

    if (this.isHeating) {
      return this.config.heat_color ?? '#ff8a1c';
    }

    return this.config.idle_color ?? '#45d158';
  }

  private get hasConfiguredFeatures(): boolean {
    return Boolean(
      this.config.show_hvac_modes ||
        this.config.show_fan_modes ||
        this.config.show_swing_modes ||
        this.config.show_horizontal_swing_modes ||
        this.config.filter_entity ||
        this.config.problem_entity ||
        this.config.pm25_entity ||
        this.config.display_light_entity ||
        this.config.sleep_mode_entity ||
        this.config.vertical_position_entity ||
        this.config.horizontal_position_entity ||
        this.config.anti_frost_switch_entity ||
        this.config.anti_mildew_switch_entity ||
        this.config.eco_switch_entity ||
        this.config.health_switch_entity ||
        this.config.soft_wind_switch_entity ||
        this.config.sound_switch_entity,
    );
  }

  private get hasPrimaryModeButtons(): boolean {
    return Boolean(this.config.show_mode_buttons) && this.availableModes.length > 0;
  }

  private get hasVisibleFeatureControls(): boolean {
    if (!this.config?.show_features || !this.hasConfiguredFeatures) {
      return false;
    }

    const attributes = this.entity?.attributes ?? {};

    if (
      this.config.show_hvac_modes &&
      !this.hasPrimaryModeButtons &&
      Array.isArray(attributes.hvac_modes) &&
      attributes.hvac_modes.length > 0
    ) {
      return true;
    }

    if (
      this.config.show_fan_modes &&
      Array.isArray(attributes.fan_modes) &&
      attributes.fan_modes.length > 0
    ) {
      return true;
    }

    if (!this.hasPrimaryModeButtons) {
      return true;
    }

    return Boolean(
      this.getFeatureEntity(this.config.eco_switch_entity) ||
        this.getFeatureEntity(this.config.sleep_mode_entity) ||
        this.getFeatureEntity(this.config.vertical_position_entity) ||
        this.getFeatureEntity(this.config.horizontal_position_entity) ||
        this.getFeatureEntity(this.config.filter_entity) ||
        this.getFeatureEntity(this.config.problem_entity) ||
        this.getFeatureEntity(this.config.pm25_entity) ||
        this.getFeatureEntity(this.config.display_light_entity) ||
        this.getFeatureEntity(this.config.anti_frost_switch_entity) ||
        this.getFeatureEntity(this.config.anti_mildew_switch_entity) ||
        this.getFeatureEntity(this.config.health_switch_entity) ||
        this.getFeatureEntity(this.config.soft_wind_switch_entity) ||
        this.getFeatureEntity(this.config.sound_switch_entity),
    );
  }

  private formatTemperature(value: number): string {
    return `${Math.round(value * 10) / 10}${this.unit}`;
  }

  private formatTemperatureValue(value: number): string {
    return `${Math.round(value * 10) / 10}`;
  }

  private get arcDegrees(): number {
    const min = this.minTemperature;
    const max = this.maxTemperature;
    const range = Math.max(1, max - min);
    const percent = Math.max(0, Math.min(1, (this.targetTemperature - min) / range));

    return Math.round(24 + percent * 266);
  }

  private dispatchMoreInfo(): void {
    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        detail: { entityId: this.config.entity },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private setOptimisticTemperature(temperature: number): void {
    window.clearTimeout(this.optimisticTimer);
    this.optimisticTemperature = temperature;
    this.optimisticTimer = window.setTimeout(() => {
      this.optimisticTemperature = undefined;
    }, 8000);
  }

  private clearOptimisticTemperature(): void {
    window.clearTimeout(this.optimisticTimer);
    this.optimisticTemperature = undefined;
  }

  private setOptimisticMode(mode: string): void {
    window.clearTimeout(this.optimisticModeTimer);
    this.optimisticMode = mode;
    this.optimisticModeTimer = window.setTimeout(() => {
      this.optimisticMode = undefined;
    }, 8000);
  }

  private clearOptimisticMode(): void {
    window.clearTimeout(this.optimisticModeTimer);
    this.optimisticMode = undefined;
  }

  private trackServiceResult(result: Promise<unknown> | void): void {
    if (result && typeof result.catch === 'function') {
      result.catch(() => this.clearOptimisticTemperature());
    }
  }

  protected updated(): void {
    const temperature = this.entity?.attributes.temperature;

    if (
      this.optimisticTemperature !== undefined &&
      typeof temperature === 'number' &&
      Math.abs(temperature - this.optimisticTemperature) < 0.1
    ) {
      this.clearOptimisticTemperature();
    }

    if (
      this.optimisticMode !== undefined &&
      this.entity?.state === this.optimisticMode
    ) {
      this.clearOptimisticMode();
    }
  }

  private setTargetTemperature(temperature: number): void {
    if (this.isUnavailable || this.isOff) {
      return;
    }

    const min = this.minTemperature;
    const max = this.maxTemperature;
    const next = Math.min(max, Math.max(min, temperature));
    this.setOptimisticTemperature(next);
    this.trackServiceResult(
      this.hass?.callService('climate', 'set_temperature', {
        entity_id: this.config.entity,
        temperature: next,
      }),
    );
  }

  private adjustTemperature(direction: -1 | 1): void {
    const step = toNumber(this.config.temperature_step, 1);
    this.setTargetTemperature(this.targetTemperature + direction * step);
  }

  private setHvacMode(mode: string): void {
    if (this.isUnavailable || mode === this.hvacMode) {
      return;
    }

    this.setOptimisticMode(mode);
    const result = this.hass?.callService('climate', 'set_hvac_mode', {
      entity_id: this.config.entity,
      hvac_mode: mode,
    });

    if (result && typeof result.catch === 'function') {
      result.catch(() => this.clearOptimisticMode());
    }
  }

  private performAction(action: ActionMode | undefined): void {
    if (this.isUnavailable || !action || action === 'none') {
      return;
    }

    this.dispatchMoreInfo();
  }

  private setClimateMode(attribute: string, service: string, value: string): void {
    if (this.isUnavailable || !value) {
      return;
    }

    this.hass?.callService('climate', service, {
      entity_id: this.config.entity,
      [attribute]: value,
    });
  }

  private toggleFeatureEntity(entityId?: string): void {
    const entity = this.getFeatureEntity(entityId);

    if (!entity || ['unavailable', 'unknown'].includes(entity.state)) {
      return;
    }

    const [domain] = entity.entity_id.split('.');
    this.hass?.callService(domain, 'toggle', {
      entity_id: entity.entity_id,
    });
  }

  private selectFeatureOption(entityId: string | undefined, option: string): void {
    const entity = this.getFeatureEntity(entityId);

    if (!entity || ['unavailable', 'unknown'].includes(entity.state) || !option) {
      return;
    }

    this.hass?.callService('select', 'select_option', {
      entity_id: entity.entity_id,
      option,
    });
  }

  private nextOption(options: unknown, current: string | undefined): string | undefined {
    if (!Array.isArray(options) || options.length === 0) {
      return undefined;
    }

    const values = options.map((option) => String(option));
    const index = Math.max(0, values.indexOf(current ?? values[0]));

    return values[(index + 1) % values.length];
  }

  private renderOffFeature(): TemplateResult {
    const off = this.entity?.state === 'off';

    return html`
      <button
        class="feature-button ${off ? '' : 'on'}"
        ?disabled=${this.isUnavailable}
        title="Off"
        aria-label="Turn thermostat off"
        @click=${(event: Event) => {
          event.stopPropagation();
          this.setClimateMode('hvac_mode', 'set_hvac_mode', 'off');
        }}
      >
        <ha-icon class="feature-icon" .icon=${'mdi:power'}></ha-icon>
        <span class="feature-label">Off</span>
        <span class="feature-value">${off ? 'off' : 'tap'}</span>
      </button>
    `;
  }

  private handlePointerDown(): void {
    window.clearTimeout(this.holdTimer);
    this.holdActive = false;
    this.holdTimer = window.setTimeout(() => {
      this.holdActive = true;
      this.performAction(this.config.hold_action);
    }, 500);
  }

  private handlePointerUp(): void {
    window.clearTimeout(this.holdTimer);
  }

  private handleClick(): void {
    if (this.holdActive) {
      this.holdActive = false;
      return;
    }

    this.performAction(this.config.tap_action);
  }

  private handleControlPointerDown(event: Event, direction: -1 | 1): void {
    event.stopPropagation();
    this.handledControlPointer = true;
    window.setTimeout(() => {
      this.handledControlPointer = false;
    }, 500);
    this.adjustTemperature(direction);
  }

  private handleControlClick(event: Event, direction: -1 | 1): void {
    event.stopPropagation();

    if (this.handledControlPointer) {
      this.handledControlPointer = false;
      return;
    }

    this.adjustTemperature(direction);
  }

  private handleModeClick(event: Event, mode: string): void {
    event.stopPropagation();
    this.setHvacMode(mode);
  }

  private renderClimateSelect(
    label: string,
    icon: string,
    value: string | undefined,
    options: unknown,
    service: string,
    serviceField: string,
  ): TemplateResult | typeof nothing {
    if (!Array.isArray(options) || options.length === 0) {
      return nothing;
    }

    const selected = value ?? String(options[0]);

    return html`
      <button
        class="feature-button ${selected !== 'off' ? 'on' : ''}"
        ?disabled=${this.isUnavailable}
        title=${`${label}: ${selected}`}
        aria-label=${`${label}: ${selected}. Tap to change.`}
        @click=${(event: Event) => {
          event.stopPropagation();
          const next = this.nextOption(options, selected);
          if (next) {
            this.setClimateMode(serviceField, service, next);
          }
        }}
      >
        <ha-icon class="feature-icon" .icon=${icon}></ha-icon>
        <span class="feature-label">${label}</span>
        <span class="feature-value">${selected}</span>
      </button>
    `;
  }

  private renderSelectEntity(
    label: string,
    icon: string,
    entityId: string | undefined,
  ): TemplateResult | typeof nothing {
    const entity = this.getFeatureEntity(entityId);

    if (!entity || !Array.isArray(entity.attributes.options)) {
      return nothing;
    }

    return html`
      <button
        class="feature-button ${entity.state !== 'Off' &&
        entity.state !== 'off' &&
        entity.state !== 'Unknown'
          ? 'on'
          : ''}"
        ?disabled=${['unavailable', 'unknown'].includes(entity.state)}
        title=${`${label}: ${entity.state}`}
        aria-label=${`${label}: ${entity.state}. Tap to change.`}
        @click=${(event: Event) => {
          event.stopPropagation();
          const next = this.nextOption(entity.attributes.options, entity.state);
          if (next) {
            this.selectFeatureOption(entity.entity_id, next);
          }
        }}
      >
        <ha-icon class="feature-icon" .icon=${entity.attributes.icon || icon}></ha-icon>
        <span class="feature-label">${label}</span>
        <span class="feature-value">${entity.state}</span>
      </button>
    `;
  }

  private renderToggleFeature(
    label: string,
    entityId: string | undefined,
    icon: string,
  ): TemplateResult | typeof nothing {
    const entity = this.getFeatureEntity(entityId);

    if (!entity) {
      return nothing;
    }

    const unavailable = ['unavailable', 'unknown'].includes(entity.state);
    const on = entity.state === 'on';
    const problem =
      entity.attributes.device_class === 'problem' && entity.state === 'on';

    return html`
      <button
        class="feature-button ${on ? 'on' : ''} ${problem
          ? 'problem'
          : ''} ${unavailable ? 'unavailable' : ''}"
        ?disabled=${unavailable || entity.entity_id.startsWith('binary_sensor.')}
        title=${`${label}: ${entity.state}`}
        aria-label=${`${label}: ${entity.state}`}
        @click=${(event: Event) => {
          event.stopPropagation();
          this.toggleFeatureEntity(entity.entity_id);
        }}
      >
        <ha-icon class="feature-icon" .icon=${entity.attributes.icon || icon}></ha-icon>
        <span class="feature-label">${label}</span>
        <span class="feature-value">${on ? 'on' : 'off'}</span>
      </button>
    `;
  }

  private renderSensorFeature(
    label: string,
    entityId: string | undefined,
    icon: string,
  ): TemplateResult | typeof nothing {
    const entity = this.getFeatureEntity(entityId);

    if (!entity) {
      return nothing;
    }

    const unavailable = ['unavailable', 'unknown'].includes(entity.state);
    const problem =
      entity.attributes.device_class === 'problem' && entity.state === 'on';
    const unit = entity.attributes.unit_of_measurement
      ? ` ${entity.attributes.unit_of_measurement}`
      : '';

    return html`
      <span
        class="feature-status ${problem ? 'problem' : ''} ${unavailable
          ? 'unavailable'
          : ''}"
        title=${`${label}: ${entity.state}${unit}`}
        aria-label=${`${label}: ${entity.state}${unit}`}
      >
        <ha-icon class="feature-icon" .icon=${entity.attributes.icon || icon}></ha-icon>
        <span class="feature-label">${label}</span>
        <span class="feature-value">${entity.state}${unit}</span>
      </span>
    `;
  }

  private renderFeatures(): TemplateResult | typeof nothing {
    if (!this.config.show_features || !this.hasConfiguredFeatures) {
      return nothing;
    }

    const attributes = this.entity?.attributes ?? {};
    const hasPrimaryModeButtons = this.hasPrimaryModeButtons;
    const items: TemplateResult[] = [];
    const addItem = (item: TemplateResult | typeof nothing): void => {
      if (item !== nothing && items.length < 4) {
        items.push(item);
      }
    };

    if (this.config.show_hvac_modes && !hasPrimaryModeButtons) {
      addItem(
        this.renderClimateSelect(
          'Mode',
          'mdi:tune-variant',
          this.entity?.state,
          attributes.hvac_modes,
          'set_hvac_mode',
          'hvac_mode',
        ),
      );
    }

    if (this.config.show_fan_modes) {
      addItem(
        this.renderClimateSelect(
          'Fan',
          'mdi:fan',
          String(attributes.fan_mode || ''),
          attributes.fan_modes,
          'set_fan_mode',
          'fan_mode',
        ),
      );
    }

    addItem(this.renderToggleFeature('Eco', this.config.eco_switch_entity, 'mdi:leaf'));
    if (!hasPrimaryModeButtons) {
      addItem(this.renderOffFeature());
    }

    addItem(
      this.renderSelectEntity(
        'Sleep',
        'mdi:weather-night',
        this.config.sleep_mode_entity,
      ),
    );
    addItem(
      this.renderSelectEntity(
        'Vertical',
        'mdi:unfold-more-horizontal',
        this.config.vertical_position_entity,
      ),
    );
    addItem(
      this.renderSelectEntity(
        'Horizontal',
        'mdi:unfold-more-vertical',
        this.config.horizontal_position_entity,
      ),
    );
    addItem(this.renderSensorFeature('Filter', this.config.filter_entity, 'mdi:air-filter'));
    addItem(this.renderSensorFeature('Problem', this.config.problem_entity, 'mdi:alert-circle'));
    addItem(this.renderSensorFeature('PM2.5', this.config.pm25_entity, 'mdi:blur'));
    addItem(
      this.renderToggleFeature('Display', this.config.display_light_entity, 'mdi:monitor'),
    );
    addItem(
      this.renderToggleFeature(
        'Anti-frost',
        this.config.anti_frost_switch_entity,
        'mdi:snowflake-alert',
      ),
    );
    addItem(
      this.renderToggleFeature(
        'Anti-mildew',
        this.config.anti_mildew_switch_entity,
        'mdi:water-off-outline',
      ),
    );
    addItem(
      this.renderToggleFeature('Health', this.config.health_switch_entity, 'mdi:heart-outline'),
    );
    addItem(
      this.renderToggleFeature(
        'Soft wind',
        this.config.soft_wind_switch_entity,
        'mdi:weather-windy',
      ),
    );
    addItem(this.renderToggleFeature('Sound', this.config.sound_switch_entity, 'mdi:volume-high'));

    if (items.length === 0) {
      return nothing;
    }

    return html`<span class="features">${items}</span>`;
  }

  private renderModeButtons(): TemplateResult | typeof nothing {
    const modes = this.availableModes;

    if (!modes.length) {
      return nothing;
    }

    return html`
      <span class="mode-controls" aria-label="HVAC mode controls">
        ${modes.map(
          (mode) => html`
            <button
              class="mode-button ${mode === this.hvacMode ? 'active' : ''}"
              ?disabled=${this.isUnavailable}
              aria-label=${`Set mode to ${MODE_LABELS[mode] ?? mode}`}
              @click=${(event: Event) => this.handleModeClick(event, mode)}
            >
              ${MODE_LABELS[mode] ?? mode}
            </button>
          `,
        )}
      </span>
    `;
  }

  private renderControls(): TemplateResult {
    return html`
      <span class="controls" aria-label="Temperature controls">
        <button
          class="control"
          aria-label="Decrease temperature"
          @pointerdown=${(event: Event) =>
            this.handleControlPointerDown(event, -1)}
          @click=${(event: Event) => this.handleControlClick(event, -1)}
        >
          -
        </button>
        <button
          class="control"
          aria-label="Increase temperature"
          @pointerdown=${(event: Event) =>
            this.handleControlPointerDown(event, 1)}
          @click=${(event: Event) => this.handleControlClick(event, 1)}
        >
          +
        </button>
      </span>
    `;
  }

  protected render(): TemplateResult {
    if (!this.config) {
      return html``;
    }

    const stateColor = this.stateColor;
    const active = !this.isOff && !this.isUnavailable;
    const glowOpacity = active ? '1' : '0';
    const cooling = this.isCooling;

    return html`
      <ha-card
        style="
          --thermostat-state-color: ${stateColor};
          --thermostat-warm-color: ${cooling
            ? 'color-mix(in srgb, ' + stateColor + ' 86%, #94d6ff)'
            : 'color-mix(in srgb, ' + stateColor + ' 86%, #ffd26a)'};
          --thermostat-hot-color: ${cooling
            ? 'color-mix(in srgb, ' + stateColor + ' 80%, #4fb3ff)'
            : 'color-mix(in srgb, ' + stateColor + ' 80%, #ff4f00)'};
          --thermostat-glow-opacity: ${glowOpacity};
          --thermostat-border-strength: ${active ? '26%' : '18%'};
          --thermostat-inner-ring-width: ${active ? '1px' : '0px'};
          --thermostat-inner-ring-strength: ${active ? '8%' : '0%'};
          --thermostat-outer-blur: ${active ? '50px' : '0'};
          --thermostat-outer-strength: ${active ? '10%' : '0%'};
          --thermostat-arc-degrees: ${this.arcDegrees}deg;
        "
      >
        <div
          class="thermostat ${active ? 'active' : 'off'} ${this.isUnavailable
            ? 'unavailable'
            : ''} ${this.hasVisibleFeatureControls
            ? 'features-visible'
            : ''} ${this.config.animated ? 'animated' : ''}"
          role="button"
          tabindex="0"
          aria-label=${this.displayName}
          @click=${this.handleClick}
          @pointerdown=${this.handlePointerDown}
          @pointerup=${this.handlePointerUp}
          @pointerleave=${this.handlePointerUp}
          @pointercancel=${this.handlePointerUp}
        >
          <span class="ambient-glow"></span>
          <span class="outline-glow"></span>
          <span class="header">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state
              ? html`<span class="state">${this.displayState}</span>`
              : nothing}
          </span>
          <span class="dial">
            <span class="dial-center">
              <span class="mode">${this.modeLabel}</span>
              <span class="target">
                <span>${this.formatTemperatureValue(this.targetTemperature)}</span>
                <span class="unit">${this.unit}</span>
              </span>
              ${this.config.show_current
                ? html`<span class="current">${this.currentLabel}</span>`
                : nothing}
            </span>
          </span>
          ${this.config.show_controls ? this.renderControls() : nothing}
          ${this.config.show_mode_buttons ? this.renderModeButtons() : nothing}
          ${this.renderFeatures()}
        </div>
      </ha-card>
    `;
  }
}

if (!customElements.get('glow-thermostat-card')) {
  customElements.define('glow-thermostat-card', GlowThermostatCard);
}

class GlowThermostatCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  public hass?: HomeAssistant;
  private config: Partial<GlowThermostatCardConfig> = {};

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
      ha-selector,
      ha-icon-picker,
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

  public setConfig(config: GlowThermostatCardConfig): void {
    this.config = { ...config };
  }

  private updateConfig(patch: Partial<GlowThermostatCardConfig>): void {
    const next = { ...this.config, ...patch };
    Object.keys(next).forEach((key) => {
      const typedKey = key as keyof GlowThermostatCardConfig;
      if (next[typedKey] === '') {
        delete next[typedKey];
      }
    });
    this.config = next;
    fireConfigChanged(this, next);
  }

  private formChanged(event: Event): void {
    const customEvent = event as CustomEvent<{
      value?: Partial<GlowThermostatCardConfig>;
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
    } as Partial<GlowThermostatCardConfig>);
  }

  private renderEntityForm(): TemplateResult {
    const schema = [
      {
        name: 'entity',
        required: true,
        selector: { entity: { domain: 'climate' } },
      },
    ];
    const labels: Record<string, string> = {
      entity: 'Climate Entity',
    };

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{ entity: this.config.entity }}
        .schema=${schema}
        .computeLabel=${(schemaItem: { name: string }) =>
          labels[schemaItem.name] ?? schemaItem.name}
        @value-changed=${this.formChanged}
      ></ha-form>
    `;
  }

  private renderTextInput(
    label: string,
    key: keyof GlowThermostatCardConfig,
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

  private renderFeatureEntityPicker(
    label: string,
    key: keyof GlowThermostatCardConfig,
    domain: string,
  ): TemplateResult {
    return html`
      <ha-selector
        .hass=${this.hass}
        .label=${label}
        .selector=${{ entity: { domain } }}
        .value=${this.config[key] ?? ''}
        .configValue=${key}
        @value-changed=${this.valueChanged}
      ></ha-selector>
    `;
  }

  private renderIconPicker(
    label: string,
    key: keyof GlowThermostatCardConfig,
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

  private renderNumberInput(
    label: string,
    key: keyof GlowThermostatCardConfig,
    placeholder = '',
  ): TemplateResult {
    return html`
      <ha-textfield
        type="number"
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
    key: keyof GlowThermostatCardConfig,
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
    key: keyof GlowThermostatCardConfig,
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
            ${this.renderTextInput('Name', 'name', 'Thermostat')}
            ${this.renderTextInput('Width', 'width', '320px')}
            ${this.renderTextInput('Height', 'height', 'auto')}
            ${this.renderTextInput('Radius', 'border_radius', '18px')}
            ${this.renderNumberInput('Temperature Step', 'temperature_step', '1')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Fill Container', 'fill_container', false)}
            ${this.renderSwitch('Show State', 'show_state', false)}
            ${this.renderSwitch('Show Current', 'show_current', true)}
            ${this.renderSwitch('Show Controls', 'show_controls', true)}
            ${this.renderSwitch('Show Mode Buttons', 'show_mode_buttons', true)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput('Heat Color', 'heat_color', '#ff8a1c')}
            ${this.renderTextInput('Cool Color', 'cool_color', '#2f80ff')}
            ${this.renderTextInput('Idle Color', 'idle_color', '#45d158')}
            ${this.renderTextInput('Off Color', 'off_color', '#697382')}
            ${this.renderTextInput('Background', 'background', '#101722')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Animated Glow', 'animated', true)}
          </div>
        </section>

        <section class="section">
          <h3>Features</h3>
          <div class="grid">
            ${this.renderSwitch('Show Features', 'show_features', false)}
            ${this.renderSwitch('HVAC Modes', 'show_hvac_modes', true)}
            ${this.renderSwitch('Fan Modes', 'show_fan_modes', true)}
            ${this.renderSwitch('Vertical Swing', 'show_swing_modes', true)}
            ${this.renderSwitch(
              'Horizontal Swing',
              'show_horizontal_swing_modes',
              true,
            )}
          </div>
          <div class="grid">
            ${this.renderFeatureEntityPicker(
              'Filter Sensor',
              'filter_entity',
              'binary_sensor',
            )}
            ${this.renderFeatureEntityPicker(
              'Problem Sensor',
              'problem_entity',
              'binary_sensor',
            )}
            ${this.renderFeatureEntityPicker('PM2.5 Sensor', 'pm25_entity', 'sensor')}
            ${this.renderFeatureEntityPicker(
              'Display Light',
              'display_light_entity',
              'light',
            )}
            ${this.renderFeatureEntityPicker(
              'Sleep Mode',
              'sleep_mode_entity',
              'select',
            )}
            ${this.renderFeatureEntityPicker(
              'Vertical Position',
              'vertical_position_entity',
              'select',
            )}
            ${this.renderFeatureEntityPicker(
              'Horizontal Position',
              'horizontal_position_entity',
              'select',
            )}
            ${this.renderFeatureEntityPicker(
              'Anti-frost',
              'anti_frost_switch_entity',
              'switch',
            )}
            ${this.renderFeatureEntityPicker(
              'Anti-mildew',
              'anti_mildew_switch_entity',
              'switch',
            )}
            ${this.renderFeatureEntityPicker('Eco', 'eco_switch_entity', 'switch')}
            ${this.renderFeatureEntityPicker('Health', 'health_switch_entity', 'switch')}
            ${this.renderFeatureEntityPicker(
              'Soft Wind',
              'soft_wind_switch_entity',
              'switch',
            )}
            ${this.renderFeatureEntityPicker('Sound', 'sound_switch_entity', 'switch')}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect('Tap Action', 'tap_action', ACTIONS, 'more-info')}
            ${this.renderSelect(
              'Hold Action',
              'hold_action',
              ACTIONS,
              'more-info',
            )}
          </div>
        </section>
      </div>
    `;
  }
}

if (!customElements.get('glow-thermostat-card-editor')) {
  customElements.define('glow-thermostat-card-editor', GlowThermostatCardEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    'glow-thermostat-card': GlowThermostatCard;
    'glow-thermostat-card-editor': GlowThermostatCardEditor;
  }

  interface Window {
    customCards?: unknown[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  preview: true,
  type: 'glow-thermostat-card',
  name: 'Glow Thermostat Card',
  description: 'A dial-style thermostat card with instant setpoint controls.',
});
