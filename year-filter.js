import { LitElement, html, css } from "lit-element";
import "mv-spinner";

export class YearFilter extends LitElement {
  static get properties() {
    return {
      "year-shown": { type: Object, reflect: true },
      selectedYear: { type: Number, reflect: true },
      hasError: { type: Boolean, attribute: "has-error", reflect: true },
      min: { type: Number, reflect: true },
      max: { type: Number, reflect: true },
    };
  }

  static get styles() {
    return css`
      :host {
        --mv-input-min-width: 70px;
        --mv-input-max-width: 70px;
        --mv-input-border: 1px solid transparent;
      }
    `;
  }

  constructor() {
    super();
    this["year-shown"] = new Date();
    this.hasError = false;
  }

  render() {
    return html`
      <mv-spinner
        name="year"
        value="${this.selectedYear}"
        .min="${this.min}"
        .max="${this.max}"
        ?has-error="${this.hasError}"
        @spinner-change="${this.changeYear}"
      ></mv-spinner>
    `;
  }

  connectedCallback() {
    this.selectYear();
    super.connectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "year-shown") {
      this.selectYear();
    }
  }

  selectYear = () => {
    const currentDate = this["year-shown"] || new Date();
    this.selectedYear = currentDate.getFullYear();
  };

  changeYear = (event) => {
    const {
      detail: { value, invalid },
    } = event;
    const currentDate = this["year-shown"] || new Date();
    this.hasError = invalid || !value || value < 1700; // should not be less than epoch year
    const date = this.hasError
      ? currentDate
      : new Date(value, currentDate.getMonth(), currentDate.getDate());
    this.dispatchEvent(new CustomEvent("select-year", { detail: { date } }));
  };
}

customElements.define("year-filter", YearFilter);
