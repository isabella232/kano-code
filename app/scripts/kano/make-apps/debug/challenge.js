import { EventEmitter } from '../../event-emitter.js';

class ChallengeDebugger extends EventEmitter {
    constructor () {
        super();
    }

    loadChallenge (challenge) {
        this.challenge = challenge;
        this.scene = this.challenge.data;
        this.step = 0;
    }

    updateStep (path, value) {
        this.emit('update-step', { path, value });
    }

    setError (error) {
        this.emit('error', error);
    }

    updateChallengeContext (ctx) {
        this.context = ctx;
    }

    set connected (value) {
        if (!this._connected && value && this.scene) {
            this.emit('step-changed', this.currentStep);
            this.emit('challenge-context-changed', this.context);
        }
        this._connected = value;
        this.emit(value ? 'connected' : 'disconnect');
    }

    highlightBlock (id) {
        this.emit('highlight-block', id);
    }

    blurBlock () {
        this.emit('blur-block');
    }

    highlightElement (id) {
        this.emit('highlight-element', id);
    }

    blurElement () {
        this.emit('blur-element');
    }

    saveChallenge () {
        this.emit('save-challenge');
    }

    get currentStep () {
        return this.scene.steps[this._step];
    }

    set step (value) {
        this._step = value;
        this.emit('step-changed', this.currentStep);
    }

    set context (value) {
        this._context = value;
        this.emit('challenge-context-changed', value);
    }

    get context () {
        return this._context;
    }
}

export const Challenge = new ChallengeDebugger();
