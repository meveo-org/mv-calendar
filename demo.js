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
      }

      mv-calendar {
        width: 50%;
      }
    `;
  }

  render() {
    return html`
    <div class="main">
      <mv-calendar></mv-calendar>
    </div>
    `;
  }
}

customElements.define("mv-calendar-demo", MvCalendarDemo);
