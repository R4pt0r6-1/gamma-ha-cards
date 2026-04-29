import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';

type LightEntity = {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    icon?: string;
    brightness?: number;
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
type ActionMode = 'toggle' | 'more-info' | 'none';

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
  show_state?: boolean;
  state_display?: StateDisplayMode;
  on_color?: string;
  off_color?: string;
  background?: string;
  tap_action?: ActionMode;
  hold_action?: ActionMode;
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
  height: '64px',
  border_radius: '999px',
  has_dimmer: false,
  show_state: true,
  state_display: 'state',
  on_color: '#ff8a1c',
  off_color: '#697382',
  background: '#101722',
  tap_action: 'toggle',
  hold_action: 'more-info',
  animated: true,
};

const ACTIONS: ActionMode[] = ['toggle', 'more-info', 'none'];
const STATE_DISPLAY_MODES: StateDisplayMode[] = ['state', 'brightness', 'auto'];

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
  };

  public hass?: HomeAssistant;
  private config!: GlowLightCardConfig;
  private holdTimer?: number;
  private holdActive = false;
  private dimmingPercent?: number;
  private isDimming = false;
  private pendingDimmerPointer = false;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private suppressClick = false;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --glow-card-width: 260px;
        --glow-card-height: 64px;
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
          color-mix(in srgb, var(--glow-state-color) 86%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 12px
            color-mix(in srgb, var(--glow-state-color) 32%, transparent),
          0 0 10px
            color-mix(in srgb, var(--glow-state-color) 56%, transparent),
          0 0 22px
            color-mix(in srgb, var(--glow-state-color) 42%, transparent),
          0 0 46px
            color-mix(in srgb, var(--glow-state-color) 26%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .button .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--glow-state-color) 52%, transparent);
        border-radius: inherit;
        box-shadow:
          0 0 6px
            color-mix(in srgb, var(--glow-state-color) 62%, transparent),
          0 0 18px
            color-mix(in srgb, var(--glow-state-color) 46%, transparent),
          0 0 38px
            color-mix(in srgb, var(--glow-state-color) 28%, transparent);
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
            color-mix(in srgb, var(--glow-state-color) 22%, transparent),
            transparent 72%
          );
        filter: blur(13px);
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
        display: inline-flex;
        height: 38px;
        justify-content: center;
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
    this.style.setProperty('--glow-card-height', this.config.height ?? '64px');
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
    return 1;
  }

  private get entity(): LightEntity | undefined {
    return this.hass?.states[this.config.entity];
  }

  private get isOn(): boolean {
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

  private get icon(): string {
    return (
      this.config.icon ||
      this.entity?.attributes.icon ||
      DEFAULT_CONFIG.icon ||
      'mdi:lightbulb'
    );
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

  private performAction(action: ActionMode | undefined): void {
    if (this.isUnavailable || !action || action === 'none') {
      return;
    }

    if (action === 'more-info') {
      this.dispatchMoreInfo();
      return;
    }

    this.hass?.callService(this.domain, 'toggle', {
      entity_id: this.config.entity,
    });
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
      this.hass?.callService('light', 'turn_off', {
        entity_id: this.config.entity,
      });
      return;
    }

    this.hass?.callService('light', 'turn_on', {
      entity_id: this.config.entity,
      brightness_pct: Math.max(1, percent),
    });
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

  protected render(): TemplateResult {
    if (!this.config) {
      return html``;
    }

    const stateColor = this.isOn
      ? this.config.on_color
      : this.config.off_color;
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
          --glow-border-strength: ${this.isOn ? '78%' : '26%'};
          --glow-inner-ring-width: ${this.isOn ? '1px' : '0px'};
          --glow-inner-ring-strength: ${this.isOn ? '28%' : '0%'};
          --glow-outer-blur: ${this.isOn ? '30px' : '0'};
          --glow-outer-strength: ${this.isOn ? '26%' : '0%'};
          --glow-slider-percent: ${sliderPercent};
          --glow-slider-opacity: ${sliderOpacity};
          --glow-slider-handle-opacity: ${sliderHandleOpacity};
        "
      >
        <button
          type="button"
          class="button ${this.hasDimmer ? 'dimmer' : ''} ${this.isOn ? 'on' : 'off'} ${this.isUnavailable
            ? 'unavailable'
            : ''} ${this.config.animated ? 'animated' : ''}"
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
          <span class="icon-shell">
            <ha-icon icon=${this.icon}></ha-icon>
          </span>
          <span class="content">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state
              ? html`<span class="state">${this.displayState}</span>`
              : nothing}
          </span>
        </button>
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
      ha-select {
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
            ${this.renderTextInput('Height', 'height', '64px')}
            ${this.renderTextInput('Radius', 'border_radius', '999px')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Fill Container', 'fill_container', false)}
            ${this.renderSwitch('Has Dimmer', 'has_dimmer', false)}
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
