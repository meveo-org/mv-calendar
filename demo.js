import { LitElement, html, css } from "lit-element";
import "./mv-calendar.js";

export class MvCalendarDemo extends LitElement {
  static get properties() {
    return {
      value: { type: String, attribute: true },
      theme: { type: String, attribute: true },
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family);
        font-size: var(--font-size-m);
        --mv-calendar-input-width: 320px;
      }

      .main {
        width: 300px;
        margin: 10px auto;
        display: flex;
        flex-direction: column;
      }

      mv-calendar {
        width: 50%;
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
      <div class="main">
        <div>
          <h4>Calendar with input field</h4>
          <mv-calendar
            id="input"
            name="inputCalendar"
            .theme="${theme}"
            @change-date="${this.changeDate}"
            dropdown
          ></mv-calendar>
        </div>
        <div>
          <h4>
            Single Calendar with Monday first<br />
            min-year=2010, max-year=2030
          </h4>
          <mv-calendar
            id="simple"
            name="simpleCalendar"
            inline-input
            monday-first
            min-year="2010"
            max-year="2030"
            .theme="${theme}"
          ></mv-calendar>
        </div>
        <div>
          <h4>Calendar with date range</h4>
          <mv-calendar
            id="range"
            name="rangeCalendar"
            inline-input
            .theme="${theme}"
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

  changeDate = (event) => {
    const {
      detail: { startDate, endDate },
    } = event;
  };
}

customElements.define("mv-calendar-demo", MvCalendarDemo);
