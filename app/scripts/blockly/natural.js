/**
 * Registers a new language generator for blockly
 * This language is the natural representation of the code
 */
let register = (Blockly) => {
    Blockly.Natural = new Blockly.Generator('Natural');
    Blockly.Natural.init = () => {
        // Create a dictionary of definitions to be printed before the code.
        Blockly.Natural.definitions_ = Object.create(null);
        // Create a dictionary mapping desired function names in definitions_
        // to actual function names (to avoid collisions with user functions).
        Blockly.Natural.functionNames_ = Object.create(null);

        if (!Blockly.Natural.variableDB_) {
          Blockly.Natural.variableDB_ =
              new Blockly.Names();
        } else {
          Blockly.Natural.variableDB_.reset();
        }

    };
    Blockly.Natural.scrub_ = (block, code) => {
        let nextBlock = block.nextConnection && block.nextConnection.targetBlock();
        let nextCode = Blockly.Natural.blockToCode(nextBlock);
        return code + nextCode;
    };
    Blockly.Natural.finish = (a) => {
        if (a.replace) {
            a = a.replace(/\s+/g, ' ');
        }
        return a;
    };

    Blockly.Natural['math_number'] = function (block) {
        return [block.getFieldValue('NUM')];
    };
    Blockly.Natural['text'] = function (block) {
        return [block.getFieldValue('TEXT')];
    };
    Blockly.Natural['text_join'] = function (block) {
        let code = new Array(block.itemCount_);
        for (var n = 0; n < block.itemCount_; n++) {
          code[n] = Blockly.Natural.valueToCode(block, 'ADD' + n) || '';
        }
        code = code.join(' ');
        return [code];
    };
    Blockly.Natural['variables_get'] = function(block) {
      // Variable getter.
      var code = Blockly.Natural.variableDB_.getName(block.getFieldValue('VAR'),
          Blockly.Variables.NAME_TYPE);
      return [code];
    };

    Blockly.Natural['variables_set'] = function(block) {
      // Variable setter.
      var argument0 = Blockly.Natural.valueToCode(block, 'VALUE') || '0';
      var varName = Blockly.Natural.variableDB_.getName(
          block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
      return `set variable ${varName} to ${argument0}`;
    };
};

export default {
    register
};
