/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import DialogProvider from '../editor/dialogs/dialog-provider.js';
import { html, render } from 'lit-html/lit-html.js';
import { IRemix } from './remix.js';
import { close } from '@kano/icons/ui.js';
import { templateContent } from '../directives/template-content.js';
import { _ } from '../../lib/i18n/index.js';

export class RemixDialogProvider extends DialogProvider {
    private data : IRemix;
    constructor(data : IRemix) {
        super();
        this.data = data;
    }
    createDom(): HTMLElement {
        const domNode = document.createElement('div');
        domNode.style.background = 'white';
        domNode.style.borderRadius = '6px';
        domNode.style.maxWidth = '650px';
        domNode.style.padding = '16px 8px 8px 8px';
        render(this.render(), domNode);
        return domNode;
    }
    render() {
        return html`
            <style>
                .samples-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .samples-title, .sample-span {
                    font-weight: bold;
                    font-family: var(--font-body);
                    font-size: 16px;
                }
                .samples-title {
                    margin-top: 0;
                    margin-left: 8px;
                    color: var(--color-grey);
                }
                .samples-close {
                    background: transparent;
                    border: none;
                }
                .samples-close:focus {
                    outline: none;
                }
                .samples-close > svg {
                    width: 10px;
                    height: 10px;
                    background: var(--color-grey);
                    fill: white;
                    border-radius: 6px;
                    padding: 5px;
                }
                .samples-close:hover > svg {
                    background: var(--color-abbey);
                }
                .samples-container {
                    display: flex;
                }
                .sample {
                    width: 50%;
                    margin: 0 8px 16px 8px;
                }
                .sample-img {
                    width: 100%;
                    margin-bottom: 8px;
                }
                
            </style>
            <div class="samples-top">
                <p class="samples-title">${_('REMIXES_EXAMPLE_TITLE', 'Remix examples')}</p>
                <button dialog-dismiss class="samples-close">${templateContent(close)}</button>
            </div>
            <div class="samples-container">
                ${this.data.samples
                    ? this.data.samples.map(sample => html`
                        <div class="sample">
                            <img src=${sample.img} class="sample-img"/>
                            <span class="sample-span">${sample.description}</span>
                        </div>
                    `)
                    : html``}
            </div>
        `;
    }
    dispose() { }
}
