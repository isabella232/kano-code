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
        const json = BlocklyMetaRenderer.renderBaseBlock(m);
        if (typeof json.output === 'undefined') {
            json.nextStatement = null;
            json.previousStatement = null;
        }
        const params = m.getParameters();
        json.message0 = `${json.message0} ${params.map((p, index) => `${p.name} %${index + 1}`).join(' ')}`;
        json.args0 = params.map((p) => {
            const input = BlocklyMetaRenderer.parseInputType(p.returnType);
            input.name = p.name;
            return input;
        });
        const register = (Blockly) => {
            Blockly.Blocks[json.id] = {
                init() {
                    this.jsonInit(json);
                },
            };
            Blockly.JavaScript[json.id] = (block) => {
                const args = json.args0.map((arg, index) => {
                    switch (arg.type) {
                    case 'input_value': {
                        return Blockly.JavaScript.valueToCode(block, arg.name) || params[index].default || 'null';
                    }
                    default: {
                        return 'null';
                    }
                    }
                });
                return `${m.getNameChain('.')}(${args.join(', ')});\n`;
            };
        };
        return { register, id: json.id };
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
    static parseInputType(type) {
        switch (type) {
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
