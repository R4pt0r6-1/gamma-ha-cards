import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';

type HassEntity = {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    icon?: string;
    options?: string[];
    [key: string]: unknown;
  };
};

type HomeAssistant = {
  states: Record<string, HassEntity | undefined>;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ) => Promise<unknown> | void;
};

type VoiceSettingsRowConfig = {
  entity: string;
  name?: string;
  icon?: string;
};

interface VoiceSettingsCardConfig {
  type?: string;
  name?: string;
  rows?: VoiceSettingsRowConfig[];
  width?: string;
  fill_container?: boolean;
  border_radius?: string;
  background?: string;
}

type ConfigElement = HTMLInputElement & {
  checked?: boolean;
  configValue?: keyof VoiceSettingsCardConfig;
  rowIndex?: number;
  rowKey?: keyof VoiceSettingsRowConfig;
};

const DEFAULT_CONFIG: Omit<VoiceSettingsCardConfig, 'type'> = {
  name: 'Atom Echo Voice',
  width: '360px',
  fill_container: false,
  border_radius: '16px',
  background: '#101722',
};

const DEFAULT_ROWS: VoiceSettingsRowConfig[] = [
  {
    entity: 'select.m5stack_atom_echo_546544_response_speaker',
    name: 'Response speaker',
    icon: 'mdi:speaker-wireless',
  },
  {
    entity: 'select.m5stack_atom_echo_546544_assistant',
    name: 'Pipeline',
    icon: 'mdi:filter-outline',
  },
  {
    entity: 'select.m5stack_atom_echo_546544_wake_word',
    name: 'Wake word',
    icon: 'mdi:microphone-outline',
  },
  {
    entity: 'select.m5stack_atom_echo_546544_wake_word_engine_location',
    name: 'Wake word engine',
    icon: 'mdi:format-list-bulleted',
  },
];

function fireConfigChanged(
  element: HTMLElement,
  config: Partial<VoiceSettingsCardConfig>,
): void {
  element.dispatchEvent(
    new CustomEvent('config-changed', {
      detail: { config },
      bubbles: true,
      composed: true,
    }),
  );
}

function humanize(value: string | undefined): string {
  if (!value || ['unknown', 'unavailable'].includes(value)) {
    return 'Unknown';
  }

  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export class VoiceSettingsCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  public hass?: HomeAssistant;
  private config!: VoiceSettingsCardConfig;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --voice-card-width: 360px;
        --voice-card-radius: 16px;
        --voice-background: #101722;
        --voice-accent: #82d6ff;

        display: block;
        max-width: var(--voice-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .voice-card {
        backdrop-filter: blur(18px) saturate(1.3);
        -webkit-backdrop-filter: blur(18px) saturate(1.3);
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--voice-background) 70%, transparent),
            color-mix(in srgb, var(--voice-background) 86%, transparent)
          ),
          linear-gradient(135deg, rgb(255 255 255 / 11%), rgb(255 255 255 / 3%));
        border: 1px solid rgb(255 255 255 / 12%);
        border-radius: var(--voice-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 14%),
          inset 0 -1px 0 rgb(255 255 255 / 4%),
          0 10px 26px rgb(0 0 0 / 22%);
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        container-type: inline-size;
        display: grid;
        gap: 10px;
        overflow: hidden;
        padding: 14px;
        position: relative;
      }

      .voice-card::before {
        background:
          radial-gradient(circle at 16% 0%, rgb(130 214 255 / 18%), transparent 34%),
          radial-gradient(circle at 92% 10%, rgb(147 116 255 / 14%), transparent 32%);
        content: '';
        inset: 0;
        opacity: 0.75;
        pointer-events: none;
        position: absolute;
      }

      .title,
      .rows {
        position: relative;
        z-index: 1;
      }

      .title {
        align-items: center;
        display: flex;
        justify-content: space-between;
        min-width: 0;
      }

      h2 {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 18px;
        font-weight: 740;
        letter-spacing: 0;
        line-height: 1.1;
        margin: 0;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .badge {
        align-items: center;
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        display: inline-flex;
        flex: 0 0 auto;
        height: 24px;
        justify-content: center;
        width: 24px;
      }

      .badge ha-icon {
        --mdc-icon-size: 15px;
      }

      .rows {
        display: grid;
        gap: 7px;
      }

      .row {
        align-items: center;
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 10px;
        display: grid;
        gap: 9px;
        grid-template-columns: 28px minmax(0, 1fr);
        min-width: 0;
        padding: 8px 9px;
      }

      .icon-wrap {
        align-items: center;
        background: color-mix(in srgb, var(--voice-accent) 15%, rgb(255 255 255 / 6%));
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 8px;
        color: var(--voice-accent);
        display: inline-flex;
        height: 28px;
        justify-content: center;
        width: 28px;
      }

      .icon-wrap ha-icon {
        --mdc-icon-size: 16px;
      }

      .row-main {
        display: grid;
        gap: 5px;
        min-width: 0;
      }

      .row-label {
        color: var(--secondary-text-color, #aeb8c6);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
      }

      select {
        appearance: none;
        -webkit-appearance: none;
        background:
          linear-gradient(180deg, rgb(255 255 255 / 7%), rgb(255 255 255 / 4%)),
          linear-gradient(45deg, transparent 50%, currentColor 50%),
          linear-gradient(135deg, currentColor 50%, transparent 50%);
        background-position:
          0 0,
          calc(100% - 12px) 50%,
          calc(100% - 8px) 50%;
        background-repeat: no-repeat;
        background-size:
          100% 100%,
          4px 4px,
          4px 4px;
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 8px;
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        font: inherit;
        font-size: 12.5px;
        font-weight: 650;
        height: 32px;
        letter-spacing: 0;
        min-width: 0;
        overflow: hidden;
        padding: 0 24px 0 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }

      select:focus-visible {
        outline: 2px solid var(--voice-accent);
        outline-offset: 2px;
      }

      select:disabled {
        cursor: default;
        opacity: 0.45;
      }

      option {
        background: #192230;
        color: #f4f7fb;
      }

      @container (max-width: 280px) {
        .voice-card {
          padding: 12px;
        }

        h2 {
          font-size: 16px;
        }

        .row {
          grid-template-columns: 24px minmax(0, 1fr);
          padding: 7px;
        }

        .icon-wrap {
          height: 24px;
          width: 24px;
        }
      }
    `;
  }

  public static getStubConfig() {
    return {
      type: 'custom:voice-settings-card',
      name: 'Atom Echo Voice',
      rows: DEFAULT_ROWS,
    };
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement('voice-settings-card-editor');
  }

  public setConfig(config: VoiceSettingsCardConfig): void {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    this.style.setProperty(
      '--voice-card-width',
      this.config.fill_container ? '100%' : this.config.width ?? '360px',
    );
    this.style.setProperty(
      '--voice-card-radius',
      this.config.border_radius ?? '16px',
    );
    this.style.setProperty('--voice-background', this.config.background ?? '#101722');
  }

  public getCardSize(): number {
    return 4;
  }

  public getGridOptions() {
    return {
      rows: 'auto',
      columns: 6,
      min_rows: 3,
      max_rows: 8,
      min_columns: 4,
      max_columns: 8,
    };
  }

  private entity(entityId: string): HassEntity | undefined {
    return this.hass?.states[entityId];
  }

  private rows(): VoiceSettingsRowConfig[] {
    return this.config.rows?.length ? this.config.rows : DEFAULT_ROWS;
  }

  private optionLabel(value: string): string {
    return humanize(value.replace(/\s+\([^)]+\)$/u, ''));
  }

  private selectOption(entityId: string, option: string): void {
    this.hass?.callService('select', 'select_option', {
      entity_id: entityId,
      option,
    });
  }

  private renderRow(row: VoiceSettingsRowConfig): TemplateResult {
    const entity = this.entity(row.entity);
    const options = entity?.attributes.options ?? [];
    const value = entity?.state ?? '';
    const hasCurrentOption = options.includes(value);

    return html`
      <div class="row">
        <span class="icon-wrap">
          <ha-icon icon=${row.icon ?? entity?.attributes.icon ?? 'mdi:tune-variant'}></ha-icon>
        </span>
        <div class="row-main">
          <span class="row-label">
            ${row.name ?? entity?.attributes.friendly_name ?? row.entity}
          </span>
          <select
            .value=${value}
            ?disabled=${!options.length}
            @change=${(event: Event) => {
              const target = event.target as HTMLSelectElement;
              this.selectOption(row.entity, target.value);
            }}
          >
            ${!options.length
              ? html`<option value="">Entity unavailable</option>`
              : nothing}
            ${!hasCurrentOption && value
              ? html`<option .value=${value}>${this.optionLabel(value)}</option>`
              : nothing}
            ${options.map(
              (option) => html`
                <option .value=${option}>${this.optionLabel(option)}</option>
              `,
            )}
          </select>
        </div>
      </div>
    `;
  }

  protected render(): TemplateResult {
    if (!this.config) {
      return html``;
    }

    return html`
      <ha-card>
        <article class="voice-card">
          <header class="title">
            <h2>${this.config.name ?? 'Atom Echo Voice'}</h2>
            <span class="badge">
              <ha-icon icon="mdi:account-voice"></ha-icon>
            </span>
          </header>
          <div class="rows">
            ${this.rows().map((row) => this.renderRow(row))}
          </div>
        </article>
      </ha-card>
    `;
  }
}

if (!customElements.get('voice-settings-card')) {
  customElements.define('voice-settings-card', VoiceSettingsCard);
}

class VoiceSettingsCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  public hass?: HomeAssistant;
  private config: Partial<VoiceSettingsCardConfig> = {};

  static get styles(): CSSResultGroup {
    return css`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
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

      .rows {
        display: grid;
        gap: 10px;
      }

      .row {
        border-top: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
        display: grid;
        gap: 10px;
        padding-top: 10px;
      }

      .row:first-child {
        border-top: 0;
        padding-top: 0;
      }

      .row-title {
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-textfield {
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

  public setConfig(config: VoiceSettingsCardConfig): void {
    this.config = {
      ...config,
      rows: config.rows?.length ? config.rows : DEFAULT_ROWS,
    };
  }

  private updateConfig(patch: Partial<VoiceSettingsCardConfig>): void {
    const next = { ...this.config, ...patch };
    Object.keys(next).forEach((key) => {
      const typedKey = key as keyof VoiceSettingsCardConfig;
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
    } as Partial<VoiceSettingsCardConfig>);
  }

  private rowValueChanged(event: Event): void {
    const target = event.target as ConfigElement;
    const customEvent = event as CustomEvent<{ value?: string }>;

    const rowIndex = target.rowIndex;
    const rowKey = target.rowKey;

    if (rowIndex === undefined || !rowKey) {
      return;
    }

    const rows = [...(this.config.rows?.length ? this.config.rows : DEFAULT_ROWS)];
    rows[rowIndex] = {
      ...rows[rowIndex],
      [rowKey]: customEvent.detail?.value ?? target.value,
    };

    Object.keys(rows[rowIndex]).forEach((key) => {
      const typedKey = key as keyof VoiceSettingsRowConfig;
      if (rows[rowIndex][typedKey] === '') {
        delete rows[rowIndex][typedKey];
      }
    });

    this.updateConfig({ rows });
  }

  private renderTextInput(
    label: string,
    key: keyof VoiceSettingsCardConfig,
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

  private renderSwitch(
    label: string,
    key: keyof VoiceSettingsCardConfig,
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

  private renderRowInput(
    row: VoiceSettingsRowConfig,
    index: number,
    key: keyof VoiceSettingsRowConfig,
    label: string,
    placeholder = '',
  ): TemplateResult {
    return html`
      <ha-textfield
        .label=${label}
        .placeholder=${placeholder}
        .value=${row[key] ?? ''}
        .rowIndex=${index}
        .rowKey=${key}
        @input=${this.rowValueChanged}
      ></ha-textfield>
    `;
  }

  private renderRows(): TemplateResult {
    const rows = this.config.rows?.length ? this.config.rows : DEFAULT_ROWS;

    return html`
      <div class="rows">
        ${rows.map(
          (row, index) => html`
            <div class="row">
              <span class="row-title">${row.name ?? `Row ${index + 1}`}</span>
              <div class="grid">
                ${this.renderRowInput(row, index, 'name', 'Name', 'Pipeline')}
                ${this.renderRowInput(row, index, 'icon', 'Icon', 'mdi:microphone-outline')}
                ${this.renderRowInput(row, index, 'entity', 'Entity', 'select.example')}
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          <div class="grid">
            ${this.renderTextInput('Card Name', 'name', 'Atom Echo Voice')}
            ${this.renderTextInput('Width', 'width', '360px')}
            ${this.renderTextInput('Radius', 'border_radius', '16px')}
            ${this.renderTextInput('Background', 'background', '#101722')}
          </div>
          <div class="grid">
            ${this.renderSwitch('Fill Container', 'fill_container', false)}
          </div>
        </section>

        <section class="section">
          <h3>Rows</h3>
          ${this.renderRows()}
        </section>
      </div>
    `;
  }
}

if (!customElements.get('voice-settings-card-editor')) {
  customElements.define('voice-settings-card-editor', VoiceSettingsCardEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    'voice-settings-card': VoiceSettingsCard;
    'voice-settings-card-editor': VoiceSettingsCardEditor;
  }

  interface Window {
    customCards?: unknown[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  preview: true,
  type: 'voice-settings-card',
  name: 'Voice Settings Card',
  description: 'A compact glass card for voice assistant select controls.',
});
