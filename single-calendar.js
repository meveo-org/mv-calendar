import { LitElement, html, css } from "lit-element";
import "mv-container";
import "mv-input";
import "./calendar-table.js";
import "./month-filter.js";
import "./year-filter.js";

export class SingleCalendar extends LitElement {
  static get properties() {
    return {
      "month-shown": { type: Object, attribute: false, reflect: true },
      "selected-date": { type: Object, attribute: false, reflect: true },
      noBorder: { type: Boolean, attribute: "no-border", reflect: true },
      inlineInput: { type: Boolean, attribute: "inline-input", reflect: true },
      mondayFirst: { type: Boolean, attribute: "monday-first", reflect: true },
      inputMask: { type: String, attribute: "input-mask", reflect: true },
      inputMatcher: { type: String, attribute: "input-mather", reflect: true },
      inputRegex: { type: String, attribute: "input-regex", reflect: true },
      minYear: { type: Number, attribute: "min-year", reflect: true },
      maxYear: { type: Number, attribute: "max-year", reflect: true },
      inputDate: { type: String, attribute: false, reflect: true },
      hasError: { type: Boolean, attribute: "has-error", reflect: true },
      theme: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family);
        --font-size: var(--font-size-m, 1rem);
        --width: var(--mv-calendar-width, calc(var(--font-size) * 16));
        --mv-container-min-width: var(--width);
        --mv-container-max-width: var(--width);
        --mv-container-padding: 10px;
      }

      .light {
        --theme-text-color: #000000;
        --theme-background: #ffffff;
      }

      .dark {
        --theme-text-color: #ffffff;
        --theme-background: #373e48;
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
      }

      .year-month-container * {
        margin: 2px;
      }
    `;
  }

  constructor() {
    super();
    this["month-shown"] = new Date();
    this.theme = "light";
    this.noBorder = false;
    this.inlineInput = false;
    this.mondayFirst = false;
    this.inputMask = "MM/DD/YYYY";
    this.inputMatcher = "MDY";
    this.inputRegex = "\\d";
  }

  render() {
    if (this.noBorder) {
      return this.renderCalendar();
    }
    return html`<mv-container .theme="${this.theme}">${this.renderCalendar()}</mv-container>`;
  }

  renderCalendar = () => {
    return html`
      <div class="mv-calendar ${this.theme}">
        <slot name="header">
          ${this.inlineInput
            ? html`
                <div class="inline-input">
                  <mv-input
                    rounded
                    .theme="${this.theme}"
                    .value="${this.inputDate}"
                    placeholder="${this.inputMask}"
                    pattern="${this.inputMask}"
                    pattern-matcher="${this.inputMatcher}"
                    pattern-regex="${this.inputRegex}"
                    ?has-error="${this.hasError}"
                    @input-change="${this.updateSelectedDate}"
                  ></mv-input>
                </div>
              `
            : html``}
        </slot>
        <div class="year-month-container">
          <month-filter
            .month-shown="${this["month-shown"]}"
            @select-month="${this.updateMonth}"
          ></month-filter>
          <year-filter
            .min="${this.minYear}"
            .max="${this.maxYear}"
            .year-shown="${this["month-shown"]}"
            @select-year="${this.updateMonth}"
          ></year-filter>
        </div>
        <calendar-table
          class="${this.theme}"
          .month-shown="${this["month-shown"]}"
          .selected-date="${this["selected-date"]}"
          ?monday-first="${this.mondayFirst}"
          @select-date="${this.updateSelectedDate}"
        ></calendar-table>
        <slot name="footer"></slot>
      </div>
    `;
  };

  updateMonth = (event) => {
    const {
      detail: { date },
    } = event;
    this.updateCalendarTable(date);
  };

  updateSelectedDate = (event) => {
    const {
      detail: { value, date },
    } = event;
    const enteredDate = new Date(value);
    const selectedDate = date || enteredDate;
    const invalidEnteredDate = !(enteredDate instanceof Date && !isNaN(enteredDate))    
    this.hasError = value !== "" && invalidEnteredDate && !date;
    if (!!date || !invalidEnteredDate) {
      const formattedDate = moment(selectedDate).format(this.inputMask);
      this.inputDate = formattedDate;
      this["selected-date"] = selectedDate;
      this.dispatchEvent(
        new CustomEvent("select-date", {
          detail: {
            date: selectedDate,
          },
        })
      );
    }
  };

  updateCalendarTable = (date) => {
    this["month-shown"] = date;
  };
}

customElements.define("single-calendar", SingleCalendar);
