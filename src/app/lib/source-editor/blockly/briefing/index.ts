/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { Briefing } from '../../../briefing/briefing.js';
import { registerBriefing } from '../../../briefing/index.js';
import { BriefingFloatingMenu } from './widget/floating-menu.js';
import { Confirm } from '../../../editor/dialogs/confirm.js';
import { button } from '@kano/styles/button.js';
import { _ } from '../../../i18n/index.js';
import { EventEmitter } from '@kano/common/index.js';
export class BlocklyBriefing extends Briefing {
    resetConfirm? : Confirm;
    menu? : BriefingFloatingMenu;

    private _onDidRequestNextChallenge : EventEmitter = new EventEmitter();
    get onDidRequestNextChallenge() { return this._onDidRequestNextChallenge.event; }

    getResetConfirm() {
        if (!this.resetConfirm) {
            this.resetConfirm = this.editor.dialogs.registerConfirm({
                buttonLabel: _('DIALOG_RESET_BRIEFING_LABEL', 'Confirm'),
                heading: _('DIALOG_RESET_BRIEFING_HEADING', 'Are you sure you want to reset your briefing?'),
                text: _('DIALOG_RESET_BRIEFING_TEXT', 'You will lose all your changes'),
            });
            this.resetConfirm.onDidConfirm(() => this.reset());
        }
        return this.resetConfirm;
    }
    reset() {
        this.editor.reset();
    }
    start() {
        super.start();
        this.editor.domNode.shadowRoot!.appendChild(button.content.cloneNode(true));

        if (!this.data) {
            return;
        }

        this.menu = new BriefingFloatingMenu(
            this.data.instruction || '', 
            this.data.nextChallengeButton ? this.data.nextChallengeButton : false
        );
        this.menu.setTitle(this.data.title || _('BRIEFING', 'Brief'));
        if (this.data.icon) {
            const domNode = this.data.icon.getDomNode();
            this.menu.setIconNode(domNode);
        }
        this.menu.onDidRequestReset(() => {
            const dialog = this.getResetConfirm();
            dialog.open();
        });
        this.menu.onDidRequestNextChallenge(() => this._onDidRequestNextChallenge.fire())
        this.menu.onDidEnd(() => this._onDidEnd.fire());
        this.editor.addContentWidget(this.menu);
    }
    dispose() {
        super.dispose();
        if (this.menu) {
            this.editor.removeContentWidget(this.menu);
            this.menu.dispose();
        }
    }
}

registerBriefing('blockly', BlocklyBriefing);
