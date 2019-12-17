import { LitElement, html, css } from "lit-element";

export class MvCalendar extends LitElement {
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

      .mv-calendar-container {
        min-width: var(--mv-container-min-width, 365px);
        max-width: var(--mv-container-max-width, 365px);
        -webkit-box-shadow: 1px 1px 5px 0px rgba(41,41,41,0.75);
        -moz-box-shadow: 1px 1px 5px 0px rgba(41,41,41,0.75);
        box-shadow: 1px 1px 5px 0px rgba(41,41,41,0.75);
        padding: 5px;
      }

      .month-year-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 1px solid #000;
        text-transform: uppercase;
        font-size: 1rem;
        text-transform: uppercase;
        padding-bottom: 5px;
      }

      .date-container {
        cursor: pointer;
        text-align: center;
        padding: 5px;
      }

      button {
        border-radius: 0;
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

      #previous {
        border-right-color: black;
	      left: 0;
      }
      #next {
        border-left-color: black;
        right: 0;
      }

      .date-container:hover {
        background-color: rgba(57,64,75,0.25);
      	border-radius: 24px;
      	color: #FFFFFF;
      }

      .prev-next-container {
        width: 40px;
        margin-right: 5px;
        position: relative;
      }

      .table td {
      	padding: .1rem 0.75rem;
      	vertical-align: top;
      }
		`;
  }

  constructor() {
    super();
    this.today = new Date();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.selectYear = null;
    this.selectMonth = null;
    this.monthAndYear = null;
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  }

  selectDate = (cell) => {
    if (cell) {
      const container = this.renderRoot.querySelector('.bg-info');
      if (container) {
        container.classList.remove('bg-info');
      }
      cell.classList.add("bg-info");
      this.getSelectedDate(cell);
    }
  };


  showCalendar = (month, year) => {
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    const tbl = this.renderRoot.querySelector('#calendar-body');

    tbl.innerHTML = "";

    this.monthAndYear.innerHTML = this.months[month] + " " + year;

    let date = 1;
    for (let i = 0; i < 6; i++) {
      let row = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
            let cell = document.createElement("td");
            let cellText = document.createTextNode("");
            let dateContainer = document.createElement("div");
            cell.addEventListener('click', this.selectDate);
            dateContainer.classList.add('date-container');
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
          dateContainer.classList.add('date-container');
          if (date === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
              dateContainer.classList.add("bg-info");
          } // color today's date
          cell.addEventListener('click', e => this.selectDate(dateContainer));
          dateContainer.appendChild(cellText);
          cell.appendChild(dateContainer);
          row.appendChild(cell);
          date++;
        }
      }

      tbl.appendChild(row);
    }
  }

  previous = () => {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.showCalendar(this.currentMonth, this.currentYear);
  };

  next = () => {
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.showCalendar(this.currentMonth, this.currentYear);
  };

  jump = () => {
    this.currentYear = parseInt(this.selectYear.value);
    this.currentMonth = parseInt(this.selectMonth.value);
    this.showCalendar(this.currentMonth, this.currentYear);
  }

  getSelectedDate = (cell) => {
    return new Date(this.currentYear, this.currentMonth, cell.innerText).getTime();
  };

  firstUpdated(changedProperties) {
    this.selectYear = this.renderRoot.getElementById("year");
    this.selectMonth = this.renderRoot.getElementById("month");
    this.monthAndYear = this.renderRoot.getElementById("monthAndYear");
    this.showCalendar(this.currentMonth, this.currentYear);
  }

  render() {
    return html `
    <div class="mv-calendar-container">
      <div class="month-year-header">
        <div class="card-header" id="monthAndYear"></div>
        <div class="prev-next-container">
          <button class="navigation" id="previous" @click="${this.previous}">Previous</button>
          <button class="navigation" id="next" @click="${this.next}">Next</button>
        </div>
      </div>
      <table class="table" id="calendar">
        <thead>
          <tr>
            <td>Su</td>
            <td>Mo</td>
            <td>Tu</td>
            <td>We</td>
            <td>Th</td>
            <td>Fr</td>
            <td>Sa</td>
          </tr>
        </thead>
        <tbody id="calendar-body">
        </tbody>
      </table>
    </div>
    `;
  }
}

customElements.define("mv-calendar", MvCalendar);
