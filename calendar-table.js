import { LitElement, html, css } from "lit-element";

const START_ON_SUNDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const START_ON_MONDAY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export class CalendarTable extends LitElement {
  static get properties() {
    return {
      "month-shown": { type: Object, reflect: true },
      "week-days": { type: Array },
      "selected-date": { type: Object, reflect: true },
      range: { type: Object, reflect: true },
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
        --today-color: var(--mv-calendar-today-color, #000000);
        --today-background: var(--mv-calendar-today-background, #ededed);
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
        width: 100%;
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
        text-shadow: var(--shadow-offset) var(--shadow-offset) #666;
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
    this["month-shown"] = new Date();
  }

  render() {
    return html`
      <div class="month-container">
        <table class="calendar-table">
          <thead>
            <tr>
              ${this.weekDays.map((day) => html` <td class="day">${day}</td> `)}
            </tr>
          </thead>
          <tbody>
            ${this.calendarDates.map(
              (week) => html`
                <tr>
                  ${week.map((date) => {
                    const buttonClass = !!date.value ? " button" : "";
                    const timeValue = date.value && date.value.getTime();
                    const isCurrentDate =
                      timeValue === this.currentDate.getTime();
                    const currentDateClass = isCurrentDate ? " today" : "";
                    const selectedTime =
                      !!this["selected-date"] &&
                      this["selected-date"].getTime();
                    const isSelectedDate = timeValue === selectedTime;
                    const selectedDateClass = isSelectedDate ? " selected" : "";
                    return html`
                      <td
                        class="day${buttonClass}${currentDateClass}${selectedDateClass}"
                        @click="${this.selectDate(date)}"
                      >
                        ${date.label}
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
    if (name === "month-shown") {
      this.initializeCalendarTable();
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  initializeCalendarTable = () => {
    const currentDate = this["month-shown"] || new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const nextMonth = currentDate.getMonth() + 1;
    const numberOfDays = new Date(currentYear, nextMonth, 0).getDate();

    const dayOffset = this.mondayFirst ? -1 : 0;
    const startingDayOfWeek =
      new Date(currentYear, currentMonth, 1).getDay() + dayOffset;
    const endingDayOfWeek =
      new Date(currentYear, currentMonth, numberOfDays).getDay() + dayOffset;

    const firstDay = startingDayOfWeek < 0 ? 6 : startingDayOfWeek;
    const lastDay = endingDayOfWeek < 0 ? 6 : endingDayOfWeek;

    this.calendarDates = [];

    const firstWeek =
      firstDay > 0
        ? this.generateWeekDates({
            currentYear,
            currentMonth,
            offset: 1,
            limit: 7 - firstDay,
            padding: firstDay,
            prefix: true,
          })
        : [];

    const lastWeek =
      lastDay < 6
        ? this.generateWeekDates({
            currentYear,
            currentMonth,
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
    const middleDates = this.generateWeekDates({
      currentYear,
      currentMonth,
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

    const now = new Date();
    this.currentDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    this.weekDays =
      this["week-days"] ||
      (this.mondayFirst ? START_ON_MONDAY : START_ON_SUNDAY);
  };

  generateWeekDates = (details) => {
    const {
      currentYear,
      currentMonth,
      offset,
      limit,
      padding,
      prefix,
    } = details;
    const weekDates = Array.from({ length: limit }, (_, date) => {
      const currentDate = date + offset;
      return {
        label: currentDate,
        value: new Date(currentYear, currentMonth, currentDate),
      };
    });
    if (!!padding) {
      // return 1 week padded by empty strings
      const padDates = Array.from({ length: padding }, () => ({
        label: "",
        value: null,
      }));
      return prefix ? [...padDates, ...weekDates] : [...weekDates, ...padDates];
    } else {
      // group by week
      return Array.from({ length: weekDates.length / 7 }, (_, week) =>
        weekDates.slice(week * 7, week * 7 + 7)
      );
    }
  };

  selectDate = (date) => () => {
    if (!!date.value) {
      const currentValue =
        !!this["selected-date"] && this["selected-date"].getTime();
      const isCurrentDate = currentValue === date.value.getTime();
      const selectedDate = isCurrentDate ? null : date.value;
      this["selected-date"] = selectedDate;
      this.dispatchEvent(
        new CustomEvent("select-date", {
          detail: {
            date: selectedDate,
          },
        })
      );
    }
  };
}

customElements.define("calendar-table", CalendarTable);
