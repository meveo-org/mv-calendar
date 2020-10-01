import { LitElement, html, css } from "lit-element";
import { EMPTY_DATE } from "./utils/index.js";
import "./mv-calendar.js";

export class MvCalendarDemo extends LitElement {
  static get properties() {
    return {
      value: { type: String, attribute: true },
      theme: { type: String, attribute: true },
      displayDates: { type: Object, attribute: false, reflect: true },
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family);
        font-size: var(--font-size-m);
        --mv-calendar-input-width: 320px;
      }

      pre {
        font-size: 20px;
        margin-left: 50px;
      }

      fieldset > label,
      label > input {
        cursor: pointer;
      }

      fieldset {
        width: 120px;
        margin-left: 10px;
        border: 2px solid red;
        -moz-border-radius: 8px;
        -webkit-border-radius: 8px;
        border-radius: 8px;
        color: #818181;
      }

      legend {
        font-weight: 500;
        color: red;
      }

      pre {
        border: 1px solid black;
        margin: 0 50px;
        padding: 20px;
      }

      .main-container {
        display: grid;
        grid-template-columns: 60% 40%;
      }

      .main {
        width: 300px;
        margin-left: 50px;
        display: flex;
        flex-direction: column;
      }
    `;
  }

  constructor() {
    super();
    this.theme = "light";
    this.selectedDates = {
      dropdownCalendar: { ...EMPTY_DATE },
      dropdownCalendarAP: { ...EMPTY_DATE },
      singleCalendar: { ...EMPTY_DATE },
      rangeCalendar: {
        start: {
          selected: { ...EMPTY_DATE },
          placeholder: "",
          hasError: null,
          minYear: null,
          maxYear: null,
        },
        end: {
          selected: { ...EMPTY_DATE },
          placeholder: "",
          hasError: null,
          minYear: null,
          maxYear: null,
        },
      },
    };
    this.displayDates = {
      dropdownCalendar: this.formatDate(this.selectedDates.dropdownCalendar),
      dropdownCalendarAP: this.formatDate(this.selectedDates.dropdownCalendarAP),
      singleCalendar: this.formatDate(this.selectedDates.singleCalendar),
      rangeCalendar: {
        start: this.formatDate(this.selectedDates.rangeCalendar.start.selected),
        end: this.formatDate(this.selectedDates.rangeCalendar.end.selected),
      },
    };
  }

  render() {
    const { theme } = this;
    return html`
      <fieldset>
        <legend>Theme</legend>
        <label>
          <input
            type="radio"
            name="theme"
            value="light"
            ?checked="${theme === "light"}"
            @change="${this.changeTheme}"
          />Light
        </label>
        <label>
          <input
            type="radio"
            name="theme"
            value="dark"
            ?checked="${theme === "dark"}"
            @change="${this.changeTheme}"
          />Dark
        </label>
      </fieldset>

      <div class="main-container">
        <div class="main">
          <div>
            <h4>Calendar with input field</h4>
            <mv-calendar
              name="dropdownCalendar"
              dropdown
              .theme="${theme}"
              .selected="${this.selectedDates.dropdownCalendar}"
              @select-date="${this.changeDate}"
            ></mv-calendar>
          </div>
          <div>
            <h4>Calendar with input field - allow partial</h4>
            <mv-calendar
              name="dropdownCalendarAP"
              dropdown
              allow-partial
              .theme="${theme}"
              .selected="${this.selectedDates.dropdownCalendarAP}"
              @select-date="${this.changeDate}"
            ></mv-calendar>
          </div>
          <div>
            <h4>
              Single Calendar with Monday first<br />
              min-year=2010, max-year=2030
            </h4>
            <mv-calendar
              name="singleCalendar"
              placeholder="Single Calendar"
              allow-partial
              inline-input
              monday-first
              min-year="2010"
              max-year="2030"
              .theme="${theme}"
              .selected="${this.selectedDates.singleCalendar}"
              @select-date="${this.changeDate}"
            ></mv-calendar>
          </div>
          <div>
            <h4>Calendar with date range</h4>
            <mv-calendar
              name="rangeCalendar"
              range-calendar
              allow-partial
              inline-input
              .theme="${theme}"
              .start="${this.selectedDates.rangeCalendar.start}"
              .end="${this.selectedDates.rangeCalendar.end}"
              @select-date="${this.changeDate}"
            ></mv-calendar>
          </div>
        </div>
        <pre>${JSON.stringify(this.displayDates, null, 2)}</pre>
      </div>
    `;
  }

  changeTheme = (originalEvent) => {
    const {
      target: { value },
    } = originalEvent;
    this.theme = value;
  };

  formatDate = (value) => {
    const { date, year, month, day } = value;
    return { date, year, month, day };
  };

  changeDate = (event) => {
    const {
      detail: { name, selected },
    } = event;

    const formattedDate =
      name === "rangeCalendar"
        ? {
            start: this.formatDate(selected.start.selected),
            end: this.formatDate(selected.end.selected),
          }
        : this.formatDate(selected);

    this.displayDates = {
      ...this.displayDates,
      [name]: formattedDate,
    };
    this.selectedDates = {
      ...this.selectedDates,
      [name]: selected,
    };
  };
}

customElements.define("mv-calendar-demo", MvCalendarDemo);
