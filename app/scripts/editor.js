import '../lib/legacy.js';
import Blockly from '../lib/blockly/index.js';
import BlocklyAssets from '../lib/blockly/modules/assets.js';
import BlocklyColor from '../lib/blockly/modules/color.js';
import BlocklyControl from '../lib/blockly/modules/control.js';
import BlocklyEvents from '../lib/blockly/modules/events.js';
import BlocklyLists from '../lib/blockly/modules/lists.js';
import BlocklyLogic from '../lib/blockly/modules/logic.js';
import BlocklyMath from '../lib/blockly/modules/math.js';
import BlocklyVariables from '../lib/blockly/modules/variables.js';

window.Kano = window.Kano || {};

window.Kano.Code = window.Kano.Code || {};
window.Kano.Code.Blockly = Blockly;
window.Kano.Code.BlocklyModules = [
    BlocklyEvents,
    BlocklyControl,
    BlocklyLogic,
    BlocklyMath,
    BlocklyVariables,
    BlocklyColor,
    BlocklyLists,
    BlocklyAssets,
];
