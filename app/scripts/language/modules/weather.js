let weather;

export default weather = {
    methods: {
        weatherIn (city) {
            let queryBegin = `select item.condition, wind, astronomy from weather.forecast where woeid in (select woeid from geo.places(1) where text="`,
                queryEnd = `")`,
                query = `${encodeURIComponent(queryBegin)}'+${city}+'${encodeURIComponent(queryEnd)}`,
                env = `store://datatables.org/alltableswithkeys`,
                url = `https://query.yahooapis.com/v1/public/yql?q=${query}&format=json&env=${encodeURIComponent(env)}`;
            return fetch(url)
                        .then((res) => res.json())
                        .then((page) => {
                            let condition = page.query.results.channel.item.condition,
                                wind = page.query.results.channel.wind,
                                astronomy = page.query.results.channel.astronomy;
                            delete condition.code;
                            delete condition.date;
                            return {
                                condition,
                                wind,
                                astronomy
                            };
                        });
        }
    },
    lifecycle: {
        stop () {

        }
    }
};
