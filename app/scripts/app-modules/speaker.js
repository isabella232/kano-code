import TextToSpeech from './service/text-to-speech';

let speaker;

export default speaker = {
    sources: [],
    samples: {},
    say (text, rate, language) {
        speaker.tts.speak(text, rate, language);
    },
    createSource (buffer) {
        let source = speaker.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(speaker.ctx.destination);
        speaker.sources.push(source);
        return source;
    },
    loadSample (name) {
        if (speaker.samples[name]) {
            return Promise.resolve(speaker.samples[name]);
        } else {
            return fetch(`/assets/audio/samples/${name}.wav`)
                .then(res => res.arrayBuffer())
                .then(data => {
                    return new Promise((resolve, reject) => {
                        speaker.ctx.decodeAudioData(data, (buffer) => {
                            speaker.samples[name] = buffer;
                            return resolve(buffer);
                        });
                    });
                });
        }
    },
    methods: {
        say (text, rate, language) {
            if (typeof text.subscribe === 'function') {
                return text.subscribe((result) => {
                    speaker.say(result, rate, language);
                });
            }
            speaker.say(text, rate, language);
        },
        play (sample) {
            speaker.loadSample(sample)
                .then(buffer => {
                    let source = speaker.createSource(buffer);
                    source.start(speaker.ctx.currentTime);
                });
        },
        loop (sample) {
            speaker.loadSample(sample)
                .then(buffer => {
                    let source = speaker.createSource(buffer);
                    source.loop = true;
                    source.start(speaker.ctx.currentTime);
                });
        },
        stop () {
            speaker.lifecycle.stop();
        }
    },
    lifecycle: {
        stop () {
            if (speaker.tts) {
                speaker.tts.stop();
            }
            speaker.sources.forEach(source => source.stop());
            speaker.sources = [];
        }
    },
    config (opts) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        speaker.tts = TextToSpeech(opts);
        speaker.ctx = new AudioContext();
    }
};
