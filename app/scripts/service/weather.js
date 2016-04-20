const WEATHER_API_URL = 'api.openweathermap.org/data/2.5/weather';

class Weather {
    constructor (opts) {
        // TODO pick only the relevant keys
        this.opts = opts;
    }
    getBaseUrl () {
        return `${WEATHER_API_URL}?APPID=${this.opts.apiKey}`;
    }
    getTemperature (city) {
        let url = `${this.getBaseUrl()}&q=${city}`;
        return fetch(url)
            .then(r => r.json())
            .then((data) => {
                console.log(data);
            });
    }
}

export default (config) => {
    return new Weather(config);
};
