let colour;

export default colour = {
    name: 'Colour',
    methods: {
        random () {
            let num = Math.floor(Math.random() * Math.pow(2, 24));
            return `#${('00000' + num.toString(16)).substr(-6)}`;
        }
    },
    lifecycle: {}
};
