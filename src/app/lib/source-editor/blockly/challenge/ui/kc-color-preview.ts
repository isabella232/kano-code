/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { LitElement, customElement, property, html, css } from 'lit-element/lit-element.js';
import { styleMap } from 'lit-html/directives/style-map.js';

@customElement('kc-color-preview')
export class KcColorPreview extends LitElement {

    @property({ type: String })
    public color : string|null = null;

    static get styles() {
        return css`
            :host {
                display: inline-block;
                vertical-align: middle;
            }
            div {
                border-radius: 3px;
                border: 1px solid black;
                width: 18px;
                height: 18px;
            }
        `;
    }

    render() {
        return html`<div style=${styleMap({ background: this.color || '' })}></div>`;
    }
}
