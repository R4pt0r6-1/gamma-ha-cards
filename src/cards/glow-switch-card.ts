import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';

type SwitchEntity = {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    icon?: string;
    [key: string]: unknown;
  };
};

type HomeAssistant = {
  states: Record<string, SwitchEntity | undefined>;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ) => Promise<unknown> | void;
};

type ActionMode = 'toggle' | 'more-info' | 'none';

interface GlowSwitchCardConfig {
  type?: string;
  entity: string;
  name?: string;
  icon?: string;
  width?: string;
  fill_container?: boolean;
  height?: string;
  border_radius?: string;
  show_state?: boolean;
  on_color?: string;
  off_color?: string;
  background?: string;
  tap_action?: ActionMode;
  hold_action?: ActionMode;
  animated?: boolean;
}

type ConfigElement = HTMLInputElement & {
  checked?: boolean;
  configValue?: keyof GlowSwitchCardConfig;
};

const DEFAULT_CONFIG: Omit<GlowSwitchCardConfig, 'entity'> = {
  icon: 'mdi:toggle-switch',
  width: '260px',
  fill_container: false,
  height: '64px',
  border_radius: '999px',
  show_state: true,
  on_color: '#45d158',
  off_color: '#697382',
  background: '#101722',
  tap_action: 'toggle',
  hold_action: 'more-info',
  animated: true,
};

const ACTIONS: ActionMode[] = ['toggle', 'more-info', 'none'];

function fireConfigChanged(
  element: HTMLElement,
  config: Partial<GlowSwitchCardConfig>,
): void {
  element.dispatchEvent(
    new CustomEvent('config-changed', {
      detail: { config },
      bubbles: true,
      composed: true,
    }),
  );
}

export class GlowSwitchCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    holdActive: { state: true },
    optimisticOn: { state: true },
  };

  public hass?: HomeAssistant;
  private config!: GlowSwitchCardConfig;
  private holdTimer?: number;
  private optimisticTimer?: number;
  private holdActive = false;
  private optimisticOn?: boolean;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --switch-card-width: 260px;
        --switch-card-height: 64px;
        --switch-card-radius: 999px;
        --switch-on-color: #45d158;
        --switch-off-color: #697382;
        --switch-background: #101722;

        display: block;
        max-width: var(--switch-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .switch-button {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--switch-hot-color) 14%, transparent),
            transparent 44%
          ),
          linear-gradient(
            118deg,
            color-mix(in srgb, var(--switch-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--switch-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--switch-hot-color) 14%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--switch-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--switch-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--switch-state-color) var(--switch-border-strength),
            transparent
          );
        border-radius: var(--switch-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--switch-inner-ring-width)
            color-mix(
              in srgb,
              var(--switch-state-color) var(--switch-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--switch-outer-blur)
            color-mix(
              in srgb,
              var(--switch-state-color) var(--switch-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 8px;
        grid-template-columns: 42px minmax(0, 1fr) 18px;
        min-height: var(--switch-card-height);
        overflow: hidden;
        padding: 8px 12px 8px 9px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .switch-button::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--switch-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--switch-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--switch-warm-color) 10%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--switch-hot-color) 12%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--switch-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .switch-button::after {
        border: 1px solid
          color-mix(in srgb, var(--switch-state-color) 86%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 11px
            color-mix(in srgb, var(--switch-state-color) 34%, transparent),
          0 0 10px
            color-mix(in srgb, var(--switch-state-color) 60%, transparent),
          0 0 22px
            color-mix(in srgb, var(--switch-state-color) 44%, transparent),
          0 0 46px
            color-mix(in srgb, var(--switch-state-color) 26%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--switch-on-opacity);
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
          color-mix(in srgb, var(--switch-state-color) 52%, transparent);
        box-shadow:
          0 0 6px
            color-mix(in srgb, var(--switch-state-color) 62%, transparent),
          0 0 18px
            color-mix(in srgb, var(--switch-state-color) 46%, transparent),
          0 0 38px
            color-mix(in srgb, var(--switch-state-color) 28%, transparent);
        inset: 2px;
        opacity: var(--switch-on-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--switch-state-color) 20%, transparent),
            transparent 70%
          );
        filter: blur(13px);
        inset: 7px;
        opacity: var(--switch-on-opacity);
        z-index: 0;
      }

      .icon-shell,
      .content,
      .status-dot {
        position: relative;
        z-index: 2;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--switch-state-color) 24%, transparent),
            transparent 72%
          ),
          color-mix(in srgb, var(--switch-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--switch-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--switch-state-color);
        display: inline-flex;
        height: 36px;
        justify-content: center;
        width: 36px;
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

      .status-dot {
        align-self: center;
        background: color-mix(in srgb, var(--switch-state-color) 82%, #ffffff 2%);
        border-radius: 999px;
        box-shadow:
          0 0 10px color-mix(in srgb, var(--switch-state-color) 54%, transparent),
          0 0 20px color-mix(in srgb, var(--switch-state-color) 28%, transparent);
        height: 8px;
        justify-self: end;
        opacity: var(--switch-dot-opacity);
        width: 8px;
      }

      .switch-button:focus-visible {
        outline: 2px solid var(--switch-state-color);
        outline-offset: 3px;
      }

      .switch-button.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .switch-button.on.animated::after {
        animation: switch-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes switch-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .switch-button.on.animated::after {
          animation: none;
        }
      }
    `;
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement('glow-switch-card-editor');
  }

  public static getStubConfig(_: unknown, entities: string[]) {
    const [switchEntity] = entities.filter((entity) =>
      entity.startsWith('switch.'),
    );

    return {
      entity: switchEntity ?? '',
    };
  }

  public setConfig(config: GlowSwitchCardConfig): void {
    if (!config?.entity) {
      throw new Error('Entity is required');
    }

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    this.style.setProperty(
      '--switch-card-width',
      this.config.fill_container ? '100%' : this.config.width ?? '260px',
    );
    this.style.setProperty('--switch-card-height', this.config.height ?? '64px');
    this.style.setProperty(
      '--switch-card-radius',
      this.config.border_radius ?? '999px',
    );
    this.style.setProperty('--switch-on-color', this.config.on_color ?? '#45d158');
    this.style.setProperty('--switch-off-color', this.config.off_color ?? '#697382');
    this.style.setProperty(
      '--switch-background',
      this.config.background ?? '#101722',
    );
  }

  public getCardSize(): number {
    return 1;
  }

  private get entity(): SwitchEntity | undefined {
    return this.hass?.states[this.config.entity];
  }

  private get isOn(): boolean {
    if (this.optimisticOn !== undefined) {
      return this.optimisticOn;
    }

    return this.entity?.state === 'on';
  }

  private get isUnavailable(): boolean {
    return !this.entity || ['unavailable', 'unknown'].includes(this.entity.state);
  }

  private get domain(): string {
    return this.config.entity.split('.')[0] || 'switch';
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

    return this.isOn ? 'On' : 'Off';
  }

  private get icon(): string {
    return (
      this.config.icon ||
      this.entity?.attributes.icon ||
      DEFAULT_CONFIG.icon ||
      'mdi:toggle-switch'
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

  private setOptimisticOn(on: boolean): void {
    window.clearTimeout(this.optimisticTimer);
    this.optimisticOn = on;
    this.optimisticTimer = window.setTimeout(() => {
      this.optimisticOn = undefined;
    }, 1800);
  }

  private clearOptimisticOn(): void {
    window.clearTimeout(this.optimisticTimer);
    this.optimisticOn = undefined;
  }

  private trackServiceResult(result: Promise<unknown> | void): void {
    if (result && typeof result.catch === 'function') {
      result.catch(() => this.clearOptimisticOn());
    }
  }

  private performAction(action: ActionMode | undefined): void {
    if (this.isUnavailable || !action || action === 'none') {
      return;
    }

    if (action === 'more-info') {
      this.dispatchMoreInfo();
      return;
    }

    this.setOptimisticOn(!this.isOn);
    this.trackServiceResult(
      this.hass?.callService(this.domain, 'toggle', {
        entity_id: this.config.entity,
      }),
    );
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
      ? this.config.on_color ?? '#45d158'
      : this.config.off_color ?? '#697382';
    const onOpacity = this.isOn ? '1' : '0';

    return html`
      <ha-card
        style="
          --switch-state-color: ${stateColor};
          --switch-warm-color: ${this.isOn
            ? 'color-mix(in srgb, ' + stateColor + ' 86%, #a8ffb2)'
            : stateColor};
          --switch-hot-color: ${this.isOn
            ? 'color-mix(in srgb, ' + stateColor + ' 80%, #00ff66)'
            : stateColor};
          --switch-on-opacity: ${onOpacity};
          --switch-dot-opacity: ${this.isOn ? '1' : '0.26'};
          --switch-border-strength: ${this.isOn ? '78%' : '24%'};
          --switch-inner-ring-width: ${this.isOn ? '1px' : '0px'};
          --switch-inner-ring-strength: ${this.isOn ? '28%' : '0%'};
          --switch-outer-blur: ${this.isOn ? '30px' : '0'};
          --switch-outer-strength: ${this.isOn ? '28%' : '0%'};
        "
      >
        <button
          type="button"
          class="switch-button ${this.isOn ? 'on' : 'off'} ${this.isUnavailable
            ? 'unavailable'
            : ''} ${this.config.animated ? 'animated' : ''}"
          aria-label=${this.displayName}
          @click=${this.handleClick}
          @pointerdown=${this.handlePointerDown}
          @pointerup=${this.handlePointerUp}
          @pointerleave=${this.handlePointerUp}
          @pointercancel=${this.handlePointerUp}
        >
          <span class="ambient-glow"></span>
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
          <span class="status-dot"></span>
        </button>
      </ha-card>
    `;
  }
}

if (!customElements.get('glow-switch-card')) {
  customElements.define('glow-switch-card', GlowSwitchCard);
}

class GlowSwitchCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  public hass?: HomeAssistant;
  private config: Partial<GlowSwitchCardConfig> = {};

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

  public setConfig(config: GlowSwitchCardConfig): void {
    this.config = { ...config };
  }

  private updateConfig(patch: Partial<GlowSwitchCardConfig>): void {
    const next = { ...this.config, ...patch };
    Object.keys(next).forEach((key) => {
      const typedKey = key as keyof GlowSwitchCardConfig;
      if (next[typedKey] === '') {
        delete next[typedKey];
      }
    });
    this.config = next;
    fireConfigChanged(this, next);
  }

  private formChanged(event: Event): void {
    const customEvent = event as CustomEvent<{
      value?: Partial<GlowSwitchCardConfig>;
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
    } as Partial<GlowSwitchCardConfig>);
  }

  private renderTextInput(
    label: string,
    key: keyof GlowSwitchCardConfig,
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
    key: keyof GlowSwitchCardConfig,
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
    key: keyof GlowSwitchCardConfig,
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
    key: keyof GlowSwitchCardConfig,
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
        selector: { entity: { domain: 'switch' } },
      },
    ];
    const labels: Record<string, string> = {
      entity: 'Switch Entity',
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
            ${this.renderTextInput('Name', 'name', 'Coffee Maker')}
            ${this.renderIconPicker('Icon', 'icon')}
            ${this.renderTextInput('Width', 'width', '260px')}
            ${this.renderTextInput('Height', 'height', '64px')}
            ${this.renderTextInput('Radius', 'border_radius', '999px')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Fill Container', 'fill_container', false)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput('On Color', 'on_color', '#45d158')}
            ${this.renderTextInput('Off Color', 'off_color', '#697382')}
            ${this.renderTextInput('Background', 'background', '#101722')}
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

if (!customElements.get('glow-switch-card-editor')) {
  customElements.define('glow-switch-card-editor', GlowSwitchCardEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    'glow-switch-card': GlowSwitchCard;
    'glow-switch-card-editor': GlowSwitchCardEditor;
  }

  interface Window {
    customCards?: unknown[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  preview: true,
  type: 'glow-switch-card',
  name: 'Glow Switch Card',
  description: 'A compact glowing switch card for Home Assistant.',
});
