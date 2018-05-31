import UI from './ui.js';
import Data from './data.js';
import Hardware from './hardware.js';

import Box from './parts/box.js';
import Button from './parts/button.js';
import Clock from './parts/clock.js';
import MapPart from './parts/map.js';
import Microphone from './parts/microphone.js';
import Mouse from './parts/mouse.js';
import Oscillator from './parts/oscillator.js';
import PictureList from './parts/picture-list.js';
import ScrollingText from './parts/scrolling-text.js';
import Slider from './parts/slider.js';
import Speaker from './parts/speaker.js';
import Sticker from './parts/sticker.js';
import Synth from './parts/synth.js';
import Terminal from './parts/terminal.js';
import TextInput from './parts/text-input.js';
import Text from './parts/text.js';
import GyroAccelerometer from './parts/powerups/gyro-accelerometer.js';
import MotionSensor from './parts/powerups/motion-sensor.js';
import LightAnimationDisplay from './parts/lightboard/light-animation-display.js';
import LightAnimation from './parts/lightboard/light-animation.js';
import LightCircle from './parts/lightboard/light-circle.js';
import LightFrame from './parts/lightboard/light-frame.js';
import LightRectangle from './parts/lightboard/light-rectangle.js';
import RSS from './parts/data/rss.js';
import Sports from './parts/data/sports.js';
import Share from './parts/data/kano/share.js';
import ISS from './parts/data/space/iss.js';
import Weather from './parts/data/weather/weather.js';

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

export { PartTypes, Parts };