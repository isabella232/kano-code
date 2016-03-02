const COLOUR = 204;

let register = (Blockly) => {
    Blockly.Blocks['get_current_conditions'] = {
        init: function () {
            let json = {
                id: 'get_current_conditions',
                colour: COLOUR,
                message0: 'get the current weather in %1 store it, then',
                args0: [{
                    type: "input_value",
                    name: "CITY"
                }],
                message1: '%1',
                args1: [{
                    type: "input_statement",
                    name: "DO"
                }],
                previousStatement: null
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript['get_current_conditions'] = (block) => {
        let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
            city = Blockly.JavaScript.valueToCode(block, 'CITY'),
            queryBegin = `select item.condition.text from weather.forecast where woeid in (select woeid from geo.places(1) where text="`,
            queryEnd = `")`,
            query = `${encodeURIComponent(queryBegin)}'+${city}+'${encodeURIComponent(queryEnd)}`,
            env = `store://datatables.org/alltableswithkeys`,
            url = `https://query.yahooapis.com/v1/public/yql?q=${query}&format=json&env=${encodeURIComponent(env)}`,
            code = `fetch('${url}')
                        .then((res) => res.json())
                        .then((j) => j.query.results.channel.item.condition.text)
                        .then((src) => {
                            window.currentWeatherConditions = src;
                            ${statement}
                        });`;
        return code;
    };

    Blockly.Natural['get_current_conditions'] = (block) => {
        let statement = Blockly.Natural.statementToCode(block, 'DO'),
            city = Blockly.Natural.valueToCode(block, 'CITY'),
            code = `Get the current weather in ${city} and store it, then ${statement}`;
        return code;
    };


    Blockly.Blocks['get_stored_weather'] = {
        init: function () {
            let json = {
                id: 'get_last_weather',
                output: true,
                colour: COLOUR,
                message0: 'stored weather'
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript['get_stored_weather'] = (block) => {
        let code = `window.currentWeatherConditions`;
        return [code];
    };

    Blockly.Natural['get_stored_weather'] = (block) => {
        let code = `stored weather`;
        return [code];
    };
};

let category = {
    name: 'Weather',
    colour: COLOUR,
    blocks: [{
        id: 'get_current_conditions'
    },
    {
        id: 'get_stored_weather'
    }]
};

export default {
    register,
    category
};
