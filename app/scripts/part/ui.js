import Part from './part';

const STYLE_CONF = {
    'background-color': {
        key: 'background-color',
        type: 'color',
        label: 'Background color'
    },
    'color': {
        key: 'color',
        type: 'color',
        label: 'Color'
    },
    'width': {
        key: 'width',
        type: 'size',
        label: 'Width',
        boundTo: 'width'
    },
    'height': {
        key: 'height',
        type: 'size',
        label: 'Height',
        boundTo: 'height'
    },
    'background': {
        key: 'background',
        type: 'color',
        label: 'Background'
    },
    'font-size': {
        key: 'font-size',
        type: 'font-size',
        label: 'Text size'
    },
    'font-weight': {
        key: 'font-weight',
        type: 'font-weight',
        label: 'Text weight'
    }
};

export default class UI extends Part {

    constructor (opts, size) {
        super(opts);
        this.customizable = Object.assign({}, opts.customizable) || { style: [], properties: [] };
        this.customizable.properties = this.customizable.properties || [];
        if (opts.customizable && opts.customizable.style) {
            this.customizable.style = opts.customizable.style.map((key) => {
                let style = STYLE_CONF[key];
                if (style.boundTo === 'width') {
                    style.max = size.width;
                } else if (style.boundTo === 'height') {
                    style.max = size.height;
                }
                return style;
            });
        }
        this.partType = 'ui';
        this.position = opts.position || {
            x: 0,
            y: 0
        };
        this.rotation = opts.rotation || 0;
        this.scale = opts.scale || 100;
        this.visible = opts.visible || true;
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_move_by',
                    message0: `move ${ui.name} %1 pixels`,
                    args0: [{
                        type: 'input_value',
                        name: 'pixels'
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function (block) {
                    let x = parseInt(Blockly.JavaScript.valueToCode(block, 'pixels')) || 0,
                        code = `devices.get('${ui.id}').moveAlong(${x});\n`;
                    return code;
                };
            },
            pseudo: (ui) => {
                return function (block) {
                    let x = parseInt(Blockly.Pseudo.valueToCode(block, 'pixels')) || 0,
                        code = `${ui.id}.move(${x});\n`;
                    return code;
                };
            }
        });
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_rotate_clockwise',
                    message0: `turn \u21BB ${ui.name} %1 degrees`,
                    args0: [{
                        type: 'input_value',
                        name: 'DEG'
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function (block) {
                    let deg = parseInt(Blockly.JavaScript.valueToCode(block, 'DEG')) || 0,
                        code;
                    code = `devices.get('${ui.id}').rotate(${deg});\n`;
                    return code;
                };
            },
            pseudo: (ui) => {
                return function (block) {
                    let deg = parseInt(Blockly.Pseudo.valueToCode(block, 'DEG')) || 0,
                        code;
                    code = `${ui.id}.turnClockwise(${deg});\n`;
                    return code;
                };
            }
        });
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_rotate_counter_clockwise',
                    message0: `turn \u21BA ${ui.name} %1 degrees`,
                    args0: [{
                        type: 'input_value',
                        name: 'DEG'
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function (block) {
                    let deg = -1 * parseInt(Blockly.JavaScript.valueToCode(block, 'DEG')) || 0,
                        code;
                    code = `devices.get('${ui.id}').rotate(${deg});\n`;
                    return code;
                };
            },
            pseudo: (ui) => {
                return function (block) {
                    let deg = parseInt(Blockly.Pseudo.valueToCode(block, 'DEG')) || 0,
                        code;
                    code = `${ui.id}.turnCounterClockwise(${deg});\n`;
                    return code;
                };
            }
        });
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_scale',
                    message0: `set ${ui.name} size to %1 %`,
                    args0: [{
                        type: 'input_value',
                        name: 'FACTOR'
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function (block) {
                    let factor = parseInt(Blockly.JavaScript.valueToCode(block, 'FACTOR')) || 0,
                        code;
                    code = `devices.get('${ui.id}').scale(${factor});\n`;
                    return code;
                };
            },
            pseudo: (ui) => {
                return function (block) {
                    let factor = parseInt(Blockly.Pseudo.valueToCode(block, 'FACTOR')) || 0,
                        direction = block.getFieldValue('DIRECTION'),
                        code;
                    code = `${ui.id}.setSizeTo(${factor});\n`;
                    return code;
                };
            }
        });
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_scale_rel',
                    message0: `change ${ui.name} size by %1 %`,
                    args0: [{
                        type: 'input_value',
                        name: 'FACTOR'
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function (block) {
                    let factor = parseInt(Blockly.JavaScript.valueToCode(block, 'FACTOR')) || 0,
                        code;
                    code = `devices.get('${ui.id}').resize(${factor});\n`;
                    return code;
                };
            },
            pseudo: (ui) => {
                return function (block) {
                    let factor = parseInt(Blockly.Pseudo.valueToCode(block, 'FACTOR')) || 0,
                        direction = block.getFieldValue('DIRECTION'),
                        code;
                    code = `${ui.id}.changeSizeBy(${factor});\n`;
                    return code;
                };
            }
        });
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_set_x_y',
                    message0: `move ${ui.name} to x %1, y %2`,
                    args0: [{
                        type: 'input_value',
                        name: 'X'
                    },
                    {
                        type: 'input_value',
                        name: 'Y'
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function (block) {
                    let x = parseInt(Blockly.JavaScript.valueToCode(block, 'X')) || 0,
                        y = parseInt(Blockly.JavaScript.valueToCode(block, 'Y')) || 0,
                        code = `devices.get('${ui.id}').setXY(${x},${y});\n`;
                    return code;
                };
            },
            pseudo: (ui) => {
                return function (block) {
                    let x = parseInt(Blockly.Pseudo.valueToCode(block, 'X')) || 0,
                        y = parseInt(Blockly.Pseudo.valueToCode(block, 'Y')) || 0,
                        code = `${ui.id}.moveTo(${x}, ${y});\n`;
                    return code;
                };
            }
        });
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_set_x',
                    message0: `set ${ui.name} x to %1`,
                    args0: [{
                        type: 'input_value',
                        name: 'X'
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function (block) {
                    let x = parseInt(Blockly.JavaScript.valueToCode(block, 'X')) || 0,
                        code = `devices.get('${ui.id}').setX(${x});\n`;
                    return code;
                };
            },
            pseudo: (ui) => {
                return function (block) {
                    let x = parseInt(Blockly.Pseudo.valueToCode(block, 'X')) || 0,
                        code = `${ui.id}.setX(${x});\n`;
                    return code;
                };
            }
        });
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_set_y',
                    message0: `set ${ui.name} y to %1`,
                    args0: [{
                        type: 'input_value',
                        name: 'Y'
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function (block) {
                    let y = parseInt(Blockly.JavaScript.valueToCode(block, 'Y')) || 0,
                        code = `devices.get('${ui.id}').setY(${y});\n`;
                    return code;
                };
            },
            pseudo: (ui) => {
                return function (block) {
                    let y = parseInt(Blockly.Pseudo.valueToCode(block, 'Y')) || 0,
                        code = `${ui.id}.setY(${y});\n`;
                    return code;
                };
            }
        });
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_show_hide',
                    message0: `${ui.name} %1`,
                    args0: [{
                        type: "field_dropdown",
                        name: "VISIBILITY",
                        options: [
                            [
                                "Show",
                                "show"
                            ],
                            [
                                "Hide",
                                "hide"
                            ]
                        ]
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function (block) {
                    let visibility = block.getFieldValue('VISIBILITY'),
                        code;
                    visibility = visibility === 'show' ? 'true' : 'false';
                    code = `devices.get('${ui.id}').show(${visibility});\n`;
                    return code;
                };
            },
            pseudo: (ui) => {
                return function (block) {
                    let visibility = block.getFieldValue('VISIBILITY'),
                        code;
                    code = `${ui.id}.${visibility}();\n`;
                    return code;
                };
            }
        });
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_toggle_visibility',
                    message0: `toggle ${ui.name}'s' visibility`,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function () {
                    let code = `devices.get('${ui.id}').toggleVisibility();\n`;
                    return code;
                };
            },
            pseudo: (ui) => {
                return function () {
                    let code = `${ui.id}.toggleVisibility();\n`;
                    return code;
                };
            }
        });
    }
    toJSON () {
        let plain = super.toJSON.call(this);
        plain.customizable = {
            properties: this.customizable.properties,
            style: this.customizable.style.map(style => style.key)
        };
        plain.rotation = this.rotation;
        plain.scale = this.scale;
        plain.visible = this.visible;
        return plain;
    }
}
