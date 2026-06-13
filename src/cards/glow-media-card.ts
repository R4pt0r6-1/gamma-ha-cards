import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';

type MediaPlayerEntity = {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    icon?: string;
    source?: string;
    app_name?: string;
    app_id?: string;
    [key: string]: unknown;
  };
};

type HomeAssistant = {
  states: Record<string, MediaPlayerEntity | undefined>;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ) => Promise<unknown> | void;
};

type ActionMode = 'toggle' | 'more-info' | 'none';

type ActionObject = {
  action: ActionMode;
  entity?: string;
};

type CallServiceAction = {
  action: 'call-service';
  service: string;
  target?: Record<string, unknown>;
  service_data?: Record<string, unknown>;
  data?: Record<string, unknown>;
};

type ActionConfig = ActionMode | ActionObject | CallServiceAction;

interface GlowMediaCardConfig {
  type?: string;
  entity: string;
  name?: string;
  icon?: string;
  width?: string;
  fill_container?: boolean;
  height?: string;
  border_radius?: string;
  show_state?: boolean;
  show_source?: boolean;
  active_color?: string;
  idle_color?: string;
  off_color?: string;
  background?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  animated?: boolean;
  active_states?: string[];
  off_states?: string[];
}

type ConfigElement = HTMLInputElement & {
  checked?: boolean;
  configValue?: keyof GlowMediaCardConfig;
};

const DEFAULT_CONFIG: Omit<GlowMediaCardConfig, 'entity'> = {
  icon: 'mdi:television-play',
  width: '280px',
  fill_container: false,
  height: '120px',
  border_radius: '22px',
  show_state: true,
  show_source: true,
  active_color: '#ff8a1c',
  idle_color: '#45d158',
  off_color: '#697382',
  background: '#101722',
  tap_action: 'more-info',
  hold_action: 'more-info',
  animated: true,
  active_states: ['on', 'playing', 'paused', 'buffering', 'idle'],
  off_states: ['off', 'standby', 'unavailable', 'unknown'],
};

const ACTIONS: Array<ActionMode | 'call-service'> = [
  'more-info',
  'none',
  'toggle',
  'call-service',
];

function fireConfigChanged(
  element: HTMLElement,
  config: Partial<GlowMediaCardConfig>,
): void {
  element.dispatchEvent(
    new CustomEvent('config-changed', {
      detail: { config },
      bubbles: true,
      composed: true,
    }),
  );
}

export class GlowMediaCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    holdActive: { state: true },
  };

  public hass?: HomeAssistant;
  private config!: GlowMediaCardConfig;
  private holdTimer?: number;
  private holdActive = false;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --media-card-width: 280px;
        --media-card-height: 120px;
        --media-card-radius: 22px;
        --media-active-color: #ff8a1c;
        --media-idle-color: #45d158;
        --media-off-color: #697382;
        --media-background: #101722;

        display: block;
        max-width: var(--media-card-width);
        width: 100%;
      }

      :host([interactive]) {
        cursor: pointer;
      }

      :host([interactive]) ha-card,
      :host([interactive]) .media-button {
        cursor: pointer;
      }

      :host([unavailable]) {
        cursor: default;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      ha-card.unavailable {
        cursor: default;
      }

      .media-button {
        all: unset;
        cursor: default;
        display: grid;
        grid-template-columns: 86px 1fr;
        gap: 16px;
        min-height: 100%;
        position: relative;
        width: 100%;
        text-align: left;
      }

      .media-button::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 42%,
            color-mix(in srgb, var(--media-warm-color) 10%, transparent) 72%,
            color-mix(in srgb, var(--media-hot-color) 25%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--media-warm-color) 9%, transparent),
            transparent 34%,
            transparent 70%,
            color-mix(in srgb, var(--media-hot-color) 11%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--media-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .media-button::after {
        border: 1px solid
          color-mix(in srgb, var(--media-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--media-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--media-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--media-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--media-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--media-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--media-state-color) 18%, transparent);
        border-radius: inherit;
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--media-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--media-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--media-state-color) 8%, transparent);
        content: '';
        inset: 2px;
        opacity: var(--media-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--media-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
        inset: 7px;
        opacity: var(--media-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 0;
      }

      .media-button.on.animated::after {
        animation: glow-breathe 3s ease-in-out infinite;
      }

      .media-button.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.6;
      }

      .icon-shell,
      .content {
        position: relative;
        z-index: 2;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--media-state-color) 24%, transparent),
            transparent 70%
          ),
          color-mix(in srgb, var(--media-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--media-state-color) 26%, transparent);
        border-radius: 16px;
        color: var(--media-icon-color);
        display: inline-flex;
        font: inherit;
        height: 56px;
        justify-content: center;
        width: 56px;
        transition: color 160ms ease, opacity 160ms ease;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 28px;
        color: currentColor;
        opacity: var(--media-icon-opacity, 1);
      }

      .content {
        align-self: center;
        display: grid;
        gap: 8px;
        min-width: 0;
        width: 100%;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 16px;
        font-weight: 700;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 13px;
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .details {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 13px;
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .media-button:focus-visible {
        outline: 2px solid var(--media-state-color);
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
        .media-button.on.animated::after {
          animation: none;
        }
      }
    `;
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement('glow-media-card-editor');
  }

  public static getStubConfig(_: unknown, entities: string[]) {
    const [mediaEntity] = entities.filter((entity) =>
      entity.startsWith('media_player.'),
    );

    return {
      entity: mediaEntity ?? '',
    };
  }

  public setConfig(config: GlowMediaCardConfig): void {
    if (!config?.entity) {
      throw new Error('Entity is required');
    }

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    this.style.setProperty(
      '--media-card-width',
      this.config.fill_container ? '100%' : this.config.width ?? '280px',
    );
    this.style.setProperty(
      '--media-card-height',
      this.config.height ?? '120px',
    );
    this.style.setProperty(
      '--media-card-radius',
      this.config.border_radius ?? '22px',
    );
    this.style.setProperty(
      '--media-active-color',
      this.config.active_color ?? '#ff8a1c',
    );
    this.style.setProperty(
      '--media-idle-color',
      this.config.idle_color ?? '#45d158',
    );
    this.style.setProperty(
      '--media-off-color',
      this.config.off_color ?? '#697382',
    );
    this.style.setProperty(
      '--media-background',
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
      max_rows: 2,
      min_columns: 3,
      max_columns: 12,
    };
  }

  private get entity(): MediaPlayerEntity | undefined {
    return this.hass?.states[this.config.entity];
  }

  private get state(): string {
    return String(this.entity?.state ?? 'unknown').toLowerCase();
  }

  private get activeStates(): string[] {
    return Array.isArray(this.config.active_states)
      ? this.config.active_states.map((state) => String(state).toLowerCase())
      : DEFAULT_CONFIG.active_states ?? [];
  }

  private get offStates(): string[] {
    return Array.isArray(this.config.off_states)
      ? this.config.off_states.map((state) => String(state).toLowerCase())
      : DEFAULT_CONFIG.off_states ?? [];
  }

  private get isActive(): boolean {
    return this.activeStates.includes(this.state);
  }

  private get isUnavailable(): boolean {
    return (
      !this.entity || ['unavailable', 'unknown'].includes(this.state)
    );
  }

  private get displayName(): string {
    return (
      this.config.name ||
      this.entity?.attributes.friendly_name ||
      this.config.entity
    );
  }

  private get displayState(): string {
    if (!this.entity) {
      return 'Unavailable';
    }

    const rawState = this.entity.state || 'unknown';
    return rawState
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private get sourceText(): string | undefined {
    if (!this.config.show_source) {
      return undefined;
    }

    const attrs = this.entity?.attributes;
    const maybeSource = String(attrs?.source ?? '').trim();
    const maybeAppName = String(attrs?.app_name ?? '').trim();
    const maybeAppId = String(attrs?.app_id ?? '').trim();

    return maybeSource || maybeAppName || maybeAppId || undefined;
  }

  private get stateColor(): string {
    if (!this.isActive) {
      return this.config.off_color ?? '#697382';
    }

    if (this.state === 'idle') {
      return this.config.idle_color ?? '#45d158';
    }

    return this.config.active_color ?? '#ff8a1c';
  }

  private get icon(): string {
    return (
      this.config.icon ||
      this.entity?.attributes.icon ||
      DEFAULT_CONFIG.icon ||
      'mdi:television-play'
    );
  }

  private performAction(action: ActionConfig | undefined): void {
    if (!action) {
      return;
    }

    if (typeof action === 'string') {
      if (action === 'more-info') {
        this.dispatchMoreInfo();
        return;
      }

      if (action === 'toggle') {
        this.performToggle();
        return;
      }

      return;
    }

    if (action.action === 'more-info') {
      this.dispatchMoreInfo();
      return;
    }

    if (action.action === 'toggle') {
      this.performToggle();
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

      if (!Object.prototype.hasOwnProperty.call(serviceData, 'entity_id')) {
        serviceData.entity_id = this.config.entity;
      }

      if (action.target) {
        this.hass?.callService(domain, service, serviceData, action.target);
      } else {
        this.hass?.callService(domain, service, serviceData);
      }
      return;
    }
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
    if (this.holdActive) {
      this.holdActive = false;
      return;
    }
  }

  private handlePointerCancel(): void {
    window.clearTimeout(this.holdTimer);
    this.holdActive = false;
  }

  private handleClick(): void {
    if (this.holdActive) {
      return;
    }

    this.performAction(this.config.tap_action);
  }

  private performToggle(): void {
    if (this.isUnavailable) {
      return;
    }

    const supportedFeatures = Number(
      this.entity?.attributes.supported_features ?? 0,
    );
    const hasToggleSupport = Boolean(supportedFeatures & 1);
    const state = this.state;

    if (hasToggleSupport) {
      this.hass?.callService('media_player', 'toggle', {
        entity_id: this.config.entity,
      });
      return;
    }

    if (['off', 'standby'].includes(state)) {
      this.hass?.callService('media_player', 'turn_on', {
        entity_id: this.config.entity,
      });
      return;
    }

    if (['on', 'playing', 'paused', 'buffering', 'idle'].includes(state)) {
      this.hass?.callService('media_player', 'turn_off', {
        entity_id: this.config.entity,
      });
      return;
    }
  }

  protected render(): TemplateResult {
    if (!this.config) {
      return html``;
    }

    const active = this.isActive && !this.isUnavailable;
    const displaySource = this.sourceText;
    this.toggleAttribute('unavailable', this.isUnavailable);
    this.toggleAttribute(
      'interactive',
      !this.isUnavailable && this.config.tap_action !== 'none',
    );

    return html`
      <ha-card
        class=${this.isUnavailable ? 'unavailable' : ''}
        style="
          --media-state-color: ${this.stateColor};
          --media-warm-color: ${active
            ? 'color-mix(in srgb, ' + this.stateColor + ' 86%, #ffd26a)'
            : this.stateColor};
          --media-hot-color: ${active
            ? 'color-mix(in srgb, ' + this.stateColor + ' 82%, #ff4f00)'
            : this.stateColor};
          --media-border-strength: ${active ? '26%' : '18%'};
          --media-inner-ring-width: ${active ? '1px' : '0px'};
          --media-inner-ring-strength: ${active ? '8%' : '0%'};
          --media-outer-blur: ${active ? '50px' : '0'};
          --media-outer-strength: ${active ? '10%' : '0%'};
          --media-on-opacity: ${active ? '1' : '0'};
          --media-icon-color: ${this.stateColor};
          --media-icon-opacity: ${active ? '1' : '0.55'};
        "
      >
        <button
          type="button"
          class="media-button ${active ? 'on' : 'off'} ${this.isUnavailable ? 'unavailable' : ''} ${this.config.animated ? 'animated' : ''}"
          aria-label=${this.displayName}
          @click=${this.handleClick}
          @pointerdown=${this.handlePointerDown}
          @pointerup=${this.handlePointerUp}
          @pointercancel=${this.handlePointerCancel}
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
            ${displaySource
              ? html`<span class="details">${displaySource}</span>`
              : this.config.show_source && !this.config.show_state
              ? html`<span class="details">${this.displayState}</span>`
              : nothing}
          </span>
        </button>
      </ha-card>
    `;
  }
}

if (!customElements.get('glow-media-card')) {
  customElements.define('glow-media-card', GlowMediaCard);
}

class GlowMediaCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  public hass?: HomeAssistant;
  private config: Partial<GlowMediaCardConfig> = {};

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

  public setConfig(config: GlowMediaCardConfig): void {
    this.config = { ...config };
  }

  private updateConfig(patch: Partial<GlowMediaCardConfig>): void {
    const next = { ...this.config, ...patch };
    Object.keys(next).forEach((key) => {
      const typedKey = key as keyof GlowMediaCardConfig;
      if (next[typedKey] === '') {
        delete next[typedKey];
      }
    });
    this.config = next;
    fireConfigChanged(this, next);
  }

  private formChanged(event: Event): void {
    const customEvent = event as CustomEvent<{
      value?: Partial<GlowMediaCardConfig>;
    }>;

    if (!customEvent.detail?.value) {
      return;
    }

    this.updateConfig(customEvent.detail.value);
  }

  private valueChanged(event: Event): void {
    const target = event.target as ConfigElement;

    if (!target?.configValue) {
      return;
    }

    const value = target.checked !== undefined ? target.checked : target.value;

    if (target.configValue === 'active_states' || target.configValue === 'off_states') {
      this.updateConfig({
        [target.configValue]: String(value)
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      } as Partial<GlowMediaCardConfig>);
      return;
    }

    if (
      (target.configValue === 'tap_action' ||
        target.configValue === 'hold_action') &&
      typeof value === 'string' &&
      value === 'call-service'
    ) {
      this.updateConfig({
        [target.configValue]: {
          action: 'call-service',
          service: '',
        },
      } as Partial<GlowMediaCardConfig>);
      return;
    }

    this.updateConfig({
      [target.configValue]: value,
    } as Partial<GlowMediaCardConfig>);
  }

  private renderEntityPicker(
    label: string,
    key: keyof GlowMediaCardConfig,
  ): TemplateResult {
    return html`
      <ha-selector
        class="full"
        .hass=${this.hass}
        .label=${label}
        .selector=${{ entity: { domain: 'media_player' } }}
        .value=${this.config[key] ?? ''}
        .configValue=${key}
        @value-changed=${this.valueChanged}
      ></ha-selector>
    `;
  }

  private renderTextInput(
    label: string,
    key: keyof GlowMediaCardConfig,
    placeholder = '',
  ): TemplateResult {
    const value = this.config[key];
    return html`
      <ha-textfield
        .label=${label}
        .placeholder=${placeholder}
        .value=${Array.isArray(value) ? value.join(', ') : value ?? ''}
        .configValue=${key}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }

  private renderIconPicker(
    label: string,
    key: keyof GlowMediaCardConfig,
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
    key: keyof GlowMediaCardConfig,
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
    key: keyof GlowMediaCardConfig,
    options: string[],
    value: string,
  ): TemplateResult {
    const currentValue = this.config[key];
    const selectedValue =
      typeof currentValue === 'string'
        ? currentValue
        : (currentValue as CallServiceAction | undefined)?.action ?? value;

    return html`
      <label>
        <span>${label}</span>
        <select
          .value=${selectedValue}
          .configValue=${key}
          @change=${this.valueChanged}
        >
          ${options.map(
            (option) => html`
              <option value=${option}>${option}</option>
            `,
          )}
        </select>
      </label>
    `;
  }

  private getActionValue(key: 'tap_action' | 'hold_action'): ActionConfig | undefined {
    return this.config[key];
  }

  private getCallServiceAction(
    key: 'tap_action' | 'hold_action',
  ): CallServiceAction {
    const action = this.getActionValue(key);

    if (typeof action === 'object' && action.action === 'call-service') {
      return {
        action: 'call-service',
        service: action.service ?? '',
        target: action.target,
        service_data: action.service_data ?? action.data,
      };
    }

    return {
      action: 'call-service',
      service: '',
    };
  }

  private renderActionFields(
    key: 'tap_action' | 'hold_action',
  ): TemplateResult {
    const action = this.getActionValue(key);
    const actionType = typeof action === 'string' ? action : action?.action;

    if (actionType === 'call-service') {
      const callAction = this.getCallServiceAction(key);
      return html`
        <div class="grid full">
          <div>
            <ha-textfield
              .label=${key === 'tap_action' ? 'Tap Service' : 'Hold Service'}
              .placeholder=${'script.sony_source_test'}
              .value=${callAction.service ?? ''}
              data-action-key=${key}
              data-action-field="service"
              @input=${this.actionFieldChanged}
            ></ha-textfield>
          </div>
          <div>
            <ha-selector
              .hass=${this.hass}
              .label=${key === 'tap_action' ? 'Tap Target Entity' : 'Hold Target Entity'}
              .selector=${{ entity: {} }}
              .value=${String(callAction.target?.entity_id ?? '')}
              data-action-key=${key}
              data-action-field="target_entity"
              @value-changed=${this.actionFieldChanged}
            ></ha-selector>
          </div>
          <div class="full">
            <label>
              ${key === 'tap_action' ? 'Tap Data' : 'Hold Data'}
              <textarea
                .value=${this.actionDataToString(callAction)}
                data-action-key=${key}
                data-action-field="data"
                @change=${this.actionFieldChanged}
                rows="5"
                style="width:100%;margin-top:6px;padding:10px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:inherit;"
              ></textarea>
            </label>
          </div>
        </div>
      `;
    }

    if (actionType === 'more-info') {
      const existingEntity = this.config.entity;
      return html`
        <div class="grid full">
          <ha-selector
            .hass=${this.hass}
            .label=${key === 'tap_action' ? 'Tap Entity' : 'Hold Entity'}
            .selector=${{ entity: { domain: 'media_player' } }}
            .value=${existingEntity ?? ''}
            data-action-key=${key}
            data-action-field="entity"
            @value-changed=${this.actionFieldChanged}
          ></ha-selector>
        </div>
      `;
    }

    return html``;
  }

  private actionDataToString(action: CallServiceAction): string {
    const data = action.service_data ?? action.data;
    if (!data || typeof data !== 'object') {
      return '';
    }

    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return '';
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
    } else if (actionField === 'target_entity') {
      const targetObj = rawValue
        ? { entity_id: rawValue }
        : undefined;
      if (targetObj) {
        (action as CallServiceAction).target = {
          ...(action as CallServiceAction).target,
          ...targetObj,
        };
      } else {
        delete (action as CallServiceAction).target;
      }
    } else if (actionField === 'data') {
      const parsed = this.parseActionData(rawValue);
      if (parsed === undefined && rawValue.trim().length > 0) {
        return;
      }
      delete (action as CallServiceAction).service_data;
      delete (action as CallServiceAction).data;
      if (parsed && Object.keys(parsed).length) {
        (action as CallServiceAction).data = parsed;
      }
    } else if (actionField === 'entity') {
      if (rawValue) {
        (action as ActionObject).entity = rawValue;
      } else {
        delete (action as ActionObject).entity;
      }
    }

    this.updateConfig({ [actionKey]: action } as Partial<GlowMediaCardConfig>);
  }

  private parseActionData(value: string): Record<string, unknown> | undefined {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }

    try {
      return JSON.parse(trimmed);
    } catch {
      const lines = trimmed.split(/\r?\n/);
      const result: Record<string, unknown> = {};
      for (const line of lines) {
        const match = line.match(/^\s*([a-zA-Z0-9_]+):\s*(.*)$/);
        if (!match) {
          return undefined;
        }
        const [, key, raw] = match;
        let parsed: unknown = raw;
        if (/^\d+$/.test(raw)) {
          parsed = Number(raw);
        } else if (/^(true|false)$/i.test(raw)) {
          parsed = raw.toLowerCase() === 'true';
        } else if (/^\[.*\]$/.test(raw) || /^\{.*\}$/.test(raw)) {
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
        }
        result[key] = parsed;
      }
      return result;
    }
  }

  private renderEntityForm(): TemplateResult {
    const schema = [
      {
        name: 'entity',
        required: true,
        selector: { entity: { domain: 'media_player' } },
      },
    ];
    const labels: Record<string, string> = {
      entity: 'Media Player Entity',
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
            ${this.renderTextInput('Name', 'name', 'Living Room TV')}
            ${this.renderIconPicker('Icon', 'icon')}
            ${this.renderTextInput('Width', 'width', '280px')}
            ${this.renderTextInput('Height', 'height', '120px')}
            ${this.renderTextInput('Radius', 'border_radius', '22px')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Fill Container', 'fill_container', false)}
            ${this.renderSwitch('Show State', 'show_state', true)}
            ${this.renderSwitch('Show Source', 'show_source', true)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput('Active Color', 'active_color', '#ff8a1c')}
            ${this.renderTextInput('Idle Color', 'idle_color', '#45d158')}
            ${this.renderTextInput('Off Color', 'off_color', '#697382')}
            ${this.renderTextInput('Background', 'background', '#101722')}
          </div>
          <div class="grid">
            ${this.renderTextInput(
              'Active States',
              'active_states',
              'on, playing, paused, buffering, idle',
            )}
            ${this.renderTextInput(
              'Off States',
              'off_states',
              'off, standby, unavailable, unknown',
            )}
            ${this.renderSwitch('Animated Glow', 'animated', true)}
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
          ${this.renderActionFields('tap_action')}
          ${this.renderActionFields('hold_action')}
        </section>
      </div>
    `;
  }
}

if (!customElements.get('glow-media-card-editor')) {
  customElements.define('glow-media-card-editor', GlowMediaCardEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    'glow-media-card': GlowMediaCard;
    'glow-media-card-editor': GlowMediaCardEditor;
  }

  interface Window {
    customCards?: unknown[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  preview: true,
  type: 'glow-media-card',
  name: 'Glow Media Card',
  description: 'A glowing media player card for TV and AV devices.',
});
