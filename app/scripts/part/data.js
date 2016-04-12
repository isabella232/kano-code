/* globals Blockly */
import Part from './part';
import modules from '../language/modules';

/**
 * Check if a block is the ancestor of another one
 */
function checkAncestor(block, type) {
    let parent = block.parentBlock_;
    if (!parent) {
        return false;
    }
    if (parent.type == type) {
        return true;
    }
    return checkAncestor(parent, type);
}

export default class Data extends Part {
    constructor (opts) {
        super(opts);
        let setConfigOptions,
            getValueOptions;
        this.partType = 'data';
        this.tagName = 'kano-part-data';
        this.dataType = opts.dataType || 'object';
        this.dataLength = opts.dataLength || 1;
        this.parameters = opts.parameters || [];
        this.config = this.parameters.reduce((acc, param) => {
            acc[param.key] = param.value;
            return acc;
        }, {});
        // Generate the list of options for blockly
        setConfigOptions = this.parameters.map((param) => {
            return [
                param.label,
                param.key
            ];
        });
        this.dataKeys = opts.dataKeys || [];
        getValueOptions = this.dataKeys.map(dataKey => [dataKey.label, dataKey.key]).concat(setConfigOptions);
        this.refreshEnabled = opts.refreshEnabled || false;
        this.refreshFreq = opts.refreshFreq || 5;
        this.minRefreshFreq = opts.minRefreshFreq || 5;
        this.method = opts.method;
        this.events = [{
            label: 'updated',
            id: 'update'
        }];
        this.blocks.push({
            block: (part) => {
                return {
                    id: 'refresh',
                    message0: `refresh ${part.name} data`,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (part) => {
                return () => {
                    let code = `devices.get('${part.id}').refresh();`;
                    return code;
                };
            },
            natural: (part) => {
                return () => {
                    let code = `refresh ${part.name} data`;
                    return code;
                };
            }
        });
        if (setConfigOptions.length) {
            this.blocks.push({
                block: (part) => {
                    return {
                        id: 'set_config',
                        message0: `${part.name} set %1 to %2`,
                        args0: [{
                            type: "field_dropdown",
                            name: "PARAM",
                            options: setConfigOptions
                        },{
                            type: "input_value",
                            name: "VALUE"
                        }],
                        previousStatement: null,
                        nextStatement: null
                    };
                },
                javascript: (part) => {
                    return function (block) {
                        let value = Blockly.JavaScript.valueToCode(block, 'VALUE'),
                        param = block.getFieldValue('PARAM'),
                        code = `devices.get('${part.id}').setConfig('${param}', ${value});\n`;
                        return code;
                    };
                },
                natural: (part) => {
                    return function (block) {
                        let value = Blockly.Natural.valueToCode(block, 'VALUE'),
                        param = block.getFieldValue('PARAM'),
                        code = `${part.name} set ${param} to ${value}\n`;
                        return code;
                    };
                }
            });
        }
        if (getValueOptions.length) {
            if (this.dataType === 'list') {
                this.blocks.push({
                    block: (part) => {
                        return {
                            id: 'get_value_at',
                            message0: `${part.name}'s %1`,
                            args0: [{
                                type: "field_dropdown",
                                name: "KEY",
                                options: getValueOptions
                            }],
                            output: true
                        };
                    },
                    javascript: (part) => {
                        return function (block) {
                            let key = block.getFieldValue('KEY'),
                                code = `item.${key}`;
                            // If the block is not in his part's for each loop
                            if (!checkAncestor(block, `${part.id}#for_each`)) {
                                code = `devices.get('${part.id}').getData()[0].${key}`;
                            }
                            return [code];
                        };
                    },
                    natural: (part) => {
                        return function (block) {
                            let key = block.getFieldValue('KEY'),
                            code = `${part.name}'s ${key}\n`;
                            return [code];
                        };
                    }
                });
            } else {
                this.blocks.push({
                    block: (part) => {
                        return {
                            id: 'get_value',
                            message0: `${part.name}'s %1`,
                            args0: [{
                                type: "field_dropdown",
                                name: "KEY",
                                options: getValueOptions
                            }],
                            output: true
                        };
                    },
                    javascript: (part) => {
                        return function (block) {
                            let key = block.getFieldValue('KEY'),
                            code = `devices.get('${part.id}').getValue('${key}')`;
                            return [code];
                        };
                    },
                    natural: (part) => {
                        return function (block) {
                            let key = block.getFieldValue('KEY'),
                            code = `${part.name}'s ${key}\n`;
                            return [code];
                        };
                    }
                });
            }
        }
        if (this.dataType === 'list') {
            this.blocks.push({
                block: (part) => {
                    return {
                        id: 'for_each',
                        message0: `for each item in ${part.name}`,
                        message1: 'do %1',
                        args1: [{
                            type: "input_statement",
                            name: "DO"
                        }],
                        previousStatement: null,
                        nextStatement: null
                    };
                },
                javascript: (part) => {
                    return function (block) {
                        let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                            code = `devices.get('${part.id}').getData().forEach(function (item) {
                                ${statement}
                            });\n`;
                        return code;
                    };
                },
                natural: (part) => {
                    return function () {
                        let code = `for each item in ${part.name}, do\n`;
                        return code;
                    };
                }
            });
        }
    }
    refresh () {
        return modules.data.methods.generateRequest(this.id, this.method, this.config);
    }
    toJSON () {
        let plain = super.toJSON.call(this);
        plain.refreshFreq = this.refreshFreq;
        plain.refreshEnabled = this.refreshEnabled;
        return plain;
    }
}
