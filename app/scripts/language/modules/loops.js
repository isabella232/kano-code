let loop;

export default loop = {
    name: "Loop",
    colour: '#3d3d7f',
    intervals: [],
    methods: {
        forever (callback) {
            //push the next tick to the end of the events queue
            let id = setInterval(callback, 10);
            loop.intervals.push(id);
        }
    },

    lifecycle: {
        stop () {
            loop.intervals.forEach((id) => clearInterval(id));
        }
    }

};
