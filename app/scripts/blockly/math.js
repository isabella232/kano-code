const COLOUR = '#7DC242'; //41

let register = (Blockly) => {
    /* --- max(x, y) */
    Blockly.Blocks.math_max = {
        init: function () {
            let json = {
                id: 'math_max',
                colour: COLOUR,
                message0: 'max %1 %2',
                args0: [{
                    type: "input_value",
                    name: "ARG1",
                    check: "Number"
                }, {
                    type: "input_value",
                    name: "ARG2",
                    check: "Number"
                }],
                inputsInline: true,
                output: "Number"
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript.math_max = (block) => {
        let arg1 = Blockly.JavaScript.valueToCode(block, 'ARG1'),
            arg2 = Blockly.JavaScript.valueToCode(block, 'ARG2'),
            code = `Math.max(${arg1}, ${arg2})`;
        return code;
    };

    Blockly.Pseudo.math_max = (block) => {
        let arg1 = Blockly.JavaScript.valueToCode(block, 'ARG1'),
            arg2 = Blockly.JavaScript.valueToCode(block, 'ARG2'),
            code = `Math.max(${arg1}, ${arg2})`;
        return code;
    };

    /* --- min(x, y) */
    Blockly.Blocks.math_min = {
        init: function () {
            let json = {
                id: 'math_min',
                colour: COLOUR,
                message0: 'min %1 %2',
                args0: [{
                    type: "input_value",
                    name: "ARG1",
                    check: "Number"
                }, {
                    type: "input_value",
                    name: "ARG2",
                    check: "Number"
                }],
                inputsInline: true,
                output: "Number"
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript.math_min = (block) => {
        let arg1 = Blockly.JavaScript.valueToCode(block, 'ARG1'),
            arg2 = Blockly.JavaScript.valueToCode(block, 'ARG2'),
            code = `Math.min(${arg1}, ${arg2})`;
        return code;
    };

    Blockly.Pseudo.math_min = (block) => {
        let arg1 = Blockly.JavaScript.valueToCode(block, 'ARG1'),
            arg2 = Blockly.JavaScript.valueToCode(block, 'ARG2'),
            code = `Math.min(${arg1}, ${arg2})`;
        return code;
    };

    /* --- sign(x) */
    Blockly.Blocks.math_sign = {
        init: function () {
            let json = {
                id: 'math_sign',
                colour: COLOUR,
                message0: 'sign %1',
                args0: [{
                    type: "input_value",
                    name: "ARG",
                    check: "Number"
                }],
                inputsInline: true,
                output: "Number"
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript.math_sign = (block) => {
        let arg = Blockly.JavaScript.valueToCode(block, 'ARG'),
            code = `math.sign(${arg}})`;
        return [code];
    };

    Blockly.Pseudo.math_sign = (block) => {
        let arg = Blockly.JavaScript.valueToCode(block, 'ARG'),
            code = `${arg}.sign`;
        return [code];
    };

    /* --- random(min, max, isFloat) */
    Blockly.Blocks.math_random = {
        init: function () {
            let json = {
                id: 'math_random',
                colour: COLOUR,
                message0: 'random %3 from %1 to %2',
                args0: [{
                    type: "input_value",
                    name: "MIN",
                    check: "Number"
                }, {
                    type: "input_value",
                    name: "MAX",
                    check: "Number"
                }, {
                    type: "field_dropdown",
                    name: "TYPE",
                    options: [
                        ['integer', 'integer'],
                        ['float', 'float']
                    ]
                }],
                inputsInline: true,
                output: "Number"
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript.math_random = (block) => {
        let min = Blockly.JavaScript.valueToCode(block, 'MIN') || 0,
            max = Blockly.JavaScript.valueToCode(block, 'MAX') || 0,
            type = Blockly.JavaScript.valueToCode(block, 'TYPE'),
            code = `math.random(${min}, ${max}, ${type === 'float'}})`;
        return code;
    };

    Blockly.Pseudo.math_random = (block) => {
        let min = Blockly.JavaScript.valueToCode(block, 'MIN') || 0,
            max = Blockly.JavaScript.valueToCode(block, 'MAX') || 100,
            type = Blockly.JavaScript.valueToCode(block, 'TYPE'),
            code = `${type}.random(${min}, ${max})`;
        return code;
    };

    Blockly.Pseudo.math_arithmetic = Blockly.JavaScript.math_arithmetic;
    Blockly.Pseudo.math_single = Blockly.JavaScript.math_single;
    Blockly.Pseudo.math_trig = Blockly.JavaScript.math_trig;
    Blockly.Pseudo.math_round = Blockly.JavaScript.math_round;
    Blockly.Pseudo.math_constant = Blockly.JavaScript.math_constant;
    Blockly.Pseudo.math_number_property = Blockly.JavaScript.math_number_property;
    Blockly.Pseudo.math_modulo = Blockly.JavaScript.math_modulo;
    Blockly.Pseudo.math_constrain = Blockly.JavaScript.math_constrain;
};

let category = {
    name: 'Math',
    colour: COLOUR,
    blocks: [{
        id: 'math_number'
    }, {
        id: 'math_arithmetic'
    }, {
        id: 'math_single'
    }, {
        id: 'math_trig'
    }, {
        id: 'math_constant'
    }, {
        id: 'math_number_property'
    }, {
        id: 'math_round'
    }, {
        id: 'math_modulo'
    }, {
        id: 'math_constrain'
    }, {
        id: 'math_max'
    }, {
        id: 'math_min'
    }, {
        id: 'math_sign'
    }, {
        id: 'math_random'
    }]
};

export default {
    register,
    category
};
