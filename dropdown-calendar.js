import { LitElement, html, css } from "lit-element";
import {
  EMPTY_DATE,
  NOW,
  isEmpty,
  initializeDate,
  parseInput,
  validateDate,
} from "./utils/index.js";
import "mv-dropdown";
import "./single-calendar.js";

export class DropdownCalendar extends LitElement {
  static get properties() {
    return {
      theme: { type: String },
      justify: { type: String },
      placeholder: { type: String },
      position: { type: String },
      pattern: { type: String },
      visible: { type: Object, attribute: false, reflect: true },
      selected: { type: Object, attribute: false, reflect: true },
      inputDate: { type: String, attribute: false, reflect: true },
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
        --width: calc(var(--font-size) * 16);
        --mv-dropdown-trigger-height: calc(var(--font-size) + 32px);
        --mv-dropdown-min-width: calc(var(--width) + 4px);
        --mv-dropdown-max-width: calc(var(--width) + 4px);
        --mv-dropdown-content-max-height: auto;
      }

      mv-input > button {
        background: transparent;
        border: none;
        padding: 0;
        margin: 0 var(--font-size-m) 0 0;
        height: 100%;
        outline: none;
        color: #777;
        cursor: pointer;
      }

      mv-dropdown[content] {
        --mv-container-margin: 0;
      }

      .clear-button {
        font-size: var(--font-size-m);
      }
    `;
  }

  constructor() {
    super();
    this.visible = new Date();
    this.theme = "light";
    this.justify = "left";
    this.position = "bottom";
    this.noBorder = false;
    this.mondayFirst = false;
    this.allowPartial = false;
    this.pattern = "MM/DD/YYYY";
    this.patternMatcher = "MDY";
    this.patternRegex = "\\d";
    this.noClearButton = false;
  }

  render() {
    const { theme, selected, allowPartial, pattern } = this;
    const properties = parseInput(selected, allowPartial, pattern);
    const patternMatcher = properties.patternMatcher || this.patternMatcher;
    const patternRegex = properties.patternRegex || this.patternRegex;
    const placeholder = this.placeholder || properties.pattern;
    const value = properties.value;
    return html`
      <mv-dropdown
        container
        .justify="${this.justify}"
        .position="${this.position}"
        .theme="${theme}"
      >
        <mv-dropdown trigger>
          <mv-input
            .theme="${theme}"
            value="${value}"
            placeholder="${placeholder}"
            pattern="${properties.pattern}"
            pattern-matcher="${patternMatcher}"
            pattern-regex="${patternRegex}"
            ?has-error="${this.hasError}"
            @input-change="${this.updateEnteredValue}"
          >
            ${this.noClearButton
              ? html``
              : html`
                  <button
                    slot="suffix"
                    class="clear-button"
                    @click="${this.clearSelectedDate}"
                  >
                    &times;
                  </button>
                `}
          </mv-input>
        </mv-dropdown>
        <mv-dropdown content .theme="${theme}">
          <single-calendar
            no-border
            min-year="${this.minYear}"
            max-year="${this.maxYear}"
            .theme="${this.theme}"
            .visible="${this.visible}"
            .selected="${this.selected}"
            .pattern="${this.pattern}"
            .pattern-matcher="${this.patternMatcher}"
            .pattern-regex="${this.patternRegex}"
            ?monday-first="${this.mondayFirst}"
            ?allow-partial="${this.allowPartial}"
            @select-date="${this.updateSelectedDate}"
          ></single-calendar>
        </mv-dropdown>
      </mv-dropdown>
    `;
  }

  connectedCallback() {
    const selectedDate = this["selected-date"];
    this.inputDate = !!selectedDate
      ? moment(selectedDate).format(this.pattern)
      : "";
    super.connectedCallback();
  }

  updateSelectedDate = (event) => {
    const {
      detail: { selected, visible },
    } = event;
    this.visible = visible;
    this.dispatchUpdates(selected);
  };

  dispatchUpdates = (selected) => {
    const { visible } = this;
    this.dispatchEvent(
      new CustomEvent("select-date", { detail: { selected, visible } })
    );
  };

  clearSelectedDate = () => {
    this.dispatchUpdates({ ...EMPTY_DATE });
  };

  updateEnteredValue = (event) => {
    const {
      detail: { value },
    } = event;
    const hasValue = !!value;
    if (hasValue) {
      const dateArray = value.split("/") || [];
      const [year, month, day] = dateArray.map((part) => Number(part));

      const hasValidYear = !!year && !isNaN(year);
      const hasValidMinYear =
        hasValidYear && !(this.minYear !== undefined && year < this.minYear);
      const hasValidMaxYear =
        hasValidYear && !(this.maxYear !== undefined && year > this.maxYear);

      const isValidYear = hasValidYear && hasValidMinYear && hasValidMaxYear;
      const isValidMonth = !!month && !isNaN(month) && month > 0 && month < 13;
      const isValidDay = !!day && !isNaN(day) && day;

      const selected = {};
      if (isValidYear) {
        selected.year = year;
      }
      if (isValidMonth) {
        selected.month = month - 1;
      }
      if (isValidDay) {
        selected.day = day;
      }

      const validationDetails = validateDate(selected);
      const {
        hasFullDate,
        hasYearOnly,
        hasYearAndMonthOnly,
      } = validationDetails;
      const isValid = hasFullDate || hasYearOnly || hasYearAndMonthOnly;
      this.hasError = !isValid;
      if (isValid) {
        this.visible = { ...this.visible, ...selected };
        if (hasFullDate) {
          selected.date = new Date(selected.year, selected.month, selected.day);
        }
        this.dispatchUpdates({ ...EMPTY_DATE, ...selected });
      } else {
        this.dispatchUpdates({ ...EMPTY_DATE });
      }
    }
  };
}

customElements.define("dropdown-calendar", DropdownCalendar);
