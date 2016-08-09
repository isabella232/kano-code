let math;

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
        random: (min, max) => {
            let swap = +min;
            min = +min;
            max = +max;

            if (min > max) {
                min = max;
                max = swap;
            }

            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
};
