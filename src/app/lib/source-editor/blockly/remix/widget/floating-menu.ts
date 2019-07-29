import '@kano/styles/typography.js';
import { customElement, html, property, css, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map';
import { IRemixSuggestion } from '../../../../remix/remix.js';
import { EventEmitter, subscribeDOM } from '@kano/common/index.js';
import { BriefingFloatingMenu } from '../../briefing/widget/floating-menu.js';
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
                font-size: 18px;
                font-family: inherit;
                font-weight: bold;
                text-align: left;
                color: inherit;
                border: 1px solid var(--color-grey);
                border-radius: 6px;
                padding: 8px;
                margin-bottom: 4px;
            }
            button:focus,
            button:hover,
            button.selected {
                background: var(--color-stone);
                outline: none;
            }
        `]
    }

    renderSuggestions() {
        return this.suggestions.map((s, index) => html`
            <button @click=${() => this._onClick(index)} class=${classMap({ selected: this.selectedSuggestionIndex === index })}>${s}</button>
        `);
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

    protected _onDidSelectSuggestion : EventEmitter<IRemixSuggestion> = new EventEmitter();
    get onDidSelectSuggestion() { return this._onDidSelectSuggestion.event; }

    protected _onDidRequestExamples : EventEmitter = new EventEmitter();
    get onDidRequestExamples() { return this._onDidRequestExamples.event; }

    constructor(title: string, suggestions : IRemixSuggestion[]) {
        super(title);
        this.suggestions = suggestions;
        const examplesBtn = this.addButton(_('EXAMPLES_BUTTON', 'Examples'));
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

            this._onDidSelectSuggestion.fire(suggestion);
        });
        domNode.appendChild(suggestionsElement);
    }

    deselectSuggestion() {
        // if (this.menuNode) {
        //     this.menuNode.selectedSuggestionIndex = -1;
        // }
    }
}