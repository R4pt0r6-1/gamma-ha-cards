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

type HomeAssistant = {
  states: Record<string, ClimateEntity | undefined>;
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
  height: '72px',
  border_radius: '999px',
  show_state: true,
  show_current: true,
  show_controls: true,
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

export class GlowThermostatCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    holdActive: { state: true },
    optimisticTemperature: { state: true },
  };

  public hass?: HomeAssistant;
  private config!: GlowThermostatCardConfig;
  private holdTimer?: number;
  private optimisticTimer?: number;
  private holdActive = false;
  private handledControlPointer = false;
  private optimisticTemperature?: number;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --thermostat-card-width: 320px;
        --thermostat-card-height: 72px;
        --thermostat-card-radius: 999px;
        --thermostat-heat-color: #ff8a1c;
        --thermostat-cool-color: #2f80ff;
        --thermostat-idle-color: #45d158;
        --thermostat-off-color: #697382;
        --thermostat-background: #101722;

        display: block;
        max-width: var(--thermostat-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .thermostat {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--thermostat-hot-color) 14%, transparent),
            transparent 44%
          ),
          linear-gradient(
            118deg,
            color-mix(in srgb, var(--thermostat-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--thermostat-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--thermostat-hot-color) 14%, transparent) 100%
          ),
          linear-gradient(
            135deg,
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
        display: grid;
        gap: 9px;
        grid-template-columns: 42px minmax(0, 1fr) auto;
        min-height: var(--thermostat-card-height);
        overflow: hidden;
        padding: 8px 10px 8px 9px;
        position: relative;
        text-align: left;
        width: 100%;
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
          color-mix(in srgb, var(--thermostat-state-color) 86%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 11px
            color-mix(in srgb, var(--thermostat-state-color) 34%, transparent),
          0 0 10px
            color-mix(in srgb, var(--thermostat-state-color) 60%, transparent),
          0 0 22px
            color-mix(in srgb, var(--thermostat-state-color) 44%, transparent),
          0 0 46px
            color-mix(in srgb, var(--thermostat-state-color) 26%, transparent);
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
          color-mix(in srgb, var(--thermostat-state-color) 52%, transparent);
        box-shadow:
          0 0 6px
            color-mix(in srgb, var(--thermostat-state-color) 62%, transparent),
          0 0 18px
            color-mix(in srgb, var(--thermostat-state-color) 46%, transparent),
          0 0 38px
            color-mix(in srgb, var(--thermostat-state-color) 28%, transparent);
        inset: 2px;
        opacity: var(--thermostat-glow-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--thermostat-state-color) 20%, transparent),
            transparent 70%
          );
        filter: blur(13px);
        inset: 7px;
        opacity: var(--thermostat-glow-opacity);
        z-index: 0;
      }

      .icon-shell,
      .content,
      .controls {
        position: relative;
        z-index: 2;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--thermostat-state-color) 24%, transparent),
            transparent 72%
          ),
          color-mix(in srgb, var(--thermostat-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--thermostat-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--thermostat-state-color);
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

      .target {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 15px;
        font-weight: 650;
        line-height: 1.15;
        margin-top: 2px;
        white-space: nowrap;
      }

      .controls {
        align-items: center;
        align-self: center;
        background: rgb(255 255 255 / 6%);
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: 999px;
        display: inline-grid;
        gap: 2px;
        grid-template-columns: 30px 30px;
        padding: 3px;
      }

      .control {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 18px;
        font-weight: 650;
        height: 30px;
        justify-content: center;
        letter-spacing: 0;
        padding: 0;
        width: 30px;
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

      .thermostat:focus-visible,
      .control:focus-visible {
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

      @media (max-width: 520px) {
        .thermostat {
          grid-template-columns: 40px minmax(0, 1fr);
        }

        .controls {
          grid-column: 1 / -1;
          width: 100%;
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
    this.style.setProperty('--thermostat-card-height', this.config.height ?? '72px');
    this.style.setProperty(
      '--thermostat-card-radius',
      this.config.border_radius ?? '999px',
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
    return 1;
  }

  private get entity(): ClimateEntity | undefined {
    return this.hass?.states[this.config.entity];
  }

  private get isUnavailable(): boolean {
    return !this.entity || ['unavailable', 'unknown'].includes(this.entity.state);
  }

  private get isOff(): boolean {
    return this.entity?.state === 'off';
  }

  private get hvacAction(): string {
    return String(this.entity?.attributes.hvac_action || this.entity?.state || 'idle');
  }

  private get unit(): string {
    return String(this.entity?.attributes.temperature_unit || '°');
  }

  private get currentTemperature(): number | undefined {
    const value = this.entity?.attributes.current_temperature;

    return typeof value === 'number' ? value : undefined;
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

  private get icon(): string {
    return (
      this.config.icon ||
      this.entity?.attributes.icon ||
      DEFAULT_CONFIG.icon ||
      'mdi:thermostat'
    );
  }

  private get stateColor(): string {
    if (this.isOff || this.isUnavailable) {
      return this.config.off_color ?? '#697382';
    }

    if (this.hvacAction === 'cooling' || this.entity?.state === 'cool') {
      return this.config.cool_color ?? '#2f80ff';
    }

    if (this.hvacAction === 'heating' || this.entity?.state === 'heat') {
      return this.config.heat_color ?? '#ff8a1c';
    }

    return this.config.idle_color ?? '#45d158';
  }

  private formatTemperature(value: number): string {
    return `${Math.round(value * 10) / 10}${this.unit}`;
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
    }, 1800);
  }

  private clearOptimisticTemperature(): void {
    window.clearTimeout(this.optimisticTimer);
    this.optimisticTemperature = undefined;
  }

  private trackServiceResult(result: Promise<unknown> | void): void {
    if (result && typeof result.catch === 'function') {
      result.catch(() => this.clearOptimisticTemperature());
    }
  }

  private setTargetTemperature(temperature: number): void {
    if (this.isUnavailable || this.isOff) {
      return;
    }

    const min = toNumber(this.entity?.attributes.min_temp, -Infinity);
    const max = toNumber(this.entity?.attributes.max_temp, Infinity);
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

  private performAction(action: ActionMode | undefined): void {
    if (this.isUnavailable || !action || action === 'none') {
      return;
    }

    this.dispatchMoreInfo();
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

    return html`
      <ha-card
        style="
          --thermostat-state-color: ${stateColor};
          --thermostat-warm-color: ${this.hvacAction === 'cooling'
            ? 'color-mix(in srgb, ' + stateColor + ' 86%, #94d6ff)'
            : 'color-mix(in srgb, ' + stateColor + ' 86%, #ffd26a)'};
          --thermostat-hot-color: ${this.hvacAction === 'cooling'
            ? 'color-mix(in srgb, ' + stateColor + ' 80%, #4fb3ff)'
            : 'color-mix(in srgb, ' + stateColor + ' 80%, #ff4f00)'};
          --thermostat-glow-opacity: ${glowOpacity};
          --thermostat-border-strength: ${active ? '78%' : '24%'};
          --thermostat-inner-ring-width: ${active ? '1px' : '0px'};
          --thermostat-inner-ring-strength: ${active ? '28%' : '0%'};
          --thermostat-outer-blur: ${active ? '30px' : '0'};
          --thermostat-outer-strength: ${active ? '28%' : '0%'};
        "
      >
        <div
          class="thermostat ${active ? 'active' : 'off'} ${this.isUnavailable
            ? 'unavailable'
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
          <span class="icon-shell">
            <ha-icon icon=${this.icon}></ha-icon>
          </span>
          <span class="content">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state
              ? html`<span class="state">${this.displayState}</span>`
              : nothing}
            <span class="target">${this.formatTemperature(this.targetTemperature)}</span>
          </span>
          ${this.config.show_controls ? this.renderControls() : nothing}
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
            ${this.renderIconPicker('Icon', 'icon')}
            ${this.renderTextInput('Width', 'width', '320px')}
            ${this.renderTextInput('Height', 'height', '72px')}
            ${this.renderTextInput('Radius', 'border_radius', '999px')}
            ${this.renderNumberInput('Temperature Step', 'temperature_step', '1')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Fill Container', 'fill_container', false)}
            ${this.renderSwitch('Show State', 'show_state', true)}
            ${this.renderSwitch('Show Current', 'show_current', true)}
            ${this.renderSwitch('Show Controls', 'show_controls', true)}
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
  description: 'A compact thermostat card with instant setpoint controls.',
});
