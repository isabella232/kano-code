/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import '@kano/styles/typography.js';
import { customElement, html, property, css, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map';
import { IRemixSuggestion } from '../../../../remix/remix.js';
import { EventEmitter, subscribeDOM } from '@kano/common/index.js';
import { BriefingFloatingMenu } from '../../briefing/widget/floating-menu.js';
import { circle } from '@kano/icons/ui.js';
import { _ } from '../../../../i18n/index.js';

@customElement('kc-remix-suggestions')
export class KCRemixSuggestions extends LitElement {

    @property({ type: Array })
    suggestions : string[] = [];

    @property({ type: Number })
    selectedSuggestionIndex : number = -1;

    static get styles() {
        return [css`
            button {
                background: transparent;
                border: none;
                cursor: pointer;
                font-size: 16px;
                font-family: inherit;
                font-weight: bold;
                text-align: left;
                color: inherit;
                border-bottom: 1px solid var(--color-porcelain);
                padding: 8px;
                width: 100%;
            }
            button:focus {
                outline: none;
            }
            button:hover, 
            button.selected {
                background: var(--button-action-background);
            }
            button:first-child {
                /* margin-top: 8px; */
                border-top: 1px solid var(--color-porcelain);
            }

            .suggestion-circle {
                width: 12px;
                fill: var(--color-stone);
                margin-right: 4px;
            }

            .selected .suggestion-circle {
                fill: var(--color-candlelight);
                stroke: var(--color-pumpkin);
            }
        `]
    }

    renderSuggestions() {
        return this.suggestions.map((s, index) => {
            const instance = circle.content.cloneNode(true);
            return html`
            <button @click=${() => this._onClick(index)} class=${classMap({ selected: this.selectedSuggestionIndex === index })}>
                <svg class="suggestion-circle" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    ${instance}
                </svg>
                ${s}
            </button>
            `
            });
    }
    
    render() {
        return html`${this.renderSuggestions()}`;
    }
    
    _onClick(index : number) {
        this.dispatchEvent(new CustomEvent('suggestion-clicked', { detail: index }));
    }
}

export class RemixFloatingMenu extends BriefingFloatingMenu {
    protected suggestions : IRemixSuggestion[];
    protected menuNode: KCRemixSuggestions | undefined;
    
    protected _onDidSelectSuggestion : EventEmitter<IRemixSuggestion> = new EventEmitter();
    get onDidSelectSuggestion() { return this._onDidSelectSuggestion.event; }

    protected _onDidDeselectSuggestion : EventEmitter = new EventEmitter();
    get onDidDeselectSuggestion() { return this._onDidDeselectSuggestion.event; }

    protected _onDidRequestExamples : EventEmitter = new EventEmitter();
    get onDidRequestExamples() { return this._onDidRequestExamples.event; }

    constructor(title: string, suggestions : IRemixSuggestion[], nextChallenge: string | Boolean) {
        super(title, nextChallenge);
        this.suggestions = suggestions;
        const examplesBtn = this.addMenuButton(_('EXAMPLES_BUTTON', 'Examples'));
        examplesBtn.onDidClick(() => { 
            this._onDidRequestExamples.fire(); 
        });
    }

    addEntry() {
        const domNode = this.getBannerEl();
        const suggestionsElement = document.createElement('kc-remix-suggestions') as KCRemixSuggestions;
        suggestionsElement.slot = 'content';
        suggestionsElement.suggestions = this.suggestions.map(s => s.title);
        subscribeDOM(suggestionsElement, 'suggestion-clicked', (e : CustomEvent) => { 
            const suggestion = this.suggestions[e.detail];
            if (!suggestion) {
                return
            }

            if (suggestionsElement.selectedSuggestionIndex === e.detail) {
                this.deselectSuggestion();
            } else {
                this._onDidSelectSuggestion.fire(suggestion);
                suggestionsElement.selectedSuggestionIndex = e.detail;
            }

        });
        this.menuNode = suggestionsElement;
        domNode.appendChild(suggestionsElement);
    }

    deselectSuggestion() {
        if (this.menuNode) {
            this.menuNode.selectedSuggestionIndex = -1;
        }
        this._onDidDeselectSuggestion.fire();
    }
}