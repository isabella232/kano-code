import { EventEmitter } from '@kano/common/index.js';

export class MIDIController {
    constructor() {
        this._controls = new Map();
        this._onDidFindMIDIDevice = new EventEmitter();
        this._onDidReceiveControl = new EventEmitter();
        navigator.requestMIDIAccess()
            .then((access) => {
                const it = access.inputs.values();
                const inst = it.next();
                const input = inst.value;
                this._setDevice(input);
            })
            .catch((e) => {
                console.error(e);
                throw e;
            });
    }
    _setDevice(input) {
        this._input = input;
        this._onDidFindMIDIDevice.fire(input);
        input.onmidimessage = (message) => {
            const [command, note, velocity] = message.data;
            switch (command) {
            case 176: {
                this._controls.set(note, velocity);
                this._onDidReceiveControl.fire({ id: note, value: velocity });
                break;
            }
            default: {
                break;
            }
            }
        };
    }
    get onDidFindMIDIDevice() {
        return this._onDidFindMIDIDevice.event;
    }
    get onDidReceiveControl() {
        return this._onDidReceiveControl.event;
    }
}

export default MIDIController;
