let data;

import fetchData from '../../util/fetch-data';
import * as appConfig from '../../config';

export default data = {
    get (id, fetchImpl) {
        let event = new Event('request');
        event.detail = {
            id
        };
        document.dispatchEvent(event);
        return fetchImpl
            .then((r) => {
                let event = new Event('response');
                event.detail = {
                    id,
                    res: r.clone()
                };
                document.dispatchEvent(event);
                return r;
            });
    },
    methods: {
        generateRequest (id, methodPath, config) {
            let pieces = methodPath.split('.'),
                method = data.methods;
            pieces.forEach((key) => {
                method = method[key];
            });
            return method(id, config);
        },
        kano: {
            getShares (id) {
                return data.get(id, fetch(appConfig.API_URL + "/share"))
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
            getWeather (id, config) {
                return data.get(id, fetchData('weather-city',
                                              {q: config.location,
                                               units: config.units}))
                    .then(r => r.json())
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
            getISSStatus (id) {
                return data.get(id, fetchData('iss'))
                    .then(r => r.json());
            }
        },
        list: {
            getData (id) {
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
