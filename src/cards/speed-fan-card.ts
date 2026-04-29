import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';

type FanEntity = {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    icon?: string;
    percentage?: number;
    percentage_step?: number;
    [key: string]: unknown;
  };
};

type HomeAssistant = {
  states: Record<string, FanEntity | undefined>;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ) => Promise<unknown> | void;
};

type ActionMode = 'cycle' | 'more-info' | 'none';

interface SpeedFanCardConfig {
  type?: string;
  entity: string;
  name?: string;
  icon?: string;
  width?: string;
  fill_container?: boolean;
  height?: string;
  border_radius?: string;
  show_state?: boolean;
  show_speed_buttons?: boolean;
  off_label?: string;
  speed_1_label?: string;
  speed_2_label?: string;
  speed_3_label?: string;
  speed_1_percentage?: number;
  speed_2_percentage?: number;
  speed_3_percentage?: number;
  on_color?: string;
  off_color?: string;
  background?: string;
  tap_action?: ActionMode;
  hold_action?: 'more-info' | 'none';
  animated?: boolean;
}

type ConfigElement = HTMLInputElement & {
  checked?: boolean;
  configValue?: keyof SpeedFanCardConfig;
};

type FanLevel = 0 | 1 | 2 | 3;

const DEFAULT_CONFIG: Omit<SpeedFanCardConfig, 'entity'> = {
  icon: 'mdi:fan',
  width: '260px',
  fill_container: false,
  height: '64px',
  border_radius: '999px',
  show_state: true,
  show_speed_buttons: true,
  off_label: 'Off',
  speed_1_label: '1',
  speed_2_label: '2',
  speed_3_label: '3',
  speed_1_percentage: 33,
  speed_2_percentage: 66,
  speed_3_percentage: 100,
  on_color: '#45d158',
  off_color: '#697382',
  background: '#101722',
  tap_action: 'cycle',
  hold_action: 'more-info',
  animated: true,
};

const TAP_ACTIONS: ActionMode[] = ['cycle', 'more-info', 'none'];
const HOLD_ACTIONS: Array<'more-info' | 'none'> = ['more-info', 'none'];

function fireConfigChanged(
  element: HTMLElement,
  config: Partial<SpeedFanCardConfig>,
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

export class SpeedFanCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    holdActive: { state: true },
    optimisticLevel: { state: true },
  };

  public hass?: HomeAssistant;
  private config!: SpeedFanCardConfig;
  private holdTimer?: number;
  private optimisticTimer?: number;
  private holdActive = false;
  private optimisticLevel?: FanLevel;
  private handledSpeedPointer = false;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --fan-card-width: 260px;
        --fan-card-height: 64px;
        --fan-card-radius: 999px;
        --fan-on-color: #45d158;
        --fan-off-color: #697382;
        --fan-background: #101722;

        display: block;
        max-width: var(--fan-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .fan {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--fan-hot-color) 14%, transparent),
            transparent 44%
          ),
          linear-gradient(
            118deg,
            color-mix(in srgb, var(--fan-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--fan-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--fan-hot-color) 14%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--fan-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--fan-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--fan-state-color) var(--fan-border-strength),
            transparent
          );
        border-radius: var(--fan-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--fan-inner-ring-width)
            color-mix(
              in srgb,
              var(--fan-state-color) var(--fan-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--fan-outer-blur)
            color-mix(
              in srgb,
              var(--fan-state-color) var(--fan-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 9px;
        grid-template-columns: 42px minmax(0, 1fr) auto;
        min-height: var(--fan-card-height);
        overflow: hidden;
        padding: 8px 10px 8px 9px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .fan::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--fan-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--fan-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--fan-warm-color) 10%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--fan-hot-color) 12%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--fan-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .fan::after {
        border: 1px solid color-mix(in srgb, var(--fan-state-color) 86%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 11px color-mix(in srgb, var(--fan-state-color) 34%, transparent),
          0 0 10px color-mix(in srgb, var(--fan-state-color) 60%, transparent),
          0 0 22px color-mix(in srgb, var(--fan-state-color) 44%, transparent),
          0 0 46px color-mix(in srgb, var(--fan-state-color) 26%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--fan-on-opacity);
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
        border: 1px solid color-mix(in srgb, var(--fan-state-color) 52%, transparent);
        box-shadow:
          0 0 6px color-mix(in srgb, var(--fan-state-color) 62%, transparent),
          0 0 18px color-mix(in srgb, var(--fan-state-color) 46%, transparent),
          0 0 38px color-mix(in srgb, var(--fan-state-color) 28%, transparent);
        inset: 2px;
        opacity: var(--fan-on-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--fan-state-color) 20%, transparent),
            transparent 70%
          );
        filter: blur(13px);
        inset: 7px;
        opacity: var(--fan-on-opacity);
        z-index: 0;
      }

      .icon-shell,
      .content,
      .speed-buttons {
        position: relative;
        z-index: 2;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--fan-state-color) 24%, transparent),
            transparent 72%
          ),
          color-mix(in srgb, var(--fan-state-color) 14%, #ffffff 2%);
        border: 1px solid color-mix(in srgb, var(--fan-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--fan-state-color);
        display: inline-flex;
        height: 36px;
        justify-content: center;
        width: 36px;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 22px;
        color: currentColor;
      }

      .fan.on.animated .icon-shell ha-icon {
        animation: fan-spin 1.8s linear infinite;
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

      .speed-buttons {
        align-items: center;
        align-self: center;
        background: rgb(255 255 255 / 6%);
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: 999px;
        display: inline-grid;
        gap: 2px;
        grid-template-columns: repeat(4, minmax(26px, 1fr));
        min-width: 112px;
        padding: 3px;
      }

      .speed {
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
        height: 26px;
        justify-content: center;
        letter-spacing: 0;
        min-width: 0;
        padding: 0 6px;
      }

      .speed.active {
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--fan-state-color) 22%, transparent),
            transparent 78%
          ),
          color-mix(in srgb, var(--fan-state-color) 22%, #ffffff 3%);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 10%),
          0 0 14px color-mix(in srgb, var(--fan-state-color) 38%, transparent);
        color: var(--primary-text-color, #f4f7fb);
      }

      .fan:focus-visible,
      .speed:focus-visible {
        outline: 2px solid var(--fan-state-color);
        outline-offset: 3px;
      }

      .fan.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .fan.on.animated::after {
        animation: fan-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes fan-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @keyframes fan-spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 520px) {
        .fan {
          grid-template-columns: 40px minmax(0, 1fr);
        }

        .speed-buttons {
          grid-column: 1 / -1;
          width: 100%;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .fan.on.animated::after,
        .fan.on.animated .icon-shell ha-icon {
          animation: none;
        }
      }
    `;
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement('speed-fan-card-editor');
  }

  public static getStubConfig(_: unknown, entities: string[]) {
    const [fanEntity] = entities.filter((entity) => entity.startsWith('fan.'));

    return {
      entity: fanEntity ?? '',
    };
  }

  public setConfig(config: SpeedFanCardConfig): void {
    if (!config?.entity) {
      throw new Error('Entity is required');
    }

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      speed_1_percentage: toNumber(config.speed_1_percentage, 33),
      speed_2_percentage: toNumber(config.speed_2_percentage, 66),
      speed_3_percentage: toNumber(config.speed_3_percentage, 100),
    };

    this.style.setProperty(
      '--fan-card-width',
      this.config.fill_container ? '100%' : this.config.width ?? '260px',
    );
    this.style.setProperty('--fan-card-height', this.config.height ?? '64px');
    this.style.setProperty(
      '--fan-card-radius',
      this.config.border_radius ?? '999px',
    );
    this.style.setProperty('--fan-on-color', this.config.on_color ?? '#45d158');
    this.style.setProperty('--fan-off-color', this.config.off_color ?? '#697382');
    this.style.setProperty('--fan-background', this.config.background ?? '#101722');
  }

  public getCardSize(): number {
    return 1;
  }

  private get entity(): FanEntity | undefined {
    return this.hass?.states[this.config.entity];
  }

  private get isOn(): boolean {
    if (this.optimisticLevel !== undefined) {
      return this.optimisticLevel > 0;
    }

    return this.entity?.state === 'on';
  }

  private get isUnavailable(): boolean {
    return !this.entity || ['unavailable', 'unknown'].includes(this.entity.state);
  }

  private get percentage(): number {
    if (this.optimisticLevel !== undefined) {
      return this.optimisticLevel === 0
        ? 0
        : this.percentageForLevel(this.optimisticLevel);
    }

    if (!this.isOn) {
      return 0;
    }

    return toNumber(this.entity?.attributes.percentage, 100);
  }

  private get level(): FanLevel {
    const percentage = this.percentage;

    if (!this.isOn || percentage <= 0) {
      return 0;
    }

    const speed1 = this.config.speed_1_percentage ?? 33;
    const speed2 = this.config.speed_2_percentage ?? 66;

    if (percentage <= (speed1 + speed2) / 2) {
      return 1;
    }

    if (percentage < (speed2 + (this.config.speed_3_percentage ?? 100)) / 2) {
      return 2;
    }

    return 3;
  }

  private get domain(): string {
    return this.config.entity.split('.')[0] || 'fan';
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

    if (!this.isOn) {
      return this.config.off_label ?? 'Off';
    }

    return `${this.percentage}%`;
  }

  private get icon(): string {
    return (
      this.config.icon ||
      this.entity?.attributes.icon ||
      DEFAULT_CONFIG.icon ||
      'mdi:fan'
    );
  }

  private percentageForLevel(level: FanLevel): number {
    if (level === 1) {
      return this.config.speed_1_percentage ?? 33;
    }

    if (level === 2) {
      return this.config.speed_2_percentage ?? 66;
    }

    return this.config.speed_3_percentage ?? 100;
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

  private setOptimisticLevel(level: FanLevel): void {
    window.clearTimeout(this.optimisticTimer);
    this.optimisticLevel = level;
    this.optimisticTimer = window.setTimeout(() => {
      this.optimisticLevel = undefined;
    }, 1800);
  }

  private clearOptimisticLevel(): void {
    window.clearTimeout(this.optimisticTimer);
    this.optimisticLevel = undefined;
  }

  private trackServiceResult(result: Promise<unknown> | void): void {
    if (result && typeof result.catch === 'function') {
      result.catch(() => this.clearOptimisticLevel());
    }
  }

  private setLevel(level: FanLevel): void {
    if (this.isUnavailable) {
      return;
    }

    this.setOptimisticLevel(level);

    if (level === 0) {
      this.trackServiceResult(
        this.hass?.callService(this.domain, 'turn_off', {
          entity_id: this.config.entity,
        }),
      );
      return;
    }

    if (this.domain === 'fan') {
      this.trackServiceResult(
        this.hass?.callService('fan', 'set_percentage', {
          entity_id: this.config.entity,
          percentage: this.percentageForLevel(level),
        }),
      );
      return;
    }

    this.trackServiceResult(
      this.hass?.callService(this.domain, 'turn_on', {
        entity_id: this.config.entity,
      }),
    );
  }

  private cycleSpeed(): void {
    const nextLevel = ((this.level + 1) % 4) as FanLevel;
    this.setLevel(nextLevel);
  }

  private performTapAction(): void {
    if (this.isUnavailable || this.config.tap_action === 'none') {
      return;
    }

    if (this.config.tap_action === 'more-info') {
      this.dispatchMoreInfo();
      return;
    }

    this.cycleSpeed();
  }

  private handlePointerDown(): void {
    window.clearTimeout(this.holdTimer);
    this.holdActive = false;
    this.holdTimer = window.setTimeout(() => {
      this.holdActive = true;

      if (this.config.hold_action !== 'none') {
        this.dispatchMoreInfo();
      }
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

    this.performTapAction();
  }

  private handleSpeedPointerDown(event: Event, level: FanLevel): void {
    event.stopPropagation();
    this.handledSpeedPointer = true;
    window.setTimeout(() => {
      this.handledSpeedPointer = false;
    }, 500);
    this.setLevel(level);
  }

  private handleSpeedClick(event: Event, level: FanLevel): void {
    event.stopPropagation();

    if (this.handledSpeedPointer) {
      this.handledSpeedPointer = false;
      return;
    }

    this.setLevel(level);
  }

  private renderSpeedButtons(): TemplateResult {
    const buttons: Array<{ level: FanLevel; label: string }> = [
      { level: 0, label: this.config.off_label ?? 'Off' },
      { level: 1, label: this.config.speed_1_label ?? '1' },
      { level: 2, label: this.config.speed_2_label ?? '2' },
      { level: 3, label: this.config.speed_3_label ?? '3' },
    ];

    return html`
      <div class="speed-buttons" aria-label="Fan speed">
        ${buttons.map(
          (button) => html`
            <button
              class="speed ${this.level === button.level ? 'active' : ''}"
              aria-label=${button.label}
              @pointerdown=${(event: Event) =>
                this.handleSpeedPointerDown(event, button.level)}
              @click=${(event: Event) =>
                this.handleSpeedClick(event, button.level)}
            >
              ${button.label}
            </button>
          `,
        )}
      </div>
    `;
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
          --fan-state-color: ${stateColor};
          --fan-warm-color: ${this.isOn
            ? 'color-mix(in srgb, ' + stateColor + ' 86%, #a8ffb2)'
            : stateColor};
          --fan-hot-color: ${this.isOn
            ? 'color-mix(in srgb, ' + stateColor + ' 80%, #00ff66)'
            : stateColor};
          --fan-on-opacity: ${onOpacity};
          --fan-border-strength: ${this.isOn ? '78%' : '24%'};
          --fan-inner-ring-width: ${this.isOn ? '1px' : '0px'};
          --fan-inner-ring-strength: ${this.isOn ? '28%' : '0%'};
          --fan-outer-blur: ${this.isOn ? '30px' : '0'};
          --fan-outer-strength: ${this.isOn ? '28%' : '0%'};
        "
      >
        <div
          class="fan ${this.isOn ? 'on' : 'off'} ${this.isUnavailable
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
          </span>
          ${this.config.show_speed_buttons ? this.renderSpeedButtons() : nothing}
        </div>
      </ha-card>
    `;
  }
}

if (!customElements.get('speed-fan-card')) {
  customElements.define('speed-fan-card', SpeedFanCard);
}

class SpeedFanCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  public hass?: HomeAssistant;
  private config: Partial<SpeedFanCardConfig> = {};

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

  public setConfig(config: SpeedFanCardConfig): void {
    this.config = { ...config };
  }

  private updateConfig(patch: Partial<SpeedFanCardConfig>): void {
    const next = { ...this.config, ...patch };
    Object.keys(next).forEach((key) => {
      const typedKey = key as keyof SpeedFanCardConfig;
      if (next[typedKey] === '') {
        delete next[typedKey];
      }
    });
    this.config = next;
    fireConfigChanged(this, next);
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
    } as Partial<SpeedFanCardConfig>);
  }

  private renderEntityPicker(
    label: string,
    key: keyof SpeedFanCardConfig,
  ): TemplateResult {
    return html`
      <ha-selector
        class="full"
        .hass=${this.hass}
        .label=${label}
        .selector=${{ entity: { domain: 'fan' } }}
        .value=${this.config[key] ?? ''}
        .configValue=${key}
        @value-changed=${this.valueChanged}
      ></ha-selector>
    `;
  }

  private renderTextInput(
    label: string,
    key: keyof SpeedFanCardConfig,
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
    key: keyof SpeedFanCardConfig,
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
    key: keyof SpeedFanCardConfig,
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
    key: keyof SpeedFanCardConfig,
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
    key: keyof SpeedFanCardConfig,
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
            ${this.renderEntityPicker('Entity', 'entity')}
            ${this.renderTextInput('Name', 'name', 'Fan')}
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
          <h3>Speeds</h3>
          <div class="grid">
            ${this.renderTextInput('Off Label', 'off_label', 'Off')}
            ${this.renderTextInput('Speed 1 Label', 'speed_1_label', '1')}
            ${this.renderTextInput('Speed 2 Label', 'speed_2_label', '2')}
            ${this.renderTextInput('Speed 3 Label', 'speed_3_label', '3')}
            ${this.renderNumberInput('Speed 1 Percent', 'speed_1_percentage', '33')}
            ${this.renderNumberInput('Speed 2 Percent', 'speed_2_percentage', '66')}
            ${this.renderNumberInput('Speed 3 Percent', 'speed_3_percentage', '100')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Show State', 'show_state', true)}
            ${this.renderSwitch('Show Speed Buttons', 'show_speed_buttons', true)}
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
            ${this.renderSwitch('Animated Glow', 'animated', true)}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect('Tap Action', 'tap_action', TAP_ACTIONS, 'cycle')}
            ${this.renderSelect(
              'Hold Action',
              'hold_action',
              HOLD_ACTIONS,
              'more-info',
            )}
          </div>
        </section>
      </div>
    `;
  }
}

if (!customElements.get('speed-fan-card-editor')) {
  customElements.define('speed-fan-card-editor', SpeedFanCardEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    'speed-fan-card': SpeedFanCard;
    'speed-fan-card-editor': SpeedFanCardEditor;
  }

  interface Window {
    customCards?: unknown[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  preview: true,
  type: 'speed-fan-card',
  name: 'Speed Fan Card',
  description: 'A compact fan card with off, 1, 2, and 3 speed controls.',
});
