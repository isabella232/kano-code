import { IVisualsContext, IAudioContext, IDOMContext, IStickerContext } from '../app/lib/output/output.js';
import { Microphone } from '../app/lib/output/microphone.js';
import { IEvent } from '@kano/common/index.js';

function stub(target : any, key : string, descriptor : any) {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
        this[key].calls = this[key].calls || [];
        this[key].calls.push(arguments);
        return originalMethod.apply(this, arguments);
    };
    return descriptor;
}

class AudioNodeStub {
    @stub
    connect(node : AudioNodeStub) {}
}

class AudioGainNodeStub extends AudioNodeStub {
    public gain : { value : number } = { value: 1 }
}

class AudioContextStub {
    public destination : AudioNodeStub = new AudioNodeStub();
    @stub
    createGain() {
        return new AudioGainNodeStub();
    }
}

export class PartContextStub {
    public visuals : IVisualsContext;
    public audio : IAudioContext;
    public dom : IDOMContext;
    public stickers : IStickerContext;
    constructor() {
        this.visuals = {
            get canvas() {
                return document.createElement('canvas');
            },
            get width() {
                return 0;
            },
            get height() {
                return 0;
            }
        };
        const audioCtx = new AudioContextStub() as unknown as AudioContext;
        this.audio = {
             context: audioCtx,
             destination: audioCtx.destination,
             microphone: new Microphone(audioCtx),
        };
        this.dom = {
            root: document.createElement('div'),
            onDidResize: (() => {}) as unknown as IEvent<void>,
        };
        this.stickers = {
            default: 'cat',
            set: [['Animals', 'animals'], ['Faces', 'faces']]
        }
    }
    wasCalled(stub : any, args? : any[]) : boolean {
        const calls = this.getCalls(stub);
        const [call] = calls;
        if (!call) {
            return false;
        }
        if (args) {
            for (let i = 0; i < args.length; i += 1) {
                if (args[i] !== call[i]) {
                    return false;
                }
            }
        }
        return calls && calls.length !== 0;
    }
    getCalls(stub : any) {
        return stub.calls;
    }
}