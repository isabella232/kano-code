import { Challenge } from '../../challenge.js';
import * as code from '../../index.js';
import * as APIs from '../../toolbox.js';
import * as i18n from '../../i18n.js';
import * as Modules from '../../modules.js';
import * as Parts from '../../dist/app/lib/parts/parts/index.js';
import * as PartAPIs from '../../dist/app/lib/parts/parts/api.js';


class OutputProfile extends code.OutputProfile {
    get modules() {
        return Object.values(Modules);
    }
    get parts() {
        return Object.values(Parts);
    }
}

class EditorProfile extends code.EditorProfile {
    get parts() {
        return Object.values(PartAPIs);
    }
    get toolbox() {
        return Object.values(APIs);
    }
    get outputProfile() {
        return new OutputProfile();
    }
}

const lang = i18n.getLang();

const app = {"source":"<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"app_onStart\" id=\"default_app_onStart\" x=\"118\" y=\"91\"><field name=\"FLASH\"></field><statement name=\"CALLBACK\"><block type=\"button_background_set\" id=\"bpN^4*Dg-KXuv,l*vOxD\"><value name=\"BACKGROUND\"><shadow type=\"colour_picker\" id=\"Nm8-O4aePXTld$G%G2Tr\"><field name=\"COLOUR\">#01579B</field></shadow></value></block></statement></block><block type=\"button_onClick\" id=\"Dhl_@,ICJMrobV3oBJWR\" x=\"117\" y=\"222\"><field name=\"FLASH\"></field></block></xml>","code":"app.onStart(function() {\n  button.background = '#01579B';\n\n});\n\nbutton.onClick(function() {\n\n});\n","parts":[{"type":"button","id":"button","name":"Button"}]};
const challengeData = {
    defaultApp: JSON.stringify(app),
    steps: [{
        beacon: 'part#button>toolbox:100,50',
        validation: {
            blockly: {
                'open-flyout': 'part#button',
            },
        },
    }, {
        beacon: 'part#button>flyout-block.label_set',
        validation: {
            blockly: {
                create: {
                    type: 'part#button>flyout-block.label_set',
                    alias: 'set_back',
                },
            },
        },
    }, {
        beacon: 'part#button>block.onClick',
        validation: {
            blockly: {
                connect: {
                    parent: 'part#button>block.onClick',
                    connection: 'CALLBACK',
                    target: 'alias#set_back',
                },
            },
        },
    }, {
        beacon: 'alias#set_back',
        validation: {
            blockly: {
                value: {
                    target: 'alias#set_back',
                    value: 'Lol'
                },
            },
        },
    }, {
        banner: 'Done',
    }],
};

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor();

        const challenge = new Challenge(editor, challengeData);

        editor.registerProfile(new EditorProfile());

        editor.inject(document.body);

        setTimeout(() => {
            challenge.start();
        });

    });
