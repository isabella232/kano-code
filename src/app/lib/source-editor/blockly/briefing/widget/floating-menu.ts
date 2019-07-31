import '@kano/styles/typography.js';
import { EventEmitter, IDisposable } from '@kano/common/index.js';
import { BannerWidget } from '../../../../challenge/widget/banner.js';
import { _ } from '../../../../i18n/index.js';

export class BriefingFloatingMenu extends BannerWidget {
    protected subscriptions : IDisposable[] = [];

    protected _onDidRequestReset : EventEmitter = new EventEmitter();
    get onDidRequestReset() { return this._onDidRequestReset.event; }

    protected _onDidEnd : EventEmitter = new EventEmitter();
    get onDidEnd() { return this._onDidEnd.event; }

    private _onDidRequestNextChallenge : EventEmitter = new EventEmitter();
    get onDidRequestNextChallenge() { return this._onDidRequestNextChallenge.event; }

    constructor(text: string, nextChallenge : string | Boolean) {
        super();
        this.setTitle(_('BRIEFING', 'Briefing'));
        this.setText(text);

        const resetBtn = this.addButton(_('RESET_BUTTON', 'Reset'));
        resetBtn.onDidClick(() => {this._onDidRequestReset.fire()});
        
        if (nextChallenge) {
            const nextChallengeButton = this.addButton(typeof nextChallenge === 'string' ? nextChallenge : _('NEXT_CHALLENGE_BUTTON', 'Next Challenge'));
            nextChallengeButton.onDidClick(() => {
                this._onDidRequestNextChallenge.fire()
            });
        } else {
            const endBtn = this.addButton(_('FINISH_BUTTON', 'Finish'));
            endBtn.onDidClick(() => {this._onDidEnd.fire()});
        }
    }
    dispose() {
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
    }
}
