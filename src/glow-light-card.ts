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
  height?: string;
  border_radius?: string;
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
  height: '64px',
  border_radius: '999px',
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
  };

  public hass?: HomeAssistant;
  private config!: GlowLightCardConfig;
  private holdTimer?: number;
  private holdActive = false;

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
            color-mix(in srgb, var(--glow-state-color) 20%, transparent),
            transparent 42%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--glow-background) 92%, #ffffff 6%),
            color-mix(in srgb, var(--glow-background) 92%, #000000 12%)
          );
        border: 1px solid
          color-mix(in srgb, var(--glow-border-color) 70%, transparent);
        border-radius: var(--glow-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 7%),
          0 12px 24px rgb(0 0 0 / 22%);
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

      .button::before {
        background:
          radial-gradient(
            circle at 22% 50%,
            color-mix(in srgb, var(--glow-state-color) 48%, transparent),
            transparent 34%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--glow-state-color) 13%, transparent),
            transparent 72%
          );
        content: '';
        inset: 0;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .button::after {
        border-radius: inherit;
        box-shadow:
          0 0 24px
            color-mix(in srgb, var(--glow-state-color) 48%, transparent),
          0 0 42px
            color-mix(in srgb, var(--glow-state-color) 28%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
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
        min-width: 0;
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

    this.style.setProperty('--glow-card-width', this.config.width ?? '260px');
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

  private get brightnessPercent(): number | undefined {
    const brightness = this.entity?.attributes.brightness;

    if (typeof brightness !== 'number') {
      return undefined;
    }

    return Math.round((brightness / 255) * 100);
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

    if (
      this.isOn &&
      brightness !== undefined &&
      (mode === 'brightness' || mode === 'auto')
    ) {
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

  protected render(): TemplateResult {
    if (!this.config) {
      return html``;
    }

    const stateColor = this.isOn
      ? this.config.on_color
      : this.config.off_color;
    const onOpacity = this.isOn ? '1' : '0';

    return html`
      <ha-card
        style="
          --glow-state-color: ${stateColor};
          --glow-border-color: ${stateColor};
          --glow-icon-color: ${stateColor};
          --glow-on-opacity: ${onOpacity};
        "
      >
        <button
          class="button ${this.isOn ? 'on' : 'off'} ${this.isUnavailable
            ? 'unavailable'
            : ''} ${this.config.animated ? 'animated' : ''}"
          aria-label=${this.displayName}
          @click=${this.handleClick}
          @pointerdown=${this.handlePointerDown}
          @pointerup=${this.handlePointerUp}
          @pointercancel=${this.handlePointerUp}
        >
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

      paper-input,
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

  private valueChanged(event: Event): void {
    const target = event.target as ConfigElement;

    if (!target.configValue) {
      return;
    }

    this.updateConfig({
      [target.configValue]:
        target.checked !== undefined ? target.checked : target.value,
    } as Partial<GlowLightCardConfig>);
  }

  private renderTextInput(
    label: string,
    key: keyof GlowLightCardConfig,
    placeholder = '',
  ): TemplateResult {
    return html`
      <paper-input
        label=${label}
        placeholder=${placeholder}
        .value=${this.config[key] ?? ''}
        .configValue=${key}
        @value-changed=${this.valueChanged}
      ></paper-input>
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

  protected render(): TemplateResult {
    return html`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          <div class="grid">
            ${this.renderTextInput('Entity', 'entity', 'light.bar_lights')}
            ${this.renderTextInput('Name', 'name', 'Bar Lights')}
            ${this.renderTextInput('Icon', 'icon', 'mdi:ceiling-light')}
            ${this.renderTextInput('Width', 'width', '260px')}
            ${this.renderTextInput('Height', 'height', '64px')}
            ${this.renderTextInput('Radius', 'border_radius', '999px')}
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
