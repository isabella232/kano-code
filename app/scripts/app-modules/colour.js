let colour;

export default colour = {
    name: 'Colour',
    HSVtoRGB (h, s, v) {
        let r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    },
    RGBtoHEX (r, g, b) {
        let hexColor = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).substr(1);
        return '#' + hexColor;
    },
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
        },
        create (type, one, two, three) {
            if (type === 'rgb') {
                let red = Math.round(one * 2.55),
                    green = Math.round(two * 2.55),
                    blue = Math.round(three * 2.55);
                return colour.RGBtoHEX(red, green, blue);
            } else if (type === 'hsv') {
                let hue = one / 100,
                    saturation = two / 100,
                    value = three / 100,
                    rgb = colour.HSVtoRGB(hue, saturation, value);
                return colour.RGBtoHEX(rgb.r, rgb.g, rgb.b);
            }
        }
    },
    lifecycle: {}
};
