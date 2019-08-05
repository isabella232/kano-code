import * as code from '../../index.js';
import * as i18n from '../../i18n.js';
import * as challenge from '../../challenge.js';
import '../../briefing/blockly.contribution.js';

const lang = i18n.getLang();

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor({ sourceType: 'blockly' });
        const briefing = challenge.createBriefing(editor);
        const img = document.createElement('img');
        img.src = '/examples/assets/sw/droid.svg'
        briefing.setData({
            id: '001_brief',
            instruction: 'Hello people, hahahahahahaha HAHAHAHAHA HAHAAHAHAH Lol',
            icon: {
                getDomNode() { return img; }
            },
        });
        briefing.onDidEnd(() => {
            console.log('requested end');
        })
        
        editor.onDidInject(() => {
            briefing.start();
        });
        editor.inject(document.body);
    });
