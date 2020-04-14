import { LitElement, html, css } from "lit-element";
import "./single-calendar.js";
import "./dropdown-calendar.js";
import "./range-calendar.js";

export class MvCalendar extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      "selected-date": { type: Object, attribute: false, reflect: true },
      "month-shown": { type: Object, attribute: false, reflect: true },
      "start-date": { type: Object, attribute: false, reflect: true },
      "start-date-shown": { type: Object, attribute: false, reflect: true },
      "end-date": { type: Object, attribute: false, reflect: true },
      "end-date-shown": { type: Object, attribute: false, reflect: true },
      dropdown: { type: Boolean },
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
      inlineInput: { type: Boolean, attribute: "inline-input", reflect: true },
      mondayFirst: { type: Boolean, attribute: "monday-first", reflect: true },
      placeholder: { type: String },
      startPlaceholder: { type: String, attribute: "start-placeholder" },
      endPlaceholder: { type: String, attribute: "end-placeholder" },
      pattern: { type: String },
      patternMatcher: {
        type: String,
        attribute: "pattern-matcher",
        reflect: true,
      },
      patternRegex: { type: String, attribute: "pattern-regex", reflect: true },
      minYear: { type: Number, attribute: "min-year" },
      maxYear: { type: Number, attribute: "max-year" },
      theme: { type: String },
      justify: { type: String },
      position: { type: String },
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
          .month-shown="${this["month-shown"]}"
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
          .start-date-shown="${this["start-date-shown"]}"
          .start-placeholder="${this.startPlaceholder}"
          .end-date="${this["end-date"]}"
          .end-date-shown="${this["start-date-shown"]}"
          .end-placeholder="${this.endPlaceholder}"
          .pattern="${this.pattern}"
          .pattern-matcher="${this.patternMatcher}"
          .pattern-regex="${this.patternRegex}"
          ?inline-input="${this.inlineInput}"
          ?monday-first="${this.mondayFirst}"
          @select-date="${this.updateSelectedDate}"
        ></range-calendar>
      `;
    }
    return html`
      <single-calendar
        min-year="${this.minYear}"
        max-year="${this.maxYear}"
        .placeholder="${this.placeholder}"
        .theme="${this.theme}"
        .month-shown="${this["month-shown"]}"
        .selected-date="${this["selected-date"]}"
        .pattern="${this.pattern}"
        .pattern-matcher="${this.patternMatcher}"
        .pattern-regex="${this.patternRegex}"
        ?inline-input="${this.inlineInput}"
        ?monday-first="${this.mondayFirst}"
        @select-date="${this.updateSelectedDate}"
      ></single-calendar>
    `;
  }

  updateMonth = (event) => {
    const {
      detail: { date },
    } = event;
    this["month-shown"] = date;
  };

  updateSelectedDate = (event) => {
    const {
      detail: { date, start, end },
    } = event;
    this.dispatchDateChange();
  };

  updateSelectedDate = (event) => {
    const {
      detail: { date, start, end },
    } = event;
    this.dispatchEvent(
      new CustomEvent(`select-date`, {
        detail: { name: this.name, date, start, end },
      })
    );
  };
}

customElements.define("mv-calendar", MvCalendar);
