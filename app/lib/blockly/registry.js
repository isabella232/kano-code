import Defaults from './defaults.js';

class BlocklyRegistry {
    constructor() {
        this.modules = new Map();
        this.categories = {};
        this.available = [];
        this.defaults = new Defaults();
    }
    define(name, m) {
        this.modules.set(name, m);
        if (m.defaults) {
            Object.keys(m.defaults).forEach((blockId) => {
                this.defaults.define(blockId, m.defaults[blockId]);
            });
        }
        if (m.category) {
            const category = this.defaults.createCategory(m.category);
            this.categories[name] = category;
        }
    }
    defineAll(modules) {
        modules.forEach(m => this.define(m.id, m));
    }
    register(Blockly) {
        if (this.registered) {
            return;
        }
        this.registered = true;
        this.modules.forEach(m => m.register(Blockly, this));
    }
    upgradeCategoryColours(id, color) {
        this.categories[id].blocks.forEach((block) => {
            Blockly.Blocks[block.id].customColor = color;
        });
    }
    getToolbox() {
        return this.categories;
    }
}

export default BlocklyRegistry;
