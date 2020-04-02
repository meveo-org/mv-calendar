import { LitElement, html, css } from "lit-element";
import "mv-container";
import "./calendar-table.js";
import "./month-filter.js";
import "./year-filter.js";

export class MvCalendar extends LitElement {
  static get properties() {
    return {
      selectedDate: { type: Object, attribute: false, reflect: true }
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        --font-size: var(--font-size-m, 1rem);
        --width: var(--mv-calendar-width, 250px);
        --mv-container-min-width: var(--width);
        --mv-container-max-width: var(--width);
        --mv-container-padding: 5px 10px;
      }

      .mv-calendar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: var(--width);
      }

      .filter-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
      }

      .filter-container * {
        margin: 2px;
      }
    `;
  }

  constructor() {
    super();
    this.selectedDate = new Date();
  }

  render() {
    return html`
      <mv-container>
        <div class="mv-calendar">
          <div class="filter-container">
            <month-filter
              .month-shown="${this.selectedDate}"
              @select-month="${this.updateMonth}"
            ></month-filter>
            <year-filter
              .year-shown="${this.selectedDate}"
              @select-year="${this.updateMonth}"
            ></year-filter>
          </div>
          <calendar-table .month-shown="${this.selectedDate}"></calendar-table>
        </div>
      </mv-container>
    `;
  }

  updateMonth = event => {
    const {
      detail: { date }
    } = event;
    this.updateCalendarTable(date);
  };

  updateCalendarTable = date => {
    this.selectedDate = date;
  };
}

customElements.define("mv-calendar", MvCalendar);
