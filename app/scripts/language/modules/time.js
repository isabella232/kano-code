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
    },
    blocks: [{
        block: {
            id: 'every_x_seconds',
            message0: 'Every %1 seconds',
            args0: [{
                type: "input_value",
                name: "INTERVAL"
            }],
            message1: 'do %1',
            args1: [{
                type: "input_statement",
                name: "DO"
            }],
            previousStatement: null
        },
        javascript: (block) => {
            let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                interval = parseInt(Blockly.JavaScript.valueToCode(block, 'INTERVAL')) || 5,
                code = `time.every(${interval}, function () {
                            ${statement}
                        });\n`;
            return code;
        },
        natural: (block) => {
            let statement = Blockly.Natural.statementToCode(block, 'DO'),
                interval = parseInt(Blockly.Natural.valueToCode(block, 'INTERVAL')) || 5,
                code = `Every ${interval} seconds, do ${statement}`;
            return code;
        }
    },{
        block: {
            id: 'in_x_seconds',
            message0: 'In %1 seconds',
            args0: [{
                type: "input_value",
                name: "INTERVAL"
            }],
            message1: 'do %1',
            args1: [{
                type: "input_statement",
                name: "DO"
            }],
            previousStatement: null
        },
        javascript: (block) => {
            let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                delay = parseInt(Blockly.JavaScript.valueToCode(block, 'DELAY')) || 5,
                code = `time.later(${delay}, function () {
                            ${statement}
                        })`;
            return code;
        },
        natural: (block) => {
            let statement = Blockly.Natural.statementToCode(block, 'DO'),
                delay = parseInt(Blockly.Natural.valueToCode(block, 'DELAY')) || 5,
                code = `${delay} seconds later, do ${statement}`;
            return code;
        }
    }]
};
