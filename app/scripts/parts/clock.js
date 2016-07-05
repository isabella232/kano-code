let clock;

export default clock = {
    partType: 'data',
    type: 'clock',
    label: 'Clock',
    image: '',
    component: 'kano-part-clock',
    excludeBlocks: ['refresh'],
    method: 'clock.noop',
    configPanel: 'disabled',
    blocks: [{
        block: () => {
            return {
                id: 'get_time',
                message0: 'Clock: current %1',
                output: true,
                args0: [{
                    type: "field_dropdown",
                    name: "FIELD",
                    options: [
                        [
                            "Year",
                            "year"
                        ],
                        [
                            "Month",
                            "month"
                        ],
                        [
                            "Day",
                            "day"
                        ],
                        [
                            "Hour",
                            "hour"
                        ],
                        [
                            "Minute",
                            "minute"
                        ],
                        [
                            "Seconds",
                            "seconds"
                        ]
                    ]
                }]
            };
        },
        javascript: () => {
            return (block) => {
                let field = block.getFieldValue('FIELD'),
                    code = `date.getCurrent().${field}`;
                return [code];
            };
        },
        pseudo: () => {
            return (block) => {
                let field = block.getFieldValue('FIELD'),
                    code = `date.getCurrent().${field}`;
                return [code];
            };
        }
    }]
};
