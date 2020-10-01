import { LitElement, html, css } from "lit-element";
import { EMPTY_DATE, filterDate } from "./utils/index.js";
import "mv-dropdown";
import "./single-calendar.js";

export class CalendarInput extends LitElement {
  static get properties() {
    return {
      theme: { type: String },
      justify: { type: String },
      placeholder: { type: String },
      position: { type: String },
      pattern: { type: String },
      rounded: { type: Boolean },
      visible: { type: Object, attribute: false, reflect: true },
      selected: { type: Object, attribute: true, reflect: true },
      minYear: { type: Number, attribute: "min-year", reflect: true },
      maxYear: { type: Number, attribute: "max-year", reflect: true },
      hasError: { type: Boolean, attribute: "has-error", reflect: true },
      inputValue: { type: String, attribute: false, reflect: true },
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
    this.allowPartial = false;
    this.inputValue = "";
    this.pattern = "MM/DD/YYYY";
    this.patternMatcher = "MDY";
    this.patternRegex = "\\d";
    this.noClearButton = false;
    this.rounded = false;
  }

  render() {
    const {
      theme,
      selected,
      allowPartial,
      pattern,
      inputValue,
      hasError,
    } = this;
    const properties = this.parseInput(selected, allowPartial, pattern);
    const patternMatcher = properties.patternMatcher || this.patternMatcher;
    const patternRegex = properties.patternRegex || this.patternRegex;
    const placeholder = this.placeholder || properties.pattern;
    const value = properties.value;

    const enteredValue = (hasError && inputValue) || "";

    return html`
      <mv-input
        .theme="${theme}"
        value="${value || enteredValue}"
        placeholder="${placeholder}"
        pattern="${properties.pattern}"
        pattern-matcher="${patternMatcher}"
        pattern-regex="${patternRegex}"
        ?rounded="${this.rounded}"
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
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "selected") {
      const parsedInput = this.parseInput(
        newValue,
        this.allowPartial,
        this.pattern
      );
      this.inputValue = parsedInput.value;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  dispatchUpdates = (selected) => {
    const { visible } = this;
    this.dispatchEvent(
      new CustomEvent("select-date", { detail: { selected, visible } })
    );
  };

  clearSelectedDate = () => {
    this.inputValue = "";
    this.hasError = false;
    this.dispatchUpdates({ ...EMPTY_DATE });
  };

  validateDate = ({ year, month, day }) => {
    const hasYear = !!year;
    const hasMonth = !!month || month === 0;
    const hasDay = !!day;
    const hasFullDate = hasYear && hasMonth && hasDay;
    const hasYearOnly = hasYear && !hasMonth && !hasDay;
    const hasYearAndMonthOnly = hasYear && hasMonth && !hasDay;
    return { hasYearOnly, hasYearAndMonthOnly, hasFullDate };
  };

  parseInput = (selected, allowPartial, inputPattern) => {
    const { date, year, month, day } = selected;
    const hasSelectedDate = !!date;
    const hasYear = !!year;
    const hasMonth = !!month || month === 0;
    const hasDay = !!day;
    const hasFullDate = hasYear && hasMonth && hasDay;
    const hasYearOnly = hasYear && !hasMonth && !hasDay;
    const hasYearAndMonthOnly = hasYear && hasMonth && !hasDay;

    const result = {};

    let selectedDate = date;

    if (!hasSelectedDate) {
      if (hasYearOnly) {
        selectedDate = new Date();
        selectedDate.setFullYear(year);
      } else if (hasYearAndMonthOnly) {
        selectedDate = new Date(year, month);
      } else if (hasFullDate) {
        selectedDate = new Date(year, month, day);
      } else {
        selectedDate = null;
      }
    }

    result.pattern = inputPattern;

    if (allowPartial) {
      result.patternMatcher = "MDY";
      result.patternRegex = "\\d";
      if (hasYearOnly) {
        result.pattern = "YYYY";
      } else if (hasYearAndMonthOnly) {
        result.pattern = "YYYY/MM";
      } else {
        result.pattern = "YYYY/MM/DD";
      }
    }
    result.value = !!selectedDate
      ? moment(selectedDate.getTime()).format(result.pattern)
      : "";

    return result;
  };

  normalizeInput = (value) => {
    if (this.allowPartial) {
      const dateArray = value.split("/") || [];
      const [year, month, day] = dateArray.map((part) => Number(part));
      return { year, month, day };
    } else {
      const dateValue = moment(value, this.pattern, true);
      return dateValue.isValid()
        ? {
            year: dateValue.year(),
            month: dateValue.month() + 1,
            day: dateValue.date(),
          }
        : { ...EMPTY_DATE };
    }
  };

  updateEnteredValue = (event) => {
    const {
      detail: { value },
    } = event;
    this.hasError = false;
    this.inputValue = value;
    const hasValue = !!value;
    if (hasValue) {
      const { year, month, day } = this.normalizeInput(value);
      const hasValidYear = !!year && !isNaN(year);
      const hasValidMinYear =
        hasValidYear && !(this.minYear !== undefined && year < this.minYear);
      const hasValidMaxYear =
        hasValidYear && !(this.maxYear !== undefined && year > this.maxYear);

      const isValidYear = hasValidYear && hasValidMinYear && hasValidMaxYear;
      const isValidMonth = !!month && !isNaN(month) && month > 0 && month < 13;
      const isValidDay = !!day && !isNaN(day);
      const daysInMonth =
        (isValidYear && isValidMonth && new Date(year, month, 0).getDate()) ||
        0;
      const isDayInRange = isValidDay && day > 0 && day < daysInMonth;
      this.hasError = !(isValidYear && isValidMonth && isDayInRange);

      const selected = {
        year,
        month: month - 1,
        day,
      };
      const validationDetails = this.validateDate(selected);
      const {
        hasFullDate,
        hasYearOnly,
        hasYearAndMonthOnly,
      } = validationDetails;
      const isValid =
        (hasFullDate && isValidYear && isValidMonth && isDayInRange) ||
        (hasYearAndMonthOnly && isValidYear && isValidMonth) ||
        (hasYearOnly && isValidYear);
      this.hasError = !isValid;
      if (isValid) {
        const filteredDate = filterDate(selected);
        this.visible = { ...this.visible, ...filteredDate };
        if (hasFullDate) {
          selected.date = new Date(selected.year, selected.month, selected.day);
        }
        this.dispatchUpdates({ ...EMPTY_DATE, ...filteredDate });
      } else {
        this.dispatchUpdates({ ...EMPTY_DATE });
      }
    }
  };
}

customElements.define("calendar-input", CalendarInput);
