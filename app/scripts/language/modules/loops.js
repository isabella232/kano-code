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
    },

    blocks: [{
        block: {
            id: 'loop_forever',
            message0: 'Repeat %1 %2',
            args0: [
            {
                type: "input_dummy"
            },
            {
                type: "input_statement",
                name: "DO"
            }],
            message1: 'forever',

            previousStatement: null
        },
        javascript: (block) => {
            let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                interval = parseInt(Blockly.JavaScript.valueToCode(block, 'INTERVAL')) || 5,
                code = `loop.forever(function () {
                            ${statement}
                        });\n`;
            return code;
        },
        natural: (block) => {
            let statement = Blockly.Natural.statementToCode(block, 'DO'),
                interval = parseInt(Blockly.Natural.valueToCode(block, 'INTERVAL')) || 5,
                code = `Do forever ${statement}`;
            return code;
        }
    }]

};
