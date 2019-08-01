import { RemixFloatingMenu } from './widget/floating-menu.js';
import { registerRemix, IRemix, Remix } from '../../../remix/index.js';
import { Confirm } from '../../../editor/dialogs/confirm.js';
import { button } from '@kano/styles/button.js';
import { EventEmitter } from '@kano/common/index.js';
import { _ } from '../../../i18n/index.js';

export class BlocklyRemix extends Remix {
    resetConfirm? : Confirm;
    menu? : RemixFloatingMenu;
    data? : IRemix;

    private _onDidRequestNextChallenge : EventEmitter = new EventEmitter();
    get onDidRequestNextChallenge() { return this._onDidRequestNextChallenge.event; }

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
        this.menu = new RemixFloatingMenu(
            this.data.title,
            this.data.suggestions,
            this.data.nextChallengeButton ? this.data.nextChallengeButton : false
        );
        this.menu.addEntry();
        if (this.data.icon) {
            const domNode = this.data.icon.getDomNode();
            this.menu.setIconNode(domNode);
        }

        this.menu.onDidSelectSuggestion((s) => this.selectSuggestion(s));
        this.menu.onDidDeselectSuggestion(() => super.deselectSuggestion());
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
        this.menu.onDidRequestNextChallenge(() => this._onDidRequestNextChallenge.fire())
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
