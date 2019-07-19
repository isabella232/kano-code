import { IStepHelper } from '../../../../challenge/helper.js';
import { IStepData } from '../../../../creator/creator.js';
import { KanoCodeChallenge } from '../kano-code.js';
import { IDisposable } from '@kano/common/index.js';

export class GestureHelper implements IStepHelper {
    swipeListener? : IDisposable;
    enter(challenge : KanoCodeChallenge, step : IStepData): void {
        const eventsMod = challenge.editor.output.runner.getModule('events');
        this.swipeListener = eventsMod._onDidSwipe.event((type : String) => {
            if (type == step.validation.gesture) {
                // success.
                challenge.nextStep();
            }
        });
    }
    leave(challenge : KanoCodeChallenge, step : IStepData) : void {
        if (this.swipeListener) this.swipeListener.dispose();
    }
    test(challenge : KanoCodeChallenge, step : IStepData) {
        return step.validation && step.validation.gesture;
    }
}