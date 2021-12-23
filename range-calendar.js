import { LitElement, html, css } from "lit-element";
import { EMPTY_DATE, NOW, parseDate } from "./utils/index.js";
import "@meveo-org/mv-container";
import "./single-calendar.js";

export class RangeCalendar extends LitElement {
  static get properties() {
    return {
      theme: { type: String },
      pattern: { type: String },
      start: { type: Object, attribute: false, reflect: true },
      end: { type: Object, attribute: false, reflect: true },
      mondayFirst: { type: Boolean, attribute: "monday-first", reflect: true },
      inlineInput: { type: Boolean, attribute: "inline-input", reflect: true },
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
      noClearButton: {
        type: Boolean,
        attribute: "no-clear-button",
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
    this.start = {
      selected: { ...EMPTY_DATE },
      visible: { ...NOW },
      placeholder: "",
      hasError: null,
      minYear: null,
      maxYear: null,
    };
    this.end = {
      selected: { ...EMPTY_DATE },
      visible: { ...NOW },
      placeholder: "",
      hasError: null,
      minYear: null,
      maxYear: null,
    };
    this.mondayFirst = false;
    this.allowPartial = false;
    this.pattern = "MM/DD/YYYY";
    this.patternMatcher = "MDY";
    this.patternRegex = "\\d";
    this.noClearButton = false;
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
            ${this.renderSingleCalendar("start")}
            ${this.renderSingleCalendar("end")}
          </div>
        </div>
      </mv-container>
    `;
  }

  renderSingleCalendar = (name) => {
    const detail = this[name];
    const {
      minYear,
      maxYear,
      placeholder,
      visible,
      selected,
      hasError,
    } = detail;
    return html`
      <single-calendar
        no-border
        name="${name}"
        min-year="${minYear}"
        max-year="${maxYear}"
        placeholder="${placeholder}"
        .theme="${this.theme}"
        .visible="${visible}"
        .selected="${selected}"
        .pattern="${this.pattern}"
        .pattern-matcher="${this.patternMatcher}"
        .pattern-regex="${this.patternRegex}"
        ?has-error="${hasError}"
        ?monday-first="${this.mondayFirst}"
        ?inline-input="${this.inlineInput}"
        ?allow-partial="${this.allowPartial}"
        @select-date="${this.updateSelected}"
      ></single-calendar>
    `;
  };

  parseValues = (name, selected, visible) => {
    if (!visible) {
      visible = selected;
    }
    return {
      start: {
        ...this.start,
      },
      end: {
        ...this.end,
      },
      [name]: {
        ...this[name],
        selected,
        visible: { ...this[name].visible, ...visible },
      },
    };
  };

  updateSelected = (event) => {
    const { detail } = event;
    const { name, selected, visible } = detail;
    this[name].visible = visible;
    this.dispatchDateChange(this.parseValues(name, selected, visible));
  };

  selectDateRange = (offset, timeUnit) => () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const unit = !!timeUnit ? timeUnit : "days";
    const startDate = !offset
      ? today
      : moment(today).subtract(offset, unit).toDate();
    const endDate = today;

    const startValue = parseDate({ date: startDate });
    const endValue = parseDate({ date: endDate });

    const start = this.parseValues("start", startValue);
    const end = this.parseValues("end", endValue);

    this.dispatchDateChange({ start: start.start, end: end.end });
  };

  resetDateRange = () => {
    const selected = {
      start: {
        ...this.start,
        selected: { ...EMPTY_DATE },
        visible: { ...NOW },
      },
      end: {
        ...this.end,
        selected: { ...EMPTY_DATE },
        visible: { ...NOW },
      },
    };

    this.dispatchDateChange(selected);
  };

  dispatchDateChange = (selected) => {
    this.dispatchEvent(
      new CustomEvent(`select-range`, {
        detail: { ...selected },
      })
    );
  };
}

customElements.define("range-calendar", RangeCalendar);
