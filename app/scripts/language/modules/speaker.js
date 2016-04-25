import TextToSpeech from '../../service/text-to-speech';

let speaker;

export default speaker = {
    say (text, rate, language) {
        speaker.tts.speak(text, rate, language);
    },
    methods: {
        say (text, rate, language) {
            if (typeof text.subscribe === 'function') {
                return text.subscribe((result) => {
                    speaker.say(result, rate, language);
                });
            }
            speaker.say(text, rate, language);
        }
    },
    lifecycle: {
        stop () {

        }
    },
    config (opts) {
        speaker.tts = TextToSpeech(opts);
    }
};
