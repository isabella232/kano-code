(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    /**
     * Registers the logic blocks, and creates its category
     */
    const COLOR = '#f75846';

    let register = (Blockly) => {

        Blockly.Functions = {};
        Blockly.Functions.getAllDefinitions = (workspace) => {
            // Assume that a procedure definition is a top block.
            return workspace.getTopBlocks(false)
                .filter(block => block.type === 'function_definition')
                .map(block => block.getFunctionDefinition());
        };
        Blockly.Functions.getDefinition = (name, workspace) => {
            let blocks;
            if (!workspace) {
                return;
            }
            // Assume that a procedure definition is a top block.
            blocks = workspace.getTopBlocks(false);
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].getFunctionDefinition) {
                    let def = blocks[i].getFunctionDefinition();
                    if (def.name === name) {
                        return blocks[i];
                    }
                }
            }
            return null;
        };

        Blockly.Blocks.function_definition = {
            init: function () {
                this.paramFields = [];
                this.appendDummyInput('NAMES')
                    .appendField(new Blockly.FieldFunctionDefinition({ parameters: 0, returns: false }, (newValue) => {
                        this.parameters = newValue.parameters;
                        this.returns    = newValue.returns;
                        this.updateShape_();
                    }), 'LOL')
                    .appendField(Blockly.Msg.FUNCTION_DEFINITION_NAME)
                    .appendField(new Blockly.FieldTextInput(Blockly.Msg.FUNCTION_DEFINITION_DEFAULT_NAME), 'NAME');

                this.appendStatementInput('DO')
                    .appendField(Blockly.Msg.FUNCTION_DEFINITION_DO);

                this.workspace.addChangeListener((e) => {
                    if (e.type === Blockly.Events.CHANGE && e.blockId === this.id) {
                        if (e.name === 'NAME') {
                            this._updateCallBlocksName(e.oldValue, e.newValue);
                            this._updateArgBlocksName(e.oldValue, e.newValue);
                        } else {
                            this._updateCallBlocks();
                        }
                    }
                });

                this.updateShape_();
            },
            updateShape_: function () {
                let names      = this.getInput('NAMES'),
                    returns    = this.getInput('RETURNS'),
                    prevValues = {},
                    fieldName;
                this.paramFields.forEach(name => {
                    prevValues[name] = this.getFieldValue(name);
                    names.removeField(name);
                });
                if (returns) {
                    this.removeInput('RETURNS');
                }
                this.paramFields = [];
                for (let i = 0; i < this.parameters; i++) {
                    fieldName = `PARAM${i}`;
                    names.appendField(new Blockly.FieldTextInput(prevValues[fieldName] || `param ${i + 1}`), fieldName);
                    this.paramFields.push(fieldName);
                }
                if (this.returns) {
                    this.appendValueInput('RETURNS')
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField(Blockly.Msg.FUNCTION_DEFINITION_RETURNS);
                }
                this._updateCallBlocks();
            },
            _findRelatedBlocks (type, name) {
                name = name || this.getFieldValue('NAME');
                return this.workspace.getAllBlocks().filter(block => {
                    return block.type === type && block.getFunctionCall() === name;
                });
            },
            _findCallBlocks (name) {
                return this._findRelatedBlocks('function_call', name);
            },
            _findArgBlocks () {
                return this._findRelatedBlocks('function_argument', name);
            },
            _updateCallBlocks () {
                let blocks = this._findCallBlocks();
                blocks.forEach(block => {
                    block.updateArgs(this.paramFields.map(paramName => this.getFieldValue(paramName)));
                    if (this.returns) {
                        block.setPreviousStatement(false);
                        block.setNextStatement(false);
                        block.setOutput(true);
                    } else {
                        block.setPreviousStatement(true);
                        block.setNextStatement(true);
                        block.setOutput(false);
                    }
                });
            },
            _updateCallBlocksName (oldValue, newValue) {
                let blocks = this._findCallBlocks(oldValue);
                blocks.forEach(block => block.renameFunction(oldValue, newValue));
            },
            _updateArgBlocksName (oldValue, newValue) {
                let blocks = this._findArgBlocks(oldValue);
                blocks.forEach(block => block.updateArg(newValue));
            },
            getFunctionDefinition: function () {
                return {
                    name: this.getFieldValue('NAME'),
                    args: this.paramFields.map(paramName => this.getFieldValue(paramName))
                };
            },
            domToMutation (el) {
                let names = this.getInput('NAMES'),
                    paramEl, fieldName
                for (let i = 0; i < el.children.length; i++) {
                    paramEl = el.children[i];
                    if (paramEl.tagName.toLowerCase() === 'param') {
                        fieldName = paramEl.getAttribute('name');
                        names.appendField(new Blockly.FieldTextInput(paramEl.getAttribute('value')), fieldName);
                        this.paramFields.push(fieldName);
                    }
                }
                this.parameters = this.paramFields.length;
                //this.setFieldValue({ parameters: this.parameters, returns: this.returns }, 'PARAMS');
            },
            mutationToDom () {
                // let container = document.createElement('mutation');
                // this.paramFields.forEach(fieldName => {
                //     let param = document.createElement('param');
                //     param.setAttribute('name', fieldName);
                //     param.setAttribute('value', this.getFieldValue(fieldName));
                //     container.appendChild(param);
                // });
                // return container;
            }
        };

        Blockly.JavaScript.function_definition = (block) => {
            let params    = [],
                statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                name      = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE),
                returns   = Blockly.JavaScript.valueToCode(block, 'RETURNS');
            for (let i = 0; i < block.parameters; i++) {
                params.push(Blockly.JavaScript.variableDB_.getName(block.getFieldValue(`PARAM${i}`), Blockly.Procedures.NAME_TYPE));
            }

            if (returns) {
                returns = `\nreturn ${returns};`;
            } else {
                returns = '';
            }

            return `function ${name}(${params.join(', ')}) {\n${statement}${returns}}\n`;
        };

        Blockly.Pseudo.function_definition = () => {
            return '';
        };

        Blockly.Blocks.function_call = {
            init: function () {
                this._args = [];
                this.appendDummyInput()
                    .appendField(this.id, 'NAME');
                this.appendDummyInput('ARGS');
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setColour(COLOR);

                this.workspace.addChangeListener((e) => {
                    if (e.type === Blockly.Events.DELETE) {
                        let name = this.getFunctionCall(),
                            def = Blockly.Functions.getDefinition(name, this.workspace);
                        if (!def) {
                            Blockly.Events.setGroup(e.group);
                            this.dispose(true, false);
                            Blockly.Events.setGroup(false);
                        }
                    }
                });
            },
            getFunctionCall () {
                return this.getFieldValue('NAME');
            },
            renameFunction (oldName, newName) {
                if (Blockly.Names.equals(oldName, this.getFunctionCall())) {
                    this.setFieldValue(newName, 'NAME');
                }
            },
            updateArgs (args) {
                let fieldName;
                this._args.forEach(arg => {
                    this.removeInput(arg);
                });
                this._args = [];
                args.forEach((arg, index) => {
                    fieldName = `ARG${index}`;
                    this.appendValueInput(fieldName)
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField(arg);
                    this._args.push(fieldName);
                });
            },
            domToMutation (el) {
                let argsInput = this.getInput('ARGS'),
                    argEl, index, fieldName;
                this.renameFunction(this.getFunctionCall(), el.getAttribute('name'));
                this._args = [];
                for (let i = 0; i < el.children.length; i++) {
                    argEl = el.children[i];
                    if (argEl.tagName.toLowerCase() === 'arg') {
                        fieldName = `ARG${index}`;
                        this.appendValueInput(fieldName)
                            .setAlign(Blockly.ALIGN_RIGHT)
                            .appendField(argEl.getAttribute('name'));
                        this._args.push(fieldName);
                        index++;
                    }
                }
            },
            mutationToDom () {
                let container = document.createElement('mutation');
                container.setAttribute('name', this.getFunctionCall());
                return container;
            }
        };

        Blockly.JavaScript.function_call = (block) => {
            let name = block.getFunctionCall(),
                functionName = Blockly.JavaScript.variableDB_.getName(name, Blockly.Procedures.NAME_TYPE),
                args = block._args.map(inputName => {
                    return Blockly.JavaScript.valueToCode(block, inputName) || 'null';
                }),
                code = `${functionName}(${args.join(', ')})`;
            if (!!block.outputConnection) {
                code = [code];
            } else {
                code += ';\n';
            }
            return code;
        };

        Blockly.Blocks.function_argument = {
            init: function () {
                this.appendDummyInput()
                    .appendField(this.id, 'NAME');

                this.setColour(COLOR);
                this.setOutput(true);
            },
            domToMutation (el) {
                let name = el.getAttribute('name');
                if (name) {
                    this.updateArg(name);
                }
            },
            mutationToDom () {
                let container = document.createElement('mutation');
                container.setAttribute('name', this.getFieldValue('NAME'));
                return container;
            },
            updateArg (arg) {
                this.setFieldValue(arg, 'NAME');
            },
            getFunctionCall () {
                return this.getFieldValue('NAME');
            }
        };

        Blockly.JavaScript.function_argument = (block) => {
            let parent = block,
                name = block.getFieldValue('NAME');
            while (parent && parent.type !== 'function_definition') {
                parent = parent.parentBlock_;
            }
            return [Blockly.JavaScript.variableDB_.getName(name, Blockly.Procedures.NAME_TYPE)];
        };

        Blockly.Pseudo.function_argument = (block) => {
            return [''];
        };

        category.blocks.forEach((category) => {
            Kano.Util.Blockly.updateBlockColour(Blockly.Blocks[category.id], COLOR);
        });
    };

    let category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name  : Blockly.Msg.CATEGORY_FUNCTIONS,
        id    : 'functions',
        colour: COLOR,
        blocks: [
            'function_definition'
        ]
    });

    Kano.MakeApps.Blockly.addModule('functions', {
        register,
        category
    });

})(window.Kano = window.Kano || {});
