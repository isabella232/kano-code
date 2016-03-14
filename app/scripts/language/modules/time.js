let time;

export default time = {
    timeouts: [],
    intervals: [],
    methods: {
        setTimeout () {
            let id = setTimeout.apply(window, arguments);
            time.timeouts.push(id);
        },
        setInterval () {
            let id = setInterval.apply(window, arguments);
            time.intervals.push(id);
        }
    },
    lifecycle: {
        stop () {
            time.timeouts.forEach((id) => clearTimeout(id));
            time.intervals.forEach((id) => clearInterval(id));
        }
    }
};
