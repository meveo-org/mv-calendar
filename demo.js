import { LitElement, html, css } from "lit-element";
import "./mv-calendar.js";

export class MvCalendarDemo extends LitElement {
  static get properties() {
    return {
      value: { type: String, attribute: true }
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, "MuseoSans");
        font-size: var(--font-size-m, 10pt);
      }

      .main {
        width: 50%;
        margin: 10px;
      }

      mv-calendar {
        width: 50%;
      }
    `;
  }

  render() {
    return html`        
    <div class="main">
      <h4>Calendar with input field</h4>
      <mv-calendar id="input" name="inputCalendar" type="input" style="light"></mv-calendar>
      <h4>Calendar with button</h4>
      <mv-calendar id="button" name="buttonCalendar" type="button" style="light"></mv-calendar>
      <h4>Single Calendar</h4>
      <mv-calendar id="simple" name="simpleCalendar" type="simple" style="dark"></mv-calendar>
      <h4>Calendar with date range</h4>
      <mv-calendar id="range" name="rangeCalendar" type="range" style="dark"></mv-calendar>
    </div>
    `;
  }
}

customElements.define("mv-calendar-demo", MvCalendarDemo);
