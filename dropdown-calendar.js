import { LitElement, html, css } from "lit-element";
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
      "month-shown": { type: Object, attribute: false, reflect: true },
      "selected-date": { type: Object, attribute: false, reflect: true },
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
    this["month-shown"] = new Date();
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
    const { theme } = this;
    const pattern = this.allowPartial ? "YYYY/MM/DD" : this.pattern;
    const placeholder = this.placeholder || pattern;
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
            value="${this.inputDate}"
            placeholder="${placeholder}"
            pattern="${pattern}"
            pattern-matcher="${this.allowPartial ? "MDY" : this.patternMatcher}"
            pattern-regex="${this.allowPartial ? "\\d" : this.patternRegex}"
            ?has-error="${this.hasError}"
            @input-change="${this.updateSelectedDate}"
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
            .month-shown="${this["month-shown"]}"
            .selected-date="${this["selected-date"]}"
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
      detail: { value, date },
    } = event;
    console.log("value: ", value);
    console.log("date: ", date);
    const enteredDate = new Date(value);
    const selectedDate = date || enteredDate;
    const invalidEnteredDate = !(
      enteredDate instanceof Date && !isNaN(enteredDate)
    );
    this.hasError =
      value !== "" && invalidEnteredDate && date !== null && !date;
    if (!!date || !invalidEnteredDate) {
      const formattedDate = moment(selectedDate).format(this.pattern);
      this.inputDate = formattedDate;
      this["selected-date"] = selectedDate;
      this["month-shown"] = selectedDate;
      this.dispatchEvent(
        new CustomEvent("select-date", {
          detail: {
            date: selectedDate,
          },
        })
      );
    } else {
      this["selected-date"] = null;
      this.inputDate = value || "";
    }
  };

  clearSelectedDate = () => {
    this.inputDate = "";
    this.hasError = false;
    this["selected-date"] = null;
    this.dispatchEvent(
      new CustomEvent("select-date", {
        detail: {
          date: null,
        },
      })
    );
  };
}

customElements.define("dropdown-calendar", DropdownCalendar);
