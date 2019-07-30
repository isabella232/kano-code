import { RemixFloatingMenu } from './widget/floating-menu.js';
import { registerRemix, IRemix, Remix } from '../../../remix/index.js';
import { Confirm } from '../../../editor/dialogs/confirm.js';
import { button } from '@kano/styles/button.js';
import { _ } from '../../../i18n/index.js';

export class BlocklyRemix extends Remix {
    resetConfirm? : Confirm;
    menu? : RemixFloatingMenu;
    data? : IRemix;
    getResetConfirm() {
        if (!this.resetConfirm) {
            this.resetConfirm = this.editor.dialogs.registerConfirm({
                buttonLabel: _('DIALOG_RESET_REMIX_LABEL', 'Confirm'),
                heading: _('DIALOG_RESET_REMIX_HEADING', 'Are you sure you want to reset your remix?'),
                text: _('DIALOG_RESET_REMIX_TEXT', 'You will lose all your changes'),
            });
            this.resetConfirm.onDidConfirm(() => this.reset());
        }
        return this.resetConfirm;
    }
    reset() {
        if (!this.data) {
            return;
        }
        this.editor.load(this.data.app);
    }
    start() {
        super.start();
        this.editor.domNode.shadowRoot!.appendChild(button.content.cloneNode(true));

        if (!this.data) {
            return;
        }
        this.menu = new RemixFloatingMenu(this.data.title, this.data.suggestions);
        this.menu.addEntry();
        this.menu.onDidSelectSuggestion((s) => this.selectSuggestion(s));
        this.menu.onDidRequestReset(() => {
            const dialog = this.getResetConfirm();
            dialog.open();
        });
        this.menu.onDidRequestExamples(() => {
            if (!this.dialog) {
                return;
            }
            this.dialog.open();
        });
        this.menu.onDidEnd(() => this._onDidEnd.fire());
        this.editor.addContentWidget(this.menu);
    }
    deselectSuggestion() {
        super.deselectSuggestion();
        if (this.menu) {
            this.menu.deselectSuggestion();
        }
    }
    dispose() {
        super.dispose();
        if (this.resetConfirm) {
            this.resetConfirm.dispose();
        }
    }
}

registerRemix('blockly', BlocklyRemix);
