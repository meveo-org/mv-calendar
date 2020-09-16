import { LitElement, html, css } from "lit-element";
import "mv-container";
import "./single-calendar.js";

export class RangeCalendar extends LitElement {
  static get properties() {
    return {
      theme: { type: String },
      justify: { type: String },
      position: { type: String },
      pattern: { type: String },
      "visible-start-month": { type: Object, attribute: false, reflect: true },
      "start-date": { type: Object, attribute: false, reflect: true },
      "visible-end-month": { type: Object, attribute: false, reflect: true },
      "end-date": { type: Object, attribute: false, reflect: true },
      inputDate: { type: String, attribute: false, reflect: true },
      mondayFirst: { type: Boolean, attribute: "monday-first", reflect: true },
      inlineInput: { type: Boolean, attribute: "inline-input", reflect: true },
      startPlaceholder: { type: String, attribute: "start-placeholder" },
      endPlaceholder: { type: String, attribute: "end-placeholder" },
      minYear: { type: Number, attribute: "min-year", reflect: true },
      maxYear: { type: Number, attribute: "max-year", reflect: true },
      patternRegex: { type: String, attribute: "pattern-regex", reflect: true },
      patternMatcher: {
        type: String,
        attribute: "pattern-matcher",
        reflect: true,
      },
      startDateError: {
        type: Boolean,
        attribute: "start-date-error",
        reflect: true,
      },
      endDateError: {
        type: Boolean,
        attribute: "end-date-error",
        reflect: true,
      },
      noClearButton: {
        type: Boolean,
        attribute: "no-clear-button",
        reflect: true,
      },
      buttonTrigger: {
        type: Boolean,
        attribute: "button-trigger",
        reflect: true,
      },
    };
  }

  static get styles() {
    return css`
      :host {
        --font-size: var(--font-size-m, 1rem);
        --width: var(--mv-calendar-width, calc(var(--font-size) * 43));
        --mv-container-min-width: var(--width);
        --mv-container-max-width: var(--width);
        --mv-container-padding: 0 10px;
      }

      .range-calendar {
        display: flex;
        flex-direction: row;
      }

      .button-section {
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        justify-content: center;
        padding: 10px 10px 10px 0;
        min-width: 140px;
        border-right: 1px solid #999;
        margin: 0;
      }

      .button-section button {
        font-family: var(--font-family);
        font-size: var(--font-size-m);
        display: inline-block;
        border: none;
        text-decoration: none;
        background: transparent;
        color: #777;
        text-transform: none;
        cursor: pointer;
        text-align: center;
        padding: 5px;
        margin: 5px auto;
        border-radius: 5px;
        box-shadow: 0px 0px 20px 1px rgba(93, 94, 97, 0.35);
        font-weight: 500;
        width: calc(100% - 10px);
        outline: none;
      }

      .button-section button:hover {
        background-color: var(--hover-background-color, #666);
        color: #ffffff;
      }

      .calendar-section {
        display: grid;
        padding: 10px 0 0 10px;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 20px;
      }
    `;
  }

  constructor() {
    super();
    this.theme = "light";
    this.justify = "left";
    this.position = "bottom";
    this.startPlaceholder = "";
    this.endPlaceholder = "";
    this.noBorder = false;
    this.mondayFirst = false;
    this.pattern = "MM/DD/YYYY";
    this.patternMatcher = "MDY";
    this.patternRegex = "\\d";
    this.noClearButton = false;
    this.buttonTrigger = false;
  }

  render() {
    return html`
      <mv-container .theme="${this.theme}">
        <div class="range-calendar">
          <div class="button-section">
            <button @click="${this.selectDateRange()}">Today</button>
            <button @click="${this.selectDateRange(1)}">Yesterday</button>
            <button @click="${this.selectDateRange(7)}">Last 7 days</button>
            <button @click="${this.selectDateRange(30)}">Last 30 days</button>
            <button @click="${this.selectDateRange(3, "months")}">
              Last 3 months
            </button>
            <button @click="${this.selectDateRange(6, "months")}">
              Last 6 months
            </button>
            <button @click="${this.resetDateRange}">Custom</button>
          </div>
          <div class="calendar-section">
            <single-calendar
              no-border
              min-year="${this.minYear}"
              max-year="${this.maxYear}"
              placeholder="${this.startPlaceholder}"
              .theme="${this.theme}"
              .selected-date="${this["start-date"]}"
              .visible-month="${this["visible-start-month"]}"
              .pattern="${this.pattern}"
              .pattern-matcher="${this.patternMatcher}"
              .pattern-regex="${this.patternRegex}"
              ?inline-input="${this.inlineInput}"
              ?monday-first="${this.mondayFirst}"
              ?has-error="${this.startDateError}"
              @select-date="${this.updateSelectedDate("start-date")}"
            ></single-calendar>
            <single-calendar
              no-border
              min-year="${this.minYear}"
              max-year="${this.maxYear}"
              placeholder="${this.endPlaceholder}"
              .theme="${this.theme}"
              .selected-date="${this["end-date"]}"
              .visible-month="${this["visible-end-month"]}"
              .pattern="${this.pattern}"
              .pattern-matcher="${this.patternMatcher}"
              .pattern-regex="${this.patternRegex}"
              ?inline-input="${this.inlineInput}"
              ?monday-first="${this.mondayFirst}"
              ?has-error="${this.endDateError}"
              @select-date="${this.updateSelectedDate("end-date")}"
            ></single-calendar>
          </div>
        </div>
      </mv-container>
    `;
  }

  updateSelectedDate = (name) => (event) => {
    const { detail } = event;
    const { date } = detail;
    this[name] = date;
    this[`${name}-error`] = date !== null && !date;
    this.dispatchDateChange();
  };

  selectDateRange = (offset, timeUnit) => () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const unit = !!timeUnit ? timeUnit : "days";
    const start = !offset
      ? today
      : moment(today).subtract(offset, unit).toDate();
    const end = today;
    this["start-date"] = start;
    this["visible-start-month"] = start;
    this["end-date"] = end;
    this["visible-end-month"] = end;
    this.dispatchDateChange();
  };

  resetDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    this["start-date"] = null;
    this["visible-start-month"] = today;
    this["end-date"] = null;
    this["visible-end-month"] = today;
    this.dispatchDateChange();
  };

  dispatchDateChange = () => {
    this.dispatchEvent(
      new CustomEvent(`select-date`, {
        detail: {
          start: this["start-date"],
          end: this["end-date"],
        },
      })
    );
  };
}

customElements.define("range-calendar", RangeCalendar);
