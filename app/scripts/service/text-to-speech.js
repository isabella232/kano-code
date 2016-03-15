/*
 * Speech synthesis service
 *
 *   Detects the capabilities of the client and choses the most suitable
 *   backend for text to speech synthesis.
 *
 */

class TextToSpeech {
    constructor() {
        this.backend = this.remote;
    }

    configure(config) {
        this.config = config;

        if (config.DEPLOY && config.DEPLOY == 'rpi') {
            this.backend = this.rpi;
        } else if (window && 'speechSynthesis' in window) {
            this.backend = this.browser;
        }

        return this;
    }

    speak(text, pitch=1, rate=1, language='en_GB') {
        this.backend(text, pitch, rate, language);
    }

    rpi(text, pitch, rate, language) {
        let opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                pitch: pitch,
                rate: rate,
                language: language,
            })
        };

        fetch(`${this.config.API_URL}/speak`, opts)
            .then(function (res) {
                if (!res.ok) {
                    console.log("Text-to-speech backend failed.");
                }
            }).catch(function (e) {
                console.log(`Text-to-speech FAILED: ${e}`);
            });
    }

    browser(text) {
        let msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    }

    remote(text) {

    }
}

let tts = new TextToSpeech();

export default function (config) {
    return tts.configure(config);
};
