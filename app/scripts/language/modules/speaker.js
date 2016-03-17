let speaker;

export default speaker = {
    methods: {
        say (text, rate, language) {
            app.tts.speak(text, rate, language);
        }
    },
    lifecycle: {
        stop () {

        }
    }
};
