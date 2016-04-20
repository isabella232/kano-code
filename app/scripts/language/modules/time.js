let time;

export default time = {
    name: 'Time',
    colour: '#2196F3',
    timeouts: [],
    intervals: [],
    methods: {
        later (delay, callback) {
            let id = setTimeout(callback, Math.max(1, delay) * 1000);
            time.timeouts.push(id);
        },
        every (interval, callback) {
            let id = setInterval(callback, Math.max(1, interval) * 1000);
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
