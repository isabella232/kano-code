let time;

export default time = {
    name: 'Time',
    colour: '#2196F3',
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
                code = `time.setInterval(function () {
                            ${statement}
                        }, ${interval} * 1000)\n`;
            return code;
        },
        natural: (block) => {
            let statement = Blockly.Natural.statementToCode(block, 'DO'),
                interval = parseInt(Blockly.Natural.valueToCode(block, 'INTERVAL')) || 5,
                code = `Every ${interval} seconds, ${statement} do`;
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
                code = `time.setTimeout(function () {
                            ${statement}
                        }, ${delay} * 1000)`;
            return code;
        },
        natural: (block) => {
            let statement = Blockly.Natural.statementToCode(block, 'DO'),
                delay = parseInt(Blockly.Natural.valueToCode(block, 'DELAY')) || 5,
                code = `${delay} seconds later, ${statement} do`;
            return code;
        }
    }]
};
