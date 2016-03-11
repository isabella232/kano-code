const COLOUR = 204;

let register = (Blockly) => {
    Blockly.Blocks['get_current_conditions'] = {
        init: function () {
            let json = {
                id: 'get_current_conditions',
                colour: COLOUR,
                output: true,
                message0: 'current weather in %1',
                args0: [{
                    type: "input_value",
                    name: "CITY"
                }]
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript['get_current_conditions'] = (block) => {
        let city = Blockly.JavaScript.valueToCode(block, 'CITY'),
            code = `weather.weatherIn(${city})`;
        return [code];
    };

    Blockly.Natural['get_current_conditions'] = (block) => {
        let city = Blockly.Natural.valueToCode(block, 'CITY'),
            code = `current weather in ${city}`;
        return [code];
    };
};

let category = {
    name: 'Weather',
    colour: COLOUR,
    blocks: [{
        id: 'get_current_conditions'
    }]
};

export default {
    register,
    category
};
