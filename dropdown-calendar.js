import { LitElement, html, css } from "lit-element";
import "mv-dropdown";
import "./calendar-input.js";
import "./single-calendar.js";

export class DropdownCalendar extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      theme: { type: String },
      justify: { type: String },
      placeholder: { type: String },
      position: { type: String },
      pattern: { type: String },
      visible: { type: Object, attribute: false, reflect: true },
      selected: { type: Object, attribute: false, reflect: true },
      inputDate: { type: String, attribute: false, reflect: true },
      mondayFirst: { type: Boolean, attribute: "monday-first", reflect: true },
      minYear: { type: Number, attribute: "min-year", reflect: true },
      maxYear: { type: Number, attribute: "max-year", reflect: true },
      hasError: { type: Boolean, attribute: "has-error", reflect: true },
      patternRegex: { type: String, attribute: "pattern-regex", reflect: true },
      patternMatcher: {
        type: String,
        attribute: "pattern-matcher",
        reflect: true,
      },
      allowPartial: {
        type: Boolean,
        attribute: "allow-partial",
        reflect: true,
      },
      noClearButton: {
        type: Boolean,
        attribute: "no-clear-button",
        reflect: true,
      },
    };
  }

  static get styles() {
    return css`
      :host {
        --font-size: var(--font-size-m, 1rem);
        --width: calc(var(--font-size) * 16);
        --mv-dropdown-trigger-height: calc(var(--font-size) + 32px);
        --mv-dropdown-min-width: calc(var(--width) + 4px);
        --mv-dropdown-max-width: calc(var(--width) + 4px);
        --mv-dropdown-content-max-height: auto;
      }

      mv-dropdown[content] {
        --mv-container-margin: 0;
      }

      .clear-button {
        font-size: var(--font-size-m);
      }
    `;
  }

  constructor() {
    super();
    this.visible = new Date();
    this.theme = "light";
    this.justify = "left";
    this.position = "bottom";
    this.noBorder = false;
    this.mondayFirst = false;
    this.allowPartial = false;
    this.pattern = "MM/DD/YYYY";
    this.patternMatcher = "MDY";
    this.patternRegex = "\\d";
    this.noClearButton = false;
  }

  render() {
    return html`
      <mv-dropdown
        container
        .justify="${this.justify}"
        .position="${this.position}"
        .theme="${this.theme}"
      >
        <mv-dropdown trigger>
          <calendar-input
            min-year="${this.minYear}"
            max-year="${this.maxYear}"
            .placeholder="${this.placeholder}"
            .theme="${this.theme}"
            .visible="${this.visible}"
            .selected="${this.selected}"
            .pattern="${this.pattern}"
            .pattern-matcher="${this.patternMatcher}"
            .pattern-regex="${this.patternRegex}"
            ?allow-partial="${this.allowPartial}"
            ?no-clear-button="${this.noClearButton}"
            @select-date="${this.updateSelected}"
          ></calendar-input>
        </mv-dropdown>
        <mv-dropdown content .theme="${this.theme}">
          <single-calendar
            no-border
            name="${this.name}"
            min-year="${this.minYear}"
            max-year="${this.maxYear}"
            .theme="${this.theme}"
            .visible="${this.visible}"
            .selected="${this.selected}"
            .pattern="${this.pattern}"
            .pattern-matcher="${this.patternMatcher}"
            .pattern-regex="${this.patternRegex}"
            ?monday-first="${this.mondayFirst}"
            ?allow-partial="${this.allowPartial}"
            @select-date="${this.updateSelected}"
          ></single-calendar>
        </mv-dropdown>
      </mv-dropdown>
    `;
  }

  updateSelected = (event) => {
    const {
      detail: { selected, visible },
    } = event;
    const { name } = this;
    this.visible = visible;
    this.dispatchEvent(
      new CustomEvent("select-date", { detail: { name, selected, visible } })
    );
  };
}

customElements.define("dropdown-calendar", DropdownCalendar);
