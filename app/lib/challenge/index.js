import EventEmitter from '../util/event-emitter.js';
import KanoCodeChallenge from './kano-code.js';
import Store from '../store.js';
import ChallengeActions from '../actions/challenge.js';

/* eslint no-underscore-dangle: "off" */
class Challenge extends EventEmitter {
    constructor(editor) {
        super();
        this.rootEl = document.createElement('kano-app-challenge');
        this.rootEl.addEventListener('next-step', this._nextStep.bind(this));
        this.rootEl.challengeClass = this;
        this.store = Store.create({
            banner: null,
            history: {
                backBuffer: [],
                forwardBuffer: [],
                ignoreNextStepChange: false,
            },
            hints: {
                enabled: true,
            },
            idle: false,
        });

        this.challengeActions = ChallengeActions(this.store);

        this._onDone = this._onDone.bind(this);
        this._onStepChanged = this._onStepChanged.bind(this);
        this._historyBack = this._historyBack.bind(this);
        this._historyForward = this._historyForward.bind(this);
        this._displayBanner = this._displayBanner.bind(this);
        this._hideBanner = this._hideBanner.bind(this);
        this._displayBeacon = this._displayBeacon.bind(this);
        this._hideBeacon = this._hideBeacon.bind(this);
        this._displayTooltips = this._displayTooltips.bind(this);
        this._hideTooltips = this._hideTooltips.bind(this);

        this._onFlyoutStateChanged = this.rootEl._onFlyoutStateChanged.bind(this.rootEl);

        this.rootEl.storeId = this.store.id;
        this.setEditor(editor);
    }
    localize(...args) {
        return this.rootEl.localize(...args);
    }
    setEditor(editor) {
        this.editor = editor;
        this.editor.rootEl.setAttribute('slot', 'editor');
        this.editor.inject(this.rootEl);
    }
    initializeChallenge() {
        const blocklyWorkspace = this.editor.getBlocklyWorkspace();
        this.engine = new KanoCodeChallenge(blocklyWorkspace);
        this.engine.addEventListener('done', this._onDone);
        this.engine.addEventListener('step-changed', this._onStepChanged);
        this.engine.addEventListener('history-back', this._historyBack);
        this.engine.addEventListener('history-forward', this._historyForward);
        this.editor.on('change', this._editorChanged.bind(this));
        // this.$.ui.editor = this.editor;
        blocklyWorkspace.addChangeListener(this._onFlyoutStateChanged);
        this.rootEl._fitBanner();

        this.engine.defineBehavior('banner', this._displayBanner, this._hideBanner);
        this.engine.defineBehavior('beacon', this._displayBeacon, this._hideBeacon);
        this.engine.defineBehavior('tooltips', this.rootEl._displayTooltips, this.rootEl._hideTooltips);

        this.engine.definePropertyProcessor([
            'beacon.target.flyout_block',
            'beacon.target.block',
            'tooltips.*.location.block',
            'tooltips.*.location.flyout_block',
        ], this.engine._processBlock.bind(this.engine));
        this.engine.definePropertyProcessor([
            'banner.head',
            'banner.text',
        ], this.rootEl._processMarkdown.bind(this));

        const state = this.store.getState();

        if (state.scene.steps) {
            this.engine.setSteps(state.scene.steps);
            this.engine.start();
            this.challengeActions.updateSteps(this.engine.steps);
        }
    }
    _nextStep() {
        if (!this.engine) {
            return;
        }
        const isLastStep = this.isLastStep();
        const { hints } = this.store.getState();
        if (isLastStep) {
            // TODO next-story
            this.dispatchEvent(new CustomEvent('request-next-story'));
        } else if (hints.enabled) {
            this.engine.nextStep();
        } else {
            this.challengeActions.enableHints();
        }
    }
    _editorChanged(e) {
        if (!this.engine) {
            return;
        }
        this.engine.triggerEvent(e.type, e);
    }
    _onStepChanged() {
        this.challengeActions.updateStepIndex(this.engine.stepIndex);
        const { history } = this.store.getState();
        if (history.ignoreNextStepChange) {
            // this.set('history.ignoreNextStepChange', false);
        } else if (this._shouldSaveStep()) {
            const { stepIndex } = this.engine;
            this.challengeActions.addHistoryRecord(stepIndex, Object.assign(this.editor.save()));
        }
        this.challengeActions.updateHistoryOptions(this.canGoBack(), this.canGoForward());
    }
    _onDone() {
        this.challengeActions.completeChallenge();
        this.trigger('completed');
    }
    _shouldSaveStep() {
        const { step } = this.engine;
        if (step.validation) {
            if (step.validation.blockly) {
                const { blockly } = step.validation;
                if (blockly['open-flyout'] || blockly.value) {
                    return true;
                }
            }
            if (step.validation['open-parts']) {
                return true;
            }
        }
        if (step.banner && step.banner['open-parts']) {
            return true;
        }

        return this.engine.stepIndex === this.engine.steps.length - 1;
    }
    _historyBack() {
        if (!this.canGoBack()) {
            return;
        }
        this.challengeActions.historyBack();
    }
    _historyForward() {
        if (!this.canGoForward()) {
            return;
        }
        this.challengeActions.historyForward();
    }
    canGoBack() {
        const { history } = this.store.getState();
        return history.backBuffer && history.backBuffer.length > 1;
    }
    canGoForward() {
        const { history } = this.store.getState();
        return history.forwardBuffer && history.forwardBuffer.length > 0;
    }
    _displayBanner(data) {
        clearTimeout(this.showButtonTimeout);
        let banner;
        const { hints } = this.store.getState();
        if (hints.enabled) {
            banner = Object.assign({}, data);
            banner.buttonLabel = data.buttonLabel || this.localize('NEXT', 'Next');
        } else {
            banner = {};
            const bannerProps = hints['disabled-banner'];
            if (bannerProps) {
                banner.head = bannerProps.head;
                banner.text = this.localize('HINTS', 'Hints');
                banner.buttonLabel = bannerProps.text;
                // Show hint button with delay
                banner.buttonState = 'hidden';
                this.showButtonTimeout = setTimeout(() => {
                    banner.buttonState = 'active';
                    this.challengeActions.updateBannerState(banner);
                }, 6000);
            }
        }
        const isLastStep = this.isLastStep();
        banner.showSaveButton = isLastStep;

        if (isLastStep) {
            banner.icon = null;
            banner.imgPage = 'star';
            const challenge = this.store.getState();
            banner.buttonLabel = challenge.next ? this.localize('NEXT_CHALLENGE', 'Next Challenge') : this.localize('BACK_TO_CHALLENGES', 'Back to Challenges');
        }
        this.challengeActions.updateBannerState(Object.assign({}, banner));
        if (data.lockdown) {
            this.challengeActions.enableLockdown();
        } else {
            this.challengeActions.disableLockdown();
        }
        // No animation or sound if the challenge has finished
        if (isLastStep) {
            return;
        }
        this.rootEl.animateBannerIn();
    }
    _hideBanner() {
        this.challengeActions.updateBannerState({});
        this.challengeActions.disableLockdown();
    }
    _displayBeacon(beacon) {
        this.challengeActions.updateBeacon(beacon);
    }
    _hideBeacon() {
        this.challengeActions.updateBeacon(null);
    }
    _displayTooltips(tooltips) {
        this.challengeActions.updateTooltips(tooltips);
    }
    _hideTooltips() {
        this.challengeActions.updateTooltips(null);
    }
    isLastStep() {
        return this.engine.stepIndex === this.engine.steps.length - 1;
    }
    load(challenge, mode, categories) {
        this.originalMode = mode;
        // Filter Mode to get the challenge view of its features
        const challengeMode = Challenge.getChallengeMode(challenge, mode);
        this.editor.setMode(challengeMode);
        // Filter Catergories to get the categories view of their features
        const challengeCategories = Challenge.getChallengeCategories(challenge, categories);
        this.editor.setToolbox(challengeCategories);
        this.setSceneVariables(Challenge.getSceneVariables(challengeCategories));
        // Filter Parts to get the categories view of their features
        const challengeParts = Challenge.getChallengeParts(challenge);
        this.editor.setParts(challengeParts);
        this.editor.loadVariables(challenge.scene.variables);
        if (challenge.scene.defaultApp) {
            this.editor.load(JSON.parse(this.scene.defaultApp));
        }
        this.challengeActions.load(challenge);
    }
    static getSceneVariables(categories) {
        const sceneVariables = {};
        Object.keys(categories).forEach((key) => {
            sceneVariables[`${key}_color`] = categories[key].colour;
        });
        return sceneVariables;
    }
    static getChallengeMode(challenge, mode) {
        // In case we filter blocks in the categories of the mode
        if (challenge.scene.filterBlocks) {
            const whitelist = challenge.scene.filterBlocks[mode.id];
            if (whitelist) {
                const newMode = Object.assign({}, mode);
                newMode.categories = newMode.categories.map((category, index) => {
                    const newCategory = Object.assign({}, category);
                    // Filter the blocks of this category to the one whitelisted
                    newCategory.blocks = newCategory.blocks.filter((block) => {
                        const definition = block.block(newMode);
                        return whitelist.indexOf(definition.id) !== -1;
                    });
                    return newCategory;
                });
                return newMode;
            }
        }
        return mode;
    }
    static getChallengeCategories(challenge, categories) {
        const cats = {};
        let cat;
        cats.events = Object.assign({}, Kano.MakeApps.Blockly.categories.events);
        Object.keys(Kano.MakeApps.Blockly.categories)
            .filter(key => challenge.scene.modules.indexOf(key) >= 0)
            .forEach((id) => {
                // Clone the object, because we might change its blocks
                cats[id] = Object.assign({}, Kano.MakeApps.Blockly.categories[id]);
            });

        // Do not filter blocks if the list is not defined
        if (challenge.scene.filterBlocks) {
            // Remove the excluded blocks from the categories
            Object.keys(challenge.scene.filterBlocks).forEach((catId) => {
                cat = cats[catId];
                if (!cat) {
                    return;
                }
                cat.blocks = cat.blocks
                    .filter(block => challenge.scene.filterBlocks[catId].indexOf(block.id) !== -1);
            });
        }
        return cats;
    }
    static getChallengeParts(challenge) {
        return Kano.MakeApps.Parts.list
            .filter(part => challenge.scene.parts.indexOf(part.type) !== -1);
    }
    setSceneVariables(variables) {
        this.challengeActions.loadVariables(variables);
    }
    inject(element = document.body, before = null) {
        element.appendChild(this.store.providerElement);
        if (before) {
            element.insertBefore(this.rootEl, before);
            return;
        }
        element.appendChild(this.rootEl);
    }
}

export default KanoCodeChallenge;

export { KanoCodeChallenge, Store, Challenge };
