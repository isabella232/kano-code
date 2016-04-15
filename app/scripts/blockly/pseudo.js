/**
 * Registers a new language generator for blockly
 * This language is the natural representation of the code
 */
let register = (Blockly) => {
    Blockly.Pseudo = new Blockly.Generator('Pseudo');
    Blockly.Pseudo.init = () => {
        // Create a dictionary of definitions to be printed before the code.
        Blockly.Pseudo.definitions_ = Object.create(null);
        // Create a dictionary mapping desired function names in definitions_
        // to actual function names (to avoid collisions with user functions).
        Blockly.Pseudo.functionNames_ = Object.create(null);

        if (!Blockly.Pseudo.variableDB_) {
          Blockly.Pseudo.variableDB_ =
              new Blockly.Names();
        } else {
          Blockly.Pseudo.variableDB_.reset();
        }

    };
    Blockly.Pseudo.scrub_ = (block, code) => {
        let nextBlock = block.nextConnection && block.nextConnection.targetBlock();
        let nextCode = Blockly.Pseudo.blockToCode(nextBlock);
        return code + nextCode;
    };
    Blockly.Pseudo.finish = (a) => {
        if (a.replace) {
            //a = a.replace(/ +/g, ' ');
        }
        return a;
    };

    Blockly.Pseudo['math_number'] = function (block) {
        return [block.getFieldValue('NUM')];
    };
    Blockly.Pseudo['text'] = function (block) {
        return [`'${block.getFieldValue('TEXT')}'`];
    };
    Blockly.Pseudo['text_join'] = function (block) {
        let code = new Array(block.itemCount_);
        for (var n = 0; n < block.itemCount_; n++) {
          code[n] = Blockly.Pseudo.valueToCode(block, 'ADD' + n) || '';
        }
        code = code.join(' + ');
        return [code];
    };
    Blockly.Pseudo['variables_get'] = function(block) {
      // Variable getter.
      var code = Blockly.Pseudo.variableDB_.getName(block.getFieldValue('VAR'),
          Blockly.Variables.NAME_TYPE);
      return [code];
    };

    Blockly.Pseudo['variables_set'] = function(block) {
      // Variable setter.
      var argument0 = Blockly.Pseudo.valueToCode(block, 'VALUE') || '0';
      var varName = Blockly.Pseudo.variableDB_.getName(
          block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
      return `${varName} = ${argument0};\n`;
    };
    Blockly.Pseudo.controls_if = Blockly.JavaScript.controls_if;
    Blockly.Pseudo.logic_compare = Blockly.JavaScript.logic_compare;
    Blockly.Pseudo.logic_operation = Blockly.JavaScript.logic_operation;
    Blockly.Pseudo.logic_negate = Blockly.JavaScript.logic_negate;
    Blockly.Pseudo.logic_boolean = Blockly.JavaScript.logic_boolean;
    Blockly.Pseudo.logic_null = Blockly.JavaScript.logic_null;
    Blockly.Pseudo.logic_ternary = Blockly.JavaScript.logic_ternary;
};

export default {
    register
};
