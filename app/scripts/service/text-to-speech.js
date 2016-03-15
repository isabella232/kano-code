/*
 * Speech synthesis service
 *
 *   Detects the capabilities of the client and choses the most suitable
 *   backend for text to speech synthesis.
 *
 */

class TextToSpeech {
    speak(text) {
        let msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    }
}

let tts = new TextToSpeech();
export default tts;
