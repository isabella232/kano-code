let colour;

export default colour = {
    name: 'Colour',
    methods: {
        random () {
            let num = Math.floor(Math.random() * Math.pow(2, 24));
            return `#${('00000' + num.toString(16)).substr(-6)}`;
        },
        luminance (hex, lum) {
            var rgb = "#", c, i;
            // validate hex string
            hex = String(hex).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            lum = lum || 0;

            // convert to decimal and change luminosity
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i * 2, 2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00" + c).substr(c.length);
            }

            return rgb;
        }
    },
    lifecycle: {}
};
