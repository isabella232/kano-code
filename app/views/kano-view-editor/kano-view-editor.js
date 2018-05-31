import '@kano/web-components/kano-alert/kano-alert.js';
import { Store } from '../../scripts/kano/make-apps/store.js';
import '../../scripts/kano/make-apps/actions/app.js';
import '../../scripts/kano/make-apps/utils.js';
import { Router } from '../../scripts/kano/util/router.js';
import '../../scripts/kano/make-apps/blockly/blockly.js';
import { SDK } from '../../scripts/kano/make-apps/sdk.js';
import { I18nBehavior } from '../../elements/behaviors/kano-i18n-behavior.js';
import '../../elements/kano-app-editor/kano-app-editor.js';
import '../../elements/kano-share-modal/kano-share-modal.js';
import '../../elements/kano-editor-topbar/kano-editor-topbar.js';
import { SharingBehavior } from '../../elements/behaviors/kano-sharing-behavior.js';
import '@kano/web-components/kano-reward-modal/kano-reward-modal.js';
import '../../elements/kc-file-upload-overlay/kc-file-upload-overlay.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Editor, UserPlugin, PartsPlugin, LocalStoragePlugin, Runner, Mode, FileUploadPlugin, I18n } from '../../lib/index.js';
import { ChallengeGeneratorPlugin } from '../../lib/challenge/index.js';
import { PartTypes, Parts } from '../../lib/parts/all.js';
import { AllModules } from '../../lib/app-modules/all.js';
import { AllApis } from '../../lib/meta-api/modules/all.js';

const behaviors = [
    SharingBehavior,
    I18nBehavior,
];

class KanoViewEditor extends Store.StateReceiver(
    mixinBehaviors(behaviors, PolymerElement)
) {
    static get is() { return 'kano-view-editor'; }
    static get template() {
        return html`
                <style>
                    :host {
                        display: block;
                        @apply(--layout-vertical);
                    }
                    :host kano-app-editor {
                        @apply(--layout-flex);
                    }
                    :host #error-dialog .title {
                        color: red;
                    }
                    :host #error-dialog .description {
                        text-align: center;
                    }
                    paper-dialog {
                        border-radius: 5px;
                        overflow: hidden;
                        background: transparent;
                    }
                    paper-dialog#share-modal kano-share-modal {
                        padding: 0px;
                        margin: 0px;
                    }
                    :host(.dragging) * {
                        pointer-events: none;
                    }
                </style>
                <kano-alert id="save-prompt"
                            heading="[[localize('DO_YOU_SAVE', 'Do you want to save your creation?')]]"
                            text="[[localize('ABOUT_TO_RESET', 'You\'ll lose any unsaved changes')]]"
                            entry-animation="from-big-animation"
                            with-backdrop>
                        <button class="kano-alert-primary" on-tap="_launchShare" dialog-confirm slot="actions">[[localize('SAVE_IT', 'Save it!')]]</button>
                        <button class="kano-alert-secondary" on-tap="_confirmExit" dialog-dismiss slot="actions">[[localize('NO_THANKS', 'No\, thanks')]]</button>
                        <button class="kano-alert-secondary" dialog-dismiss slot="actions">[[localize('CANCEL', 'Cancel')]]</button>
                </kano-alert>
                <kano-alert opened="[[remixLoadingAlertOpened]]"
                            heading="[[localize('LOADING_REMIX', 'Loading creation for remixing')]]"
                            text="[[localize('PLEASE_WAIT', 'Please wait...')]]"
                            modal>
                </kano-alert>
                <paper-dialog id="error-dialog" with-backdrop>
                    <h2 class="title">{{error.title}}</h2>
                    <p class="description">{{error.description}}</p>
                </paper-dialog>
                <paper-dialog id="share-modal" opened="{{shareOpened}}" modal>
                    <kano-share-modal id="share-modal-content"
                                    on-confirm="confirmShare"
                                    on-dismiss="dismissShare"
                                    opened="[[shareOpened]]"
                                    share-info="{{shareInfo}}"
                                    world-url="[[config.WORLD_URL]]"
                                    is-authenticated="[[user]]"></kano-share-modal>
                </paper-dialog>
                <kano-reward-modal id="reward-modal" on-second-action="_openSignup"></kano-reward-modal>
                <kc-file-upload-overlay id="file-upload-overlay"></kc-file-upload-overlay>
        `;
    }
    static get properties() {
        return {
            context: {
                type: Object,
                linkState: 'routing.context',
            },
            remixMode: {
                type: Boolean,
                value: false,
            },
            error: {
                type: Object,
                value: {
                    title: '',
                    description: '',
                },
                notify: true,
            },
            showSavePrompt: {
                type: Boolean,
                value: false,
                notify: true,
            },
            app: {
                type: Object,
                linkState: 'editor.app',
                observer: '_appChanged',
            },
            remixLoadingAlertOpened: {
                type: Boolean,
                linkState: 'editor.remixLoadingAlertOpened',
            }
        };
    }
    static get observers() {
        return [
            '_pauseApp(shareOpened)',
        ];
    }
    constructor() {
        super();
        const { config } = this.getState();
        this.editor = new Editor(config);

        const userPlugin = new UserPlugin();
        this.editor.addPlugin(userPlugin);

        this.partsPlugin = new PartsPlugin(PartTypes);
        this.partsPlugin.setParts(Parts);
        this.editor.addPlugin(this.partsPlugin);

        this.storagePlugin = new LocalStoragePlugin(this._getStorageKey.bind(this));
        this.editor.addPlugin(this.storagePlugin);

        this.editor.toolbox.setEntries(AllApis);

        this.runner = new Runner(AllModules);
        this.editor.addPlugin(this.runner);

        if (config.ENABLE_CHALLENGE_GENERATOR) {
            this.challengeGeneratorPlugin = new ChallengeGeneratorPlugin();
            this.editor.addPlugin(this.challengeGeneratorPlugin);
        }


        this._deactivateSavePrompt = this._deactivateSavePrompt.bind(this);
        this._deactivateSavePrompt = this._deactivateSavePrompt.bind(this);
    }
    connectedCallback() {
        super.connectedCallback();
        this.setupListeners();
        this.modal = this.$['share-modal'];

        this.fileUpload = new FileUploadPlugin(this, this.$['file-upload-overlay']);
        this.fileUpload.on('upload', this._onFileDropped.bind(this));
        this.editor.addPlugin(this.fileUpload);

        const slug = this.context.params.slug;
        let p;
        if (slug) {
            p = this.loadRemix(slug).then(share => {
                const app = share;
                return this.loadMode(share.mode)
                    .then((mode) => {
                        if (app.code && app.code.snapshot) {
                            app.source = app.code.snapshot.blocks;
                        }
                        this.editor.setMode(mode);
                        this.setupEditor();
                        this.editor.load(app);
                    });
            });
        } else {
            const modeId = this._getMode(this.context);
            p = this.loadMode(modeId)
                .then((mode) => {
                    this.editor.setMode(mode);
                    this.setupEditor();
                    this.storagePlugin.load();
                });
        }
        Promise.all([
            p,
            this.loadLanguages(),
        ]);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeListeners();
    }
    setupListeners() {
        this.addEventListener('share-successful', this._deactivateSavePrompt);
        this.addEventListener('share-attempted', this._deactivateSavePrompt);
    }
    removeListeners() {
        this.removeEventListener('share-successful', this._deactivateSavePrompt);
        this.removeEventListener('share-attempted', this._deactivateSavePrompt);
    }
    loadLanguages() {
        const lang = I18n.getLang();
        return Promise.all([
            I18n.load(`/locale/editor/${lang}.json`),
        ]);
    }
    loadRemix(slug) {
        this.dispatch({ type: 'LOAD_REMIX' });
        this.remixMode = true;
        this.storagePlugin.disable();
        const { config } = this.getState();
        const sdk = new SDK(config);
        //loading component for remixing, we need to get data from the slug
        return sdk.getShareBySlug(slug)
            .then(res => {
                //getting the workspace info from the share
                if (res.item.workspace_info_url) {
                    return fetch(res.item.workspace_info_url);
                }
                throw new Error('Missing workspace information in share');
            })
            .then(r => r.json())
            .then((share) => {
                this.dispatch({ type: 'REMIX_LOADED' });
                return share;               
            })
            .catch(err => {
                console.error('loading failed', err);
                this.set('error.title', 'Loading failed');
                this.set('error.description', 'Couldn\'t load share');
                this.$['error-dialog'].open();
            });
    }
    loadMode(id) {
        const url = `/mode/${id}.js`;
        return Mode.load(id, url);
    }
    setupEditor() {
        this.editor.inject(this.root, this.root.firstChild);
        const { config } = this.getState();
        this.editor.on('share', shareInfo => this.share({ detail: shareInfo }));
        this.editor.on('exit', () => this._exit());

        this.editor.setRunningState(true);
    }
    _appChanged() {
        if (!this.app) {
            return;
        }
        this.editor.load(this.app);
    }
    _pauseApp(modalOpen) {
        if (!this.editor) {
            return;
        }
        if (modalOpen) {
            this._wasRunning = this.editor.getRunningState();
            this.editor.setRunningState(false);
        } else {
            this.editor.setRunningState(this._wasRunning);
            this._wasRunning = undefined;
        }
    }
    _onFileDropped(contents) {
        let app;
        try {
            app = JSON.parse(contents);
        } catch (e) {
            app = null;
        }
        this.dispatch({ type: 'LOAD_EDITOR_APP', data: app });
    }
    _getMode(context) {
        var modeFromQs = Router.parseQsParam(this.context.querystring, 'mode');
        return modeFromQs ? modeFromQs : 'normal';
    }
    _getStorageKey() {
        const { id } = this.editor.getMode();
        return `savedApp-${id}`;
    }
    _activateSavePrompt() {
        this.showSavePrompt = true;
    }
    _deactivateSavePrompt() {
        this.showSavePrompt = false;
    }
    _confirmExit() {
        this.fire('exit-confirmed');
        this.fire('tracking-event', {
            name: 'ide_exit_confirmed'
        });
    }
    _launchShare() {
        this.editor.share();
    }
    _exit() {
        if (this.showSavePrompt) {
            this.$['save-prompt'].open();
            this.fire('tracking-event', {
                name: 'save_prompt_opened'
            });
        } else {
            this.fire('exit-confirmed');
        }
    }
    _openSignup() {
        this.fire('signup');
    }
}

customElements.define(KanoViewEditor.is, KanoViewEditor);