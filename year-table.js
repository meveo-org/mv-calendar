import { LitElement, html, css } from "lit-element";
import { EMPTY_DATE, NOW } from "./utils/index.js";

const ROWS = 3;
const YEARS_PER_ROW = 5;
const YEARS_SHOWN = YEARS_PER_ROW * ROWS;
const YEARS_OFFSET = (YEARS_SHOWN - 1) / 2;

const mapYearTable = (year) => {
  const yearArray = Array.from(
    { length: YEARS_SHOWN },
    (_, i) => year - YEARS_OFFSET + i
  );
  let groupedYears = [];
  while (yearArray.length) {
    groupedYears.push(yearArray.splice(0, YEARS_PER_ROW));
  }
  return groupedYears;
};

export class YearTable extends LitElement {
  static get properties() {
    return {
      visible: { type: Object, attribute: false, reflect: true },
      selected: { type: Object, attribute: false, reflect: true },
      minYear: { type: Number, attribute: "min-year", reflect: true },
      maxYear: { type: Number, attribute: "max-year", reflect: true },
      yearIndex: { type: Number, attribute: false, reflect: true },
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

      .year-container {
        display: flex;
        justify-content: center;
      }

      .year-table {
        border-spacing: 4px;
        border-collapse: separate;
        margin: 0 0 4px 4px;
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

      button:disabled {
        color: var(--theme-disabled-text);
        background: var(--theme-background);
        cursor: not-allowed;
      }

      .navigation-text {
        text-align: center;
      }
    `;
  }

  constructor() {
    super();
    this.selected = { ...EMPTY_DATE };
    this.visible = { ...NOW };
    this.yearIndex = 0;
  }

  render() {
    const selectedYear = this.selected.year;
    const visibleYear = this.visible.year || NOW.year;
    const currentYear = !!selectedYear ? selectedYear : visibleYear;
    const middleYear = currentYear + this.yearIndex;
    const backDisabled = middleYear - YEARS_OFFSET <= this.minYear;
    const nextDisabled = middleYear + YEARS_OFFSET >= this.maxYear;

    return html`
      <div class="year-container">
        <table class="year-table">
          <tbody>
            ${mapYearTable(middleYear).map((yearRow) => {
              return html`
                <tr>
                  ${yearRow.map((year) => {
                    const selected = year === selectedYear ? "selected" : "";
                    const now = year === NOW.year ? " now" : "";
                    const hasMinYear = this.minYear !== undefined;
                    const hasMaxYear = this.maxYear !== undefined;
                    const invalidMinYear = hasMinYear && year < this.minYear;
                    const invalidMaxYear = hasMaxYear && year > this.maxYear;
                    const isInvalid = invalidMinYear || invalidMaxYear;
                    const disabled = isInvalid ? "disabled" : "";
                    return html`
                      <td>
                        <button
                          class="${selected}${now}"
                          ?disabled="${disabled}"
                          @click="${this.selectYear(year)}"
                        >
                          ${year}
                        </button>
                      </td>
                    `;
                  })}
                </tr>
              `;
            })}
            <tr>
              <td>
                <button
                  ?disabled="${backDisabled}"
                  @click="${this.navigateBack}"
                >
                  &#x25C1;
                </button>
              </td>
              <td class="navigation-text" colspan="3">
                <button @click="${this.selectYear(NOW.year)}">Now</button>
              </td>
              <td>
                <button
                  ?disabled="${nextDisabled}"
                  @click="${this.navigateForward}"
                >
                  &#x25B7;
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  navigateBack = () => {
    this.yearIndex = this.yearIndex - YEARS_PER_ROW * ROWS;
  };

  navigateForward = () => {
    this.yearIndex = this.yearIndex + YEARS_PER_ROW * ROWS;
  };

  selectYear = (year) => () => {
    this.yearIndex = 0;
    this.dispatchEvent(new CustomEvent("select-year", { detail: { year } }));
  };
}

customElements.define("year-table", YearTable);
