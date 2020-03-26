import { LitElement, html, css } from "lit-element";
import "./mv-calendar.js";

export class MvCalendarDemo extends LitElement {
  static get properties() {
    return {
      value: { type: String, attribute: true },
      theme: { type: String, attribute: true }
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, "MuseoSans");
        font-size: var(--font-size-m, 10pt);
        --mv-calendar-input-width: 320px;
        --mv-dropdown-max-width: 450px;
        --mv-dropdown-content-max-height: 325px;
      }

      .main {
        width: 50%;
        margin: 10px;
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
    this.theme = "dark";
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
            @change="${this.changeTheme}"
          />Light
        </label>
        <label>
          <input
            type="radio"
            name="theme"
            value="dark"
            checked
            @change="${this.changeTheme}"
          />Dark
        </label>
      </fieldset>
      <div class="main">
        <h4>Calendar with input field</h4>
        <mv-calendar
          id="input"
          name="inputCalendar"
          type="input"
          .theme="${theme}"
          @change-date="${this.changeDate}"
          use-default-date
        ></mv-calendar>
        <h4>Calendar with button</h4>
        <mv-calendar
          id="button"
          name="buttonCalendar"
          type="button"
          .theme="${theme}"
          use-default-date
        ></mv-calendar>
        <h4>Single Calendar</h4>
        <mv-calendar
          id="simple"
          name="simpleCalendar"
          type="simple"
          .theme="${theme}"
        ></mv-calendar>
        <h4>Calendar with date range</h4>
        <mv-calendar
          id="range"
          name="rangeCalendar"
          type="range"
          .theme="${theme}"
        ></mv-calendar>
      </div>
    `;
  }

  changeTheme = originalEvent => {
    const {
      target: { value }
    } = originalEvent;
    this.theme = value;
  };

  hideDropdown = event => {
    console.log("bone bone");
    const { target } = event;
    target.dispatchEvent(
      new CustomEvent("close-mv-dropdown", { bubbles: true })
    );
  };

  changeDate = event => {
    const {
      detail: { startDate, endDate }
    } = event;
  };
}

customElements.define("mv-calendar-demo", MvCalendarDemo);
