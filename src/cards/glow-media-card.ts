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
  callWS?: <T = unknown>(message: Record<string, unknown>) => Promise<T>;
};

type ActionMode = 'toggle' | 'more-info' | 'none' | 'script' | 'navigate';

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

type LovelaceDashboard = {
  id?: string;
  title?: string;
  url_path?: string;
};

type LovelaceView = {
  title?: string;
  path?: string;
};

type LovelaceConfig = {
  views?: LovelaceView[];
};

type NavigationOption = {
  label: string;
  path: string;
};

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

type ConfigElement =
  | (HTMLInputElement & {
      checked?: boolean;
      configValue?: keyof GlowMediaCardConfig;
    })
  | (HTMLSelectElement & {
      configValue?: keyof GlowMediaCardConfig;
    });

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

const ACTIONS: Array<ActionMode | 'call-service' | 'multi'> = [
  'more-info',
  'none',
  'toggle',
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
    navigationOptions: { state: true },
  };

  public hass?: HomeAssistant;
  private config: Partial<GlowMediaCardConfig> = {};
  private navigationOptions: NavigationOption[] = [];
  private navigationOptionsLoaded = false;
  private navigationOptionsLoading = false;

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

      .navigation-select-field {
        display: grid;
        gap: 6px;
      }

      .navigation-select-label {
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 600;
        line-height: 1.2;
      }

      .navigation-select {
        appearance: none;
        -webkit-appearance: none;
        background:
          linear-gradient(45deg, transparent 50%, currentColor 50%),
          linear-gradient(135deg, currentColor 50%, transparent 50%),
          color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        background-position:
          calc(100% - 18px) 50%,
          calc(100% - 13px) 50%,
          0 0;
        background-repeat: no-repeat;
        background-size:
          5px 5px,
          5px 5px,
          100% 100%;
        border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 4px;
        box-sizing: border-box;
        color: var(--primary-text-color);
        cursor: pointer;
        font: inherit;
        min-height: 48px;
        padding: 0 34px 0 12px;
      }

      .navigation-select:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }

      .navigation-select option {
        background: var(--card-background-color, #1c1c1c);
        color: var(--primary-text-color, #fff);
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

  protected updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('hass')) {
      void this.loadNavigationOptions();
    }
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

  private async loadNavigationOptions(): Promise<void> {
    if (
      this.navigationOptionsLoaded ||
      this.navigationOptionsLoading ||
      !this.hass?.callWS
    ) {
      return;
    }

    this.navigationOptionsLoading = true;

    try {
      const dashboards = await this.hass.callWS<LovelaceDashboard[]>({
        type: 'lovelace/dashboards/list',
      });
      const options: NavigationOption[] = [];
      const paths = new Set<string>();
      const dashboardList = Array.isArray(dashboards) && dashboards.length
        ? dashboards
        : [{ title: 'Overview', url_path: 'lovelace' }];

      for (const dashboard of dashboardList) {
        const dashboardPath = this.normalizeDashboardPath(
          dashboard.url_path || dashboard.id || 'lovelace',
        );
        const dashboardTitle = dashboard.title || dashboardPath;
        const config = await this.fetchLovelaceConfig(dashboardPath);
        const views = Array.isArray(config?.views) ? config.views : [];

        if (!views.length) {
          this.addNavigationOption(
            options,
            paths,
            `/${dashboardPath}`,
            dashboardTitle,
          );
          continue;
        }

        views.forEach((view, index) => {
          const viewPath = this.normalizeDashboardPath(
            view.path || String(index),
          );
          this.addNavigationOption(
            options,
            paths,
            `/${dashboardPath}/${viewPath}`,
            `${dashboardTitle} / ${view.title || view.path || `View ${index + 1}`}`,
          );
        });
      }

      this.navigationOptions = options;
      this.navigationOptionsLoaded = true;
    } catch {
      this.navigationOptions = [];
      this.navigationOptionsLoaded = true;
    } finally {
      this.navigationOptionsLoading = false;
    }
  }

  private async fetchLovelaceConfig(
    dashboardPath: string,
  ): Promise<LovelaceConfig | undefined> {
    if (!this.hass?.callWS) {
      return undefined;
    }

    const messages: Record<string, unknown>[] = [
      {
        type: 'lovelace/config',
        url_path: dashboardPath,
        force: false,
      },
    ];

    if (dashboardPath === 'lovelace') {
      messages.push({ type: 'lovelace/config', force: false });
    }

    for (const message of messages) {
      try {
        return await this.hass.callWS<LovelaceConfig>(message);
      } catch {
        // Try the next supported request shape.
      }
    }

    return undefined;
  }

  private normalizeDashboardPath(path: string): string {
    return String(path || 'lovelace').replace(/^\/+|\/+$/g, '') || 'lovelace';
  }

  private addNavigationOption(
    options: NavigationOption[],
    paths: Set<string>,
    path: string,
    label: string,
  ): void {
    if (paths.has(path)) {
      return;
    }

    paths.add(path);
    options.push({ label, path });
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
    const target = (event.currentTarget as HTMLElement) ||
      (event.target as HTMLElement);
    const configValue =
      target?.dataset?.configValue ||
      (target as ConfigElement).configValue;

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
    } else if (target instanceof HTMLTextAreaElement) {
      value = target.value;
    } else {
      value = (target as any).value;
    }

    if (configValue === 'active_states' || configValue === 'off_states') {
      this.updateConfig({
        [configValue]: String(value)
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      } as Partial<GlowMediaCardConfig>);
      return;
    }

    if ((configValue === 'tap_action' || configValue === 'hold_action')) {
      const selectedAction = String(value);
      if (selectedAction === 'call-service') {
        this.updateConfig(({
          [configValue]: {
            action: 'call-service',
            service: '',
          },
        } as unknown) as Partial<GlowMediaCardConfig>);
        return;
      }

      if (selectedAction === 'script') {
        this.updateConfig(({
          [configValue]: {
            action: 'call-service',
            service: 'script.turn_on',
          },
        } as unknown) as Partial<GlowMediaCardConfig>);
        return;
      }

      if (selectedAction === 'navigate') {
        this.updateConfig(({
          [configValue]: {
            action: 'navigate',
            navigation_path: '',
          },
        } as unknown) as Partial<GlowMediaCardConfig>);
        return;
      }

      if (selectedAction === 'multi') {
        this.updateConfig(({
          [configValue]: {
            action: 'multi',
            actions: [],
          },
        } as unknown) as Partial<GlowMediaCardConfig>);
        return;
      }

      this.updateConfig({
        [configValue]: selectedAction,
      } as Partial<GlowMediaCardConfig>);
      return;
    }

    this.updateConfig({
      [configValue]: value,
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
    let selectedValue =
      typeof currentValue === 'string'
        ? currentValue
        : (currentValue as CallServiceAction | undefined)?.action ?? value;

    if (
      (key === 'tap_action' || key === 'hold_action') &&
      this.isScriptAction(currentValue as ActionConfig | undefined)
    ) {
      selectedValue = 'script';
    }

    return html`
      <ha-select
        .label=${label}
        .value=${selectedValue}
        value=${selectedValue}
        data-config-value=${key}
        @change=${this.valueChanged}
        @closed=${(event: Event) => event.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${options.map(
          (option) => html`
            <mwc-list-item
              .value=${option}
              value=${option}
              ?selected=${option === selectedValue}
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

  private isScriptAction(action: ActionConfig | undefined): boolean {
    return (
      typeof action === 'object' &&
      action.action === 'call-service' &&
      action.service === 'script.turn_on'
    );
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

  private renderNavigationField(
    label: string,
    value: string,
    actionKey: 'tap_action' | 'hold_action',
    actionIndex?: number,
  ): TemplateResult {
    const handleNavigationChanged = (event: Event): void => {
      if (actionIndex === undefined) {
        this.actionFieldChanged(event);
      } else {
        this.multiActionFieldChanged(event);
      }
    };
    const hasKnownPath = this.navigationOptions.some(
      (option) => option.path === value,
    );

    return html`
      <div style="margin-top: 6px;">
        ${this.navigationOptions.length
          ? html`
              <label class="navigation-select-field">
                <span class="navigation-select-label">${label}</span>
                <select
                  class="navigation-select"
                  .value=${hasKnownPath ? value : ''}
                  data-action-key=${actionKey}
                  data-action-index=${actionIndex ?? ''}
                  data-action-field="navigation_path"
                  @change=${handleNavigationChanged}
                >
                  <option value="" ?selected=${!hasKnownPath} disabled>
                    Select dashboard view
                  </option>
                  ${this.navigationOptions.map(
                    (option) => html`
                      <option
                        value=${option.path}
                        ?selected=${option.path === value}
                      >
                        ${option.label}
                      </option>
                    `,
                  )}
                </select>
              </label>
            `
          : nothing}
        <ha-textfield
          .label=${this.navigationOptions.length ? 'Custom Path' : label}
          .placeholder=${'/lovelace/0'}
          .value=${value}
          data-action-key=${actionKey}
          data-action-index=${actionIndex ?? ''}
          data-action-field="navigation_path"
          @input=${handleNavigationChanged}
        ></ha-textfield>
      </div>
    `;
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
          ${this.renderNavigationField(
            'Navigation View',
            String((action as NavigateAction)?.navigation_path ?? ''),
            key,
          )}
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
    const target = (event.currentTarget || event.target) as HTMLElement & {
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

    const customEvent = event as CustomEvent<{
      item?: { value?: string };
      value?: string;
    }>;
    const rawValue =
      customEvent.detail?.value ??
      customEvent.detail?.item?.value ??
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
    } else if (actionField === 'navigation_path') {
      (action as NavigateAction).navigation_path = rawValue;
    }

    this.updateConfig({ [actionKey]: action } as Partial<GlowMediaCardConfig>);
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
                  value=${actionType}
                  data-action-key=${key}
                  data-action-index=${index}
                  data-action-field="action"
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
                        value=${option}
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
                      ${this.renderNavigationField(
                        'Navigation View',
                        String(
                          typeof action === 'object' &&
                            action.action === 'navigate'
                            ? action.navigation_path
                            : '',
                        ),
                        key,
                        index,
                      )}
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
      } as Partial<GlowMediaCardConfig>);
    }
  }

  private removeMultiAction(key: 'tap_action' | 'hold_action', index: number): void {
    const action = this.getActionValue(key);
    if (typeof action === 'object' && action.action === 'multi') {
      const multiAction = action as MultiAction;
      const newActions = multiAction.actions.filter((_, i) => i !== index);
      this.updateConfig({
        [key]: { action: 'multi', actions: newActions },
      } as Partial<GlowMediaCardConfig>);
    }
  }

  private multiActionFieldChanged(event: Event): void {
    const target = (event.currentTarget || event.target) as HTMLElement & {
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
    } as Partial<GlowMediaCardConfig>);
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
