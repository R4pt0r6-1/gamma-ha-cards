import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';

type LightEntity = {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    icon?: string;
    brightness?: number;
    color_mode?: string;
    color_temp_kelvin?: number;
    effect?: string;
    effect_list?: string[];
    rgb_color?: number[];
    supported_color_modes?: string[];
    [key: string]: unknown;
  };
};

type HomeAssistant = {
  states: Record<string, LightEntity | undefined>;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ) => Promise<unknown> | void;
};

type StateDisplayMode = 'state' | 'brightness' | 'auto';
type ActionMode = 'toggle' | 'more-info' | 'none' | 'script' | 'navigate';
type LightControlMode = 'color' | 'temperature' | 'effect';

type ActionObject = {
  action: Exclude<ActionMode, 'navigate'>;
  entity?: string;
};

type CallServiceAction = {
  action: 'call-service';
  service: string;
  target?: Record<string, unknown>;
  service_data?: Record<string, unknown>; 
  data?: Record<string, unknown>;
};

type NavigateAction = {
  action: 'navigate';
  navigation_path: string;
};

type SingleAction = ActionMode | ActionObject | CallServiceAction | NavigateAction;

type MultiAction = {
  action: 'multi';
  actions: SingleAction[];
};

type ActionConfig = SingleAction | MultiAction;

type LightColorPreset = {
  name: string;
  rgb_color?: number[];
  color_temp_kelvin?: number;
};

interface GlowLightCardConfig {
  type?: string;
  entity: string;
  name?: string;
  icon?: string;
  width?: string;
  fill_container?: boolean;
  height?: string;
  border_radius?: string;
  has_dimmer?: boolean;
  show_light_controls?: boolean;
  show_color_presets?: boolean;
  show_color_temp?: boolean;
  show_effects?: boolean;
  color_presets?: LightColorPreset[];
  show_state?: boolean;
  state_display?: StateDisplayMode;
  on_color?: string;
  off_color?: string;
  background?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  animated?: boolean;
}

type ConfigElement = HTMLInputElement & {
  checked?: boolean;
  configValue?: keyof GlowLightCardConfig;
};

const DEFAULT_CONFIG: Omit<GlowLightCardConfig, 'entity'> = {
  icon: 'mdi:ceiling-light',
  width: '260px',
  fill_container: false,
  height: '56px',
  border_radius: '999px',
  has_dimmer: false,
  show_light_controls: false,
  show_color_presets: true,
  show_color_temp: true,
  show_effects: false,
  show_state: true,
  state_display: 'state',
  on_color: '#ff8a1c',
  off_color: '#697382',
  background: '#101722',
  tap_action: 'toggle',
  hold_action: 'more-info',
  animated: true,
};

const ACTIONS: Array<ActionMode | 'call-service' | 'multi'> = [
  'toggle',
  'more-info',
  'none',
  'call-service',
  'script',
  'navigate',
  'multi',
];
const MULTI_ACTIONS: Array<ActionMode | 'call-service'> = [
  'more-info',
  'none',
  'toggle',
  'call-service',
  'script',
  'navigate',
];
const STATE_DISPLAY_MODES: StateDisplayMode[] = ['state', 'brightness', 'auto'];
const LIGHT_CONTROL_LABELS: Record<LightControlMode, string> = {
  color: 'Color',
  temperature: 'Temp',
  effect: 'Effect',
};
const DEFAULT_COLOR_PRESETS: LightColorPreset[] = [
  { name: 'Amber', rgb_color: [255, 146, 66] },
  { name: 'Peach', rgb_color: [255, 191, 142] },
  { name: 'Cream', rgb_color: [255, 225, 194] },
  { name: 'White', rgb_color: [255, 255, 244] },
  { name: 'Sky', rgb_color: [89, 164, 255] },
  { name: 'Rose', rgb_color: [255, 112, 182] },
];
const DEFAULT_TEMP_PRESETS: LightColorPreset[] = [
  { name: 'Warm', color_temp_kelvin: 2700 },
  { name: 'Soft', color_temp_kelvin: 3200 },
  { name: 'Neutral', color_temp_kelvin: 4000 },
  { name: 'Day', color_temp_kelvin: 5000 },
];

function fireConfigChanged(
  element: HTMLElement,
  config: Partial<GlowLightCardConfig>,
): void {
  element.dispatchEvent(
    new CustomEvent('config-changed', {
      detail: { config },
      bubbles: true,
      composed: true,
    }),
  );
}

export class GlowLightCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    holdActive: { state: true },
    dimmingPercent: { state: true },
    controlMode: { state: true },
    optimisticOn: { state: true },
    optimisticBrightnessPercent: { state: true },
    optimisticRgb: { state: true },
    optimisticKelvin: { state: true },
    optimisticEffect: { state: true },
  };

  public hass?: HomeAssistant;
  private config!: GlowLightCardConfig;
  private holdTimer?: number;
  private optimisticTimer?: number;
  private holdActive = false;
  private dimmingPercent?: number;
  private controlMode?: LightControlMode;
  private optimisticOn?: boolean;
  private optimisticBrightnessPercent?: number;
  private optimisticRgb?: number[];
  private optimisticKelvin?: number;
  private optimisticEffect?: string;
  private isDimming = false;
  private pendingDimmerPointer = false;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private suppressClick = false;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --glow-card-width: 260px;
        --glow-card-height: 56px;
        --glow-card-radius: 999px;
        --glow-on-color: #ff8a1c;
        --glow-off-color: #697382;
        --glow-background: #101722;

        display: block;
        max-width: var(--glow-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .button {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--glow-hot-color) 14%, transparent),
            transparent 44%
          ),
          linear-gradient(
            115deg,
            color-mix(in srgb, var(--glow-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--glow-state-color) 8%, transparent) 42%,
            color-mix(in srgb, var(--glow-hot-color) 13%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--glow-background) 92%, #ffffff 6%),
            color-mix(in srgb, var(--glow-background) 92%, #000000 12%)
          );
        border: 1px solid color-mix(
          in srgb,
          var(--glow-border-color) var(--glow-border-strength),
          transparent
        );
        border-radius: var(--glow-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 7%),
          inset 0 0 0 var(--glow-inner-ring-width)
            color-mix(
              in srgb,
              var(--glow-state-color) var(--glow-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--glow-outer-blur)
            color-mix(
              in srgb,
              var(--glow-state-color) var(--glow-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        grid-template-columns: 46px minmax(0, 1fr);
        gap: 8px;
        min-height: var(--glow-card-height);
        overflow: hidden;
        padding: 8px 14px 8px 10px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .button.dimmer {
        touch-action: pan-y;
      }

      .button.panel {
        border-radius: min(var(--glow-card-radius), 22px);
        cursor: default;
        display: grid;
        gap: 7px;
        grid-template-columns: 1fr;
        min-height: max(122px, var(--glow-card-height));
        padding: 9px 11px 10px;
      }

      .button::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 42%,
            color-mix(in srgb, var(--glow-warm-color) 10%, transparent) 72%,
            color-mix(in srgb, var(--glow-hot-color) 25%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--glow-warm-color) 9%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--glow-hot-color) 11%, transparent)
          ),
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--glow-hot-color) 11%, transparent),
            transparent 32%,
            transparent 70%,
            color-mix(in srgb, var(--glow-warm-color) 9%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .button::after {
        border: 1px solid
          color-mix(in srgb, var(--glow-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--glow-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--glow-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--glow-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--glow-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .button .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--glow-state-color) 18%, transparent);
        border-radius: inherit;
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--glow-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--glow-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--glow-state-color) 8%, transparent);
        content: '';
        inset: 2px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 1;
      }

      .button .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--glow-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
        inset: 7px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 0;
      }

      .button .slider-fill {
        background:
          radial-gradient(
            circle at 18% 50%,
            color-mix(in srgb, var(--glow-hot-color) 22%, transparent),
            transparent 48%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--glow-warm-color) 44%, transparent),
            color-mix(in srgb, var(--glow-state-color) 32%, transparent)
          );
        border-radius: inherit;
        box-shadow:
          inset 0 0 18px
            color-mix(in srgb, var(--glow-state-color) 24%, transparent),
          0 0 18px
            color-mix(in srgb, var(--glow-state-color) 22%, transparent);
        inset: 0 auto 0 0;
        opacity: var(--glow-slider-opacity);
        pointer-events: none;
        position: absolute;
        transition:
          opacity 160ms ease,
          width 120ms ease;
        width: var(--glow-slider-percent);
        z-index: 0;
      }

      .button .slider-fill::after {
        background: color-mix(in srgb, var(--glow-state-color) 86%, #ffffff 10%);
        border-radius: 999px;
        box-shadow:
          0 0 10px
            color-mix(in srgb, var(--glow-state-color) 62%, transparent),
          0 0 24px
            color-mix(in srgb, var(--glow-state-color) 36%, transparent);
        content: '';
        height: calc(100% - 18px);
        opacity: var(--glow-slider-handle-opacity);
        position: absolute;
        right: 2px;
        top: 9px;
        width: 2px;
      }

      .button.on.animated::after {
        animation: glow-breathe 3s ease-in-out infinite;
      }

      .button:focus-visible {
        outline: 2px solid var(--glow-state-color);
        outline-offset: 3px;
      }

      .button.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .icon-shell,
      .content {
        position: relative;
        z-index: 1;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--glow-state-color) 24%, transparent),
            transparent 70%
          ),
          color-mix(in srgb, var(--glow-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--glow-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--glow-icon-color);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        height: 38px;
        justify-content: center;
        padding: 0;
        width: 38px;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 22px;
        color: currentColor;
      }

      .content {
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-self: center;
        min-width: 0;
        text-align: center;
        width: 100%;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0;
        line-height: 1.15;
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

      .panel-header,
      .brightness-control,
      .mode-tabs,
      .control-panel {
        position: relative;
        z-index: 2;
      }

      .panel-header {
        align-items: center;
        display: grid;
        gap: 8px;
        grid-template-columns: 30px minmax(0, 1fr) auto;
        min-height: 30px;
      }

      .panel .icon-shell {
        height: 30px;
        width: 30px;
      }

      .panel .icon-shell ha-icon {
        --mdc-icon-size: 17px;
      }

      .panel .name {
        font-size: 13px;
        font-weight: 720;
      }

      .panel .state {
        font-size: 11px;
        line-height: 1.1;
        margin-top: 2px;
      }

      .level {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 12px;
        font-weight: 760;
        line-height: 1;
        min-width: 34px;
        text-align: right;
      }

      .brightness-control {
        appearance: none;
        background: rgb(255 255 255 / 12%);
        border: 0;
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 -1px 0 rgb(0 0 0 / 18%);
        cursor: pointer;
        display: block;
        height: 8px;
        overflow: hidden;
        padding: 0;
        touch-action: pan-y;
        width: 100%;
      }

      .brightness-fill {
        background:
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--glow-state-color) 76%, #ffffff 8%),
            color-mix(in srgb, var(--glow-state-color) 38%, #ffffff 42%)
          );
        border-radius: inherit;
        box-shadow: 0 0 14px color-mix(in srgb, var(--glow-state-color) 34%, transparent);
        display: block;
        height: 100%;
        transition: width 140ms ease;
        width: var(--glow-slider-percent);
      }

      .mode-tabs {
        background: rgb(0 0 0 / 14%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 12px;
        display: grid;
        gap: 2px;
        grid-auto-columns: minmax(0, 1fr);
        grid-auto-flow: column;
        min-height: 24px;
        padding: 2px;
      }

      .mode-tab {
        appearance: none;
        background: transparent;
        border: 0;
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        cursor: pointer;
        font: inherit;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0;
        padding: 0 8px;
      }

      .mode-tab.active {
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--glow-state-color) 24%, transparent),
            transparent 84%
          ),
          color-mix(in srgb, var(--glow-state-color) 24%, #ffffff 4%);
        color: var(--primary-text-color, #f4f7fb);
      }

      .control-panel {
        display: grid;
        gap: 6px;
      }

      .swatches {
        align-items: center;
        display: flex;
        gap: 8px;
        justify-content: space-between;
        min-height: 28px;
        overflow: visible;
        padding: 0;
      }

      .swatch,
      .effect-chip {
        appearance: none;
        cursor: pointer;
        font: inherit;
      }

      .swatch {
        align-items: center;
        background:
          radial-gradient(circle at 34% 28%, rgb(255 255 255 / 42%), transparent 30%),
          var(--swatch-color, #ffffff);
        border: 1px solid rgb(255 255 255 / 22%);
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 22%),
          inset 0 -8px 12px rgb(0 0 0 / 14%),
          0 4px 10px rgb(0 0 0 / 16%);
        display: inline-flex;
        flex: 0 0 26px;
        height: 26px;
        justify-content: center;
        padding: 0;
        position: relative;
        transition:
          border-color 140ms ease,
          box-shadow 140ms ease,
          transform 140ms ease;
        width: 26px;
      }

      .swatch:active {
        transform: scale(0.94);
      }

      .swatch.active {
        border-color: rgb(255 255 255 / 82%);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 28%),
          inset 0 -8px 12px rgb(0 0 0 / 14%),
          0 0 0 2px rgb(255 255 255 / 22%),
          0 0 0 5px color-mix(in srgb, var(--glow-state-color) 28%, transparent),
          0 8px 16px rgb(0 0 0 / 20%);
      }

      .swatch.active::after {
        background: rgb(255 255 255 / 92%);
        border-radius: 999px;
        box-shadow:
          0 1px 4px rgb(0 0 0 / 34%),
          0 0 10px rgb(255 255 255 / 24%);
        content: '';
        height: 7px;
        width: 7px;
      }

      .effect-list {
        display: flex;
        flex-wrap: nowrap;
        gap: 6px;
        overflow: hidden;
      }

      .effect-chip {
        background: rgb(0 0 0 / 16%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        flex: 1 1 0;
        font-size: 10px;
        font-weight: 700;
        min-height: 28px;
        min-width: 0;
        overflow: hidden;
        padding: 0 8px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .effect-chip.active {
        background: color-mix(in srgb, var(--glow-state-color) 24%, #ffffff 4%);
        border-color: color-mix(in srgb, var(--glow-state-color) 42%, transparent);
        color: var(--primary-text-color, #f4f7fb);
      }

      .brightness-control:focus-visible,
      .icon-shell:focus-visible,
      .mode-tab:focus-visible,
      .swatch:focus-visible,
      .effect-chip:focus-visible {
        outline: 2px solid var(--glow-state-color);
        outline-offset: 3px;
      }

      @keyframes glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .button.on.animated::after {
          animation: none;
        }
      }
    `;
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement('glow-light-card-editor');
  }

  public static getStubConfig(_: unknown, entities: string[]) {
    const [lightEntity] = entities.filter((entity) =>
      entity.startsWith('light.'),
    );

    return {
      entity: lightEntity ?? '',
    };
  }

  public setConfig(config: GlowLightCardConfig): void {
    if (!config?.entity) {
      throw new Error('Entity is required');
    }

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    this.style.setProperty(
      '--glow-card-width',
      this.config.fill_container ? '100%' : this.config.width ?? '260px',
    );
    this.style.setProperty('--glow-card-height', this.config.height ?? '56px');
    this.style.setProperty(
      '--glow-card-radius',
      this.config.border_radius ?? '999px',
    );
    this.style.setProperty('--glow-on-color', this.config.on_color ?? '#ff8a1c');
    this.style.setProperty('--glow-off-color', this.config.off_color ?? '#697382');
    this.style.setProperty(
      '--glow-background',
      this.config.background ?? '#101722',
    );
  }

  public getCardSize(): number {
    return this.hasLightControls ? 2 : 1;
  }

  public getGridOptions() {
    const hasControls = this.hasLightControls;

    return {
      rows: hasControls ? 2 : 1,
      columns: 6,
      min_rows: hasControls ? 2 : 1,
      max_rows: hasControls ? 2 : 1,
      min_columns: 3,
      max_columns: 12,
    };
  }

  private get entity(): LightEntity | undefined {
    return this.hass?.states[this.config.entity];
  }

  private get isOn(): boolean {
    if (this.optimisticBrightnessPercent !== undefined) {
      return this.optimisticBrightnessPercent > 0;
    }

    if (this.optimisticOn !== undefined) {
      return this.optimisticOn;
    }

    return this.entity?.state === 'on';
  }

  private get isUnavailable(): boolean {
    return !this.entity || ['unavailable', 'unknown'].includes(this.entity.state);
  }

  private get domain(): string {
    return this.config.entity.split('.')[0] ?? 'light';
  }

  private get hasDimmer(): boolean {
    return Boolean(this.config.has_dimmer) && this.domain === 'light';
  }

  private get hasLightControls(): boolean {
    return Boolean(this.config.show_light_controls) && this.domain === 'light';
  }

  private get supportedColorModes(): string[] {
    const modes = this.entity?.attributes.supported_color_modes;

    if (!Array.isArray(modes)) {
      return [];
    }

    return modes.filter((mode): mode is string => typeof mode === 'string');
  }

  private get effectList(): string[] {
    const effects = this.entity?.attributes.effect_list;

    if (!Array.isArray(effects)) {
      return [];
    }

    return effects.filter((effect): effect is string => typeof effect === 'string');
  }

  private get supportsColorTemp(): boolean {
    const attributes = this.entity?.attributes;

    return Boolean(
      this.supportedColorModes.includes('color_temp') ||
        typeof attributes?.color_temp_kelvin === 'number' ||
        typeof attributes?.min_color_temp_kelvin === 'number' ||
        typeof attributes?.max_color_temp_kelvin === 'number',
    );
  }

  private get controlModes(): LightControlMode[] {
    if (!this.hasLightControls) {
      return [];
    }

    const modes: LightControlMode[] = [];

    if (this.config.show_color_presets !== false) {
      modes.push('color');
    }

    if (this.config.show_color_temp !== false && this.supportsColorTemp) {
      modes.push('temperature');
    }

    if (this.config.show_effects !== false && this.effectList.length > 0) {
      modes.push('effect');
    }

    return modes;
  }

  private get activeControlMode(): LightControlMode | undefined {
    const modes = this.controlModes;

    if (modes.length === 0) {
      return undefined;
    }

    return this.controlMode && modes.includes(this.controlMode)
      ? this.controlMode
      : modes[0];
  }

  private get currentRgb(): number[] | undefined {
    if (this.optimisticRgb) {
      return this.optimisticRgb;
    }

    const rgb = this.entity?.attributes.rgb_color;

    if (!Array.isArray(rgb) || rgb.length < 3) {
      return undefined;
    }

    return rgb.slice(0, 3).map((value) =>
      Math.max(0, Math.min(255, Math.round(Number(value) || 0))),
    );
  }

  private get currentKelvin(): number | undefined {
    if (typeof this.optimisticKelvin === 'number') {
      return this.optimisticKelvin;
    }

    const kelvin = this.entity?.attributes.color_temp_kelvin;

    return typeof kelvin === 'number' ? kelvin : undefined;
  }

  private get currentEffect(): string {
    return this.optimisticEffect ?? String(this.entity?.attributes.effect || '');
  }

  private get colorPresets(): LightColorPreset[] {
    return this.config.color_presets?.length
      ? this.config.color_presets
      : DEFAULT_COLOR_PRESETS;
  }

  private get stateColor(): string {
    if (!this.isOn) {
      return this.config.off_color ?? '#697382';
    }

    const rgb = this.currentRgb;
    const kelvin = this.currentKelvin;

    if (rgb) {
      return this.rgbToCss(rgb);
    }

    if (typeof kelvin === 'number') {
      return this.kelvinToCss(kelvin);
    }

    return this.config.on_color ?? '#ff8a1c';
  }

  private get brightnessPercent(): number | undefined {
    const brightness = this.entity?.attributes.brightness;

    if (typeof brightness !== 'number') {
      return undefined;
    }

    return Math.round((brightness / 255) * 100);
  }

  private get activeBrightnessPercent(): number {
    if (this.dimmingPercent !== undefined) {
      return this.dimmingPercent;
    }

    if (this.optimisticBrightnessPercent !== undefined) {
      return this.optimisticBrightnessPercent;
    }

    if (!this.isOn) {
      return 0;
    }

    return this.brightnessPercent ?? 100;
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

    const mode = this.config.state_display ?? 'state';
    const brightness = this.brightnessPercent;

    if (this.isOn && this.hasDimmer) {
      return `${this.activeBrightnessPercent}%`;
    }

    if (this.isOn && brightness !== undefined && (mode === 'brightness' || mode === 'auto')) {
      return `${brightness}%`;
    }

    return this.isOn ? 'On' : 'Off';
  }

  private get displayPowerState(): string {
    if (this.isUnavailable) {
      return 'Unavailable';
    }

    return this.isOn ? 'On' : 'Off';
  }

  private get icon(): string {
    return (
      this.config.icon ||
      this.entity?.attributes.icon ||
      DEFAULT_CONFIG.icon ||
      'mdi:lightbulb'
    );
  }

  private rgbToCss(rgb: number[]): string {
    return `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`;
  }

  private kelvinToCss(kelvin: number): string {
    if (kelvin <= 3000) {
      return '#ffb56f';
    }

    if (kelvin <= 3800) {
      return '#ffd9a6';
    }

    if (kelvin <= 4600) {
      return '#fff1d6';
    }

    return '#f2f7ff';
  }

  private colorDistance(first: number[], second: number[]): number {
    return Math.sqrt(
      first.reduce((total, value, index) => {
        const delta = value - (second[index] ?? 0);
        return total + delta * delta;
      }, 0),
    );
  }

  private isColorPresetActive(preset: LightColorPreset): boolean {
    if (!this.isOn || !preset.rgb_color || !this.currentRgb) {
      return false;
    }

    return this.colorDistance(preset.rgb_color, this.currentRgb) < 44;
  }

  private isTemperaturePresetActive(preset: LightColorPreset): boolean {
    if (!this.isOn || !preset.color_temp_kelvin || !this.currentKelvin) {
      return false;
    }

    return Math.abs(preset.color_temp_kelvin - this.currentKelvin) < 220;
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

  private setOptimisticOn(on: boolean, brightnessPercent?: number): void {
    window.clearTimeout(this.optimisticTimer);
    this.optimisticOn = on;
    this.optimisticBrightnessPercent = brightnessPercent;
    this.optimisticTimer = window.setTimeout(() => {
      this.clearOptimisticState();
    }, 1800);
  }

  private setOptimisticBrightness(percent: number): void {
    this.setOptimisticOn(percent > 0, Math.max(0, Math.min(100, percent)));
  }

  private clearOptimisticState(): void {
    window.clearTimeout(this.optimisticTimer);
    this.optimisticOn = undefined;
    this.optimisticBrightnessPercent = undefined;
    this.optimisticRgb = undefined;
    this.optimisticKelvin = undefined;
    this.optimisticEffect = undefined;
  }

  private trackServiceResult(result: Promise<unknown> | void): void {
    if (result && typeof result.catch === 'function') {
      result.catch(() => this.clearOptimisticState());
    }
  }

  private performAction(action: ActionConfig | undefined): void {
    if (this.isUnavailable || !action) {
      return;
    }

    if (typeof action === 'object' && action.action === 'multi') {
      this.performMultiAction(action);
      return;
    }

    this.performSingleAction(action);
  }

  private performMultiAction(action: MultiAction): void {
    for (const singleAction of action.actions) {
      this.performSingleAction(singleAction);
    }
  }

  private performSingleAction(action: SingleAction | string): void {
    if (this.isUnavailable || action === 'none') {
      return;
    }

    if (typeof action === 'string') {
      if (action === 'more-info') {
        this.dispatchMoreInfo();
        return;
      }

      if (action === 'toggle') {
        if (this.hasDimmer) {
          this.setOptimisticBrightness(
            this.isOn ? 0 : this.brightnessPercent ?? 100,
          );
        } else {
          this.setOptimisticOn(!this.isOn);
        }
        this.trackServiceResult(
          this.hass?.callService(this.domain, 'toggle', {
            entity_id: this.config.entity,
          }),
        );
        return;
      }

      return;
    }

    if (action.action === 'more-info') {
      this.dispatchMoreInfo();
      return;
    }

    if (action.action === 'toggle') {
      if (this.hasDimmer) {
        this.setOptimisticBrightness(
          this.isOn ? 0 : this.brightnessPercent ?? 100,
        );
      } else {
        this.setOptimisticOn(!this.isOn);
      }
      this.trackServiceResult(
        this.hass?.callService(this.domain, 'toggle', {
          entity_id: this.config.entity,
        }),
      );
      return;
    }

    if (action.action === 'navigate') {
      const path = action.navigation_path;
      if (path && window.location) {
        window.history.pushState(null, '', path);
        this.dispatchEvent(
          new CustomEvent('location-changed', {
            detail: { replace: false },
            bubbles: true,
            composed: true,
          }),
        );
      }
      return;
    }

    if (action.action === 'call-service') {
      const serviceValue = String(action.service || '').trim();
      const [domain, service] = serviceValue.split('.');

      if (!domain || !service) {
        return;
      }

      const serviceData: Record<string, unknown> = {
        ...(action.service_data ?? action.data ?? {}),
      };
      const hasTarget = Boolean(
        action.target && Object.keys(action.target).length,
      );

      if (
        !hasTarget &&
        !Object.prototype.hasOwnProperty.call(serviceData, 'entity_id')
      ) {
        serviceData.entity_id = this.config.entity;
      }

      if (hasTarget) {
        this.trackServiceResult(
          this.hass?.callService(domain, service, serviceData, action.target),
        );
      } else {
        this.trackServiceResult(
          this.hass?.callService(domain, service, serviceData),
        );
      }
      return;
    }
  }

  private brightnessFromPointer(event: PointerEvent): number {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const rawPercent = ((event.clientX - rect.left) / rect.width) * 100;

    return Math.max(0, Math.min(100, Math.round(rawPercent)));
  }

  private commitBrightness(percent: number): void {
    if (!this.hasDimmer || this.isUnavailable) {
      return;
    }

    if (percent <= 5) {
      this.setOptimisticBrightness(0);
      this.trackServiceResult(
        this.hass?.callService('light', 'turn_off', {
          entity_id: this.config.entity,
        }),
      );
      return;
    }

    this.setOptimisticBrightness(percent);
    this.trackServiceResult(
      this.hass?.callService('light', 'turn_on', {
        entity_id: this.config.entity,
        brightness_pct: Math.max(1, percent),
      }),
    );
  }

  private turnOnWithOptions(options: Record<string, unknown>): void {
    if (this.isUnavailable || this.domain !== 'light') {
      return;
    }

    const fallbackBrightness =
      this.brightnessPercent && this.brightnessPercent > 0
        ? this.brightnessPercent
        : 100;
    const brightness =
      typeof options.brightness_pct === 'number'
        ? options.brightness_pct
        : this.isOn
          ? this.activeBrightnessPercent || fallbackBrightness
          : fallbackBrightness;
    const serviceData: Record<string, unknown> = {
      entity_id: this.config.entity,
      ...options,
    };

    if (typeof options.brightness_pct === 'number' || !this.isOn) {
      serviceData.brightness_pct = Math.max(1, brightness);
    }

    this.setOptimisticOn(true, brightness);

    if (Array.isArray(options.rgb_color)) {
      this.optimisticRgb = options.rgb_color
        .slice(0, 3)
        .map((value) => Math.max(0, Math.min(255, Math.round(Number(value) || 0))));
      this.optimisticKelvin = undefined;
    }

    if (typeof options.color_temp_kelvin === 'number') {
      this.optimisticKelvin = options.color_temp_kelvin;
      this.optimisticRgb = undefined;
    }

    if (typeof options.effect === 'string') {
      this.optimisticEffect = options.effect;
    }

    this.trackServiceResult(this.hass?.callService('light', 'turn_on', serviceData));
  }

  private handleControlModeClick(event: Event, mode: LightControlMode): void {
    event.stopPropagation();
    this.controlMode = mode;
  }

  private handleColorPresetClick(event: Event, preset: LightColorPreset): void {
    event.stopPropagation();

    if (!preset.rgb_color) {
      return;
    }

    this.turnOnWithOptions({
      rgb_color: preset.rgb_color,
    });
  }

  private handleTemperaturePresetClick(
    event: Event,
    preset: LightColorPreset,
  ): void {
    event.stopPropagation();

    if (!preset.color_temp_kelvin) {
      return;
    }

    this.turnOnWithOptions({
      color_temp_kelvin: preset.color_temp_kelvin,
    });
  }

  private handleEffectClick(event: Event, effect: string): void {
    event.stopPropagation();
    this.turnOnWithOptions({ effect });
  }

  private stopControlEvent(event: Event): void {
    event.stopPropagation();
  }

  private handleBrightnessPointerDown(event: PointerEvent): void {
    event.stopPropagation();
    this.handlePointerDown(event);
  }

  private handleBrightnessPointerMove(event: PointerEvent): void {
    event.stopPropagation();
    this.handlePointerMove(event);
  }

  private handleBrightnessPointerUp(event: PointerEvent): void {
    event.stopPropagation();
    this.handlePointerUp(event);
  }

  private handleBrightnessPointerCancel(event: PointerEvent): void {
    event.stopPropagation();
    this.handlePointerCancel();
  }

  private handlePointerDown(event: PointerEvent): void {
    window.clearTimeout(this.holdTimer);
    this.holdActive = false;
    this.suppressClick = false;

    if (this.hasDimmer && !this.isUnavailable) {
      this.pendingDimmerPointer = true;
      this.isDimming = false;
      this.pointerStartX = event.clientX;
      this.pointerStartY = event.clientY;
      (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
      this.holdTimer = window.setTimeout(() => {
        if (!this.pendingDimmerPointer || this.isDimming) {
          return;
        }

        this.holdActive = true;
        this.pendingDimmerPointer = false;
        this.suppressClick = true;
        this.performAction(this.config.hold_action);
      }, 500);
      return;
    }

    this.holdTimer = window.setTimeout(() => {
      this.holdActive = true;
      this.performAction(this.config.hold_action);
    }, 500);
  }

  private handlePointerMove(event: PointerEvent): void {
    if (!this.hasDimmer || (!this.pendingDimmerPointer && !this.isDimming)) {
      return;
    }

    const deltaX = Math.abs(event.clientX - this.pointerStartX);
    const deltaY = Math.abs(event.clientY - this.pointerStartY);

    if (!this.isDimming) {
      if (deltaX < 9 || deltaY > deltaX * 1.4) {
        return;
      }

      window.clearTimeout(this.holdTimer);
      this.isDimming = true;
      this.pendingDimmerPointer = false;
      this.suppressClick = true;
    }

    this.dimmingPercent = this.brightnessFromPointer(event);
    event.preventDefault();
  }

  private handlePointerUp(event: PointerEvent): void {
    window.clearTimeout(this.holdTimer);

    if (this.hasDimmer && this.isDimming) {
      const percent = this.brightnessFromPointer(event);
      this.dimmingPercent = percent;
      this.commitBrightness(percent);
      this.isDimming = false;
      this.pendingDimmerPointer = false;
      window.setTimeout(() => {
        this.dimmingPercent = undefined;
        this.suppressClick = false;
      }, 180);
      event.preventDefault();
      return;
    }

    if (this.hasDimmer) {
      this.pendingDimmerPointer = false;
    }
  }

  private handlePointerCancel(): void {
    window.clearTimeout(this.holdTimer);
    this.isDimming = false;
    this.pendingDimmerPointer = false;
    this.dimmingPercent = undefined;
    window.setTimeout(() => {
      this.suppressClick = false;
    }, 0);
  }

  private handleClick(event: Event): void {
    if (this.hasDimmer && this.suppressClick) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.holdActive) {
      this.holdActive = false;
      return;
    }

    this.performAction(this.config.tap_action);
  }

  private handleIconPointerDown(event: Event): void {
    if (!this.hasDimmer && !this.hasLightControls) {
      return;
    }

    event.stopPropagation();
    window.clearTimeout(this.holdTimer);
    this.holdActive = false;
    this.pendingDimmerPointer = false;
    this.isDimming = false;
  }

  private handleIconClick(event: Event): void {
    if (!this.hasDimmer && !this.hasLightControls) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.performAction(this.config.tap_action);
  }

  private renderControlTabs(): TemplateResult | typeof nothing {
    const modes = this.controlModes;

    if (modes.length <= 1) {
      return nothing;
    }

    return html`
      <span class="mode-tabs" aria-label="Light control modes">
        ${modes.map(
          (mode) => html`
            <button
              type="button"
              class="mode-tab ${mode === this.activeControlMode ? 'active' : ''}"
              @pointerdown=${this.stopControlEvent}
              @pointerup=${this.stopControlEvent}
              @pointercancel=${this.stopControlEvent}
              @click=${(event: Event) => this.handleControlModeClick(event, mode)}
            >
              ${LIGHT_CONTROL_LABELS[mode]}
            </button>
          `,
        )}
      </span>
    `;
  }

  private renderColorControls(): TemplateResult {
    const presets = this.colorPresets.filter((preset) =>
      Array.isArray(preset.rgb_color),
    );

    return html`
      <span class="swatches" aria-label="Color presets">
        ${presets.map(
          (preset) => html`
            <button
              type="button"
              class="swatch ${this.isColorPresetActive(preset) ? 'active' : ''}"
              style=${`--swatch-color: ${this.rgbToCss(preset.rgb_color ?? [255, 255, 255])}`}
              aria-label=${`Set ${preset.name}`}
              title=${preset.name}
              @pointerdown=${this.stopControlEvent}
              @pointerup=${this.stopControlEvent}
              @pointercancel=${this.stopControlEvent}
              @click=${(event: Event) => this.handleColorPresetClick(event, preset)}
            ></button>
          `,
        )}
      </span>
    `;
  }

  private renderTemperatureControls(): TemplateResult {
    return html`
      <span
        class="swatches"
        aria-label="Color temperature presets"
      >
        ${DEFAULT_TEMP_PRESETS.map(
          (preset) => html`
            <button
              type="button"
              class="swatch ${this.isTemperaturePresetActive(preset) ? 'active' : ''}"
              style=${`--swatch-color: ${this.kelvinToCss(preset.color_temp_kelvin ?? 3000)}`}
              aria-label=${`Set ${preset.name}`}
              title=${`${preset.name} ${preset.color_temp_kelvin}K`}
              @pointerdown=${this.stopControlEvent}
              @pointerup=${this.stopControlEvent}
              @pointercancel=${this.stopControlEvent}
              @click=${(event: Event) =>
                this.handleTemperaturePresetClick(event, preset)}
            ></button>
          `,
        )}
      </span>
    `;
  }

  private renderEffectControls(): TemplateResult {
    const currentEffect = this.currentEffect;

    return html`
      <span class="effect-list" aria-label="Light effects">
        ${this.effectList.map(
          (effect) => html`
            <button
              type="button"
              class="effect-chip ${effect === currentEffect ? 'active' : ''}"
              @pointerdown=${this.stopControlEvent}
              @pointerup=${this.stopControlEvent}
              @pointercancel=${this.stopControlEvent}
              @click=${(event: Event) => this.handleEffectClick(event, effect)}
            >
              ${effect}
            </button>
          `,
        )}
      </span>
    `;
  }

  private renderActiveControls(): TemplateResult | typeof nothing {
    switch (this.activeControlMode) {
      case 'color':
        return this.renderColorControls();
      case 'temperature':
        return this.renderTemperatureControls();
      case 'effect':
        return this.renderEffectControls();
      default:
        return nothing;
    }
  }

  private renderCompactButton(): TemplateResult {
    return html`
      <button
        type="button"
        class="button ${this.hasDimmer ? 'dimmer' : ''} ${this.isOn
          ? 'on'
          : 'off'} ${this.isUnavailable ? 'unavailable' : ''} ${this.config
          .animated
          ? 'animated'
          : ''}"
        aria-label=${this.displayName}
        @click=${this.handleClick}
        @pointerdown=${this.handlePointerDown}
        @pointermove=${this.handlePointerMove}
        @pointerup=${this.handlePointerUp}
        @pointercancel=${this.handlePointerCancel}
      >
        <span class="ambient-glow"></span>
        <span class="slider-fill"></span>
        <span class="outline-glow"></span>
        <span
          class="icon-shell"
          @pointerdown=${this.handleIconPointerDown}
          @click=${this.handleIconClick}
        >
          <ha-icon icon=${this.icon}></ha-icon>
        </span>
        <span class="content">
          <span class="name">${this.displayName}</span>
          ${this.config.show_state
            ? html`<span class="state">${this.displayState}</span>`
            : nothing}
        </span>
      </button>
    `;
  }

  private renderLightPanel(): TemplateResult {
    return html`
      <div
        class="button panel ${this.isOn ? 'on' : 'off'} ${this.isUnavailable
          ? 'unavailable'
          : ''} ${this.config.animated ? 'animated' : ''}"
        @click=${this.stopControlEvent}
        @pointerdown=${this.stopControlEvent}
        @pointerup=${this.stopControlEvent}
        @pointercancel=${this.stopControlEvent}
      >
        <span class="ambient-glow"></span>
        <span class="outline-glow"></span>
        <span class="panel-header">
          <button
            type="button"
            class="icon-shell"
            aria-label=${`${this.isOn ? 'Turn off' : 'Turn on'} ${this.displayName}`}
            @pointerdown=${this.handleIconPointerDown}
            @click=${this.handleIconClick}
          >
            <ha-icon icon=${this.icon}></ha-icon>
          </button>
          <span class="content">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state
              ? html`<span class="state">${this.displayPowerState}</span>`
              : nothing}
          </span>
          <span class="level">${this.activeBrightnessPercent}%</span>
        </span>
        ${this.hasDimmer
          ? html`
              <button
                type="button"
                class="brightness-control"
                aria-label=${`Set ${this.displayName} brightness`}
                @click=${this.stopControlEvent}
                @pointerdown=${this.handleBrightnessPointerDown}
                @pointermove=${this.handleBrightnessPointerMove}
                @pointerup=${this.handleBrightnessPointerUp}
                @pointercancel=${this.handleBrightnessPointerCancel}
              >
                <span class="brightness-fill"></span>
              </button>
            `
          : nothing}
        ${this.renderControlTabs()}
        <span class="control-panel">${this.renderActiveControls()}</span>
      </div>
    `;
  }

  protected render(): TemplateResult {
    if (!this.config) {
      return html``;
    }

    const stateColor = this.stateColor;
    const onOpacity = this.isOn ? '1' : '0';
    const sliderPercent = this.hasDimmer
      ? `${this.activeBrightnessPercent}%`
      : '0%';
    const sliderOpacity = this.hasDimmer && this.activeBrightnessPercent > 0 ? '1' : '0';
    const sliderHandleOpacity =
      this.hasDimmer && this.activeBrightnessPercent > 5 ? '1' : '0';

    return html`
      <ha-card
        style="
          --glow-state-color: ${stateColor};
          --glow-warm-color: ${this.isOn
            ? 'color-mix(in srgb, ' + stateColor + ' 86%, #ffd26a)'
            : stateColor};
          --glow-hot-color: ${this.isOn
            ? 'color-mix(in srgb, ' + stateColor + ' 82%, #ff4f00)'
            : stateColor};
          --glow-border-color: ${stateColor};
          --glow-icon-color: ${stateColor};
          --glow-on-opacity: ${onOpacity};
          --glow-border-strength: ${this.isOn ? '26%' : '18%'};
          --glow-inner-ring-width: ${this.isOn ? '1px' : '0px'};
          --glow-inner-ring-strength: ${this.isOn ? '8%' : '0%'};
          --glow-outer-blur: ${this.isOn ? '50px' : '0'};
          --glow-outer-strength: ${this.isOn ? '10%' : '0%'};
          --glow-slider-percent: ${sliderPercent};
          --glow-slider-opacity: ${sliderOpacity};
          --glow-slider-handle-opacity: ${sliderHandleOpacity};
        "
      >
        ${this.hasLightControls ? this.renderLightPanel() : this.renderCompactButton()}
      </ha-card>
    `;
  }
}

if (!customElements.get('glow-light-card')) {
  customElements.define('glow-light-card', GlowLightCard);
}

class GlowLightCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  public hass?: HomeAssistant;
  private config: Partial<GlowLightCardConfig> = {};

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

      ha-selector,
      ha-form,
      ha-icon-picker,
      ha-textfield,
      ha-select,
      select {
        width: 100%;
      }

      .full {
        grid-column: 1 / -1;
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

  public setConfig(config: GlowLightCardConfig): void {
    this.config = { ...config };
  }

  private updateConfig(patch: Partial<GlowLightCardConfig>): void {
    const next = { ...this.config, ...patch };
    Object.keys(next).forEach((key) => {
      const typedKey = key as keyof GlowLightCardConfig;
      if (next[typedKey] === '') {
        delete next[typedKey];
      }
    });
    this.config = next;
    fireConfigChanged(this, next);
  }

  private formChanged(event: Event): void {
    const customEvent = event as CustomEvent<{
      value?: Partial<GlowLightCardConfig>;
    }>;

    if (!customEvent.detail?.value) {
      return;
    }

    this.updateConfig(customEvent.detail.value);
  }

  private valueChanged(event: Event): void {
    const target = (event.currentTarget as HTMLElement) ||
      (event.target as HTMLElement);
    const configValue =
      target?.dataset?.configValue ||
      (target as Partial<ConfigElement>).configValue;

    if (!configValue) {
      return;
    }

    const customEvent = event as CustomEvent<{
      item?: { value?: unknown };
      value?: unknown;
    }>;
    let value: unknown =
      customEvent.detail?.value ?? customEvent.detail?.item?.value;

    if (value !== undefined) {
      // handled from custom event detail
    } else if (target instanceof HTMLInputElement) {
      value = target.type === 'checkbox' ? target.checked : target.value;
    } else if (target instanceof HTMLSelectElement) {
      value = target.value;
    } else {
      value = (target as any).value;
    }

    if ((configValue === 'tap_action' || configValue === 'hold_action')) {
      const selectedAction = String(value);
      if (selectedAction === 'call-service') {
        this.updateConfig(({
          [configValue]: {
            action: 'call-service',
            service: '',
          },
        } as unknown) as Partial<GlowLightCardConfig>);
        return;
      }

      if (selectedAction === 'script') {
        this.updateConfig(({
          [configValue]: {
            action: 'call-service',
            service: 'script.turn_on',
          },
        } as unknown) as Partial<GlowLightCardConfig>);
        return;
      }

      if (selectedAction === 'navigate') {
        this.updateConfig(({
          [configValue]: {
            action: 'navigate',
            navigation_path: '',
          },
        } as unknown) as Partial<GlowLightCardConfig>);
        return;
      }

      if (selectedAction === 'multi') {
        this.updateConfig(({
          [configValue]: {
            action: 'multi',
            actions: [],
          },
        } as unknown) as Partial<GlowLightCardConfig>);
        return;
      }

      this.updateConfig({
        [configValue]: selectedAction,
      } as Partial<GlowLightCardConfig>);
      return;
    }

    this.updateConfig({
      [configValue]: value,
    } as Partial<GlowLightCardConfig>);
  }

  private renderEntityPicker(
    label: string,
    key: keyof GlowLightCardConfig,
  ): TemplateResult {
    return html`
      <ha-selector
        class="full"
        .hass=${this.hass}
        .label=${label}
        .selector=${{ entity: { domain: 'light' } }}
        .value=${this.config[key] ?? ''}
        .configValue=${key}
        @value-changed=${this.valueChanged}
      ></ha-selector>
    `;
  }

  private renderTextInput(
    label: string,
    key: keyof GlowLightCardConfig,
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
    key: keyof GlowLightCardConfig,
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
    key: keyof GlowLightCardConfig,
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
    key: keyof GlowLightCardConfig,
    options: string[],
    value: string,
  ): TemplateResult {
    const currentValue =
      key === 'tap_action' || key === 'hold_action'
        ? this.getEditorActionType(key)
        : (this.config[key] as string | undefined) ?? value;

    return html`
      <ha-select
        .label=${label}
        .value=${currentValue}
        data-config-value=${key}
        @selected=${this.valueChanged}
        @change=${this.valueChanged}
        @closed=${(event: Event) => event.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${options.map(
          (option) => html`
            <mwc-list-item
              .value=${option}
              ?selected=${option === currentValue}
            >
              ${option}
            </mwc-list-item>
          `,
        )}
      </ha-select>
    `;
  }

  private getActionValue(key: 'tap_action' | 'hold_action'): ActionConfig | undefined {
    return this.config[key];
  }

  private getEditorActionType(key: 'tap_action' | 'hold_action'): string {
    const action = this.getActionValue(key);
    if (typeof action === 'object' && action.action === 'call-service' && action.service === 'script.turn_on') {
      return 'script';
    }
    return typeof action === 'string' ? action : action?.action ?? 'more-info';
  }

  private getActionSelectValue(
    action: SingleAction | undefined,
    fallback = 'call-service',
  ): string {
    if (!action) {
      return fallback;
    }

    if (typeof action === 'string') {
      return action;
    }

    if (
      action.action === 'call-service' &&
      action.service === 'script.turn_on'
    ) {
      return 'script';
    }

    return action.action;
  }

  private isScriptAction(action: ActionConfig | undefined): boolean {
    return (
      typeof action === 'object' &&
      action.action === 'call-service' &&
      action.service === 'script.turn_on'
    );
  }

  private renderActionFields(
    key: 'tap_action' | 'hold_action',
  ): TemplateResult {
    const action = this.getActionValue(key);
    const actionType = typeof action === 'string' ? action : action?.action;

    if (actionType === 'multi') {
      const multiAction = action as MultiAction | undefined;
      return html`
        <div class="grid full">
          <div style="padding: 10px; background: rgba(255,255,255,.05); border-radius: 8px; border: 1px solid rgba(255,255,255,.1);">
            <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px; color: var(--secondary-text-color);">Actions</div>
            ${this.renderMultiActionSequence(key, multiAction)}
            <button
              @click=${() => this.addMultiAction(key)}
              style="margin-top: 8px; padding: 6px 12px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); border-radius: 6px; color: inherit; cursor: pointer; font-size: 12px;"
            >
              + Add Action
            </button>
          </div>
        </div>
      `;
    }

    if (actionType === 'navigate') {
      return html`
        <div class="grid full">
          <ha-textfield
            .label=${key === 'tap_action' ? 'Navigation Path' : 'Navigation Path'}
            .placeholder=${'#/dashboard/main'}
            .value=${String((action as NavigateAction)?.navigation_path ?? '')}
            data-action-key=${key}
            data-action-field="navigation_path"
            @input=${this.actionFieldChanged}
          ></ha-textfield>
        </div>
      `;
    }

    if (actionType === 'call-service' && this.isScriptAction(action)) {
      return html`
        <div class="grid full">
          <ha-selector
            .hass=${this.hass}
            .label=${key === 'tap_action' ? 'Tap Script' : 'Hold Script'}
            .selector=${{ entity: { domain: 'script' } }}
            .value=${String((action as CallServiceAction).target?.entity_id ?? '')}
            data-action-key=${key}
            data-action-field="script"
            @value-changed=${this.actionFieldChanged}
          ></ha-selector>
        </div>
      `;
    }

    if (actionType === 'call-service') {
      return html`
        <div class="grid full">
          <ha-textfield
            .label=${key === 'tap_action' ? 'Tap Service' : 'Hold Service'}
            .placeholder=${'light.turn_on'}
            .value=${String((action as CallServiceAction)?.service ?? '')}
            data-action-key=${key}
            data-action-field="service"
            @input=${this.actionFieldChanged}
          ></ha-textfield>
        </div>
      `;
    }

    return html``;
  }

  private renderMultiActionSequence(
    key: 'tap_action' | 'hold_action',
    multiAction: MultiAction | undefined,
  ): TemplateResult {
    if (!multiAction?.actions || multiAction.actions.length === 0) {
      return html`<div style="font-size: 12px; color: var(--secondary-text-color); padding: 8px; text-align: center;">No actions added yet</div>`;
    }

    return html`
      ${multiAction.actions.map(
        (action, index) => {
          const actionType = this.getActionSelectValue(action);
          const callAction =
            typeof action === 'object' && action.action === 'call-service'
              ? action
              : undefined;

          return html`
            <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,.03); border-radius: 6px; border: 1px solid rgba(255,255,255,.08);">
              <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 11px; color: var(--secondary-text-color);">Step ${index + 1}</span>
                <button
                  @click=${() => this.removeMultiAction(key, index)}
                  style="margin-left: auto; padding: 2px 6px; background: rgba(255,0,0,.2); border: 1px solid rgba(255,0,0,.4); border-radius: 4px; color: inherit; cursor: pointer; font-size: 11px;"
                >
                  Remove
                </button>
              </div>
              <div style="font-size: 12px;">
                Type:
                <ha-select
                  .value=${actionType}
                  data-action-key=${key}
                  data-action-index=${index}
                  data-action-field="action"
                  @selected=${this.multiActionFieldChanged}
                  @change=${this.multiActionFieldChanged}
                  @closed=${(event: Event) => event.stopPropagation()}
                  style="width: auto; font-size: 12px;"
                  fixedMenuPosition
                  naturalMenuWidth
                >
                  ${MULTI_ACTIONS.map(
                    (option) => html`
                      <mwc-list-item
                        .value=${option}
                        ?selected=${option === actionType}
                      >
                        ${option}
                      </mwc-list-item>
                    `,
                  )}
                </ha-select>
              </div>
              ${actionType === 'script'
                ? html`
                    <div style="margin-top: 6px;">
                      <ha-selector
                        .hass=${this.hass}
                        .label=${'Script'}
                        .selector=${{ entity: { domain: 'script' } }}
                        .value=${String(callAction?.target?.entity_id ?? '')}
                        data-action-key=${key}
                        data-action-index=${index}
                        data-action-field="script"
                        @value-changed=${this.multiActionFieldChanged}
                      ></ha-selector>
                    </div>
                  `
                : actionType === 'call-service'
                  ? html`
                      <div style="margin-top: 6px;">
                        <ha-textfield
                          .label=${'Service'}
                          .value=${String(callAction?.service ?? '')}
                          data-action-key=${key}
                          data-action-index=${index}
                          data-action-field="service"
                          @input=${this.multiActionFieldChanged}
                          style="font-size: 12px;"
                        ></ha-textfield>
                      </div>
                    `
                  : actionType === 'navigate'
                    ? html`
                        <div style="margin-top: 6px;">
                          <ha-textfield
                            .label=${'Path'}
                            .value=${String(
                              typeof action === 'object' &&
                                action.action === 'navigate'
                                ? action.navigation_path
                                : '',
                            )}
                            data-action-key=${key}
                            data-action-index=${index}
                            data-action-field="navigation_path"
                            @input=${this.multiActionFieldChanged}
                            style="font-size: 12px;"
                          ></ha-textfield>
                        </div>
                      `
                    : nothing}
            </div>
          `;
        },
      )}
    `;
  }

  private addMultiAction(key: 'tap_action' | 'hold_action'): void {
    const action = this.getActionValue(key);
    if (typeof action === 'object' && action.action === 'multi') {
      const multiAction = action as MultiAction;
      const newActions = [
        ...multiAction.actions,
        { action: 'call-service', service: '' },
      ];
      this.updateConfig({
        [key]: { action: 'multi', actions: newActions },
      } as Partial<GlowLightCardConfig>);
    }
  }

  private removeMultiAction(key: 'tap_action' | 'hold_action', index: number): void {
    const action = this.getActionValue(key);
    if (typeof action === 'object' && action.action === 'multi') {
      const multiAction = action as MultiAction;
      const newActions = multiAction.actions.filter((_, i) => i !== index);
      this.updateConfig({
        [key]: { action: 'multi', actions: newActions },
      } as Partial<GlowLightCardConfig>);
    }
  }

  private actionFieldChanged(event: Event): void {
    const target = event.target as HTMLElement & {
      value?: string;
      dataset?: { actionKey?: string; actionField?: string };
      detail?: { value?: string };
    };
    const actionKey = target.dataset?.actionKey as
      | 'tap_action'
      | 'hold_action'
      | undefined;
    const actionField = target.dataset?.actionField;

    if (!actionKey || !actionField) {
      return;
    }

    const rawValue =
      target.detail?.value ??
      (typeof target.value === 'string' ? target.value : undefined);

    if (rawValue === undefined) {
      return;
    }

    const existing = this.getActionValue(actionKey);
    const action =
      typeof existing === 'object'
        ? { ...existing }
        : { action: existing ?? 'more-info' };

    if (actionField === 'service') {
      (action as CallServiceAction).service = rawValue;
    } else if (actionField === 'script') {
      (action as CallServiceAction).service = 'script.turn_on';
      if (rawValue) {
        (action as CallServiceAction).target = { entity_id: rawValue };
      } else {
        delete (action as CallServiceAction).target;
      }
    } else if (actionField === 'navigation_path') {
      (action as NavigateAction).navigation_path = rawValue;
    }

    this.updateConfig({ [actionKey]: action } as Partial<GlowLightCardConfig>);
  }

  private multiActionFieldChanged(event: Event): void {
    const target = event.target as HTMLElement & {
      value?: string;
      dataset?: { actionKey?: string; actionIndex?: string; actionField?: string };
      detail?: { value?: string };
    };
    const actionKey = target.dataset?.actionKey as
      | 'tap_action'
      | 'hold_action'
      | undefined;
    const actionIndex =
      target.dataset?.actionIndex !== undefined
        ? Number(target.dataset.actionIndex)
        : undefined;
    const actionField = target.dataset?.actionField;

    if (
      !actionKey ||
      actionIndex === undefined ||
      !Number.isInteger(actionIndex) ||
      !actionField
    ) {
      return;
    }

    const customEvent = event as CustomEvent<{
      item?: { value?: string };
      value?: string;
    }>;
    const rawValue =
      customEvent.detail?.value ??
      customEvent.detail?.item?.value ??
      target.detail?.value ??
      (typeof target.value === 'string' ? target.value : undefined);

    const action = this.getActionValue(actionKey);
    if (typeof action !== 'object' || action.action !== 'multi') {
      return;
    }

    const multiAction = action as MultiAction;
    const newActions = [...multiAction.actions];
    const targetAction = newActions[actionIndex];

    if (!targetAction) {
      return;
    }

    if (actionField === 'action') {
      if (rawValue === 'call-service') {
        newActions[actionIndex] = { action: 'call-service', service: '' };
      } else if (rawValue === 'script') {
        newActions[actionIndex] = {
          action: 'call-service',
          service: 'script.turn_on',
        };
      } else if (rawValue === 'navigate') {
        newActions[actionIndex] = { action: 'navigate', navigation_path: '' };
      } else if (
        rawValue === 'more-info' ||
        rawValue === 'none' ||
        rawValue === 'toggle'
      ) {
        newActions[actionIndex] = rawValue;
      }
    } else if (actionField === 'service') {
      if (typeof targetAction === 'object' && targetAction.action === 'call-service') {
        newActions[actionIndex] = {
          ...targetAction,
          service: rawValue ?? '',
        };
      }
    } else if (actionField === 'script') {
      newActions[actionIndex] = {
        action: 'call-service',
        service: 'script.turn_on',
        ...(rawValue ? { target: { entity_id: rawValue } } : {}),
      };
    } else if (actionField === 'navigation_path') {
      if (typeof targetAction === 'object' && targetAction.action === 'navigate') {
        newActions[actionIndex] = {
          ...targetAction,
          navigation_path: rawValue ?? '',
        };
      }
    }

    this.updateConfig({
      [actionKey]: { action: 'multi', actions: newActions },
    } as Partial<GlowLightCardConfig>);
  }

  private renderEntityForm(): TemplateResult {
    const schema = [
      {
        name: 'entity',
        required: true,
        selector: { entity: { domain: 'light' } },
      },
    ];
    const labels: Record<string, string> = {
      entity: 'Light Entity',
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

  protected render(): TemplateResult {
    return html`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput('Name', 'name', 'Bar Lights')}
            ${this.renderIconPicker('Icon', 'icon')}
            ${this.renderTextInput('Width', 'width', '260px')}
            ${this.renderTextInput('Height', 'height', '56px')}
            ${this.renderTextInput('Radius', 'border_radius', '999px')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Fill Container', 'fill_container', false)}
            ${this.renderSwitch('Has Dimmer', 'has_dimmer', false)}
            ${this.renderSwitch('Light Controls', 'show_light_controls', false)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput('On Color', 'on_color', '#ff8a1c')}
            ${this.renderTextInput('Off Color', 'off_color', '#697382')}
            ${this.renderTextInput('Background', 'background', '#101722')}
            ${this.renderSelect(
              'State Display',
              'state_display',
              STATE_DISPLAY_MODES,
              'state',
            )}
          </div>
          <div class="grid">
            ${this.renderSwitch('Show State', 'show_state', true)}
            ${this.renderSwitch('Animated Glow', 'animated', true)}
            ${this.renderSwitch('Color Presets', 'show_color_presets', true)}
            ${this.renderSwitch('Color Temp', 'show_color_temp', true)}
            ${this.renderSwitch('Effects', 'show_effects', false)}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect('Tap Action', 'tap_action', ACTIONS, 'toggle')}
            ${this.renderSelect(
              'Hold Action',
              'hold_action',
              ACTIONS,
              'more-info',
            )}
          </div>
          ${this.renderActionFields('tap_action')}
          ${this.renderActionFields('hold_action')}
        </section>
      </div>
    `;
  }
}

if (!customElements.get('glow-light-card-editor')) {
  customElements.define('glow-light-card-editor', GlowLightCardEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    'glow-light-card': GlowLightCard;
    'glow-light-card-editor': GlowLightCardEditor;
  }

  interface Window {
    customCards?: unknown[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  preview: true,
  type: 'glow-light-card',
  name: 'Glow Light Card',
  description: 'A compact glowing light card for Home Assistant.',
});
