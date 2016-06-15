let time;

export default time = {
    name: 'Time',
    colour: '#2196F3',
    timeouts: [],
    intervals: [],
    frames: [],
    methods: {
        later (delay, callback) {
            let id = setTimeout(callback, Math.max(1, delay) * 1000);
            time.timeouts.push(id);
        },
        every (interval, unit, callback) {
            if (unit === 'frames') {
                let id,
                    counter = 0,
                    oldIdIndex,
                    func;
                // Round and min to 1
                interval = Math.max(1, Math.round(interval));
                func = () => {
                    // Only execute the callback on the right frames
                    if (counter % interval === 0) {
                        callback();
                    }
                    counter++;
                    // Update the id, so that we can cancel the frame at any time
                    id = requestAnimationFrame(func);
                    oldIdIndex = time.frames.indexOf(id);
                    if (time.frames[oldIdIndex]) {
                        time.frames[oldIdIndex] = id;
                    } else {
                        time.frames.push(id);
                    }
                };
                func();
            } else {
                // Round and min to 1
                interval = unit === 'milliseconds' ? interval : interval * 1000;
                interval = Math.max(1, Math.round(interval));
                let id = setInterval(callback, interval);
                time.intervals.push(id);
            }
        }
    },
    lifecycle: {
        stop () {
            time.timeouts.forEach((id) => clearTimeout(id));
            time.intervals.forEach((id) => clearInterval(id));
            time.frames.forEach((id) => cancelAnimationFrame(id));
        }
    }
};
