import { LitElement, html, css } from "lit-element";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export class MvCalendar extends LitElement {
  static get properties() {
    return {
      value: { type: String, attribute: true },
      name: { type: String },
      type: { type: String },
      style: { type: String },
    };
  }

  static get styles() {
    return css`
			:host {
				font-family: "MuseoSans";
				font-size: var(--font-size-m, 10pt);
        font-color: var(--font-color, #3F4753);
        --max-width: var(--mv-select-max-width, 200px);
        font-weight: 100;
      }

      table {
        max-width: var(--max-width);
        border: var(--border);
        border-radius: var(--border-radius);
        border-collapse: collapse;
      }

      .bg-info {
        background: -webkit-gradient(linear, left top, right top, from(#007ADF), color-stop(180%, #00ECBC));
      	background: -webkit-linear-gradient(left, #007ADF 0%, #00ECBC 180%);
      	background: -o-linear-gradient(left, #007ADF 0%, #00ECBC 180%);
      	background: linear-gradient(to right, #007ADF 0%, #00ECBC 180%);
      	border-radius: 24px;
      	color: #FFFFFF;
      }

      .filter-btn-selected {
        background-color: #ccc !important;
        color: #000 !important;
      }

      .current-date {
        font-weight: bold;
      }

      .mv-calendar-container {
        min-width: var(--mv-container-min-width, 584px);
        max-width: var(--mv-container-max-width, 615px);
        -webkit-box-shadow: 1px 1px 5px 0px rgba(41,41,41,0.75);
        -moz-box-shadow: 1px 1px 5px 0px rgba(41,41,41,0.75);
        box-shadow: 1px 1px 5px 0px rgba(41,41,41,0.75);
        padding: 5px;
        display: flex;
      }

      .mv-single-calendar-container {
        min-width: var(--mv-container-min-width, 420px);
        max-width: var(--mv-container-max-width, 420px);
        height: 325px;
        -webkit-box-shadow: 0px 0px 20px 1px rgba(93,94,97,0.35);
        -moz-box-shadow: 0px 0px 20px 1px rgba(93,94,97,0.35);
        box-shadow: 0px 0px 20px 1px rgba(93,94,97,0.35);
        background-color: #3F4753;
        border-color: #1E3843;
        padding: 5px;
        display: flex;
        border-radius: 5px;
      }

      .mv-range-calendar-container {
        min-width: var(--mv-container-min-width, 730px);
        max-width: var(--mv-container-max-width, 730px);
        height: 325px;
        -webkit-box-shadow: 0px 0px 20px 1px rgba(93,94,97,0.35);
        -moz-box-shadow: 0px 0px 20px 1px rgba(93,94,97,0.35);
        box-shadow: 0px 0px 20px 1px rgba(93,94,97,0.35);
        background-color: #3F4753;
        border-color: #1E3843;
        padding: 5px;
        display: flex;
        border-radius: 5px;
      }

      .mv-input-calendar-container {
        min-width: var(--mv-container-min-width, 584px);
        max-width: var(--mv-container-max-width, 615px);
        -webkit-box-shadow: 0px 0px 20px 1px rgba(93,94,97,0.35);
        -moz-box-shadow: 0px 0px 20px 1px rgba(93,94,97,0.35);
        box-shadow: 0px 0px 20px 1px rgba(93,94,97,0.35);
        background-color: #3F4753;
        border-color: #1E3843;
        padding: 5px;
        display: flex;
      }

      .month-year-header {
        text-transform: uppercase;
        font-size: 1rem;
        text-transform: uppercase;
        padding-bottom: 5px;
        color: #fff;
        text-align: center;
      }

      .date-container {
        cursor: pointer;
        text-align: center;
        padding: 5px;
      }

      .text-filter-to {
      	margin-top: 30px;
      	color: #8A8E94;
      }

      button {
        border-radius: 0;
      }

      button:focus {
        outline:0;
      }

      .navigation {
        background: none;
      	line-height: 1.7rem;
      	text-align: center;
      	cursor: pointer;
      	position: absolute;
      	top: 2px;
      	width: 0;
      	padding: 0;
      	border: 0.45rem solid transparent;
      	z-index: 1;
      	height: 10px;
      	width: 10px;
      	text-indent: -999em;
      	overflow: hidden;
      }

      .date-container:hover {
        background-color: #666;
      	border-radius: 24px;
      	color: #FFFFFF;
      }

      .prev-next-container {
        width: 40px;
        margin-right: 5px;
        position: relative;
      }

      .table td {
        padding: 3px 5px;
      	vertical-align: top;
        color: #fff;
        font-family: "MuseoSans", sans-serif;
        font-size: 1rem;
        font-weight: 100;
      }

      .calendar {
        width: 280px;
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        margin-left: 10px;
        margin-right: 10px;
        font-family: "MuseoSans",sans-serif;
      }

      .calendar .calendar-column-item {
      	border-radius: 5px;
      	margin: 8px auto;
      	display: -ms-flexbox;
      	display: flex;
      	-ms-flex-direction: row;
      	flex-direction: row;
      	-ms-flex-align: center;
      	align-items: center;
      }

      .calendar .text-field-container .date-text-field input {
      	width: 240px;
      	height: 20px;
      	border-radius: 50px;
      	font-family: "MuseoSans",sans-serif;
      	font-size: 1rem;
      	color: #fff;
      	background-color: #3F4753;
      	border: #fff solid 1px;
      	padding: 5px 5px;
      	font-weight: 300;
      }

      input:focus, textarea:focus, select:focus{
        outline: none;
      }

      .calendar .datepicker {
        border-radius: 0.3rem;
        display: inline-block;
        position: relative;
      }

      .datepicker__triangle {
      	position: absolute;
      	left: 50px;
        font-family: "MuseoSans",sans-serif;
        font-size: 1rem;
        font-weight: 100;
        color: #000;
      }

      .datepicker__navigation--previous {
      	left: 10px;
        width: 0;
        height: 0;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right:8px solid #ccc;
        border-left: 0;
      }

      .datepicker__navigation--next {
      	right: 10px;
        width: 0;
        height: 0;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-left: 8px solid #ccc;
        border-right: 0;
      }

      .datepicker__navigation {
        background: none;
      	line-height: 1.7rem;
      	text-align: center;
      	cursor: pointer;
      	position: absolute;
      	top: 2px;
      	width: 0;
      	padding: 0;
      	z-index: 1;
      	height: 10px;
      	width: 10px;
      	text-indent: -999em;
      	overflow: hidden;
      }

      .button-list {
        margin-top: 15px;
      }

      .button-list .button-item {
      	padding: 5px 10px;
      }

      .button-list .button-item button {
        display: inline-block;
        border: none;
        min-height: 32px;
        height: 32px;
        margin: 0;
        text-decoration: none;
        background: #0069ed;
        color: #ffffff;
        text-transform: none;
        font-family: "MuseoSans",sans-serif;
        font-size: 1rem;
        cursor: pointer;
        text-align: center;
        justify-content: left;
        -webkit-appearance: none;
        -moz-appearance: none;
        cursor: pointer;
        border-radius: 5px;
      }

      .button-list .button-item .date-btn {
      	background-color: #39404B;
      	-webkit-box-shadow: 0px 0px 20px 1px rgba(93,94,97,0.35);
      	box-shadow: 0px 0px 20px 1px rgba(93,94,97,0.35);
      	color: #fff;
      	font-weight: 100;
      	padding-top: 5px;
      	padding-right: 7px;
      	width: 100%;
      }

      .button-container {
        display: flex;
        flex-direction: row;
        min-width: 139px;
        width: 139px;
        height: 324px;
      	background-color: #3F4753;
      	border-radius: 5px 0px 0px 5px;
      	-webkit-box-shadow: 0px 0px 20px 1px rgba(93,94,97,0.35);
      	box-shadow: 0px 0px 20px 1px rgba(93,94,97,0.35);
      	border-right: #1E3843 solid 1px;
      	display: -ms-flexbox;
      	display: flex;
      	-ms-flex-direction: column;
      	flex-direction: column;
      	text-align: center;
      }
		`;
  }

  constructor() {
    super();
    this.today = new Date();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.nextMonth = this.currentMonth;
    this.nextYear = this.currentYear;
    this.selectYear = null;
    this.selectMonth = null;
    this.monthAndYear = null;
    this.nextMonthAndYear = null;
    this.startDateField = null;
    this.currentMonthCalendar = null;
    this.nextMonthCalendar = null;
    this.months = MONTHS;
    this.days = DAYS;
    this.name = '';
    this.type = 'single';
    this.startDate = null;
    this.endDate = null;
  }

  firstUpdated(changedProperties) {
    this.selectYear = this.renderRoot.getElementById("year");
    this.selectMonth = this.renderRoot.getElementById("month");
    this.monthAndYear = this.renderRoot.getElementById("monthAndYear");
    this.nextMonthAndYear = this.renderRoot.getElementById("nextMonthAndYear");
    this.startDateField = this.renderRoot.getElementById("startDateField");
    this.currentMonthCalendar = this.renderRoot.getElementById("currentMonthCalendar");
    this.nextMonthCalendar = this.renderRoot.getElementById("nextMonthCalendar");
    this.showCalendar(this.currentMonth, this.currentYear);
    if (this.type === 'range') {
      this.endDateField = this.renderRoot.getElementById("endDateField");
      this.showCalendar(this.nextMonth, this.nextYear, 'next-month-calendar-body');
    }
  }

  render() {
    return html `
      ${this.renderCalendar()}
    `;
  }

  renderCalendar = () => {
    let view = '';
    if (this.type === 'single') {
      return html `${this.renderSingleCalendar()}`;
    } else if (this.type === 'range') {
      return html `${this.renderRangeCalendar()}`;
    } else if (this.type === 'input') {
      return html `${this.renderCalendarWithInputField()}`;
    } else {
      return html `${this.renderSingleCalendar()}`;
    }
  };

  renderFilterButtonContainer = () => {
    return html `<div class="button-container">
      <div class="button-list">
          <div class="button-item"><button id="todayBtn" class="date-btn" tabindex="0" type="button" name="today" @click=${this.handleDateToday}><span class="MuiButton-label">Today</span></button></div>
          <div class="button-item"><button id="yesterdayBtn" class="date-btn" tabindex="0" type="button" name="yesterday" @click=${this.handleDateYesterday}><span class="MuiButton-label">Yesterday</span></button></div>
          <div class="button-item"><button id="last7DaysBtn" class="date-btn" tabindex="0" type="button" name="last7Days" @click=${this.handleLast7Days}><span class="MuiButton-label">Last 7 days</span></button></div>
          <div class="button-item"><button id="last30DaysBtn" class="date-btn" tabindex="0" type="button" name="last30Days" @click=${this.handleLast30Days}><span class="MuiButton-label">Last 30 days</span></button></div>
          <div class="button-item"><button id="last3MosBtn" class="date-btn" tabindex="0" type="button" name="last3Mos" @click=${this.handleLast3Months}><span class="MuiButton-label">Last 3 months</span></button></div>
          <div class="button-item"><button id="last6MosBtn" class="date-btn" tabindex="0" type="button" name="last6Mos" @click=${this.handleLast6Months}><span class="MuiButton-label">Last 6 months</span></button></div>
          <div class="button-item"><button id="customBtn" class="date-btn" tabindex="0" type="button" name="custom" style="pointer-events: none;"><span class="MuiButton-label">Custom</span></button></div>
      </div>
    </div>`;
  };

  renderSingleCalendar = () => {
    return html `<div class="mv-single-calendar-container ${this.style}">
      ${this.renderFilterButtonContainer()}
      <div id="currentMonthCalendar" class="calendar">
        <div class="calendar-column-item text-field-container">
            <div class="date-text-field"><input id="startDateField" name="start-date" type="text" placeholder="Select start date" readonly></div>
        </div>
        <div class="calendar-column-item">
          <div class="datepicker">
            <div class="datepicker__triangle"></div>
            <button type="button" class="datepicker__navigation datepicker__navigation--previous" @click="${this.previous(this.currentYear, this.currentMonth)}">Previous Month</button>
            <button type="button" class="datepicker__navigation datepicker__navigation--next" @click="${this.next(this.currentYear, this.currentMonth)}">Next month</button>
            <div class="month-container">
              <div class="month-year-header">
                <div class="card-header" id="monthAndYear"></div>
              </div>
              <table class="table" id="calendar">
                <thead>
                  <tr>
                    ${this.days.map(day => html `<td style='text-align:center'>${day}</td>`)}
                  </tr>
                </thead>
                <tbody id="current-month-calendar-body">
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  };

  renderRangeCalendar = () => {
    return html `<div class="mv-range-calendar-container ${this.style}">
      ${this.renderFilterButtonContainer()}
      <div id="currentMonthCalendar" class="calendar">
        <div class="calendar-column-item text-field-container">
            <div class="date-text-field"><input id="startDateField" name="start-date" type="text" placeholder="Select start date" readonly></div>
        </div>
        <div class="calendar-column-item">
          <div class="datepicker">
            <div class="datepicker__triangle"></div>
            <button type="button" class="datepicker__navigation datepicker__navigation--previous" @click="${this.previous(this.currentYear, this.currentMonth)}">Previous Month</button>
            <button type="button" class="datepicker__navigation datepicker__navigation--next" @click="${this.next(this.currentYear, this.currentMonth)}">Next month</button>
            <div class="month-container">
              <div class="month-year-header">
                <div class="card-header" id="monthAndYear"></div>
              </div>
              <table class="table" id="calendar">
                <thead>
                  <tr>
                    ${this.days.map(day => html `<td style='text-align:center'>${day}</td>`)}
                  </tr>
                </thead>
                <tbody id="current-month-calendar-body">
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="text-filter-to">to</div>
        <div id="nextMonthCalendar" class="calendar">
          <div class="calendar-column-item text-field-container">
              <div class="date-text-field"><input id="endDateField" name="end-date-" type="text" placeholder="Select start date" readonly></div>
          </div>
          <div class="calendar-column-item">
            <div class="datepicker">
              <div class="datepicker__triangle"></div>
              <button type="button" class="datepicker__navigation datepicker__navigation--previous" @click="${this.previous(this.nextYear, this.nextMonth, false)}">Previous Month</button>
              <button type="button" class="datepicker__navigation datepicker__navigation--next" @click="${this.next(this.nextYear, this.nextMonth, false)}">Next month</button>
              <div class="month-container">
                <div class="month-year-header">
                  <div class="card-header" id="nextMonthAndYear"></div>
                </div>
                <table class="table" id="calendar">
                  <thead>
                    <tr>
                      ${this.days.map(day => html `<td style='text-align:center'>${day}</td>`)}
                    </tr>
                  </thead>
                  <tbody id="next-month-calendar-body">
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    </div>`;
  };

  renderCalendarWithInputField = () => {
    return html `<div class="mv-input-calendar-container ${this.style}">
      <div class="month-year-header">
        <div class="card-header" id="monthAndYear"></div>
        <div class="prev-next-container">
          <button class="navigation" id="previous" @click="${this.previous(this.currentYear, this.currentMonth)}">Previous</button>
          <button class="navigation" id="next" @click="${this.next(this.currentYear, this.currentMonth)}">Next</button>
        </div>
      </div>
      <table class="table" id="calendar">
        <thead>
          <tr>
            ${this.days.map(day => html `<td>${day}</td>`)}
          </tr>
        </thead>
        <tbody id="current-month-calendar-body">
        </tbody>
      </table>
    </div>`;
  };

  showCalendar = (month, year, tableBody = 'current-month-calendar-body') => {
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    const tbl = this.renderRoot.querySelector(`#${tableBody}`);
    const isCurrentMonthTable = tableBody === 'current-month-calendar-body' ? true : false;

    if (tbl) {
      tbl.innerHTML = "";
      if (isCurrentMonthTable) {
        this.monthAndYear.innerHTML = this.months[month] + " " + year;
      }

      if (!isCurrentMonthTable) {
        this.nextMonthAndYear.innerHTML = this.months[this.nextMonth] + " " + this.nextYear;
      }

      let date = 1;
      for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < firstDay) {
              let cell = document.createElement("td");
              let cellText = document.createTextNode("");
              let dateContainer = document.createElement("div");
              dateContainer.classList.add('date-container', tableBody);
              dateContainer.appendChild(cellText);
              cell.appendChild(dateContainer);
              row.appendChild(cell);
          }
          else if (date > daysInMonth) {
              break;
          } else {
            let cell = document.createElement("td");
            let dateContainer = document.createElement("div");
            let cellText = document.createTextNode(date);
            const calendarDate = new Date(`${month + 1}/${date}/${year}`);
            dateContainer.classList.add('date-container', tableBody);
            if (date === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
                dateContainer.classList.add("current-date");
            }
            if (this.startDate && this.endDate) {
              if (calendarDate >= this.startDate && calendarDate <= this.endDate) {
                this.highlightDateCell(dateContainer);
              }
            }

            if (isCurrentMonthTable && this.startDate && date === this.startDate.getDate() && year === this.startDate.getFullYear() && month === this.startDate.getMonth()) {
              this.highlightDateCell(dateContainer);
            } else if (!isCurrentMonthTable && this.endDate && date === this.endDate.getDate() && year === this.endDate.getFullYear() && month === this.endDate.getMonth()) {
              this.highlightDateCell(dateContainer);
            }
            cell.classList.add(tableBody);
            dateContainer.id = `${tableBody}-${date}`;
            if (isCurrentMonthTable) {
              cell.addEventListener('click', this.selectStartDate(dateContainer));
            } else {
              cell.addEventListener('click', this.selectEndDate(dateContainer));
            }

            dateContainer.appendChild(cellText);
            cell.appendChild(dateContainer);
            row.appendChild(cell);
            date++;
          }
        }

        tbl.appendChild(row);
      }
    }
  };

  highlightDateCell = (cell) => {
    cell.classList.add("bg-info");
  };

  removeHighlightedDateCell = (cell, tableCss = 'current-month-calendar-body') => {
    const highlightedCells = this.renderRoot.querySelectorAll(`.${tableCss} .bg-info`);
    for (let i=0;i < highlightedCells.length; i++) {
      highlightedCells[i].classList.remove("bg-info");
    }
  };

  previous = (year, month, isCurrentMonth = true) => () => {
    if (!isCurrentMonth) {
      this.nextYear = (this.nextMonth === 0) ? this.nextYear - 1 : this.nextYear;
      this.nextMonth = (this.nextMonth === 0) ? 11 : this.nextMonth - 1;
      this.showCalendar(this.nextMonth, this.nextYear, 'next-month-calendar-body');
    } else {
      this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
      this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
      this.showCalendar(this.currentMonth, this.currentYear);
    }
  };

  next = (year, month, isCurrentMonth = true) => () => {
    if (!isCurrentMonth) {
      this.nextYear = (this.nextMonth === 11) ? this.nextYear + 1 : this.nextYear;
      this.nextMonth = (this.nextMonth + 1) % 12;
      this.showCalendar(this.nextMonth, this.nextYear, 'next-month-calendar-body');
    } else {
      this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
      this.currentMonth = (this.currentMonth + 1) % 12;
      this.showCalendar(this.currentMonth, this.currentYear);
    }
  };

  jump = () => {
    this.currentYear = parseInt(this.selectYear.value);
    this.currentMonth = parseInt(this.selectMonth.value);
    this.showCalendar(this.currentMonth, this.currentYear);
  }

  getFormattedDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  setDateRange = () => {
    const currentMonthContainer = this.renderRoot.getElementById(`current-month-calendar-body-${this.endDate.getDate()}`);
    if (currentMonthContainer) {
      const customBtn = this.renderRoot.getElementById('customBtn');
      this.currentYear = this.startDate.getFullYear();
      this.currentMonth = this.startDate.getMonth();
      customBtn.classList.remove('filter-btn-selected');
      this.showCalendar(this.startDate.getMonth(), this.startDate.getFullYear());
      this.getSelectedDate(currentMonthContainer);
    }
    if (this.type === 'range') {
      const nextMonthContainer = this.renderRoot.getElementById(`next-month-calendar-body-${this.endDate.getDate()}`);
      if (nextMonthContainer) {
        const customBtn = this.renderRoot.getElementById('customBtn');
        this.nextYear = this.endDate.getFullYear();
        this.nextMonth = this.endDate.getMonth();
        customBtn.classList.remove('filter-btn-selected');
        this.showCalendar(this.endDate.getMonth(), this.endDate.getFullYear(), 'next-month-calendar-body');
        this.getSelectedDate(nextMonthContainer);
      }
    }
  };

  getSelectedDate = (cell) => {
    if (cell.classList.contains('current-month-calendar-body')) {
      this.startDate = new Date(this.currentYear, this.currentMonth, cell.innerText);
      this.startDateField.value = this.getFormattedDate(this.startDate);
    }

    if (cell.classList.contains('next-month-calendar-body')) {
      this.endDate = new Date(this.nextYear, this.nextMonth, cell.innerText);
      this.endDateField.value = this.getFormattedDate(this.endDate);
    }

    return {
      startDate: this.startDate,
      endDate: this.endDate };
  };

  selectStartDate = (cell) => () => {
    const selectedDate = this.getSelectedDate(cell);
    this.removeHighlightedDateCell(cell);
    this.highlightDateCell(cell);
    if (this.type !== 'range') {
        this.endDate = null;
        this.resetFilterButtonSelection();
    } else {
      if (selectedDate.startDate && selectedDate.endDate) {
        this.resetFilterButtonSelection();
        this.setFilterButtonSelection('customBtn');
        this.showCalendar(selectedDate.startDate.getMonth(), selectedDate.startDate.getFullYear());
        this.showCalendar(selectedDate.endDate.getMonth(), selectedDate.endDate.getFullYear(), 'next-month-calendar-body');
      }
    }
  };

  selectEndDate = (cell) => () => {
    const tableCss = 'next-month-calendar-body';
    const selectedDate = this.getSelectedDate(cell);
    this.removeHighlightedDateCell(cell, tableCss);
    this.highlightDateCell(cell);
    if (this.type !== 'range') {
        this.startDate = null;
        this.resetFilterButtonSelection();
    } else {
      if (selectedDate.startDate && selectedDate.endDate) {
        this.resetFilterButtonSelection();
        this.setFilterButtonSelection('customBtn');
        this.showCalendar(selectedDate.startDate.getMonth(), selectedDate.startDate.getFullYear());
        this.showCalendar(selectedDate.endDate.getMonth(), selectedDate.endDate.getFullYear(), 'next-month-calendar-body');
      }
    }
  };

  setFilterButtonSelection = (buttonId) => {
    const button = this.renderRoot.getElementById(buttonId);
    if (button) {
      button.classList.add('filter-btn-selected');
    }
  };

  resetFilterButtonSelection = () => {
    const filterButtons = this.renderRoot.querySelectorAll('.date-btn');
    for (let i=0;i < filterButtons.length; i++) {
      filterButtons[i].classList.remove("filter-btn-selected");
    }
  };

  handleDateToday = () => {
    this.startDate = new Date();
    this.endDate = this.startDate;
    this.resetFilterButtonSelection();
    this.setFilterButtonSelection('todayBtn');
    this.setDateRange();
  }

  handleDateYesterday = () => {
    this.startDate = new Date();
    this.startDate.setDate(this.today.getDate() - 1);
    this.endDate = this.startDate;
    this.resetFilterButtonSelection();
    this.setFilterButtonSelection('yesterdayBtn');
    this.setDateRange();
  }

  handleLast7Days = () => {
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setDate(this.today.getDate() - 7);
    this.resetFilterButtonSelection();
    this.setFilterButtonSelection('last7DaysBtn');
    this.setDateRange();
  };

  handleLast30Days = () => {
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setDate(this.today.getDate() - 30);
    this.resetFilterButtonSelection();
    this.setFilterButtonSelection('last30DaysBtn');
    this.setDateRange();
  };

  handleLast3Months = () => {
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setMonth(this.today.getMonth() - 3);
    this.resetFilterButtonSelection();
    this.setFilterButtonSelection('last3MosBtn');
    this.setDateRange();
  };

  handleLast6Months = () => {
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setMonth(this.today.getMonth() - 6);
    this.resetFilterButtonSelection();
    this.setFilterButtonSelection('last6MosBtn');
    this.setDateRange();
  };
}

customElements.define("mv-calendar", MvCalendar);
