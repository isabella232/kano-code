/* globals Blockly */
import slug from 'speakingurl';

export default class Part {

    set name (value) {
        let oldName = this.name,
            names = Part.nameRegistry[this.type],
            newName;
        if (!value) {
            this.uniqueName = value;
            return;
        }
        names[oldName] = false;
        // Generate a unique name
        newName = this.getUniqueName(value);
        // Add it to the registery
        names[newName] = true;
        this.uniqueName = newName;
        this.id = slug(this.uniqueName, '');
    }

    get name () {
        return this.uniqueName;
    }

    constructor (opts) {
        this.type = opts.type;
        Part.nameRegistry[this.type] = Part.nameRegistry[this.type] || {};
        this.id = opts.id;
        this.name = opts.name;
        this.label = opts.label;
        this.name = this.name || this.label;
        this.description = opts.description;
        this.image = opts.image;
        this.colour = opts.colour;
        this.blocks = Array.isArray(opts.blocks) ? opts.blocks.slice(0) : [];
        this.events = Array.isArray(opts.events) ? opts.events.slice(0) : [];
        this.listeners = Array.isArray(opts.listeners) ? opts.listeners.slice(0) : [];
        this.codes = {};
        this.userStyle = Object.assign({}, opts.userStyle);
        this.userProperties = Object.assign({}, opts.userProperties);
        this.events.forEach((event) => {
            let blockId = `${this.id}#${event.id}`,
                name = this.name;
            Blockly.Blocks[blockId] = {
                init: function () {
                    let json = {
                        id: blockId,
                        colour: '#33a7ff',
                        message0: `When ${name} ${event.label}`,
                        message1: '%1',
                        args1: [{
                            type: "input_statement",
                            name: "DO"
                        }]
                    };
                    this.jsonInit(json);
                }
            };
            Blockly.JavaScript[blockId] = (block) => {
                let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                    code = `devices.get('${this.id}').when('${event.id}', function () {\n${statement}});\n`;
                return code;
            };
            Blockly.Pseudo[blockId] = (block) => {
                let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                    code = `devices.get('${this.id}').when('${event.id}', function () {\n${statement}});\n`;
                return code;
            };
        });
    }
    getUniqueName (value, inc=0) {
        let newName = inc ? `${value} ${inc}` : value;
        if (Part.nameRegistry[this.type][newName]) {
            return this.getUniqueName(value, inc + 1);
        }
        return newName;
    }
    addBlock (block) {
        this.blocks.push(block);
    }
    addEvent (event) {
        this.events.push(event);
    }
    stop () {
        this.removeListeners();
    }
    start () {

    }
    addEventListener () {
        this.listeners.push(arguments);
    }
    removeListeners () {
        this.listeners = [];
    }
    toJSON () {
        let plain = {};
        plain.id = this.id;
        plain.name = this.name;
        plain.type = this.type;
        plain.userStyle = this.userStyle;
        plain.userProperties = this.userProperties;
        plain.position = this.position;
        return plain;
    }
}

Part.nameRegistry = {};
Part.clear = () => {
    Part.nameRegistry = {};
};
