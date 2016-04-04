import Part from './part';
import UI from './ui';
import Data from './data';
import Button from './button';
import Frame from './frame';
import TextInput from './text-input';
import Label from './label';
import Map from './map';
import ISS from './data/space/iss';
import Weather from './data/weather/weather';
import List from './data/list/list';
import Share from './data/kano/share';

let part,
    partTypes;

export default part = [Button, Frame, TextInput, Label, Map, ISS, Weather, Share];

partTypes = {
    'ui': UI,
    'data': Data
};

window.Part = {
    create (model, size) {
        return new partTypes[model.partType](model, size);
    },
    clear () {
        return Part.clear();
    }
};
