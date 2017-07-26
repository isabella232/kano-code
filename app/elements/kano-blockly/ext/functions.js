/* global Blockly */

Blockly.Functions = {};

Blockly.Functions.NAME_TYPE = 'FUNCTION';

class UserFunction {
    constructor (definitionBlock) {
        let onDelete;
        this.definitionBlock = definitionBlock;
        this.params = [];
        this.calls = [];

        onDelete = (e) => {
            if (e.type === Blockly.Events.DELETE && e.blockId === this.definitionBlock.id) {
                this.deleteCalls();
                this.deleteParams();
                Blockly.Workspace.getById(e.workspaceId).removeChangeListener(onDelete);
            }
        }
        this.definitionBlock.workspace.addChangeListener(onDelete);
    }

    addCall (callBlock) {
        let onDelete = (e) => {
            let index;
            if (e.type === Blockly.Events.DELETE && e.blockId === callBlock.id) {
                Blockly.Workspace.getById(e.workspaceId).removeChangeListener(onDelete);
                index = this.calls.indexOf(callBlock);
                if (index !== -1) {
                    this.calls.splice(index, 1);
                }
            }
        };
        for (let i = 0; i < this.calls.length; i++) {
            if (this.calls[i].id === callBlock.id) {
                this.calls.splice(i, 1, callBlock);
                callBlock.workspace.addChangeListener(onDelete);
                return;
            }
        }
        this.calls.push(callBlock);
        callBlock.workspace.addChangeListener(onDelete);
    }

    addParam (paramBlock) {
        let onDelete = (e) => {
            let index;
            if (e.type === Blockly.Events.DELETE && e.blockId === paramBlock.id) {
                Blockly.Workspace.getById(e.workspaceId).removeChangeListener(onDelete);
                index = this.params.indexOf(paramBlock);
                if (index !== -1) {
                    this.params.splice(index, 1);
                }
            }
        };
        for (let i = 0; i < this.params.length; i++) {
            if (this.params[i].id === paramBlock.id) {
                this.params.splice(i, 1, paramBlock);
                paramBlock.workspace.addChangeListener(onDelete);
                return;
            }
        }
        this.params.push(paramBlock);
        paramBlock.workspace.addChangeListener(onDelete);
    }

    deleteCalls () {
        this.calls.forEach(block => block.dispose(false, false));
    }

    deleteParams () {
        this.params.forEach(block => block.dispose(false, false));
    }

    getCallXml () {
        return `<block type="function_call"><mutation definition="${this.definitionBlock.id}"></mutation></block>`;
    }

    getParamsXml () {
        let params = this.getParams();
        return Object.keys(params).map(param => `<block type="function_argument"><mutation param="${param}" definition="${this.definitionBlock.id}"></mutation></block>`);
    }

    getName () {
        return this.definitionBlock.getFieldValue('NAME');
    }

    getParams () {
        return this.definitionBlock.paramFields.reduce((acc, field) => {
            acc[field] = this.definitionBlock.getFieldValue(field);
            return acc;
        }, {});
    }

    getReturns () {
        return this.definitionBlock.returns;
    }

    updateCallBlocks () {
        this.calls.forEach(block => block.updateShape());
        this.definitionBlock.workspace.fireChangeListener({
            type: Blockly.Events.UPDATE_FUNCTIONS,
            blockId: this.definitionBlock.id
        });
    }

    updateParamsBlocks () {
        let params = Object.keys(this.getParams());
        // Delete blocks that used to point to a deleted param
        this.params.forEach((block, index) => {
            if (params.indexOf(block.paramName) === -1) {
                block.dispose(false, false);
                this.params.splice(index, 1);
            }
        });
        this.params.forEach(block => block.updateShape());
    }
}

Blockly.FunctionsRegistry = function (workspace) {
    this.workspace = workspace;
    this.functions = {};
};

Blockly.FunctionsRegistry.prototype.createFunction = function (definitionBlock) {
    this.functions[definitionBlock.id] = new UserFunction(definitionBlock);
};

Blockly.FunctionsRegistry.prototype.createCall = function (id, callBlock) {
    this.getFunction(id).addCall(callBlock);
};

Blockly.FunctionsRegistry.prototype.createParam = function (id, paramBlock) {
    this.getFunction(id).addParam(paramBlock);
};

Blockly.FunctionsRegistry.prototype.getFunction = function (definitionId) {
    return this.functions[definitionId];
};

Blockly.FunctionsRegistry.prototype.getAllFunctions = function () {
    return Object.keys(this.functions).map(defId => this.functions[defId]);
};

Blockly.FunctionsRegistry.prototype.getToolbox = function () {
    let toolbox = Object.keys(this.functions).map(functionId => {
        return {
            custom: this.functions[functionId].getCallXml()
        }
    });

    toolbox.unshift({ id: 'function_definition' });

    return toolbox;
};