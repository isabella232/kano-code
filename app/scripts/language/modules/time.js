let timeouts = [],
    intervals = [],
    time;

export default time = {
    methods: {
        setTimeout () {
            let id = setTimeout.apply(window, arguments);
            timeouts.push(id);
        },
        setInterval () {
            let id = setInterval.apply(window, arguments);
            intervals.push(id);
        }
    },
    lifecycle: {
        stop () {
            timeouts.forEach((id) => clearTimeout(id));
            intervals.forEach((id) => clearInterval(id));
        }
    }
};
