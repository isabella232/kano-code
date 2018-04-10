import Defaults from './defaults.js';

class BlocklyRegistry {
    constructor() {
        this.modules = new Map();
        this.experiments = new Map();
        this.categories = {};
        this.available = [];
        this.defaults = new Defaults();
    }
    define(name, m, experiment = false) {
        this.modules.set(name, m);
        if (m.defaults) {
            Object.keys(m.defaults).forEach((blockId) => {
                this.defaults.define(blockId, m.defaults[blockId]);
            });
        }
        if (experiment) {
            this.experiments.set(name, this.experiments.get(name) || []);
            this.experiments.get(name).push(m);
        } else if (m.category) {
            const category = this.defaults.createCategory(m.category);
            this.categories[name] = category;
        }
        if (m.experiments) {
            this.available = this.available.concat(Object.keys(m.experiments));
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
        const flags = Kano.MakeApps.experiments.getFlags();
        flags.experiments.forEach((exp) => {
            if (this.experiments.has(exp)) {
                this.experiments.get(exp).forEach((m) => {
                    this.categories[exp] = m.category;
                });
            }
            this.modules.forEach((m, key) => {
                if (m.experiments && m.experiments[exp]) {
                    const category = this.categories[key];
                    category.blocks = category.blocks.concat(m.experiments[exp]);
                }
            });
        });
        Kano.MakeApps.experiments.addExperiments('blocks', this.available.concat(Object.keys(this.experiments)));
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
