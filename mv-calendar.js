import { LitElement, html, css } from "lit-element";
import "./single-calendar.js";
import "./dropdown-calendar.js";
import "./range-calendar.js";

export class MvCalendar extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      dropdown: { type: Boolean },
      theme: { type: String },
      justify: { type: String },
      position: { type: String },
      placeholder: { type: String },
      pattern: { type: String },
      "selected-date": { type: Object, attribute: false, reflect: true },
      "visible-month": { type: Object, attribute: false, reflect: true },
      "start-date": { type: Object, attribute: false, reflect: true },
      "visible-start-month": { type: Object, attribute: false, reflect: true },
      "end-date": { type: Object, attribute: false, reflect: true },
      "visible-end-month": { type: Object, attribute: false, reflect: true },
      inlineInput: { type: Boolean, attribute: "inline-input", reflect: true },
      mondayFirst: { type: Boolean, attribute: "monday-first", reflect: true },
      startPlaceholder: { type: String, attribute: "start-placeholder" },
      endPlaceholder: { type: String, attribute: "end-placeholder" },
      minYear: { type: Number, attribute: "min-year" },
      maxYear: { type: Number, attribute: "max-year" },
      patternRegex: { type: String, attribute: "pattern-regex", reflect: true },
      patternMatcher: {
        type: String,
        attribute: "pattern-matcher",
        reflect: true,
      },
      rangeCalendar: {
        type: Boolean,
        attribute: "range-calendar",
        reflect: true,
      },
      buttonTrigger: {
        type: Boolean,
        attribute: "button-trigger",
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
    return css``;
  }

  constructor() {
    super();
    this.theme = "light";
    this.justify = "left";
    this.position = "bottom";
    this.inlineInput = false;
    this.mondayFirst = false;
    this.pattern = "MM/DD/YYYY";
    this.patternMatcher = "MDY";
    this.patternRegex = "\\d";
    this.buttonTrigger = false;
    this.dropdown = false;
    this.rangeCalendar = false;
    this.noClearButton = false;
  }

  render() {
    if (this.dropdown) {
      return html`
        <dropdown-calendar
          min-year="${this.minYear}"
          max-year="${this.maxYear}"
          .placeholder="${this.placeholder}"
          .theme="${this.theme}"
          .visible-month="${this["visible-month"]}"
          .selected-date="${this["selected-date"]}"
          .pattern="${this.pattern}"
          .pattern-matcher="${this.patternMatcher}"
          .pattern-regex="${this.patternRegex}"
          .justify="${this.justify}"
          .position="${this.position}"
          ?monday-first="${this.mondayFirst}"
          ?no-clear-button="${this.noClearButton}"
          ?button-trigger="${this.buttonTrigger}"
          @select-date="${this.updateSelectedDate}"
        ></dropdown-calendar>
      `;
    } else if (this.rangeCalendar) {
      return html`
        <range-calendar
          min-year="${this.minYear}"
          max-year="${this.maxYear}"
          .theme="${this.theme}"
          .start-date="${this["start-date"]}"
          .visible-start-month="${this["visible-start-month"]}"
          .start-placeholder="${this.startPlaceholder}"
          .end-date="${this["end-date"]}"
          .visible-end-month="${this["visible-end-month"]}"
          .end-placeholder="${this.endPlaceholder}"
          .pattern="${this.pattern}"
          .pattern-matcher="${this.patternMatcher}"
          .pattern-regex="${this.patternRegex}"
          ?inline-input="${this.inlineInput}"
          ?monday-first="${this.mondayFirst}"
          @select-date="${this.updateSelectedDate}"
          @select-start-month="${this.updateSelectedMonth("start")}"
          @select-start-year="${this.updateSelectedYear("start")}"
          @select-end-month="${this.updateSelectedMonth("end")}"
          @select-end-year="${this.updateSelectedYear("end")}"
        ></range-calendar>
      `;
    }
    return html`
      <single-calendar
        min-year="${this.minYear}"
        max-year="${this.maxYear}"
        .placeholder="${this.placeholder}"
        .theme="${this.theme}"
        .visible-month="${this["visible-month"]}"
        .selected-date="${this["selected-date"]}"
        .pattern="${this.pattern}"
        .pattern-matcher="${this.patternMatcher}"
        .pattern-regex="${this.patternRegex}"
        ?inline-input="${this.inlineInput}"
        ?monday-first="${this.mondayFirst}"
        @select-date="${this.updateSelectedDate}"
        @select-month="${this.updateSelectedMonth()}"
        @select-year="${this.updateSelectedYear()}"
      ></single-calendar>
    `;
  }

  updateSelectedDate = (event) => {
    const { name } = this;
    const {
      detail: { date, start, end },
    } = event;
    this.dispatchEvent(
      new CustomEvent(`select-date`, {
        detail: { name, date, start, end },
      })
    );
  };

  updateSelectedMonth = (range) => (event) => {
    const selectedDate = this["selected-date"];
    const {
      detail: { date, month },
    } = event;
    const newDate = selectedDate || date;
    newDate.setMonth(month);
    const name = `visible${!!range ? `-${range}` : ""}-month`;
    const monthName = !!range ? `${range}Month` : "month";
    this[name] = newDate;
    this.dispatchEvent(
      new CustomEvent(`select-partial`, {
        detail: { name, date: newDate, [monthName]: month },
      })
    );
  };

  updateSelectedYear = (range) => (event) => {
    const selectedDate = this["selected-date"];
    const {
      detail: { date, year },
    } = event;
    const newDate = selectedDate || date;
    newDate.setFullYear(year);
    const name = `visible${!!range ? `-${range}` : ""}-month`;
    const yearName = !!range ? `${range}Year` : "year";
    this[name] = newDate;
    this.dispatchEvent(
      new CustomEvent(`select-partial`, {
        detail: { name, date: newDate, [yearName]: year },
      })
    );
  };
}

customElements.define("mv-calendar", MvCalendar);
