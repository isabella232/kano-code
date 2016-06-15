let math;

function inclusiveRandom() {
    if (Math.random() === 0) {
        return 1;
    } else {
        return Math.random();
    }
}

export default math = {
    methods: {
        sign: (x) => {
            x = +x; // convert to a number
            if (x === 0 || isNaN(x)) {
                return x;
            }
            return x > 0 ? 1 : -1;
        },

        /* This generator is inclusive the ranges [min, max] */
        random: (min, max, isFloat) => {
            let swap = +min;
            min = +min;
            max = +max;

            if (min > max) {
                min = max;
                max = swap;
            }

            if (isFloat) {
                return inclusiveRandom() * (max - min) + min;
            }

            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
};
