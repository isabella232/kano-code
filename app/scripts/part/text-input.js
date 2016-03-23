let input;

export default input = {
    type: 'text-input',
    label: 'Text input',
    image: 'assets/part/text-field-icon.png',
    colour: '#3CAA36',
    blocks: [{
        block: (ui) => {
            return {
                id: 'input_text_get_value',
                output: true,
                message0: `${ui.name} value`
            };
        },
        javascript: (ui) => {
            return function () {
                return [`devices.get('${ui.id}').getValue()`];
            };
        },
        natural: () => {
            return function () {
                return [`input value`];
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'input_text_set_value',
                output: false,
                message0: `set ${ui.name} to %1`,
                args0: [{
                    type: "input_value",
                    name: "INPUT"
                }]
            };
        },
        javascript: (ui) => {
            return function (block) {
                let value = Blockly.JavaScript.valueToCode(block, 'INPUT');
                return [`devices.get('${ui.id}').setValue(${value});`];
            };
        },
        natural: () => {
            return function () {
                return [`input set value`];
            };
        }
    }],
    events: [{
        label: 'has changed',
        id: 'input-keyup'
    }]
};
