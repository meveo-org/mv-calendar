import { LitElement, html, css } from "lit-element";
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

      .main {
        width: 300px;
        margin-left: 50px;
        display: flex;
        flex-direction: column;
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
    `;
  }

  constructor() {
    super();
    this.theme = "light";
    this.selectedDates = {
      inputCalendar: new Date(2023, 7, 1),
      singleCalendar: null,
      rangeCalendar: { start: new Date(2023, 7, 1), end: new Date(2023, 7, 5) },
    };
    this.displayDates = {
      inputCalendar: this.formatDate(this.selectedDates.inputCalendar),
      singleCalendar: this.formatDate(this.selectedDates.singleCalendar),
      rangeCalendar: {
        start: this.formatDate(this.selectedDates.rangeCalendar.start),
        end: this.formatDate(this.selectedDates.rangeCalendar.end),
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

      <pre>${JSON.stringify(this.displayDates, null, 2)}</pre>

      <div class="main">
        <div>
          <h4>Calendar with input field</h4>
          <mv-calendar
            name="inputCalendar"
            dropdown
            no-clear-button
            .theme="${theme}"
            .selected-date="${this.selectedDates.inputCalendar}"
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
            inline-input
            monday-first
            min-year="2010"
            max-year="2030"
            .theme="${theme}"
            .selected-date="${this.selectedDates.singleCalendar}"
            @select-date="${this.changeDate}"
          ></mv-calendar>
        </div>
        <div>
          <h4>Calendar with date range</h4>
          <mv-calendar
            name="rangeCalendar"
            range-calendar
            inline-input
            .theme="${theme}"
            .start-date="${this.selectedDates.rangeCalendar.start}"
            .end-date="${this.selectedDates.rangeCalendar.end}"
            @select-date="${this.changeDate}"
          ></mv-calendar>
        </div>
      </div>
    `;
  }

  changeTheme = (originalEvent) => {
    const {
      target: { value },
    } = originalEvent;
    this.theme = value;
  };

  hideDropdown = (event) => {
    const { target } = event;
    target.dispatchEvent(
      new CustomEvent("close-mv-dropdown", { bubbles: true })
    );
  };

  formatDate = (date) => {
    return !!date ? moment(date.getTime()).format("MM/DD/YYYY") : "";
  };

  changeDate = (event) => {
    const {
      detail: { name, date, start, end },
    } = event;

    const value =
      name === "rangeCalendar"
        ? { start: this.formatDate(start), end: this.formatDate(end) }
        : this.formatDate(date);
        
    this.displayDates = {
      ...this.displayDates,
      [name]: value,
    };
  };
}

customElements.define("mv-calendar-demo", MvCalendarDemo);
