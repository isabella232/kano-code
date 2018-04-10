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

import AppModules from '../lib/app-modules/app-modules.js';
import AppModule from '../lib/app-modules/app-module.js';
import AssetsModule from '../lib/app-modules/assets.js';
import CameraModule from '../lib/app-modules/camera.js';
import GlobalModule from '../lib/app-modules/global.js';
import ColourModule from '../lib/app-modules/colour.js';
import DataModule from '../lib/app-modules/data.js';
import DateModule from '../lib/app-modules/date.js';
import LightboardModule from '../lib/app-modules/lightboard.js';
import LoopModule from '../lib/app-modules/loop.js';
import LoopsModule from '../lib/app-modules/loops.js';
import MathModule from '../lib/app-modules/math.js';
import MicModule from '../lib/app-modules/mic.js';
import PartsModule from '../lib/app-modules/parts.js';
import TiltModule from '../lib/app-modules/tilt.js';
import MotionModule from '../lib/app-modules/motion.js';
import TimeModule from '../lib/app-modules/time.js';

window.Kano = window.Kano || {};

window.Kano.AppModules = AppModules;
window.Kano.AppModules.AppModule = AppModule;
window.Kano.Code.AppModules = [
    AssetsModule,
    CameraModule,
    GlobalModule,
    ColourModule,
    DataModule,
    DateModule,
    LightboardModule,
    LoopModule,
    LoopsModule,
    MathModule,
    MicModule,
    PartsModule,
    TiltModule,
    MotionModule,
    TimeModule,
];

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
