let timeouts = [],
    time;

export default time = {
    methods: {
        setTimeout (cb, duration) {
            let id = setTimeout.apply(window, arguments);
            timeouts.push(id);
        }
    },
    lifecycle: {
        stop () {
            timeouts.forEach((to) => clearTimeout(to));
        }
    }
};
