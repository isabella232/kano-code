import '../lib/legacy.js';

import LocalStoragePlugin from '../lib/storage/local-storage.js';

import Blockly from '../lib/blockly/index.js';
import BlocklyAssets from '../lib/meta-api/modules/assets.js';
import BlocklyColor from '../lib/meta-api/modules/color.js';
import BlocklyControl from '../lib/meta-api/modules/control.js';
import BlocklyEvents from '../lib/meta-api/modules/events.js';
import BlocklyLists from '../lib/meta-api/modules/lists.js';
import BlocklyLogic from '../lib/meta-api/modules/logic.js';
import BlocklyMath from '../lib/meta-api/modules/math.js';
import BlocklyVariables from '../lib/meta-api/modules/variables.js';

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

import UI from '../lib/parts/ui.js';
import Data from '../lib/parts/data.js';
import Hardware from '../lib/parts/hardware.js';

import general from '../lib/parts/parts/canvas/blocks/general.js';
import paths from '../lib/parts/parts/canvas/blocks/paths.js';
import setters from '../lib/parts/parts/canvas/blocks/setters.js';
import shapes from '../lib/parts/parts/canvas/blocks/shapes.js';
import space from '../lib/parts/parts/canvas/blocks/space.js';

import Box from '../lib/parts/parts/box.js';
import Button from '../lib/parts/parts/button.js';
import Clock from '../lib/parts/parts/clock.js';
import MapPart from '../lib/parts/parts/map.js';
import Microphone from '../lib/parts/parts/microphone.js';
import Mouse from '../lib/parts/parts/mouse.js';
import Oscillator from '../lib/parts/parts/oscillator.js';
import PictureList from '../lib/parts/parts/picture-list.js';
import ScrollingText from '../lib/parts/parts/scrolling-text.js';
import Slider from '../lib/parts/parts/slider.js';
import Speaker from '../lib/parts/parts/speaker.js';
import Sticker from '../lib/parts/parts/sticker.js';
import Synth from '../lib/parts/parts/synth.js';
import Terminal from '../lib/parts/parts/terminal.js';
import TextInput from '../lib/parts/parts/text-input.js';
import Text from '../lib/parts/parts/text.js';
import GyroAccelerometer from '../lib/parts/parts/powerups/gyro-accelerometer.js';
import MotionSensor from '../lib/parts/parts/powerups/motion-sensor.js';
import LightAnimationDisplay from '../lib/parts/parts/lightboard/light-animation-display.js';
import LightAnimation from '../lib/parts/parts/lightboard/light-animation.js';
import LightCircle from '../lib/parts/parts/lightboard/light-circle.js';
import LightFrame from '../lib/parts/parts/lightboard/light-frame.js';
import LightRectangle from '../lib/parts/parts/lightboard/light-rectangle.js';
import RSS from '../lib/parts/parts/data/rss.js';
import Sports from '../lib/parts/parts/data/sports.js';
import Share from '../lib/parts/parts/data/kano/share.js';
import ISS from '../lib/parts/parts/data/space/iss.js';
import Weather from '../lib/parts/parts/data/weather/weather.js';

const PartTypes = [UI, Data, Hardware];
const Parts = [
    Box,
    Button,
    Clock,
    MapPart,
    Microphone,
    Mouse,
    Oscillator,
    PictureList,
    ScrollingText,
    Slider,
    Speaker,
    Sticker,
    Synth,
    Terminal,
    TextInput,
    Text,
    GyroAccelerometer,
    MotionSensor,
    LightAnimationDisplay,
    LightAnimation,
    LightCircle,
    LightFrame,
    LightRectangle,
    RSS,
    Sports,
    Share,
    ISS,
    Weather,
];

const Canvas = {
    general,
    paths,
    setters,
    shapes,
    space,
};

const Legacy = { PartTypes, Parts, Canvas };

window.Kano.Code.Legacy = Legacy;
window.Kano.Code.LocalStoragePlugin = LocalStoragePlugin;

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
