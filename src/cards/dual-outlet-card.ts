import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';

type OutletEntity = {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    icon?: string;
    [key: string]: unknown;
  };
};

type HomeAssistant = {
  states: Record<string, OutletEntity | undefined>;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ) => Promise<unknown> | void;
};

type ActionMode = 'toggle' | 'more-info' | 'none';
type LayoutMode = 'duplex' | 'grid' | 'stack';

interface DualOutletCardConfig {
  type?: string;
  entity_1: string;
  entity_2?: string;
  title?: string;
  name_1?: string;
  name_2?: string;
  icon_1?: string;
  icon_2?: string;
  width?: string;
  fill_container?: boolean;
  button_height?: string;
  gap?: string;
  layout?: LayoutMode;
  show_title?: boolean;
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
  configValue?: keyof DualOutletCardConfig;
};

type OutletSlot = {
  entityId: string;
  name?: string;
  icon?: string;
  fallbackName: string;
};

const DEFAULT_CONFIG: Omit<DualOutletCardConfig, 'entity_1'> = {
  title: 'Outlets',
  icon_1: 'mdi:power-socket-us',
  icon_2: 'mdi:power-socket-us',
  width: '320px',
  fill_container: false,
  button_height: '54px',
  gap: '12px',
  layout: 'duplex',
  show_title: false,
  show_state: true,
  on_color: '#ff3b30',
  off_color: '#697382',
  background: '#101722',
  tap_action: 'toggle',
  hold_action: 'more-info',
  animated: true,
};

const ACTIONS: ActionMode[] = ['toggle', 'more-info', 'none'];
const LAYOUTS: LayoutMode[] = ['duplex', 'grid', 'stack'];

function fireConfigChanged(
  element: HTMLElement,
  config: Partial<DualOutletCardConfig>,
): void {
  element.dispatchEvent(
    new CustomEvent('config-changed', {
      detail: { config },
      bubbles: true,
      composed: true,
    }),
  );
}

export class DualOutletCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    holdActive: { state: true },
    optimisticStates: { state: true },
  };

  public hass?: HomeAssistant;
  private config!: DualOutletCardConfig;
  private holdTimer?: number;
  private optimisticTimers: Record<string, number | undefined> = {};
  private optimisticStates: Record<string, boolean> = {};
  private holdActive = false;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --outlet-card-width: 540px;
        --outlet-button-height: 54px;
        --outlet-gap: 12px;
        --outlet-on-color: #ff3b30;
        --outlet-off-color: #697382;
        --outlet-background: #101722;

        display: block;
        max-width: var(--outlet-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .card {
        display: grid;
        gap: 10px;
        width: 100%;
      }

      .title {
        align-items: center;
        color: var(--primary-text-color, #f4f7fb);
        display: flex;
        font-size: 14px;
        font-weight: 600;
        gap: 8px;
        letter-spacing: 0;
        line-height: 1.2;
        min-height: 20px;
      }

      .title ha-icon {
        --mdc-icon-size: 18px;
        color: var(--outlet-off-color);
      }

      .outlets {
        display: grid;
        gap: var(--outlet-gap);
      }

      .layout-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .layout-stack {
        grid-template-columns: 1fr;
      }

      .duplex-shell {
        background:
          radial-gradient(
            circle at 18% 22%,
            color-mix(in srgb, var(--outlet-any-color) 16%, transparent),
            transparent 36%
          ),
          radial-gradient(
            circle at 82% 78%,
            color-mix(in srgb, var(--outlet-any-color) 12%, transparent),
            transparent 40%
          ),
          linear-gradient(
            145deg,
            color-mix(in srgb, var(--outlet-background) 88%, #ffffff 8%),
            color-mix(in srgb, var(--outlet-background) 94%, #000000 16%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--outlet-any-color) var(--outlet-shell-border-strength),
            transparent
          );
        border-radius: 26px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 1px rgb(255 255 255 / 3%),
          0 14px 28px rgb(0 0 0 / 24%),
          0 0 var(--outlet-shell-glow-blur)
            color-mix(
              in srgb,
              var(--outlet-any-color) var(--outlet-shell-glow-strength),
              transparent
            );
        box-sizing: border-box;
        display: grid;
        gap: 0;
        overflow: hidden;
        padding: 0;
        position: relative;
      }

      .duplex-shell::before {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--outlet-any-color) 15%, transparent),
            transparent 70%
          );
        content: '';
        filter: blur(16px);
        inset: 8px;
        opacity: var(--outlet-any-on-opacity);
        pointer-events: none;
        position: absolute;
      }

      .duplex-shell::after {
        border: 1px solid
          color-mix(in srgb, var(--outlet-any-color) 18%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 12px
            color-mix(in srgb, var(--outlet-any-color) 10%, transparent),
          0 0 34px
            color-mix(in srgb, var(--outlet-any-color) 12%, transparent);
        content: '';
        inset: 2px;
        opacity: var(--outlet-any-on-opacity);
        pointer-events: none;
        position: absolute;
      }

      .duplex-outlet {
        align-items: center;
        background:
          linear-gradient(
            115deg,
            color-mix(in srgb, var(--outlet-warm-color) 13%, transparent) 0%,
            color-mix(in srgb, var(--outlet-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--outlet-hot-color) 13%, transparent) 100%
          );
        border: 0;
        border-radius: 0;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 7%);
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 12px;
        grid-template-columns: 48px minmax(0, 1fr) 14px;
        min-height: calc(var(--outlet-button-height) + 4px);
        overflow: hidden;
        padding: 8px 12px 8px 10px;
        position: relative;
        text-align: left;
        width: 100%;
        z-index: 1;
      }

      .duplex-outlet.top {
        border-radius: 25px 25px 0 0;
      }

      .duplex-outlet.bottom {
        border-radius: 0 0 25px 25px;
      }

      .duplex-outlet.single {
        border-radius: 25px;
      }

      .duplex-outlet::before,
      .duplex-outlet::after {
        content: '';
        inset: 0;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .duplex-outlet::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 42%,
            color-mix(in srgb, var(--outlet-warm-color) 11%, transparent) 72%,
            color-mix(in srgb, var(--outlet-hot-color) 24%, transparent) 100%
          );
      }

      .duplex-outlet::after {
        border: 0;
        border-radius: inherit;
        box-shadow:
          inset 0 0 0 1px
            color-mix(in srgb, var(--outlet-state-color) 18%, transparent),
          inset 0 0 18px
            color-mix(in srgb, var(--outlet-state-color) 12%, transparent),
          inset 0 1px 0 rgb(255 255 255 / 7%);
      }

      .socket-face {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--outlet-state-color) 18%, transparent),
            transparent 74%
          ),
          color-mix(in srgb, var(--outlet-state-color) 8%, rgb(255 255 255 / 5%));
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 34%, transparent);
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 10%),
          0 0 var(--outlet-status-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-status-glow),
              transparent
            );
        display: inline-grid;
        height: 36px;
        justify-content: center;
        place-items: center;
        position: relative;
        width: 36px;
        z-index: 2;
      }

      .socket-icon {
        color: color-mix(in srgb, var(--outlet-state-color) 82%, #dce4f0 14%);
        filter: drop-shadow(
          0 0 var(--outlet-status-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-status-glow),
              transparent
            )
        );
        height: 23px;
        width: 23px;
      }

      .socket-icon path {
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2.5;
      }

      .duplex-divider {
        background: linear-gradient(
          90deg,
          transparent,
          rgb(255 255 255 / 10%),
          transparent
        );
        height: 1px;
        margin: 0 16px;
        position: relative;
        z-index: 3;
      }

      .outlet {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--outlet-hot-color) 15%, transparent),
            transparent 44%
          ),
          linear-gradient(
            118deg,
            color-mix(in srgb, var(--outlet-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--outlet-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--outlet-hot-color) 15%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--outlet-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--outlet-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--outlet-state-color) var(--outlet-border-strength),
            transparent
          );
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--outlet-inner-ring-width)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--outlet-outer-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 9px;
        grid-template-columns: 42px minmax(0, 1fr) 18px;
        min-height: var(--outlet-button-height);
        overflow: hidden;
        padding: 8px 12px 8px 9px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .outlet::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--outlet-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--outlet-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--outlet-warm-color) 11%, transparent),
            transparent 34%,
            transparent 67%,
            color-mix(in srgb, var(--outlet-hot-color) 14%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outlet::after {
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--outlet-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--outlet-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--outlet-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--outlet-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 18%, transparent);
        border-radius: inherit;
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--outlet-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--outlet-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--outlet-state-color) 8%, transparent);
        inset: 2px;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--outlet-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
        inset: 7px;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 0;
      }

      .icon-shell,
      .socket-face,
      .content,
      .status-light {
        position: relative;
        z-index: 2;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--outlet-state-color) 22%, transparent),
            transparent 72%
          ),
          color-mix(in srgb, var(--outlet-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--outlet-state-color);
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

      .status-light {
        align-self: center;
        background: color-mix(
          in srgb,
          var(--outlet-state-color) var(--outlet-status-strength),
          #2f3642
        );
        border-radius: 999px;
        box-shadow:
          0 0 var(--outlet-status-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-status-glow),
              transparent
            ),
          inset 0 1px 0 rgb(255 255 255 / 14%);
        height: 8px;
        justify-self: center;
        width: 8px;
      }

      .outlet:focus-visible {
        outline: 2px solid var(--outlet-state-color);
        outline-offset: 3px;
      }

      .duplex-outlet:focus-visible {
        outline: 2px solid var(--outlet-state-color);
        outline-offset: 3px;
      }

      .outlet.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .duplex-outlet.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .outlet.on.animated::after {
        animation: outlet-glow-breathe 3s ease-in-out infinite;
      }

      .duplex-outlet.on.animated::after {
        animation: outlet-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes outlet-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (max-width: 620px) {
        .layout-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .outlet.on.animated::after {
          animation: none;
        }
      }
    `;
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement('dual-outlet-card-editor');
  }

  public static getStubConfig(_: unknown, entities: string[]) {
    const toggleEntities = entities.filter(
      (entity) =>
        entity.startsWith('switch.') ||
        entity.startsWith('light.') ||
        entity.startsWith('input_boolean.'),
    );

    return {
      entity_1: toggleEntities[0] ?? '',
      entity_2: toggleEntities[1] ?? '',
    };
  }

  public setConfig(config: DualOutletCardConfig): void {
    if (!config?.entity_1) {
      throw new Error('Entity 1 is required');
    }

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    this.style.setProperty(
      '--outlet-card-width',
      this.config.fill_container ? '100%' : this.config.width ?? '320px',
    );
    this.style.setProperty(
      '--outlet-button-height',
      this.config.button_height ?? '54px',
    );
    this.style.setProperty('--outlet-gap', this.config.gap ?? '12px');
    this.style.setProperty('--outlet-on-color', this.config.on_color ?? '#ff3b30');
    this.style.setProperty('--outlet-off-color', this.config.off_color ?? '#697382');
    this.style.setProperty(
      '--outlet-background',
      this.config.background ?? '#101722',
    );
  }

  public getCardSize(): number {
    const outletRows = this.config.layout === 'grid' ? 2 : 3;

    return outletRows + (this.config.show_title ? 1 : 0);
  }

  public getGridOptions() {
    const outletRows =
      this.config.layout === 'grid'
        ? 1
        : this.outlets.length > 1
          ? 2
          : 1;
    const rows = outletRows + (this.config.show_title ? 1 : 0);

    return {
      rows,
      columns: 6,
      min_rows: rows,
      max_rows: Math.max(rows, 4),
      min_columns: 3,
      max_columns: 12,
    };
  }

  private get anyOutletOn(): boolean {
    return this.outlets.some((slot) =>
      this.isOn(this.getEntity(slot.entityId), slot.entityId),
    );
  }

  private get outlets(): OutletSlot[] {
    const outlets: OutletSlot[] = [
      {
        entityId: this.config.entity_1,
        name: this.config.name_1,
        icon: this.config.icon_1,
        fallbackName: 'Outlet 1',
      },
    ];

    if (this.config.entity_2) {
      outlets.push({
        entityId: this.config.entity_2,
        name: this.config.name_2,
        icon: this.config.icon_2,
        fallbackName: 'Outlet 2',
      });
    }

    return outlets;
  }

  private getEntity(entityId: string): OutletEntity | undefined {
    return this.hass?.states[entityId];
  }

  private isOn(entity?: OutletEntity, entityId?: string): boolean {
    if (entityId && this.optimisticStates[entityId] !== undefined) {
      return this.optimisticStates[entityId];
    }

    return entity?.state === 'on';
  }

  private isUnavailable(entity?: OutletEntity): boolean {
    return !entity || ['unavailable', 'unknown'].includes(entity.state);
  }

  private domain(entityId: string): string {
    return entityId.split('.')[0] || 'switch';
  }

  private displayName(slot: OutletSlot): string {
    const entity = this.getEntity(slot.entityId);

    return (
      slot.name ||
      entity?.attributes.friendly_name ||
      slot.fallbackName ||
      slot.entityId
    );
  }

  private displayState(entity?: OutletEntity, entityId?: string): string {
    if (this.isUnavailable(entity)) {
      return 'Unavailable';
    }

    return this.isOn(entity, entityId) ? 'On' : 'Off';
  }

  private displayIcon(slot: OutletSlot): string {
    const entity = this.getEntity(slot.entityId);

    return (
      slot.icon ||
      entity?.attributes.icon ||
      DEFAULT_CONFIG.icon_1 ||
      'mdi:power-socket-us'
    );
  }

  private dispatchMoreInfo(entityId: string): void {
    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private setOptimisticState(entityId: string, on: boolean): void {
    window.clearTimeout(this.optimisticTimers[entityId]);
    this.optimisticStates = {
      ...this.optimisticStates,
      [entityId]: on,
    };
    this.optimisticTimers[entityId] = window.setTimeout(() => {
      this.clearOptimisticState(entityId);
    }, 1800);
  }

  private clearOptimisticState(entityId: string): void {
    window.clearTimeout(this.optimisticTimers[entityId]);
    const next = { ...this.optimisticStates };
    delete next[entityId];
    this.optimisticStates = next;
  }

  private trackServiceResult(
    entityId: string,
    result: Promise<unknown> | void,
  ): void {
    if (result && typeof result.catch === 'function') {
      result.catch(() => this.clearOptimisticState(entityId));
    }
  }

  private performAction(entityId: string, action: ActionMode | undefined): void {
    const entity = this.getEntity(entityId);

    if (this.isUnavailable(entity) || !action || action === 'none') {
      return;
    }

    if (action === 'more-info') {
      this.dispatchMoreInfo(entityId);
      return;
    }

    this.setOptimisticState(entityId, !this.isOn(entity, entityId));
    this.trackServiceResult(
      entityId,
      this.hass?.callService(this.domain(entityId), 'toggle', {
        entity_id: entityId,
      }),
    );
  }

  private handlePointerDown(entityId: string): void {
    window.clearTimeout(this.holdTimer);
    this.holdActive = false;
    this.holdTimer = window.setTimeout(() => {
      this.holdActive = true;
      this.performAction(entityId, this.config.hold_action);
    }, 500);
  }

  private handlePointerUp(): void {
    window.clearTimeout(this.holdTimer);
  }

  private handleClick(entityId: string): void {
    if (this.holdActive) {
      this.holdActive = false;
      return;
    }

    this.performAction(entityId, this.config.tap_action);
  }

  private renderOutlet(slot: OutletSlot): TemplateResult {
    const entity = this.getEntity(slot.entityId);
    const outletOn = this.isOn(entity, slot.entityId);
    const unavailable = this.isUnavailable(entity);
    const stateColor = outletOn
      ? this.config.on_color ?? '#ff3b30'
      : this.config.off_color ?? '#697382';
    const onOpacity = outletOn ? '1' : '0';

    return html`
      <button
        class="outlet ${outletOn ? 'on' : 'off'} ${unavailable
          ? 'unavailable'
          : ''} ${this.config.animated ? 'animated' : ''}"
        style="
          --outlet-state-color: ${stateColor};
          --outlet-warm-color: ${outletOn
            ? 'color-mix(in srgb, ' + stateColor + ' 86%, #ff9a64)'
            : stateColor};
          --outlet-hot-color: ${outletOn
            ? 'color-mix(in srgb, ' + stateColor + ' 80%, #ff1d1d)'
            : stateColor};
          --outlet-on-opacity: ${onOpacity};
          --outlet-border-strength: ${outletOn ? '26%' : '18%'};
          --outlet-inner-ring-width: ${outletOn ? '1px' : '0px'};
          --outlet-inner-ring-strength: ${outletOn ? '8%' : '0%'};
          --outlet-outer-blur: ${outletOn ? '50px' : '0'};
          --outlet-outer-strength: ${outletOn ? '10%' : '0%'};
          --outlet-status-strength: ${outletOn ? '92%' : '22%'};
          --outlet-status-blur: ${outletOn ? '18px' : '0'};
          --outlet-status-glow: ${outletOn ? '72%' : '0%'};
        "
        aria-label=${this.displayName(slot)}
        @click=${() => this.handleClick(slot.entityId)}
        @pointerdown=${() => this.handlePointerDown(slot.entityId)}
        @pointerup=${this.handlePointerUp}
        @pointerleave=${this.handlePointerUp}
        @pointercancel=${this.handlePointerUp}
      >
        <span class="ambient-glow"></span>
        <span class="outline-glow"></span>
        <span class="icon-shell">
          <ha-icon icon=${this.displayIcon(slot)}></ha-icon>
        </span>
        <span class="content">
          <span class="name">${this.displayName(slot)}</span>
          ${this.config.show_state
            ? html`<span class="state"
                >${this.displayState(entity, slot.entityId)}</span
              >`
            : nothing}
        </span>
        <span class="status-light"></span>
      </button>
    `;
  }

  private renderDuplexOutlet(
    slot: OutletSlot,
    position: 'top' | 'bottom' | 'single',
  ): TemplateResult {
    const entity = this.getEntity(slot.entityId);
    const outletOn = this.isOn(entity, slot.entityId);
    const unavailable = this.isUnavailable(entity);
    const stateColor = outletOn
      ? this.config.on_color ?? '#ff3b30'
      : this.config.off_color ?? '#697382';
    const onOpacity = outletOn ? '1' : '0';

    return html`
      <button
        class="duplex-outlet ${position} ${outletOn ? 'on' : 'off'} ${unavailable
          ? 'unavailable'
          : ''} ${this.config.animated ? 'animated' : ''}"
        style="
          --outlet-state-color: ${stateColor};
          --outlet-warm-color: ${outletOn
            ? 'color-mix(in srgb, ' + stateColor + ' 86%, #ff9a64)'
            : stateColor};
          --outlet-hot-color: ${outletOn
            ? 'color-mix(in srgb, ' + stateColor + ' 80%, #ff1d1d)'
            : stateColor};
          --outlet-on-opacity: ${onOpacity};
          --outlet-border-strength: ${outletOn ? '26%' : '18%'};
          --outlet-inner-ring-width: ${outletOn ? '1px' : '0px'};
          --outlet-inner-ring-strength: ${outletOn ? '8%' : '0%'};
          --outlet-outer-blur: ${outletOn ? '50px' : '0'};
          --outlet-outer-strength: ${outletOn ? '10%' : '0%'};
          --outlet-status-strength: ${outletOn ? '92%' : '22%'};
          --outlet-status-blur: ${outletOn ? '18px' : '0'};
          --outlet-status-glow: ${outletOn ? '72%' : '0%'};
        "
        aria-label=${this.displayName(slot)}
        @click=${() => this.handleClick(slot.entityId)}
        @pointerdown=${() => this.handlePointerDown(slot.entityId)}
        @pointerup=${this.handlePointerUp}
        @pointerleave=${this.handlePointerUp}
        @pointercancel=${this.handlePointerUp}
      >
        <span class="socket-face" aria-hidden="true">
          <svg class="socket-icon" viewBox="0 0 32 32" focusable="false">
            <path d="M12 8v8"></path>
            <path d="M20 8v8"></path>
            <path d="M11.5 22.5c0 3 2 5 4.5 5s4.5-2 4.5-5"></path>
          </svg>
        </span>
        <span class="content">
          <span class="name">${this.displayName(slot)}</span>
          ${this.config.show_state
            ? html`<span class="state"
                >${this.displayState(entity, slot.entityId)}</span
              >`
            : nothing}
        </span>
        <span class="status-light"></span>
      </button>
    `;
  }

  private renderDuplex(): TemplateResult {
    const anyOutletOn = this.anyOutletOn;
    const shellColor = anyOutletOn
      ? this.config.on_color ?? '#ff3b30'
      : this.config.off_color ?? '#697382';

    return html`
      <div
        class="duplex-shell"
        style="
          --outlet-any-color: ${shellColor};
          --outlet-any-on-opacity: ${anyOutletOn ? '1' : '0'};
          --outlet-shell-border-strength: ${anyOutletOn ? '22%' : '16%'};
          --outlet-shell-glow-blur: ${anyOutletOn ? '50px' : '0'};
          --outlet-shell-glow-strength: ${anyOutletOn ? '10%' : '0%'};
        "
      >
        ${this.outlets.map(
          (slot, index) => html`
            ${index > 0 ? html`<span class="duplex-divider"></span>` : nothing}
            ${this.renderDuplexOutlet(
              slot,
              this.outlets.length === 1
                ? 'single'
                : index === 0
                  ? 'top'
                  : 'bottom',
            )}
          `,
        )}
      </div>
    `;
  }

  protected render(): TemplateResult {
    if (!this.config) {
      return html``;
    }

    const layout = this.config.layout ?? 'duplex';

    return html`
      <ha-card>
        <div class="card">
          ${this.config.show_title
            ? html`
                <div class="title">
                  <span>${this.config.title}</span>
                </div>
              `
            : nothing}
          ${layout === 'duplex'
            ? this.renderDuplex()
            : html`
                <div class="outlets layout-${layout}">
                  ${this.outlets.map((slot) => this.renderOutlet(slot))}
                </div>
              `}
        </div>
      </ha-card>
    `;
  }
}

if (!customElements.get('dual-outlet-card')) {
  customElements.define('dual-outlet-card', DualOutletCard);
}

class DualOutletCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  public hass?: HomeAssistant;
  private config: Partial<DualOutletCardConfig> = {};

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

  public setConfig(config: DualOutletCardConfig): void {
    this.config = { ...config };
  }

  private updateConfig(patch: Partial<DualOutletCardConfig>): void {
    const next = { ...this.config, ...patch };
    Object.keys(next).forEach((key) => {
      const typedKey = key as keyof DualOutletCardConfig;
      if (next[typedKey] === '') {
        delete next[typedKey];
      }
    });
    this.config = next;
    fireConfigChanged(this, next);
  }

  private valueChanged(event: Event): void {
    const target = (event.currentTarget || event.target) as ConfigElement;
    const customEvent = event as CustomEvent<{ value?: string }>;

    if (!target.configValue) {
      return;
    }

    this.updateConfig({
      [target.configValue]:
        target.checked !== undefined
          ? target.checked
          : customEvent.detail?.value ?? target.value,
    } as Partial<DualOutletCardConfig>);
  }

  private renderEntityPicker(
    label: string,
    key: keyof DualOutletCardConfig,
  ): TemplateResult {
    return html`
      <ha-selector
        class="full"
        .hass=${this.hass}
        .label=${label}
        .selector=${{ entity: { domain: ['switch', 'light', 'input_boolean'] } }}
        .value=${this.config[key] ?? ''}
        .configValue=${key}
        @value-changed=${this.valueChanged}
      ></ha-selector>
    `;
  }

  private renderTextInput(
    label: string,
    key: keyof DualOutletCardConfig,
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
    key: keyof DualOutletCardConfig,
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
    key: keyof DualOutletCardConfig,
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
    key: keyof DualOutletCardConfig,
    options: string[],
    value: string,
  ): TemplateResult {
    return html`
      <ha-select
        .label=${label}
        .value=${this.config[key] ?? value}
        value=${this.config[key] ?? value}
        .configValue=${key}
        @change=${this.valueChanged}
        @closed=${(event: Event) => event.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${options.map(
          (option) => html`
            <mwc-list-item .value=${option} value=${option}>${option}</mwc-list-item>
          `,
        )}
      </ha-select>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="editor">
        <section class="section">
          <h3>Outlets</h3>
          <div class="grid">
            ${this.renderEntityPicker('Outlet 1 Entity', 'entity_1')}
            ${this.renderTextInput('Outlet 1 Name', 'name_1', 'Top Outlet')}
            ${this.renderIconPicker('Outlet 1 Icon', 'icon_1')}
            ${this.renderEntityPicker('Outlet 2 Entity', 'entity_2')}
            ${this.renderTextInput('Outlet 2 Name', 'name_2', 'Bottom Outlet')}
            ${this.renderIconPicker('Outlet 2 Icon', 'icon_2')}
          </div>
        </section>

        <section class="section">
          <h3>Layout</h3>
          <div class="grid">
            ${this.renderTextInput('Title', 'title', 'Outlets')}
            ${this.renderTextInput('Width', 'width', '320px')}
            ${this.renderTextInput('Button Height', 'button_height', '54px')}
            ${this.renderTextInput('Gap', 'gap', '12px')}
            ${this.renderSelect('Layout', 'layout', LAYOUTS, 'duplex')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Show Title', 'show_title', false)}
            ${this.renderSwitch('Show State', 'show_state', true)}
            ${this.renderSwitch('Fill Container', 'fill_container', false)}
            ${this.renderSwitch('Animated Glow', 'animated', true)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput('On Color', 'on_color', '#ff3b30')}
            ${this.renderTextInput('Off Color', 'off_color', '#697382')}
            ${this.renderTextInput('Background', 'background', '#101722')}
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

if (!customElements.get('dual-outlet-card-editor')) {
  customElements.define('dual-outlet-card-editor', DualOutletCardEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    'dual-outlet-card': DualOutletCard;
    'dual-outlet-card-editor': DualOutletCardEditor;
  }

  interface Window {
    customCards?: unknown[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  preview: true,
  type: 'dual-outlet-card',
  name: 'Dual Outlet Card',
  description: 'A two-outlet toggle card with red on-state glow.',
});
