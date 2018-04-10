class BlocklyMetaRenderer {
    static render(m) {
        switch (m.def.type) {
        case 'module': {
            return BlocklyMetaRenderer.renderModule(m);
        }
        case 'variable': {
            return BlocklyMetaRenderer.renderVariable(m);
        }
        case 'function': {
            return BlocklyMetaRenderer.renderFunction(m);
        }
        default: {
            break;
        }
        }
        return null;
    }
    static renderModule(m) {
        return m.symbols.reduce((acc, sym) => {
            const rendered = BlocklyMetaRenderer.render(sym);
            if (Array.isArray(rendered)) {
                return acc.concat(rendered);
            }
            acc.push(rendered);
            return acc;
        }, []);
    }
    static renderVariable(m) {
        const json = BlocklyMetaRenderer.renderBaseBlock(m);
        const register = (Blockly) => {
            Blockly.Blocks[json.id] = {
                init() {
                    this.jsonInit(json);
                },
            };
            Blockly.JavaScript[json.id] = () => [m.getNameChain('.')];
        };
        return { register, id: json.id };
    }
    static renderFunction(m) {
        let json = BlocklyMetaRenderer.renderBaseBlock(m);
        if (typeof json.output === 'undefined') {
            json.nextStatement = null;
            json.previousStatement = null;
        }
        const params = m.getParameters();
        const argsMap = new Array(params.length);
        json = params.reduce((acc, p, index) => {
            // Get the input type and check
            const input = BlocklyMetaRenderer.parseInputType(p.def.returnType, p);
            // First Item includes the function name
            if (index === 0) {
                // Append the function name
                acc[`message${index}`] = `${json.message0}`;
                // If the parameter is a callback, force line break
                if (input.type === 'input_statement') {
                    acc[`message${index}`] += ' %1 %2';
                } else {
                    acc[`message${index}`] += ` ${p.getVerboseDisplay()} %1`;
                }
            } else if (input.type === 'input_statement') {
                acc[`message${index}`] = ' %1 %2';
            } else {
                acc[`message${index}`] = ` ${p.getVerboseDisplay()} %1`;
            }
            input.name = p.def.name.toUpperCase();
            argsMap[index] = input.name;
            const args = [input];
            if (input.type === 'input_statement') {
                args.unshift({ type: 'input_dummy' });
            }
            acc[`args${index}`] = args;
            return acc;
        }, json);
        json.inputsInline = params.length <= 2;
        if (m.def.blockly && typeof m.def.blockly.postProcess === 'function') {
            json = m.def.blockly.postProcess(json);
        }
        const defaults = params.filter(p => p.def.default).reduce((acc, p) => {
            acc[p.def.name.toUpperCase()] = p.def.default;
            return acc;
        }, {});
        const register = (Blockly) => {
            const aliases = m.def.blockly && m.def.blockly.aliases ? m.def.blockly.aliases : [];
            aliases.push(json.id);
            aliases.forEach((alias) => {
                Blockly.Blocks[alias] = {
                    init() {
                        this.jsonInit(json);
                    },
                };
                Blockly.JavaScript[alias] = (block) => {
                    const values = argsMap.map((argName, index) => {
                        const input = block.getInput(argName);
                        const field = block.getField(argName);
                        let value;
                        if (field && !input) {
                            value = block.getFieldValue(argName) || params[index].def.default || '';
                            if (typeof value === 'string') {
                                value = `'${value}'`;
                            }
                        } else {
                            switch (input.type) {
                            case Blockly.INPUT_VALUE: {
                                value = Blockly.JavaScript.valueToCode(block, argName) || params[index].def.default || 'null';
                                break;
                            }
                            case Blockly.NEXT_STATEMENT: {
                                const statement = Blockly.JavaScript.statementToCode(block, argName) || params[index].def.default || '';
                                value = `function() {\n${statement}\n}`;
                                break;
                            }
                            default: {
                                return 'null';
                            }
                            }
                        }
                        return value;
                    });
                    return `${m.getNameChain('.')}(${values.join(', ')});\n`;
                };
            });
        };
        return { register, id: json.id, defaults };
    }
    static renderBaseBlock(m) {
        const id = m.getNameChain();
        return {
            id,
            colour: m.getColor(),
            message0: m.getVerboseDisplay(),
            output: BlocklyMetaRenderer.parseType(m.getReturnType()),
        };
    }
    static parseInputType(type, param) {
        switch (type) {
        case Function: {
            return {
                type: 'input_statement',
            };
        }
        case 'Enum': {
            return {
                type: 'field_dropdown',
                options: param.def.enum || [],
            };
        }
        case Number:
        default: {
            return {
                type: 'input_value',
                check: BlocklyMetaRenderer.parseType(type),
            };
        }
        }
    }
    static parseType(type) {
        switch (type) {
        case Number: {
            return 'Number';
        }
        case 'Color': {
            return 'Colour';
        }
        default: {
            return type;
        }
        }
    }
}

export default BlocklyMetaRenderer;
