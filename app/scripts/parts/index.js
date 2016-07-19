import Part from './part';
import UI from './ui';
import Hardware from './hardware';
import Data from './data';
import Button from './button';
import Box from './box';
import TextInput from './text-input';
import Text from './text';
import Map from './map';
import ISS from './data/space/iss';
import RSS from './data/rss';
import Sports from './data/sports';
import Weather from './data/weather/weather';
import Share from './data/kano/share';
import Image from './image';
import ScrollingText from './scrolling-text';
import Speaker from './speaker';
import Microphone from './microphone';
import LightRectangle from './light-rectangle';
import LightCircle from './light-circle';
import LightFrame from './lightboard/light-frame';
import PictureList from './picture-list';
import Canvas from './canvas/canvas';
import Clock from './clock';
import Kaleidoscope from './kaleidoscope';

let Parts,
    partTypes;

partTypes = {
    'ui': UI,
    'data': Data,
    'hardware': Hardware
};
module.exports = Parts = {
    list: [Button, Box, TextInput, Text, Map, ISS, Weather, Share,
           Image, ScrollingText, RSS, Sports, Speaker, Microphone, Clock,
           Kaleidoscope],
    experiments: {
        'lightboard': [LightRectangle, LightCircle, LightFrame],
        'camera': [PictureList],
        'canvas': [Canvas]
    },
    create (model, size) {
        return new partTypes[model.partType](model, size);
    },
    clear () {
        return Part.clear();
    },
    init (c) {
        let flags = c.getFlags();
        flags.experiments.forEach(exp => {
            if (Parts.experiments[exp]) {
                Parts.list = Parts.list.concat(Parts.experiments[exp]);
            }
        });
        c.addExperiments('parts', Object.keys(Parts.experiments));
    }
};
