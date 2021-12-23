import { LitElement, html, css } from "lit-element";
import { EMPTY_DATE, NOW, isEmpty, initializeDate } from "./utils/index.js";
import { MONTHS } from "./month-table.js";
import "@meveo-org/mv-container";
import "@meveo-org/mv-input";
import "./calendar-input.js";
import "./calendar-table.js";
import "./month-table.js";
import "./year-table.js";
export class SingleCalendar extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      theme: { type: String },
      placeholder: { type: String },
      selected: { type: Object, attribute: true, reflect: true },
      visible: { type: Object, attribute: false, reflect: true },
      inputDate: { type: String, attribute: false, reflect: true },
      monthTableVisible: { type: Boolean, attribute: false, reflect: true },
      yearTableVisible: { type: Boolean, attribute: false, reflect: true },
      noBorder: { type: Boolean, attribute: "no-border", reflect: true },
      inlineInput: { type: Boolean, attribute: "inline-input", reflect: true },
      mondayFirst: { type: Boolean, attribute: "monday-first", reflect: true },
      minYear: { type: Number, attribute: "min-year", reflect: true },
      maxYear: { type: Number, attribute: "max-year", reflect: true },
      hasError: { type: Boolean, attribute: "has-error", reflect: true },
      pattern: { type: String },
      patternRegex: { type: String, attribute: "pattern-regex", reflect: true },
      patternMatcher: {
        type: String,
        attribute: "pattern-matcher",
        reflect: true,
      },
      allowPartial: {
        type: Boolean,
        attribute: "allow-partial",
        reflect: true,
      },
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family);
        --font-size: var(--font-size-m, 1rem);
        --mv-container-padding: 10px;
        --mv-container-margin: 0;
      }

      .light {
        --theme-text-color: #000000;
        --theme-disabled-text: #ededed;
        --theme-background: #ffffff;
        --theme-today-color: #3d3d3d;
        --theme-today-background: #ededed;
      }

      .dark {
        --theme-text-color: #ffffff;
        --theme-disabled-text: #666666;
        --theme-background: #373e48;
        --theme-today-color: #cccccc;
        --theme-today-background: #6d6d6d;
      }

      .mv-calendar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0 1px 3px 3px;
      }

      .year-month-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
      }

      .year-month-container * {
        margin: 2px;
      }

      .current-month,
      .current-year {
        font-family: var(--font-family);
        font-size: var(--font-size);
        display: inline-block;
        border: none;
        text-decoration: none;
        background: transparent;
        color: var(--theme-text-color);
        text-transform: none;
        cursor: pointer;
        text-align: center;
        padding: 5px;
        margin: 5px auto;
        border-radius: 5px;
        font-weight: 500;
        width: 100%;
        outline: none;
      }

      .current-month:hover,
      .current-year:hover {
        background-color: var(--hover-background-color, #666);
        color: #ffffff;
      }
    `;
  }

  constructor() {
    super();
    this.theme = "light";
    this.pattern = "MM/DD/YYYY";
    this.patternMatcher = "MDY";
    this.patternRegex = "\\d";
    this.noBorder = false;
    this.inlineInput = false;
    this.mondayFirst = false;
    this.allowPartial = false;
    this.monthTableVisible = false;
    this.yearTableVisible = false;
    this.selected = { ...EMPTY_DATE };
    this.visible = { ...NOW };
  }

  render() {
    if (this.noBorder) {
      return this.renderCalendar();
    }
    return html`
      <mv-container .theme="${this.theme}">
        ${this.renderCalendar()}
      </mv-container>
    `;
  }

  renderCalendar = () => {
    const { selected, visible } = this;
    const selectedMonth = this.monthTableVisible ? " selected" : "";
    const selectedYear = this.yearTableVisible ? " selected" : "";
    const monthButton = `current-month${selectedMonth}`;
    const yearButton = `current-year${selectedYear}`;

    return html`
      <div class="mv-calendar ${this.theme}">
        <slot name="header">
          ${this.inlineInput
            ? html`
                <div class="inline-input">
                  <calendar-input
                    rounded
                    min-year="${this.minYear}"
                    max-year="${this.maxYear}"
                    .placeholder="${this.placeholder}"
                    .theme="${this.theme}"
                    .visible="${this.visible}"
                    .selected="${this.selected}"
                    .pattern="${this.pattern}"
                    .pattern-matcher="${this.patternMatcher}"
                    .pattern-regex="${this.patternRegex}"
                    ?allow-partial="${this.allowPartial}"
                    ?no-clear-button="${this.noClearButton}"
                    @select-date="${this.updateSelected}"
                  ></calendar-input>
                </div>
              `
            : html``}
        </slot>
        <div class="year-month-container">
          <button class="${monthButton}" @click="${this.toggleMonthTable}">
            ${MONTHS[visible.month]}
          </button>
          <button class="${yearButton}" @click="${this.toggleYearTable}">
            ${visible.year || NOW.year}
          </button>
        </div>
        ${this.monthTableVisible
          ? html`
              <month-table
                .visible="${visible}"
                .selected="${selected}"
                @select-month="${this.updateMonth}"
              ></month-table>
            `
          : html``}
        ${this.yearTableVisible
          ? html`
              <year-table
                min-year="${this.minYear}"
                max-year="${this.maxYear}"
                .visible="${visible}"
                .selected="${selected}"
                @select-year="${this.updateYear}"
              ></year-table>
            `
          : html``}
        ${!this.monthTableVisible && !this.yearTableVisible
          ? html`
              <calendar-table
                class="${this.theme}"
                .visible="${visible}"
                .selected="${selected}"
                ?monday-first="${this.mondayFirst}"
                @select-date="${this.updateDay}"
              ></calendar-table>
            `
          : html``}
        <slot name="footer"></slot>
      </div>
    `;
  };

  connectedCallback() {
    const hasSelectedDate = !isEmpty(this.selected);
    this.visible = hasSelectedDate ? this.selected : this.visible || NOW;
    super.connectedCallback();
  }

  toggleMonthTable = () => {
    this.monthTableVisible = !this.monthTableVisible;
    this.yearTableVisible = false;
  };

  toggleYearTable = () => {
    this.yearTableVisible = !this.yearTableVisible;
    this.monthTableVisible = false;
  };

  updateDay = (event) => {
    const { detail } = event;
    const { day, month, year } = detail;
    const isEmptyDate = isEmpty({ day, month, year });
    this.visible = isEmptyDate ? { ...NOW } : { day, month, year };
    const selected = isEmptyDate
      ? { ...EMPTY_DATE }
      : { date: new Date(year, month, day), day, month, year };
    this.dispatchUpdates(selected);
  };

  updateMonth = (event) => {
    const { detail } = event;
    const { month } = detail;
    this.visible = { ...this.visible, month };
    if (this.allowPartial) {
      const year = !!this.selected.year ? this.selected.year : NOW.year;
      const selected = {
        ...initializeDate(this.selected),
        day: "",
        month,
        year,
      };
      this.dispatchUpdates(selected);
    }
    this.monthTableVisible = false;
  };

  updateYear = (event) => {
    const { detail } = event;
    const { year } = detail;
    this.visible = { ...this.visible, year };
    if (this.allowPartial) {
      const sameMonth = this.visible.month === this.selected.month;
      const sameYear = this.visible.year === this.selected.year;
      const day = sameMonth && sameYear ? this.selected.day : "";
      const selected = { ...initializeDate(this.selected), day, year };
      this.dispatchUpdates(selected);
    }
    this.yearTableVisible = false;
  };

  updateSelected = (event) => {
    const {
      detail: { selected, visible },
    } = event;
    this.visible = visible;
    this.dispatchUpdates(selected);
  };

  dispatchUpdates = (selected) => {
    const { visible, name } = this;
    this.dispatchEvent(
      new CustomEvent("select-date", { detail: { name, selected, visible } })
    );
  };
}

customElements.define("single-calendar", SingleCalendar);
