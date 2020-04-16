/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import { close } from '@kano/icons/ui.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../ui/kano-ui-viewport/kano-ui-viewport.js';
import { button } from '@kano/styles/button.js';

class KcWorkspaceFrame extends PolymerElement {
    static get template() {
        return html`
        ${button}
        <style>
            :host {
                display: flex;
                flex-direction: column;
                height: 100%;
            }
            :host .content-wrapper {
                width: 100%;
                padding-bottom: 75%;
                position: relative;
                margin-top: 14px;
            }
            :host(.fullscreen) #content {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                margin: 0;
            }
            :host #content {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                transition: background linear 150ms;
                z-index: 300;
            }
            :host.running #content {
                --kano-ui-viewport: {
                    border: none;
                };
            }

            .pause-overlay {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            #workspace-placeholder {
                height: 100%;
            }

            .controls {
                display: flex;
                flex-direction: column;
                flex: 1 1 auto;
                box-sizing: border-box;
                margin: 12px 0;
            }

            :host(:not(.fullscreen)) .fullscreen-backdrop {
                display: none;
            }
            .fullscreen-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--kano-app-editor-workspace-background, #f2f2f2);
                z-index: 300;
            }

            :host(:not(.fullscreen)) button#fullscreen-close {
                display: none;
            }
            button#fullscreen-close {
                align-self: flex-end;
                background: #5e6367;
                color: rgba(255, 255, 255, 0.75);
                border-radius: 3px;
                position: fixed;
                top: 16px;
                right: 16px;
                padding: 0px;
                z-index: 301;
                transition: all linear 250ms;
            }
            button#fullscreen-close:hover {
                background: #95979a;
            }
            paper-dialog {
                background: transparent;
            }
            button .icon {
                fill: #8F9195;
                width: 8px;
                height: 8px;
            }
            button#fullscreen-close {
                display: flex;
                align-items: center;
                justify-content: center;
                fill: rgba(255, 255, 255, 0.75);
            }
            button#fullscreen-close .icon {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                line-height: 8px;
            }
            button#fullscreen-close:hover .icon {
                fill: rgba(255, 255, 255, 1);
            }
            button#fullscreen-close {
                width: 30px;
                height: 30px;
                border-radius: 15px;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <div class="fullscreen-backdrop"></div>
        <div class="content-wrapper">
            <kano-ui-viewport id="content" mode="scaled" centered view-width="[[width]]" view-height="[[height]]">
                <div id="workspace-placeholder">
                    <slot name="workspace"></slot>
                </div>
            </kano-ui-viewport>
        </div>
        <div class="controls">
            <slot name="controls"></slot>
        </div>
        <button id="fullscreen-close" class="btn" on-tap="_closeFullscreen">
            <div class="icon">${close}</div>
        </button>
        <iron-a11y-keys keys="meta+enter" on-keys-pressed="_goFullscreen" target="[[target]]"></iron-a11y-keys>
        <iron-a11y-keys keys="esc" on-keys-pressed="_cancelFullscreen" target="[[target]]"></iron-a11y-keys>
`;
    }
    static get properties() {
        return {
            running: {
                type: Boolean,
                value: false,
                notify: true,
            },
            width: {
                type: Number,
            },
            height: {
                type: Number,
            },
            fullscreen: {
                type: Boolean,
                value: false,
                observer: '_fullscreenChanged',
            },
        };
    }
    constructor() {
        super();
        this._onResize = this._onResize.bind(this);
    }
    connectedCallback() {
        super.connectedCallback();
        this.target = document.body;
        window.addEventListener('resize', this._onResize);
        this._setViewportHeight();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('resize', this._onResize);
    }
    _onResize() {
        this._setViewportHeight();
    }
    addMenuOption(label, icon, callback) {
        return this.$.toolbar.addMenuItem(label, icon, callback);
    }
    _setViewportHeight() {
        this.$.content.resizeView();
    }
    _goFullscreen() {
        if (!this.fullscreen) {
            this._toggleFullscreen();
        }
    }
    _cancelFullscreen() {
        if (this.fullscreen) {
            this._toggleFullscreen();
        }
    }
    _closeFullscreen() {
        this.dispatchEvent(new CustomEvent('close-fullscreen'));
    }
    _fullscreenChanged() {
        this.classList.toggle('fullscreen', this.fullscreen);
        this._setViewportHeight();
        window.dispatchEvent(new Event('resize'));
    }
    getViewportScale() {
        return this.$.content.getScale();
    }
}

customElements.define('kc-workspace-frame', KcWorkspaceFrame);
