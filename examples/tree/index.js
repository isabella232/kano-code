import * as code from '../../index.js';
import * as i18n from '../../i18n.js';
import * as APIs from '../../toolbox.js';
import { LocalStoragePlugin } from '../../dist/app/lib/storage/local-storage.js'
import { Player } from '../../dist/app/lib/index.js';
import { CreationImagePreviewProvider } from '../../dist/app/lib/creation/providers/image.js';



const Trees = {
    type: 'module',
    color: '#355C7D',
    name: 'trees',
    verbose: 'Trees',
    symbols: [{
        type: 'function',
        name: 'tree',
        verbose: 'Draw a tree',
    }],
};

class TreesModule extends code.AppModule {
    static get id() {
        return 'trees';
    }

    constructor(output) {
        super (output);
        const { canvas } = output.visuals;
        const ctx = canvas.getContext('2d');

        this.addMethod('tree', () => {

            function tree(length) {
                ctx.moveTo(0,0);
                ctx.lineTo(0,-length);
                ctx.translate(0,-length);

                length = length * 0.66;

                if (length > 5) {
                    ctx.save();
                    ctx.rotate(Math.PI / 6);
                    tree(length);
                    ctx.restore();

                    ctx.save();
                    ctx.rotate(Math.PI / -6);
                    tree(length);
                    ctx.restore();
                }
            }

            ctx.translate(400, 600)
            ctx.beginPath();
            tree(200);
            ctx.stroke(); 
        });
    }
};

class OutputProfile extends code.DefaultOutputProfile {
    onInstall(output) {
        super.onInstall(output);
        this.modules.push(TreesModule);
    }
}

class EditorProfile extends code.DefaultEditorProfile {
    onInstall(editor) {
        super.onInstall(editor);
        this.storage = new LocalStoragePlugin('intro');
        this.plugins.push(this.storage);
        this.toolbox = [
            Trees,
            APIs.AppAPI,
            APIs.ControlAPI,
            APIs.LogicAPI,
            APIs.MathAPI,
            APIs.VariablesAPI,
            APIs.ColorAPI,
            APIs.ListsAPI,
            APIs.DrawAPI,
            APIs.StampAPI,
        ];
        this.outputProfile = new OutputProfile();
        Player.registerProfile(this.outputProfile);
    }
    get creationPreviewProvider() {
        return new CreationImagePreviewProvider({ width: 800, height: 600 }, 10, 10);
    }
}


const lang = i18n.getLang();

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor();

        editor.registerProfile(new EditorProfile());

        editor.onDidInject(() => {
            editor.profile.storage.load();
        });

        editor.inject(document.body);
    });
