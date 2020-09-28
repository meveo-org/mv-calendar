import { LitElement, html, css } from "lit-element";
import {
  NOW,
  EMPTY_DATE,
  START_ON_MONDAY,
  START_ON_SUNDAY,
  isEmpty,
  isEqual,
  generateWeekDates,
} from "./utils/index.js";

const buildCellClass = (date, selected) => {
  const buttonClass = !isEmpty(date) ? " button" : "";
  const currentClass = isEqual(date, NOW) ? " today" : "";
  const isSelectedDate = isEqual(date, selected);
  const selectedDateClass = isSelectedDate ? " selected" : "";
  return `day${buttonClass}${currentClass}${selectedDateClass}`;
};

export class CalendarTable extends LitElement {
  static get properties() {
    return {
      visible: { type: Object, reflect: true },
      selected: { type: Object, reflect: true },
      range: { type: Object, reflect: true },
      weekDays: { type: Array, attribute: "week-days", reflect: true },
      mondayFirst: { type: Boolean, attribute: "monday-first", reflect: true },
      calendarDates: { type: Array, attribute: false },
      currentDate: { type: String, attribute: false },
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
      }

      td {
        padding: 0;
        margin: 0;
        height: var(--cell-size);
        width: var(--cell-size);
      }

      .month-container {
        display: flex;
        justify-content: center;
      }

      .calendar-table {
        margin: 0 0 5px 5px;
      }

      .day {
        font-family: var(--font-family);
        font-size: var(--font-size);
        margin: 0;
        padding: 0;
        text-align: center;
        cursor: default;
        height: var(--cell-size);
        width: var(--cell-size);
        border-radius: 50%;
      }

      .day.button {
        cursor: pointer;
        text-align: center;
      }

      .day.button.today {
        font-weight: bold;
        color: var(--today-color);
        background-color: var(--today-background);
      }

      .day.button:hover {
        background: var(--day-hover);
        color: var(--day-hover-color);
      }

      .day.button.selected {
        background: var(--active-background);
        color: var(--active-color);
      }
    `;
  }

  constructor() {
    super();
    this.mondayFirst = false;
    this.selected = { ...EMPTY_DATE };
    this.visible = { ...NOW };
  }

  render() {
    return html`
      <div class="month-container">
        <table class="calendar-table">
          <thead>
            <tr>
              ${this.weekDays.map((day) => html`<td class="day">${day}</td>`)}
            </tr>
          </thead>
          <tbody>
            ${this.calendarDates.map(
              (week) => html`
                <tr>
                  ${week.map((date) => {
                    const cellClass = buildCellClass(date, this.selected);
                    return html`
                      <td
                        class="${cellClass}"
                        @click="${this.selectDate(date)}"
                      >
                        ${date.day}
                      </td>
                    `;
                  })}
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "visible") {
      this.initializeCalendarTable();
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  initializeCalendarTable = () => {
    this.visible = isEmpty(this.visible) ? { ...NOW } : this.visible;
    const year = this.visible.year;
    const month = this.visible.month;
    const nextMonth = this.visible.month + 1;
    const numberOfDays = new Date(year, nextMonth, 0).getDate();

    const dayOffset = this.mondayFirst ? -1 : 0;
    const startingDayOfWeek = new Date(year, month, 1).getDay() + dayOffset;
    const endingDayOfWeek =
      new Date(year, month, numberOfDays).getDay() + dayOffset;

    const firstDay = startingDayOfWeek < 0 ? 6 : startingDayOfWeek;
    const lastDay = endingDayOfWeek < 0 ? 6 : endingDayOfWeek;

    this.calendarDates = [];

    const firstWeek =
      firstDay > 0
        ? generateWeekDates({
            year,
            month,
            offset: 1,
            limit: 7 - firstDay,
            padding: firstDay,
            prefix: true,
          })
        : [];

    const lastWeek =
      lastDay < 6
        ? generateWeekDates({
            year,
            month,
            offset: numberOfDays - lastDay,
            limit: lastDay + 1,
            padding: 6 - lastDay,
            prefix: false,
          })
        : [];

    const emptyFirstWeek = firstWeek.length < 1;
    const emptyLastWeek = lastWeek.length < 1;
    const lastWeekCount = emptyLastWeek ? 0 : lastDay + 1;
    const middleDatesStart = emptyFirstWeek ? 1 : 8 - firstDay;
    const middleDatesEnd = numberOfDays - middleDatesStart - lastWeekCount + 1;
    const middleDates = generateWeekDates({
      year,
      month,
      offset: middleDatesStart,
      limit: middleDatesEnd,
    });

    if (!emptyFirstWeek) {
      this.calendarDates.push(firstWeek);
    }
    this.calendarDates.push(...middleDates);
    if (!emptyLastWeek) {
      this.calendarDates.push(lastWeek);
    }

    this.weekDays =
      this.weekDays || (this.mondayFirst ? START_ON_MONDAY : START_ON_SUNDAY);
  };

  selectDate = (date) => () => {
    if (!isEmpty(date)) {
      const isCurrentDate = isEqual(date, this.selected);
      const chosenDate = isCurrentDate ? { ...EMPTY_DATE } : date;
      this.dispatchEvent(
        new CustomEvent("select-date", { detail: { ...chosenDate } })
      );
    }
  };
}

customElements.define("calendar-table", CalendarTable);
