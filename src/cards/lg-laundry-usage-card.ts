import { LitElement, css, html, nothing } from 'lit';
import type { CSSResultGroup, TemplateResult } from 'lit';
import {
  entityDurationMinutes,
  formatDuration,
  formatEnergyCost,
  isUnavailable,
  parseCentsPerKwh,
  parseEnergyKwh,
} from './lg-laundry-card';
import type { HassEntity, HomeAssistant } from './lg-laundry-card';

interface LgLaundryUsageCardConfig {
  type?: string;
  name?: string;
  washer_energy_entity?: string;
  dryer_energy_entity?: string;
  washer_energy_yesterday_entity?: string;
  dryer_energy_yesterday_entity?: string;
  washer_energy_last_month_entity?: string;
  dryer_energy_last_month_entity?: string;
  washer_cycles_entity?: string;
  dryer_cycles_entity?: string;
  washer_total_time_entity?: string;
  dryer_total_time_entity?: string;
  energy_price_cents_per_kwh?: number | string;
  width?: string;
  fill_container?: boolean;
  border_radius?: string;
  background?: string;
}

type ChartSeries = {
  label: string;
  washerEntity?: string;
  dryerEntity?: string;
};

const DEFAULT_CONFIG: Omit<LgLaundryUsageCardConfig, 'type'> = {
  name: 'Laundry usage',
  width: '500px',
  fill_container: true,
  border_radius: '16px',
  background: '#101722',
  energy_price_cents_per_kwh: undefined,
};

function formatKwh(value: number | undefined): string {
  if (value === undefined) {
    return '--';
  }

  return `${new Intl.NumberFormat(undefined, {
    maximumFractionDigits: value >= 10 ? 1 : 2,
    minimumFractionDigits: value >= 10 ? 1 : 2,
  }).format(value)} kWh`;
}

function formatMoney(value: number | undefined): string {
  if (value === undefined) {
    return '--';
  }

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: string | undefined): string {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return '--';
  }

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(numeric);
}

export class LgLaundryUsageCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  public hass?: HomeAssistant;
  private config!: LgLaundryUsageCardConfig;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --laundry-usage-width: 500px;
        --laundry-usage-radius: 16px;
        --laundry-usage-background: #101722;
        --washer-color: #2f8cff;
        --dryer-color: #ff5a2f;

        display: block;
        max-width: var(--laundry-usage-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .usage-card {
        backdrop-filter: blur(18px) saturate(1.32);
        -webkit-backdrop-filter: blur(18px) saturate(1.32);
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--laundry-usage-background) 70%, transparent),
            color-mix(in srgb, var(--laundry-usage-background) 86%, transparent)
          ),
          linear-gradient(135deg, rgb(255 255 255 / 11%), rgb(255 255 255 / 3%));
        border: 1px solid rgb(255 255 255 / 12%);
        border-radius: var(--laundry-usage-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 14%),
          inset 0 -1px 0 rgb(255 255 255 / 4%),
          0 10px 26px rgb(0 0 0 / 22%);
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        container-type: inline-size;
        display: grid;
        gap: 12px;
        overflow: hidden;
        padding: 14px;
        position: relative;
      }

      .usage-card::before {
        background:
          radial-gradient(circle at 18% 0%, rgb(47 140 255 / 18%), transparent 34%),
          radial-gradient(circle at 88% 8%, rgb(255 90 47 / 16%), transparent 32%);
        content: '';
        inset: 0;
        opacity: 0.8;
        pointer-events: none;
        position: absolute;
      }

      .header,
      .hero,
      .summary-grid,
      .chart {
        position: relative;
        z-index: 1;
      }

      .header {
        align-items: start;
        display: flex;
        gap: 12px;
        justify-content: space-between;
        min-width: 0;
      }

      .title {
        display: grid;
        gap: 3px;
        min-width: 0;
      }

      .eyebrow {
        color: var(--secondary-text-color, #9aa3b1);
        font-size: 9.5px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1;
        text-transform: uppercase;
      }

      h2 {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 15px;
        font-weight: 750;
        letter-spacing: 0;
        line-height: 1.1;
        margin: 0;
      }

      .rate {
        align-items: center;
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: 999px;
        color: var(--secondary-text-color, #c0cad7);
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 10.5px;
        font-weight: 650;
        gap: 5px;
        min-height: 25px;
        padding: 0 9px;
      }

      .rate ha-icon {
        --mdc-icon-size: 14px;
        color: #ffd36a;
      }

      .hero {
        align-items: end;
        display: grid;
        gap: 8px;
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .hero-main {
        display: grid;
        gap: 3px;
        min-width: 0;
      }

      .hero-label {
        color: var(--secondary-text-color, #aeb8c6);
        font-size: 10.5px;
        font-weight: 650;
      }

      .hero-value {
        color: var(--primary-text-color, #ffffff);
        font-size: 30px;
        font-weight: 780;
        letter-spacing: 0;
        line-height: 1;
      }

      .hero-sub {
        color: var(--secondary-text-color, #aeb8c6);
        font-size: 11px;
        line-height: 1.25;
      }

      .split-pill {
        align-items: center;
        display: grid;
        gap: 5px;
        grid-template-columns: auto auto;
        justify-content: end;
      }

      .split-item {
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 8px;
        display: grid;
        gap: 2px;
        min-width: 66px;
        padding: 6px 8px;
      }

      .split-item span {
        color: var(--secondary-text-color, #aeb8c6);
        font-size: 9.5px;
        font-weight: 650;
      }

      .split-item strong {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 12px;
        font-weight: 750;
      }

      .summary-grid {
        display: grid;
        gap: 7px;
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .summary {
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 7%);
        border-radius: 9px;
        display: grid;
        gap: 3px;
        min-width: 0;
        padding: 7px 8px;
      }

      .summary span {
        color: var(--secondary-text-color, #9aa3b1);
        font-size: 9.5px;
        font-weight: 650;
        letter-spacing: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .summary strong {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 12px;
        font-weight: 760;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .chart {
        display: grid;
        gap: 9px;
      }

      .chart-row {
        display: grid;
        gap: 5px;
      }

      .chart-head {
        align-items: center;
        color: var(--secondary-text-color, #b7c0ce);
        display: flex;
        font-size: 10.5px;
        font-weight: 650;
        justify-content: space-between;
      }

      .chart-head strong {
        color: var(--primary-text-color, #f4f7fb);
        font-weight: 760;
      }

      .bar-line {
        align-items: center;
        display: grid;
        gap: 7px;
        grid-template-columns: 48px minmax(0, 1fr) 54px;
        min-width: 0;
      }

      .bar-label,
      .bar-value {
        color: var(--secondary-text-color, #c3ccd8);
        font-size: 10.5px;
        font-weight: 650;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .bar-value {
        color: var(--primary-text-color, #f4f7fb);
        text-align: right;
      }

      .bar-track {
        background: rgb(255 255 255 / 7%);
        border-radius: 999px;
        height: 8px;
        overflow: hidden;
        position: relative;
      }

      .bar-fill {
        background: var(--bar-color);
        border-radius: inherit;
        box-shadow: 0 0 12px color-mix(in srgb, var(--bar-color) 40%, transparent);
        display: block;
        height: 100%;
        min-width: var(--bar-min-width);
        width: var(--bar-width);
      }

      @container (max-width: 390px) {
        .usage-card {
          padding: 12px;
        }

        .hero {
          align-items: stretch;
          grid-template-columns: 1fr;
        }

        .split-pill {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          justify-content: stretch;
        }

        .summary-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @container (max-width: 280px) {
        .header {
          display: grid;
        }

        .hero-value {
          font-size: 24px;
        }

        .bar-line {
          grid-template-columns: 42px minmax(0, 1fr) 46px;
        }
      }
    `;
  }

  public static getStubConfig() {
    return {
      type: 'custom:lg-laundry-usage-card',
      washer_energy_entity: 'sensor.washer_energy_this_month',
      dryer_energy_entity: 'sensor.dryer_energy_this_month',
    };
  }

  public setConfig(config: LgLaundryUsageCardConfig): void {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    this.style.setProperty(
      '--laundry-usage-width',
      this.config.fill_container ? '100%' : this.config.width ?? '500px',
    );
    this.style.setProperty(
      '--laundry-usage-radius',
      this.config.border_radius ?? '16px',
    );
    this.style.setProperty(
      '--laundry-usage-background',
      this.config.background ?? '#101722',
    );
  }

  public getCardSize(): number {
    return 5;
  }

  public getGridOptions() {
    return {
      rows: 'auto',
      columns: 6,
      min_rows: 4,
      max_rows: 8,
      min_columns: 4,
      max_columns: 12,
    };
  }

  private entity(entityId?: string): HassEntity | undefined {
    return entityId ? this.hass?.states[entityId] : undefined;
  }

  private energy(entityId?: string): number | undefined {
    return parseEnergyKwh(this.entity(entityId));
  }

  private cost(entityId?: string): number | undefined {
    const kwh = this.energy(entityId);
    const cents = parseCentsPerKwh(this.config.energy_price_cents_per_kwh);

    if (kwh === undefined || cents === undefined) {
      return undefined;
    }

    return (kwh * cents) / 100;
  }

  private displayEnergy(entityId?: string): string {
    const entity = this.entity(entityId);
    const cost = formatEnergyCost(entity, this.config.energy_price_cents_per_kwh);
    return cost ?? formatKwh(parseEnergyKwh(entity));
  }

  private displayTotal(washerEntity?: string, dryerEntity?: string): string {
    const washerCost = this.cost(washerEntity);
    const dryerCost = this.cost(dryerEntity);

    if (washerCost !== undefined || dryerCost !== undefined) {
      return formatMoney((washerCost ?? 0) + (dryerCost ?? 0));
    }

    const washerKwh = this.energy(washerEntity);
    const dryerKwh = this.energy(dryerEntity);
    if (washerKwh === undefined && dryerKwh === undefined) {
      return '--';
    }

    return formatKwh((washerKwh ?? 0) + (dryerKwh ?? 0));
  }

  private totalMonthCost(): number | undefined {
    const washer = this.cost(this.config.washer_energy_entity);
    const dryer = this.cost(this.config.dryer_energy_entity);

    if (washer === undefined && dryer === undefined) {
      return undefined;
    }

    return (washer ?? 0) + (dryer ?? 0);
  }

  private totalMonthEnergy(): number | undefined {
    const washer = this.energy(this.config.washer_energy_entity);
    const dryer = this.energy(this.config.dryer_energy_entity);

    if (washer === undefined && dryer === undefined) {
      return undefined;
    }

    return (washer ?? 0) + (dryer ?? 0);
  }

  private totalCycles(): string {
    const washer = this.entity(this.config.washer_cycles_entity);
    const dryer = this.entity(this.config.dryer_cycles_entity);
    const washerCycles = isUnavailable(washer) ? undefined : Number(washer?.state);
    const dryerCycles = isUnavailable(dryer) ? undefined : Number(dryer?.state);

    if (Number.isFinite(washerCycles) || Number.isFinite(dryerCycles)) {
      const washerCount = Number.isFinite(washerCycles) ? Number(washerCycles) : 0;
      const dryerCount = Number.isFinite(dryerCycles) ? Number(dryerCycles) : 0;
      return formatNumber(String(washerCount + dryerCount));
    }

    return formatNumber(washer?.state);
  }

  private totalTime(): string {
    const washer = entityDurationMinutes(this.entity(this.config.washer_total_time_entity));
    const dryer = entityDurationMinutes(this.entity(this.config.dryer_total_time_entity));

    if (washer === undefined && dryer === undefined) {
      return '--';
    }

    return formatDuration((washer ?? 0) + (dryer ?? 0));
  }

  private dryerShare(): string {
    const washer = this.energy(this.config.washer_energy_entity);
    const dryer = this.energy(this.config.dryer_energy_entity);

    if (!dryer || washer === undefined) {
      return 'Usage split';
    }

    const total = washer + dryer;
    if (!total) {
      return 'Usage split';
    }

    return `${Math.round((dryer / total) * 100)}% dryer`;
  }

  private chartValue(entityId?: string): number | undefined {
    return this.cost(entityId) ?? this.energy(entityId);
  }

  private barStyle(value: number | undefined, max: number, color: string): string {
    const percent = value && max > 0 ? Math.max(4, Math.min(100, (value / max) * 100)) : 0;
    const minWidth = value && max > 0 ? '5px' : '0px';
    return `--bar-color: ${color}; --bar-width: ${percent}%; --bar-min-width: ${minWidth};`;
  }

  private renderBar(
    label: string,
    entityId: string | undefined,
    max: number,
    color: string,
  ): TemplateResult {
    const value = this.chartValue(entityId);

    return html`
      <div class="bar-line">
        <span class="bar-label">${label}</span>
        <span class="bar-track">
          <span
            class="bar-fill"
            style=${this.barStyle(value, max, color)}
          ></span>
        </span>
        <span class="bar-value">${this.displayEnergy(entityId)}</span>
      </div>
    `;
  }

  private renderChartRow(series: ChartSeries): TemplateResult | typeof nothing {
    const washerValue = this.chartValue(series.washerEntity);
    const dryerValue = this.chartValue(series.dryerEntity);
    const max = Math.max(washerValue ?? 0, dryerValue ?? 0);

    if (!max) {
      return nothing;
    }

    return html`
      <div class="chart-row">
        <div class="chart-head">
          <span>${series.label}</span>
          <strong>${this.displayTotal(series.washerEntity, series.dryerEntity)}</strong>
        </div>
        ${this.renderBar('Washer', series.washerEntity, max, 'var(--washer-color)')}
        ${this.renderBar('Dryer', series.dryerEntity, max, 'var(--dryer-color)')}
      </div>
    `;
  }

  protected render(): TemplateResult {
    if (!this.config) {
      return html``;
    }

    const series: ChartSeries[] = [
      {
        label: 'This month',
        washerEntity: this.config.washer_energy_entity,
        dryerEntity: this.config.dryer_energy_entity,
      },
      {
        label: 'Yesterday',
        washerEntity: this.config.washer_energy_yesterday_entity,
        dryerEntity: this.config.dryer_energy_yesterday_entity,
      },
      {
        label: 'Last month',
        washerEntity: this.config.washer_energy_last_month_entity,
        dryerEntity: this.config.dryer_energy_last_month_entity,
      },
    ];
    const monthCost = this.totalMonthCost();
    const monthEnergy = this.totalMonthEnergy();
    const cents = parseCentsPerKwh(this.config.energy_price_cents_per_kwh);

    return html`
      <ha-card>
        <article class="usage-card">
          <header class="header">
            <div class="title">
              <span class="eyebrow">Laundry</span>
              <h2>${this.config.name ?? 'Laundry usage'}</h2>
            </div>
            ${cents
              ? html`
                  <span class="rate">
                    <ha-icon icon="mdi:lightning-bolt"></ha-icon>
                    ${cents}c/kWh
                  </span>
                `
              : nothing}
          </header>

          <section class="hero">
            <div class="hero-main">
              <span class="hero-label">This month</span>
              <span class="hero-value">
                ${monthCost !== undefined ? formatMoney(monthCost) : formatKwh(monthEnergy)}
              </span>
              <span class="hero-sub">${this.dryerShare()}</span>
            </div>
            <div class="split-pill">
              <span class="split-item">
                <span>Washer</span>
                <strong>${this.displayEnergy(this.config.washer_energy_entity)}</strong>
              </span>
              <span class="split-item">
                <span>Dryer</span>
                <strong>${this.displayEnergy(this.config.dryer_energy_entity)}</strong>
              </span>
            </div>
          </section>

          <section class="summary-grid">
            <div class="summary">
              <span>Energy</span>
              <strong>${formatKwh(monthEnergy)}</strong>
            </div>
            <div class="summary">
              <span>Cycles</span>
              <strong>${this.totalCycles()}</strong>
            </div>
            <div class="summary">
              <span>Time</span>
              <strong>${this.totalTime()}</strong>
            </div>
            <div class="summary">
              <span>Yesterday</span>
              <strong>
                ${this.displayTotal(
                  this.config.washer_energy_yesterday_entity,
                  this.config.dryer_energy_yesterday_entity,
                )}
              </strong>
            </div>
          </section>

          <section class="chart">
            ${series.map((item) => this.renderChartRow(item))}
          </section>
        </article>
      </ha-card>
    `;
  }
}

if (!customElements.get('lg-laundry-usage-card')) {
  customElements.define('lg-laundry-usage-card', LgLaundryUsageCard);
}

declare global {
  interface HTMLElementTagNameMap {
    'lg-laundry-usage-card': LgLaundryUsageCard;
  }

  interface Window {
    customCards?: unknown[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  preview: true,
  type: 'lg-laundry-usage-card',
  name: 'LG Laundry Usage Card',
  description: 'A glassy laundry energy and cost analytics card.',
});
