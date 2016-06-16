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
import PictureList from './picture-list';

let Parts,
    partTypes;

partTypes = {
    'ui': UI,
    'data': Data,
    'hardware': Hardware
};
module.exports = Parts = {
    list: [Button, Box, TextInput, Text, Map, ISS, Weather, Share,
           Image, ScrollingText, RSS, Sports, Speaker, Microphone,
           LightRectangle, LightCircle, PictureList],
    create (model, size) {
        return new partTypes[model.partType](model, size);
    },
    clear () {
        return Part.clear();
    }
};
