let data;

export default data = {
    methods: {
        generateRequest (methodPath, config) {
            let pieces = methodPath.split('.'),
                method = data.methods;
            pieces.forEach((key) => {
                method = method[key];
            });
            return method(config);
        },
        kano: {
            getShares () {
                return fetch('http://api.kano.me/share')
                    .then(r => r.json())
                    .then(data => {
                        return data.entries.map(share => {
                            return {
                                title: share.title,
                                likes: share.likes.length,
                                user: share.user.username,
                                image: share.cover_url
                            };
                        });
                    });
            }
        },
        weather: {
            getWeather (config) {
                return fetch(`http://api.openweathermap.org/data/2.5/weather?APPID=79f483fba81614f1e7d1fea5a28b9750&q=${config.location}&units=${config.units}`)
                    .then((res) => res.json())
                    .then((data) => {
                        return {
                            temperature: data.main.temp,
                            wind_speed: data.wind.speed,
                            wind_angle: data.wind.deg,
                            clouds: data.clouds.all
                        };
                    });
            }
        },
        space: {
            getISSStatus () {
                return fetch('https://api.wheretheiss.at/v1/satellites/25544')
                    .then((res) => res.json());
            }
        },
        list: {
            getData () {
                return Promise.resolve([{
                    title: 'List item 1',
                    content: 'Content 1'
                },{
                    title: 'List item 2',
                    content: 'Content 2'
                },{
                    title: 'List item 3',
                    content: 'Content 3'
                }]);
            }
        }
    },
    lifecycle: {
        stop () {

        }
    }
};
