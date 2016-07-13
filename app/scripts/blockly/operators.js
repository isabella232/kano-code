const COLOUR = '#0087ee';

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
        let arg1 = Blockly.JavaScript.valueToCode(block, 'ARG1') || 0,
            arg2 = Blockly.JavaScript.valueToCode(block, 'ARG2') || 0,
            code = `Math.max(${arg1}, ${arg2})`;
        return [code];
    };

    Blockly.Pseudo.math_max = (block) => {
        let arg1 = Blockly.Pseudo.valueToCode(block, 'ARG1') || 0,
            arg2 = Blockly.Pseudo.valueToCode(block, 'ARG2') || 0,
            code = `maximum(${arg1}, ${arg2})`;
        return [code];
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
        let arg1 = Blockly.JavaScript.valueToCode(block, 'ARG1') || 0,
            arg2 = Blockly.JavaScript.valueToCode(block, 'ARG2') || 0,
            code = `Math.min(${arg1}, ${arg2})`;
        return [code];
    };

    Blockly.Pseudo.math_min = (block) => {
        let arg1 = Blockly.Pseudo.valueToCode(block, 'ARG1') || 0,
            arg2 = Blockly.Pseudo.valueToCode(block, 'ARG2') || 0,
            code = `minimum(${arg1}, ${arg2})`;
        return [code];
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
        let arg = Blockly.Pseudo.valueToCode(block, 'ARG'),
            code = `sign(${arg})`;
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
            code = `math.random(${min}, ${max}, ${type === 'float'})`;
        return [code];
    };

    Blockly.Pseudo.math_random = (block) => {
        let min = Blockly.Pseudo.valueToCode(block, 'MIN') || 0,
            max = Blockly.Pseudo.valueToCode(block, 'MAX') || 100,
            code = `random(${min}, ${max})`;
        return [code];
    };

    Blockly.Pseudo.math_single = (block) => {
        // Math operators with single operand.
        let operator = block.getFieldValue('OP'),
            code,
            arg;
        if (operator == 'NEG') {
            // Negation is a special case given its different operator precedence.
            arg = Blockly.Pseudo.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_UNARY_NEGATION) || '0';
            if (arg[0] == '-') {
                // --3 is not legal in JS.
                arg = ' ' + arg;
            }
            code = '-' + arg;
            return [code, Blockly.JavaScript.ORDER_UNARY_NEGATION];
        }
        if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
            arg = Blockly.Pseudo.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_DIVISION) || '0';
        } else {
            arg = Blockly.Pseudo.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_NONE) || '0';
        }
        // First, handle cases which generate values that don't need parentheses
        // wrapping the code.
        switch (operator) {
            case 'ABS':
                code = 'absolute(' + arg + ')';
                break;
            case 'ROOT':
                code = 'squareroot(' + arg + ')';
                break;
            case 'LN':
                code = 'logarithm(' + arg + ')';
                break;
            case 'EXP':
                code = 'exponential(' + arg + ')';
                break;
            case 'POW10':
                code = 'power(10,' + arg + ')';
                break;
            case 'ROUND':
                code = 'round(' + arg + ')';
                break;
            case 'ROUNDUP':
                code = 'ceiling(' + arg + ')';
                break;
            case 'ROUNDDOWN':
                code = 'floor(' + arg + ')';
                break;
            case 'SIN':
                code = 'sine(' + arg + ')';
                break;
            case 'COS':
                code = 'cosine(' + arg + ')';
                break;
            case 'TAN':
                code = 'tangent(' + arg + ')';
                break;
        }
        if (code) {
            return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
        }
        // Second, handle cases which generate values that may need parentheses
        // wrapping the code.
        switch (operator) {
            case 'LOG10':
                code = 'logarithm10(' + arg + ')';
                break;
            case 'ASIN':
                code = 'asine(' + arg + ')';
                break;
            case 'ACOS':
                code = 'acosine(' + arg + ')';
                break;
            case 'ATAN':
                code = 'atangent(' + arg + ')';
                break;
            default:
                throw 'Unknown math operator: ' + operator;
        }
        return [code, Blockly.JavaScript.ORDER_DIVISION];
    };

    Blockly.Pseudo.math_constrain = (block) => {
        // Constrain a number between two limits.
        let argument0 = Blockly.Pseudo.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_COMMA) || '0';
        let argument1 = Blockly.Pseudo.valueToCode(block, 'LOW', Blockly.JavaScript.ORDER_COMMA) || '0';
        let argument2 = Blockly.Pseudo.valueToCode(block, 'HIGH', Blockly.JavaScript.ORDER_COMMA) || 'Infinity';
        let code = `constrain(${argument0}, ${argument1}, ${argument2})`;
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    };

    Blockly.Pseudo.math_constant = (block) => {
        // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
        const CONSTANTS = {
            'PI': ['PI', Blockly.JavaScript.ORDER_MEMBER],
            'E': ['E', Blockly.JavaScript.ORDER_MEMBER],
            'GOLDEN_RATIO': ['GOLDEN_RATIO', Blockly.JavaScript.ORDER_DIVISION],
            'SQRT2': ['SQRT2', Blockly.JavaScript.ORDER_MEMBER],
            'SQRT1_2': ['SQRT1_2', Blockly.JavaScript.ORDER_MEMBER],
            'INFINITY': ['Infinity', Blockly.JavaScript.ORDER_ATOMIC]
        };
        return CONSTANTS[block.getFieldValue('CONSTANT')];
    };

    Blockly.Blocks.unary = {
        init: function () {
            let json = {
                id: 'unary',
                message0: '%1 %2 %3',
                args0: [{
                    type: "field_variable",
                    name: "LEFT_HAND",
                    variable: Blockly.Msg.VARIABLES_DEFAULT_NAME
                },{
                    type: "field_dropdown",
                    name: "OPERATOR",
                    options: [
                        ['+=','+='],
                        ['-=','-='],
                        ['*=','*='],
                        ['/=','/=']
                    ]
                },{
                    type: "input_value",
                    name: "RIGHT_HAND",
                    check: "Number"
                }],
                inputsInline: true,
                previousStatement: null,
                nextStatement: null
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript.unary = (block) => {
        let leftHand = block.getFieldValue('LEFT_HAND'),
            op = block.getFieldValue('OPERATOR') || '+=',
            rightHand = Blockly.JavaScript.valueToCode(block, 'RIGHT_HAND'),
            code = `${leftHand} ${op} ${rightHand};\n`;
        return code;
    };
    Blockly.Pseudo.unary = (block) => {
        let leftHand = block.getFieldValue('LEFT_HAND'),
            op = block.getFieldValue('OPERATOR') || '+=',
            rightHand = Blockly.JavaScript.valueToCode(block, 'RIGHT_HAND'),
            code = `${leftHand} ${op} ${rightHand};\n`;
        return code;
    };

    Blockly.Pseudo.math_arithmetic = Blockly.JavaScript.math_arithmetic;
    Blockly.Pseudo.math_trig = Blockly.Pseudo.math_single;
    Blockly.Pseudo.math_round = Blockly.Pseudo.math_single;
    Blockly.Pseudo.math_number_property = Blockly.JavaScript.math_number_property;
    Blockly.Pseudo.math_modulo = Blockly.JavaScript.math_modulo;
};

let category = {
    name: 'Operators',
    id: 'operators',
    colour: COLOUR,
    blocks: [{
        id: 'math_arithmetic'
    }, {
        id: 'unary',
        shadow: {
            'RIGHT_HAND': '<shadow type="math_number"><field name="NUM">1</field></shadow>'
        }
    }, {
        id: 'text_join'
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
