import { LitElement, html, css } from "lit-element";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_PER_ROW = 3;

const MONTH_TABLE_VALUES = (() => {
  let monthArray = [...MONTHS];
  let groupedMonths = [];
  while (monthArray.length) {
    groupedMonths.push(monthArray.splice(0, MONTHS_PER_ROW));
  }
  return groupedMonths;
})();

export class MonthTable extends LitElement {
  static get properties() {
    return {
      "visible-month": { type: Object, attribute: false, reflect: true },
      "selected-date": { type: Object, attribute: false, reflect: true },
    };
  }

  static get styles() {
    return css`
      :host {
        color: var(--theme-text-color);
        background: var(--theme-background);
        font-family: var(--font-family);
        --font-size: var(--font-size-m, 1rem);
        --day-hover: var(--mv-calendar-day-hover, #666666);
        --day-hover-color: var(--mv-calendar-day-hover-color, #ffffff);
        --today-color: var(--theme-today-color, #3d3d3d);
        --today-background: var(--theme-today-background, #ededed);
        --cell-size: calc(var(--font-size) * 2);
        --shadow-offset: calc(var(--font-size) * 0.04);
        --active-color: var(--mv-calendar-active-color, #ffffff);
        --active-background: var(
          --mv-calendar-active-background,
          linear-gradient(to right, #007adf 0%, #00ecbc 180%)
        );
        --table-padding: var(--month-table-padding, 0);
      }

      button {
        font-family: var(--font-family);
        font-size: var(--font-size);
        display: inline-block;
        border: none;
        text-decoration: none;
        background: transparent;
        color: var(--theme-text-color);
        text-transform: none;
        cursor: pointer;
        text-align: center;
        padding: 5px;
        margin: 5px auto;
        border-radius: 5px;
        font-weight: 500;
        width: 100%;
        outline: none;
      }

      button:hover {
        background-color: var(--hover-background-color, #666);
        color: #ffffff;
      }

      td {
        padding: 0;
        margin: 0;
      }

      .month-container {
        max-width: calc(100% - 4px);
      }

      .month-table {
        border-spacing: 3px;
        border-collapse: separate;
        margin: 0 0 4px 3px;
      }

      button.now {
        font-weight: bold;
        color: var(--today-color);
        background-color: var(--today-background);
      }

      button.selected {
        background: var(--active-background);
        color: var(--active-color);
      }
    `;
  }

  constructor() {
    super();
    this["visible-month"] = new Date();
    this.month = new Date().getMonth();
  }

  render() {
    const selectedMonth =
      !!this["selected-date"] && this["selected-date"].getMonth();
    return html`
      <div class="month-container">
        <table class="month-table">
          <tbody>
            ${MONTH_TABLE_VALUES.map((monthRow, rowIndex) => {
              return html`
                <tr>
                  ${monthRow.map((month, monthIndex) => {
                    const value = rowIndex * MONTHS_PER_ROW + monthIndex;
                    const selected = value === selectedMonth ? "selected" : "";
                    const now = value === this.month ? " now" : "";
                    return html`<td>
                      <button
                        class="${selected}${now}"
                        @click="${this.selectMonth(value)}"
                      >
                        ${month}
                      </button>
                    </td>`;
                  })}
                </tr>
              `;
            })}
          </tbody>
        </table>
      </div>
    `;
  }

  selectMonth = (month) => () => {
    const selectedDate = this["selected-date"];
    const hasSelectedDate = !!selectedDate;
    const currentDate = hasSelectedDate ? selectedDate : this["visible-month"];
    currentDate.setMonth(month);
    this.dispatchEvent(
      new CustomEvent("select-month", { detail: { date: currentDate, month } })
    );
  };
}

customElements.define("month-table", MonthTable);
