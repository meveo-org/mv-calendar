import { LitElement, html, css } from "lit-element";
import "mv-select";

const MONTHS = [
  { label: "January", value: 0 },
  { label: "February", value: 1 },
  { label: "March", value: 2 },
  { label: "April", value: 3 },
  { label: "May", value: 4 },
  { label: "June", value: 5 },
  { label: "July", value: 6 },
  { label: "August", value: 7 },
  { label: "September", value: 8 },
  { label: "October", value: 9 },
  { label: "November", value: 10 },
  { label: "December", value: 11 },
];

export class MonthFilter extends LitElement {
  static get properties() {
    return {
      "month-shown": { type: Object, reflect: true },
      selectedOption: { type: Object, attribute: false, reflect: true },
      theme: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        --mv-select-width: 110px;
        --mv-select-input-padding: 6.7px;
        --mv-select-border: none;
      }
    `;
  }

  constructor() {
    super();
    this["month-shown"] = new Date();
    this.theme = "light";
    this.inlineInput = "false";
  }

  render() {
    return html`
      <mv-select
        placeholder="Select month"
        .value="${this.selectedOption}"
        .options="${MONTHS}"
        .theme="${this.theme}"
        @select-option="${this.selectMonth}"
        no-clear-button
      ></mv-select>
    `;
  }

  connectedCallback() {
    this.selectOption();
    super.connectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "month-shown") {
      this.selectOption();
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  selectOption = () => {
    const currentMonth = this["month-shown"] || new Date();
    this.selectedOption = MONTHS[currentMonth.getMonth()];
  };

  selectMonth = (event) => {
    const {
      detail: { option },
    } = event;
    const currentDate = this["month-shown"];
    const date = new Date(currentDate.getFullYear(), option.value);
    this.dispatchEvent(new CustomEvent("select-month", { detail: { date } }));
  };
}

customElements.define("month-filter", MonthFilter);
