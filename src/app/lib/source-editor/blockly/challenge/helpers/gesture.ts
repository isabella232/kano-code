import { IStepHelper } from '../../../../challenge/helper.js';
import { IStepData } from '../../../../creator/creator.js';
import { KanoCodeChallenge } from '../kano-code.js';
import { IDisposable } from '@kano/common/index.js';

export class GestureHelper implements IStepHelper {
    swipeListener? : IDisposable;
    enter(challenge : KanoCodeChallenge, step : IStepData): void {
        const eventsMod = challenge.editor.output.runner.getModule('events');
        this.swipeListener = eventsMod._onDidSwipe.event((type : String) => {
            challenge.triggerEvent('sw-gesture', { gesture: type });
        });
    }
    leave(challenge : KanoCodeChallenge, step : IStepData) : void {
        if (this.swipeListener) this.swipeListener.dispose();
    }
    test(challenge : KanoCodeChallenge, step : IStepData) {
        return step.validation && step.validation['sw-gesture'];
    }
}