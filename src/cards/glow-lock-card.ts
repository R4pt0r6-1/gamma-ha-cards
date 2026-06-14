import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';

type LockEntity = {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    icon?: string;
    [key: string]: unknown;
  };
};

type HomeAssistant = {
  states: Record<string, LockEntity | undefined>;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ) => Promise<unknown> | void;
};

type ActionMode = 'toggle' | 'lock' | 'unlock' | 'more-info' | 'none';
type OptimisticLockState = 'locking' | 'unlocking';

interface GlowLockCardConfig {
  type?: string;
  entity: string;
  name?: string;
  icon?: string;
  locked_icon?: string;
  unlocked_icon?: string;
  jammed_icon?: string;
  width?: string;
  fill_container?: boolean;
  height?: string;
  border_radius?: string;
  show_state?: boolean;
  locked_color?: string;
  unlocked_color?: string;
  pending_color?: string;
  jammed_color?: string;
  off_color?: string;
  background?: string;
  tap_action?: ActionMode;
  hold_action?: ActionMode;
  animated?: boolean;
}

type ConfigElement = HTMLInputElement & {
  checked?: boolean;
  configValue?: keyof GlowLockCardConfig;
};

const DEFAULT_CONFIG: Omit<GlowLockCardConfig, 'entity'> = {
  locked_icon: 'mdi:lock',
  unlocked_icon: 'mdi:lock-open-variant',
  jammed_icon: 'mdi:lock-alert',
  width: '260px',
  fill_container: false,
  height: '56px',
  border_radius: '999px',
  show_state: true,
  locked_color: '#45d158',
  unlocked_color: '#ff3b30',
  pending_color: '#ff8a1c',
  jammed_color: '#ff3b30',
  off_color: '#697382',
  background: '#101722',
  tap_action: 'toggle',
  hold_action: 'more-info',
  animated: true,
};

const ACTIONS: ActionMode[] = ['toggle', 'lock', 'unlock', 'more-info', 'none'];

function fireConfigChanged(
  element: HTMLElement,
  config: Partial<GlowLockCardConfig>,
): void {
  element.dispatchEvent(
    new CustomEvent('config-changed', {
      detail: { config },
      bubbles: true,
      composed: true,
    }),
  );
}

export class GlowLockCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    holdActive: { state: true },
    optimisticLocked: { state: true },
    optimisticState: { state: true },
  };

  public hass?: HomeAssistant;
  private config!: GlowLockCardConfig;
  private holdTimer?: number;
  private optimisticTimer?: number;
  private holdActive = false;
  private optimisticLocked?: boolean;
  private optimisticState?: OptimisticLockState;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --lock-card-width: 260px;
        --lock-card-height: 56px;
        --lock-card-radius: 999px;
        --lock-locked-color: #45d158;
        --lock-unlocked-color: #ff3b30;
        --lock-pending-color: #ff8a1c;
        --lock-jammed-color: #ff3b30;
        --lock-off-color: #697382;
        --lock-background: #101722;

        display: block;
        max-width: var(--lock-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .lock-button {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--lock-hot-color) 14%, transparent),
            transparent 44%
          ),
          linear-gradient(
            118deg,
            color-mix(in srgb, var(--lock-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--lock-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--lock-hot-color) 14%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--lock-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--lock-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--lock-state-color) var(--lock-border-strength),
            transparent
          );
        border-radius: var(--lock-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--lock-inner-ring-width)
            color-mix(
              in srgb,
              var(--lock-state-color) var(--lock-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--lock-outer-blur)
            color-mix(
              in srgb,
              var(--lock-state-color) var(--lock-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 8px;
        grid-template-columns: 46px minmax(0, 1fr);
        min-height: var(--lock-card-height);
        overflow: hidden;
        padding: 8px 14px 8px 10px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .lock-button::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--lock-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--lock-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--lock-warm-color) 10%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--lock-hot-color) 12%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--lock-glow-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .lock-button::after {
        border: 1px solid
          color-mix(in srgb, var(--lock-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--lock-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--lock-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--lock-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--lock-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--lock-glow-opacity);
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
          color-mix(in srgb, var(--lock-state-color) 18%, transparent);
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--lock-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--lock-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--lock-state-color) 8%, transparent);
        inset: 2px;
        opacity: var(--lock-glow-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--lock-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
        inset: 7px;
        opacity: var(--lock-glow-opacity);
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
            color-mix(in srgb, var(--lock-state-color) 24%, transparent),
            transparent 72%
          ),
          color-mix(in srgb, var(--lock-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--lock-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--lock-state-color);
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
        background: color-mix(in srgb, var(--lock-state-color) 82%, #ffffff 2%);
        border-radius: 999px;
        box-shadow:
          0 0 10px color-mix(in srgb, var(--lock-state-color) 54%, transparent),
          0 0 20px color-mix(in srgb, var(--lock-state-color) 28%, transparent);
        height: 8px;
        opacity: var(--lock-dot-opacity);
        position: absolute;
        right: 16px;
        top: calc(50% - 4px);
        width: 8px;
      }

      .lock-button:focus-visible {
        outline: 2px solid var(--lock-state-color);
        outline-offset: 3px;
      }

      .lock-button.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .lock-button.active.animated::after {
        animation: lock-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes lock-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .lock-button.active.animated::after {
          animation: none;
        }
      }
    `;
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement('glow-lock-card-editor');
  }

  public static getStubConfig(_: unknown, entities: string[]) {
    const [lockEntity] = entities.filter((entity) => entity.startsWith('lock.'));

    return {
      entity: lockEntity ?? '',
    };
  }

  public setConfig(config: GlowLockCardConfig): void {
    if (!config?.entity) {
      throw new Error('Entity is required');
    }

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    this.style.setProperty(
      '--lock-card-width',
      this.config.fill_container ? '100%' : this.config.width ?? '260px',
    );
    this.style.setProperty('--lock-card-height', this.config.height ?? '56px');
    this.style.setProperty(
      '--lock-card-radius',
      this.config.border_radius ?? '999px',
    );
    this.style.setProperty('--lock-locked-color', this.config.locked_color ?? '#45d158');
    this.style.setProperty('--lock-unlocked-color', this.config.unlocked_color ?? '#ff3b30');
    this.style.setProperty('--lock-pending-color', this.config.pending_color ?? '#ff8a1c');
    this.style.setProperty('--lock-jammed-color', this.config.jammed_color ?? '#ff3b30');
    this.style.setProperty('--lock-off-color', this.config.off_color ?? '#697382');
    this.style.setProperty('--lock-background', this.config.background ?? '#101722');
  }

  public getCardSize(): number {
    return 1;
  }

  public getGridOptions() {
    return {
      rows: 1,
      columns: 6,
      min_rows: 1,
      max_rows: 1,
      min_columns: 3,
      max_columns: 12,
    };
  }

  private get entity(): LockEntity | undefined {
    return this.hass?.states[this.config.entity];
  }

  private get isUnavailable(): boolean {
    return !this.entity || ['unavailable', 'unknown'].includes(this.entity.state);
  }

  private get isJammed(): boolean {
    return this.entity?.state === 'jammed';
  }

  private get effectiveState(): string | undefined {
    return this.optimisticState ?? this.entity?.state;
  }

  private get isPending(): boolean {
    return this.effectiveState === 'locking' || this.effectiveState === 'unlocking';
  }

  private get isLocked(): boolean {
    if (this.optimisticLocked !== undefined) {
      return this.optimisticLocked;
    }

    return this.effectiveState === 'locked' || this.effectiveState === 'locking';
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

    const state = this.effectiveState;

    if (state === 'locking') {
      return 'Locking';
    }

    if (state === 'unlocking') {
      return 'Unlocking';
    }

    if (state === 'jammed') {
      return 'Jammed';
    }

    return state === 'locked' ? 'Locked' : 'Unlocked';
  }

  private get icon(): string {
    if (this.config.icon) {
      return this.config.icon;
    }

    if (this.isJammed) {
      return this.config.jammed_icon ?? 'mdi:lock-alert';
    }

    return this.isLocked
      ? this.config.locked_icon ?? 'mdi:lock'
      : this.config.unlocked_icon ?? 'mdi:lock-open-variant';
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

  private setOptimisticLockState(locked: boolean): void {
    window.clearTimeout(this.optimisticTimer);
    this.optimisticLocked = locked;
    this.optimisticState = locked ? 'locking' : 'unlocking';
    this.optimisticTimer = window.setTimeout(() => {
      this.clearOptimisticLocked();
    }, 8000);
  }

  private clearOptimisticLocked(): void {
    window.clearTimeout(this.optimisticTimer);
    this.optimisticLocked = undefined;
    this.optimisticState = undefined;
  }

  protected updated(): void {
    if (this.optimisticState === 'locking' && this.entity?.state === 'locked') {
      this.clearOptimisticLocked();
      return;
    }

    if (this.optimisticState === 'unlocking' && this.entity?.state === 'unlocked') {
      this.clearOptimisticLocked();
    }
  }

  private trackServiceResult(result: Promise<unknown> | void): void {
    if (result && typeof result.catch === 'function') {
      result.catch(() => this.clearOptimisticLocked());
    }
  }

  private callLockService(locked: boolean): void {
    this.setOptimisticLockState(locked);
    this.trackServiceResult(
      this.hass?.callService('lock', locked ? 'lock' : 'unlock', {
        entity_id: this.config.entity,
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

    if (action === 'lock') {
      this.callLockService(true);
      return;
    }

    if (action === 'unlock') {
      this.callLockService(false);
      return;
    }

    this.callLockService(!this.isLocked);
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

    const stateColor = this.isUnavailable
      ? this.config.off_color ?? '#697382'
      : this.isJammed
        ? this.config.jammed_color ?? '#ff3b30'
        : this.isPending
          ? this.config.pending_color ?? '#ff8a1c'
        : this.isLocked
          ? this.config.locked_color ?? '#45d158'
          : this.config.unlocked_color ?? '#ff3b30';
    const glowOpacity = this.isUnavailable ? '0' : '1';
    const statusClass = this.isPending
      ? 'pending'
      : this.isLocked
        ? 'locked'
        : this.isJammed
          ? 'jammed'
          : 'unlocked';

    return html`
      <ha-card
        style="
          --lock-state-color: ${stateColor};
          --lock-warm-color: ${this.isLocked
            ? 'color-mix(in srgb, ' + stateColor + ' 86%, #a8ffb2)'
            : 'color-mix(in srgb, ' + stateColor + ' 86%, #ffd26a)'};
          --lock-hot-color: ${this.isLocked
            ? 'color-mix(in srgb, ' + stateColor + ' 80%, #00ff66)'
            : 'color-mix(in srgb, ' + stateColor + ' 80%, #ff4f00)'};
          --lock-glow-opacity: ${glowOpacity};
          --lock-dot-opacity: ${this.isUnavailable ? '0.26' : '1'};
          --lock-border-strength: ${this.isUnavailable ? '18%' : '26%'};
          --lock-inner-ring-width: ${this.isUnavailable ? '0px' : '1px'};
          --lock-inner-ring-strength: ${this.isUnavailable ? '0%' : '8%'};
          --lock-outer-blur: ${this.isUnavailable ? '0' : '50px'};
          --lock-outer-strength: ${this.isUnavailable ? '0%' : '10%'};
        "
      >
        <button
          type="button"
          class="lock-button active ${statusClass} ${this.isUnavailable
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

if (!customElements.get('glow-lock-card')) {
  customElements.define('glow-lock-card', GlowLockCard);
}

class GlowLockCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  public hass?: HomeAssistant;
  private config: Partial<GlowLockCardConfig> = {};

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

  public setConfig(config: GlowLockCardConfig): void {
    this.config = { ...config };
  }

  private updateConfig(patch: Partial<GlowLockCardConfig>): void {
    const next = { ...this.config, ...patch };
    Object.keys(next).forEach((key) => {
      const typedKey = key as keyof GlowLockCardConfig;
      if (next[typedKey] === '') {
        delete next[typedKey];
      }
    });
    this.config = next;
    fireConfigChanged(this, next);
  }

  private formChanged(event: Event): void {
    const customEvent = event as CustomEvent<{
      value?: Partial<GlowLockCardConfig>;
    }>;

    if (!customEvent.detail?.value) {
      return;
    }

    this.updateConfig(customEvent.detail.value);
  }

  private valueChanged(event: Event): void {
    const target = (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
    const customEvent = event as CustomEvent<{ value?: string }>;

    const configValue = (target as any).configValue || target?.dataset?.configValue;

    if (!configValue) {
      return;
    }

    const checked = (target as HTMLInputElement).checked;
    const value = checked !== undefined
      ? checked
      : customEvent.detail?.value ?? (target as any).value;

    this.updateConfig({
      [configValue]: value,
    } as Partial<GlowLockCardConfig>);
  }

  private renderEntityForm(): TemplateResult {
    const schema = [
      {
        name: 'entity',
        required: true,
        selector: { entity: { domain: 'lock' } },
      },
    ];
    const labels: Record<string, string> = {
      entity: 'Lock Entity',
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
    key: keyof GlowLockCardConfig,
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
    key: keyof GlowLockCardConfig,
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
    key: keyof GlowLockCardConfig,
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
    key: keyof GlowLockCardConfig,
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
            ${this.renderTextInput('Name', 'name', 'Front Door')}
            ${this.renderIconPicker('Icon Override', 'icon')}
            ${this.renderIconPicker('Locked Icon', 'locked_icon')}
            ${this.renderIconPicker('Unlocked Icon', 'unlocked_icon')}
            ${this.renderTextInput('Width', 'width', '260px')}
            ${this.renderTextInput('Height', 'height', '56px')}
            ${this.renderTextInput('Radius', 'border_radius', '999px')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Fill Container', 'fill_container', false)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput('Locked Color', 'locked_color', '#45d158')}
            ${this.renderTextInput('Unlocked Color', 'unlocked_color', '#ff3b30')}
            ${this.renderTextInput('Pending Color', 'pending_color', '#ff8a1c')}
            ${this.renderTextInput('Jammed Color', 'jammed_color', '#ff3b30')}
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

if (!customElements.get('glow-lock-card-editor')) {
  customElements.define('glow-lock-card-editor', GlowLockCardEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    'glow-lock-card': GlowLockCard;
    'glow-lock-card-editor': GlowLockCardEditor;
  }

  interface Window {
    customCards?: unknown[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  preview: true,
  type: 'glow-lock-card',
  name: 'Glow Lock Card',
  description: 'A compact smart lock card with instant locked and unlocked states.',
});
