import { LitElement, html, css } from "lit-element";
import "mv-font-awesome";
import "./mv-calendar.js";

export class MvCalendarDemo extends LitElement {
  static get properties() {
    return {
      value: { type: String, attribute: true },
      open: { type: Boolean, attribute: true },
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
        --mv-dropdown-trigger-height: 44px;
      }

      .main {
        width: 50%;
        margin: 10px;
      }

      mv-calendar {
        width: 50%;
      }

      mv-fa[icon="lightbulb"] {
        font-size: 50px;
        cursor: pointer;
        margin: 20px;
      }

      .theme {
        display: flex;
        justify-content: flex-start;
      }
    `;
  }

  constructor() {
    super();
    this.open = false;
    this.theme = "dark";
  }

  render() {
    return html `
      <div class="theme">
        <mv-fa icon="lightbulb" style="color: ${this.open ? "yellow" : ""}" @click=${this.toggleLightBulb}></mv-fa>
      </div>
      <div class="main">
        <h4>Calendar with input field</h4>
        <mv-calendar id="input" name="inputCalendar" type="input" .theme="${this.theme}"></mv-calendar>
        <h4>Calendar with button</h4>
        <mv-calendar id="button" name="buttonCalendar" type="button" .theme="${this.theme}"></mv-calendar>
        <h4>Single Calendar</h4>
        <mv-calendar id="simple" name="simpleCalendar" type="simple" .theme="${this.theme}"></mv-calendar>
        <h4>Calendar with date range</h4>
        <mv-calendar id="range" name="rangeCalendar" type="range" .theme="${this.theme}"></mv-calendar>
      </div>
    `;
  }

  toggleLightBulb = () => {
    this.open = !this.open;
    if (this.open) {
      this.theme = "light";
    } else {
      this.theme = "dark";
    }
  };

  hideDropdown = event => {
    console.log('bone bone');
    const { target } = event;
    target.dispatchEvent(
      new CustomEvent("close-mv-dropdown", { bubbles: true })
    );
  };
}

customElements.define("mv-calendar-demo", MvCalendarDemo);
