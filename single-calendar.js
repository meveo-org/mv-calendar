import { LitElement, html, css } from "lit-element";
import { MONTHS } from "./month-table.js";
import "mv-container";
import "mv-input";
import "./calendar-table.js";
import "./month-table.js";
import "./year-table.js";

export class SingleCalendar extends LitElement {
  static get properties() {
    return {
      theme: { type: String },
      placeholder: { type: String },
      pattern: { type: String },
      "visible-month": { type: Object, attribute: false, reflect: true },
      "selected-date": { type: Object, attribute: false, reflect: true },
      inputDate: { type: String, attribute: false, reflect: true },
      monthTableVisible: { type: Boolean, attribute: false, reflect: true },
      yearTableVisible: { type: Boolean, attribute: false, reflect: true },
      noBorder: { type: Boolean, attribute: "no-border", reflect: true },
      inlineInput: { type: Boolean, attribute: "inline-input", reflect: true },
      mondayFirst: { type: Boolean, attribute: "monday-first", reflect: true },
      minYear: { type: Number, attribute: "min-year", reflect: true },
      maxYear: { type: Number, attribute: "max-year", reflect: true },
      hasError: { type: Boolean, attribute: "has-error", reflect: true },
      patternRegex: { type: String, attribute: "pattern-regex", reflect: true },
      patternMatcher: {
        type: String,
        attribute: "pattern-matcher",
        reflect: true,
      },
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family);
        --font-size: var(--font-size-m, 1rem);
        --width: var(--mv-calendar-width, calc(var(--font-size) * 16));
        --mv-container-min-width: calc(var(--width) + 4px);
        --mv-container-max-width: calc(var(--width) + 4px);
        --mv-container-padding: 10px;
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
        width: var(--width);
      }

      .year-month-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-left: 5px;
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
    this.noBorder = false;
    this.inlineInput = false;
    this.mondayFirst = false;
    this.pattern = "MM/DD/YYYY";
    this.patternMatcher = "MDY";
    this.patternRegex = "\\d";
    this.monthTableVisible = false;
    this.yearTableVisible = false;
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
    const visibleMonth = this["visible-month"];
    const selectedDate = this["selected-date"];
    const currentMonth = visibleMonth.getMonth();
    const currentYear = visibleMonth.getFullYear();
    const currentMonthName = MONTHS[currentMonth];
    const monthButtonClass = `current-month${
      this.monthTableVisible ? " selected" : ""
    }`;
    const yearButtonClass = `current-year${
      this.yearTableVisible ? " selected" : ""
    }`;
    return html`
      <div class="mv-calendar ${this.theme}">
        <slot name="header">
          ${this.inlineInput ? this.renderInlineInput() : html``}
        </slot>
        <div class="year-month-container">
          <button class="${monthButtonClass}" @click="${this.showMonthTable}">
            ${currentMonthName}
          </button>
          <button class="${yearButtonClass}" @click="${this.showYearTable}">
            ${currentYear}
          </button>
        </div>
        ${this.monthTableVisible
          ? html`
              <month-table
                .visible-month="${visibleMonth}"
                .selected-date="${selectedDate}"
                @select-month="${this.updateMonth}"
              ></month-table>
            `
          : html``}
        ${this.yearTableVisible
          ? html`
              <year-table
                min-year="${this.minYear}"
                max-year="${this.maxYear}"
                .visible-year="${visibleMonth}"
                .selected-date="${selectedDate}"
                @select-year="${this.updateYear}"
              ></year-table>
            `
          : html``}
        ${!this.monthTableVisible && !this.yearTableVisible
          ? html`
              <calendar-table
                class="${this.theme}"
                .visible-month="${visibleMonth}"
                .selected-date="${selectedDate}"
                ?monday-first="${this.mondayFirst}"
                @select-date="${this.updateSelectedDate}"
              ></calendar-table>
            `
          : html``}
        <slot name="footer"></slot>
      </div>
    `;
  };

  renderInlineInput = () => {
    const selectedDate = this["selected-date"];
    const value = !!selectedDate
      ? moment(selectedDate.getTime()).format(this.pattern)
      : "";
    return html`
      <div class="inline-input">
        <mv-input
          rounded
          .theme="${this.theme}"
          .value="${value}"
          placeholder="${this.placeholder || this.pattern}"
          pattern="${this.pattern}"
          pattern-matcher="${this.patternMatcher}"
          pattern-regex="${this.patternRegex}"
          ?has-error="${this.hasError}"
          @input-change="${this.updateSelectedDate}"
        ></mv-input>
      </div>
    `;
  };

  connectedCallback() {
    super.connectedCallback();
    const selectedDate = this["selected-date"];
    const hasSelectedDate = !!selectedDate;
    const hasVisibleMonth = !!this["visible-month"];
    if (!hasVisibleMonth) {
      this["visible-month"] = hasSelectedDate ? selectedDate : new Date();
    }
  }

  showMonthTable = () => {
    this.monthTableVisible = true;
    this.yearTableVisible = false;
  };

  showYearTable = () => {
    this.yearTableVisible = true;
    this.monthTableVisible = false;
  };

  updateMonth = (event) => {
    const {
      detail: { date, month },
    } = event;
    this["visible-month"] = date;
    this.monthTableVisible = false;
    this.dispatchEvent(
      new CustomEvent("select-month", { detail: { date, month } })
    );
  };

  updateYear = (event) => {
    const {
      detail: { date, year },
    } = event;
    this["visible-month"] = date;
    this.yearTableVisible = false;
    this.dispatchEvent(
      new CustomEvent("select-year", { detail: { date, year } })
    );
  };

  updateSelectedDate = (event) => {
    const {
      detail: { value, date },
    } = event;
    const enteredDate = new Date(value);

    const invalidEnteredDate = !(
      enteredDate instanceof Date && !isNaN(enteredDate)
    );

    this.hasError =
      value !== "" &&
      value !== this.pattern &&
      invalidEnteredDate &&
      date !== null &&
      !date;

    const selectedDate = date || enteredDate;

    if (!!date || !invalidEnteredDate) {
      this["selected-date"] = selectedDate;
      this["visible-month"] = selectedDate;
      this.dispatchEvent(
        new CustomEvent("select-date", {
          detail: {
            date: selectedDate,
          },
        })
      );
    } else if (!date || !value) {
      this["selected-date"] = null;
      this.dispatchEvent(
        new CustomEvent("select-date", {
          detail: {
            date: null,
          },
        })
      );
    }
  };
}

customElements.define("single-calendar", SingleCalendar);
