import { LitElement, html, css } from "lit-element";
import "./single-calendar.js";
import "./dropdown-calendar.js";

export class MvCalendar extends LitElement {
  static get properties() {
    return {
      "month-shown": { type: Object, attribute: false, reflect: true },
      "selected-date": { type: Object, attribute: false, reflect: true },
      dropdown: { type: Boolean },
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
      inputMask: { type: String, attribute: "input-mask", reflect: true },
      inputMatcher: { type: String, attribute: "input-matcher", reflect: true },
      inputRegex: { type: String, attribute: "input-regex", reflect: true },
      minYear: { type: Number, attribute: "min-year", reflect: true },
      maxYear: { type: Number, attribute: "max-year", reflect: true },
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
    this["month-shown"] = new Date();
    this.inlineInput = false;
    this.mondayFirst = false;
    this.inputMask = "mm/dd/yyyy";
    this.inputMatcher = "mdy";
    this.inputRegex = "\\d";
    this.buttonTrigger = false;
    this.dropdown=false;
    this.noClearButton = false;
  }

  render() {
    if (this.dropdown) {
      return html`
        <dropdown-calendar
          .theme="${this.theme}"
          .month-shown="${this["month-shown"]}"
          .selected-date="${this["selected-date"]}"
          .input-mask="${this.inputMask}"
          .input-matcher="${this.inputMatcher}"
          .input-regex="${this.inputRegex}"
          .min-year="${this.minYear}"
          .max-year="${this.maxYear}"
          .justify="${this.justify}"
          .position="${this.position}"
          ?inline-input="${this.inlineInput}"
          ?monday-first="${this.mondayFirst}"
          ?no-clear-button="${this.noClearButton}"
          ?button-trigger="${this.buttonTrigger}"
          @select-date="${this.updateSelectedDate}"
        ></dropdown-calendar>
      `;
    }
    return html`
      <single-calendar
        .theme="${this.theme}"
        .month-shown="${this["month-shown"]}"
        .selected-date="${this["selected-date"]}"
        .input-mask="${this.inputMask}"
        .input-matcher="${this.inputMatcher}"
        .input-regex="${this.inputRegex}"
        .min-year="${this.minYear}"
        .max-year="${this.maxYear}"
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
      detail: { date },
    } = event;
    this["month-shown"] = date;
    this["selected-date"] = date;
  };
}

customElements.define("mv-calendar", MvCalendar);
