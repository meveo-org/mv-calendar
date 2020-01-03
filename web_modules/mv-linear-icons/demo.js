import { LitElement, html, css } from "lit-element";
import "./mv-linear-icons.js";
import { ICONS } from "./mv-linear-icons.js";

export class MvLinearIconDemo extends LitElement {
  static get properties() {
    return {
      value: { type: String, attribute: true }
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: var(--font-family, Arial);
        font-size: var(--font-size-m, 10pt);
      }
      
      .glyph {
        font-size: 16px;
        width: 15em;
        padding: 0.5em 0;
        margin: 0 2em;
        float: left;
        overflow: hidden;
      }
      .mls {
        margin-left: .25em;
      }
      .clearfix:before,
      .clearfix:after {
        content: " ";
        display: table;
      }
      .clearfix:after {
        clear: both;
      }
      .fs1 {
        font-size: 20px;
      }

      /* sample for overriding style */
      mv-lnr {
        font-size: 24px;
        color: #2196F3;
      }
    `;
  }

  render() {
    return html`
      <div class="clearfix">
      ${ICONS.map(
        icon => html`
        <div class="glyph fs1">
          <div class="clearfix">
            <mv-lnr icon="${icon}"></mv-lnr>
            <span class="mls"> ${icon}</span>
          </div>
        </div>
        `
      )}
      </div>    
    `;
  }
}

customElements.define("mv-linear-icons-demo", MvLinearIconDemo);
