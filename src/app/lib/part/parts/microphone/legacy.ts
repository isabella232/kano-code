import { LegacyUtil } from '../../../legacy/util.js';

export function transformLegacy(app : any) {
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (!root) {
        return;
    }
    LegacyUtil.forEachPart(app, 'microphone', ({ id }) => {
        LegacyUtil.transformBlock(root, `block[type="${id}#get_volume"]`, (block) => {
            const field = block.querySelector('field[name="TYPE"]');
            if (!field) {
                return;
            }
            if (field.textContent === 'volume') {
                block.setAttribute('type', `get_${id}_volume`);
            } else {
                block.setAttribute('type', `get_${id}_pitch`);
            }
            block.removeChild(field);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#threshold"]`, (block) => {
            LegacyUtil.transformField(block, 'OVER', (name, content) => {
                return {
                    name: 'TYPE',
                    content: content === 'true' ? 'rising' : 'falling',
                };
            });
            LegacyUtil.renameStatement(block, 'DO', 'CALLBACK');
            block.setAttribute('type', `${id}_onEdge`);
            // Force move the block to the root of the tree.
            // This block used to allow previous connections
            root.appendChild(block);
        });
    });
    const serializer = new XMLSerializer();
    app.source = serializer.serializeToString(root);
}
