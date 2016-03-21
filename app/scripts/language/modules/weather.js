import ObservableProducer from '../observable-producer';
let weather;

export default weather = {
    name: 'Weather',
    colour: '#cddc39',
    observableProducer: new ObservableProducer(),
    WEATHER_API_URL: 'http://api.openweathermap.org/data/2.5/weather',
    getBaseUrl () {
        return `${this.WEATHER_API_URL}?APPID=${this.WEATHER_API_KEY}`;
    },
    getTemperature (city) {
        let url = `${this.getBaseUrl()}&q=${city}`;
        return fetch(url)
            .then(r => r.json())
            .then((data) => {
                return data.main.temp;
            });
    },
    config (opts) {
        this.WEATHER_API_KEY = opts.WEATHER_API_KEY;
    },
    methods: {
        getTemperature () {
            let obs = weather.observableProducer
                .createObservable(weather.getTemperature.bind(weather), arguments);
            return obs;
        },
        refresh () {
            weather.observableProducer.refresh();
        }
    },
    lifecycle: {
        stop () {
            weather.observableProducer.clear();
        }
    },
    blocks: [{
        block: {
            id: 'get_temperature',
            output: true,
            message0: 'temperature in %1',
            args0: [{
                type: "input_value",
                name: "CITY"
            }]
        },
        javascript: (block) => {
            let city = Blockly.JavaScript.valueToCode(block, 'CITY'),
                code = `weather.getTemperature(${city})`;
            return [code];
        },
        natural: (block) => {
            let city = Blockly.Natural.valueToCode(block, 'CITY'),
                code = `temperature in ${city}`;
            return [code];
        }
    },{
        block: {
            id: 'refresh_weather',
            message0: 'refresh weather',
            previousStatement: null,
            nextStatement: null
        },
        javascript: () => {
            let code = `weather.refresh()`;
            return code;
        },
        natural: () => {
            let code = `refresh weather`;
            return code;
        }
    }]
};
