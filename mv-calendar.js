import { LitElement, html, css } from "lit-element";
import "./single-calendar.js";
import "./dropdown-calendar.js";
import "./range-calendar.js";
import { EMPTY_DATE, NOW } from "./utils/index.js";
export class MvCalendar extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      placeholder: { type: String },
      theme: { type: String },
      justify: { type: String },
      position: { type: String },
      dropdown: { type: Boolean },
      selected: { type: Object, attribute: false, reflect: true },
      visible: { type: Object, attribute: false, reflect: true },
      range: { type: Object, attribute: false, reflect: true },
      "visible-range": { type: Object, attribute: false, reflect: true },
      inlineInput: { type: Boolean, attribute: "inline-input", reflect: true },
      mondayFirst: { type: Boolean, attribute: "monday-first", reflect: true },
      startPlaceholder: { type: String, attribute: "start-placeholder" },
      endPlaceholder: { type: String, attribute: "end-placeholder" },
      minYear: { type: Number, attribute: "min-year" },
      maxYear: { type: Number, attribute: "max-year" },
      pattern: { type: String },
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
      rangeCalendar: {
        type: Boolean,
        attribute: "range-calendar",
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
    return css``;
  }

  constructor() {
    super();
    this.theme = "light";
    this.justify = "left";
    this.position = "bottom";
    this.pattern = "MM/DD/YYYY";
    this.patternMatcher = "MDY";
    this.patternRegex = "\\d";
    this.inlineInput = false;
    this.mondayFirst = false;
    this.allowPartial = false;
    this.dropdown = false;
    this.rangeCalendar = false;
    this.noClearButton = false;
    this.selected = { ...EMPTY_DATE };
    this.visible = { ...NOW };
    this.selectedRange = {
      start: { ...EMPTY_DATE },
      end: { ...EMPTY_DATE },
    };
    this.visibleRange = {
      start: { ...NOW },
      end: { ...NOW },
    };
  }

  render() {
    if (this.dropdown) {
      return html`
        <dropdown-calendar
          min-year="${this.minYear}"
          max-year="${this.maxYear}"
          .placeholder="${this.placeholder}"
          .theme="${this.theme}"
          .visible="${this.visible}"
          .selected="${this.selected}"
          .pattern="${this.pattern}"
          .pattern-matcher="${this.patternMatcher}"
          .pattern-regex="${this.patternRegex}"
          .justify="${this.justify}"
          .position="${this.position}"
          ?monday-first="${this.mondayFirst}"
          ?allow-partial="${this.allowPartial}"
          ?no-clear-button="${this.noClearButton}"
          @select-date="${this.updateSelected}"
        ></dropdown-calendar>
      `;
    } else if (this.rangeCalendar) {
      return html`
        <range-calendar
          min-year="${this.minYear}"
          max-year="${this.maxYear}"
          .theme="${this.theme}"
          .start-date="${this["start-date"]}"
          .visible-start-month="${this["visible-start-month"]}"
          .start-placeholder="${this.startPlaceholder}"
          .end-date="${this["end-date"]}"
          .visible-end-month="${this["visible-end-month"]}"
          .end-placeholder="${this.endPlaceholder}"
          .pattern="${this.pattern}"
          .pattern-matcher="${this.patternMatcher}"
          .pattern-regex="${this.patternRegex}"
          ?inline-input="${this.inlineInput}"
          ?monday-first="${this.mondayFirst}"
          ?allow-partial="${this.allowPartial}"
          @select-date="${this.updateSelected}"
        ></range-calendar>
      `;
    }
    return html`
      <single-calendar
        min-year="${this.minYear}"
        max-year="${this.maxYear}"
        .placeholder="${this.placeholder}"
        .theme="${this.theme}"
        .visible="${this.visible}"
        .selected="${this.selected}"
        .pattern="${this.pattern}"
        .pattern-matcher="${this.patternMatcher}"
        .pattern-regex="${this.patternRegex}"
        ?inline-input="${this.inlineInput}"
        ?monday-first="${this.mondayFirst}"
        ?allow-partial="${this.allowPartial}"
        @select-date="${this.updateSelected}"
      ></single-calendar>
    `;
  }

  updateSelected = (event) => {
    const { name } = this;
    const {
      detail: { selected, visible },
    } = event;

    this.visible = visible;

    this.dispatchEvent(
      new CustomEvent("select-date", { detail: { name, selected } })
    );
  };
}

customElements.define("mv-calendar", MvCalendar);
