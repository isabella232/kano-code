let data,
    emojiMap = {};


emojiMap['01d'] = '\u2600\uFE0F';
emojiMap['02d'] = '\uD83C\uDF24';
emojiMap['03d'] = '\uD83C\uDF25';
emojiMap['04d'] = '\u2601\uFE0F';
emojiMap['09d'] = '\uD83C\uDF27';
emojiMap['10d'] = '\uD83C\uDF26';
emojiMap['11d'] = '\u26C8 ';
emojiMap['13d'] = '\uD83C\uDF28';
emojiMap['50d'] = '\uD83C\uDF2B';

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
    /**
     * A wrapper around the fetch API for our data proxy.
     */
    fetchData (srcId, queryParams) {
        let baseUrl = data.DATA_API_URL + '/data-src/' + srcId + '/',
            queryString = '';

        if (queryParams) {
            queryString = Object.keys(queryParams).reduce((prev, key) => {
                let pair = key + "=" + encodeURIComponent(queryParams[key]);

                if (prev.length) {
                    prev += '&';
                } else {
                    prev += '?';
                }

                return prev + pair;
            }, '');
        }

        return fetch(baseUrl + queryString)
            .then((r) => {
                return r.json().then((data) => {
                    let s,
                        init = {"status" : r.status, "statusText" : r.statusText};

                    if (data.success) {
                        s = JSON.stringify(data.value);
                    } else {
                        console.error('Failed to retrieve data');
                        s = '{}';
                    }

                    return new Response(s, init);
                });
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
                return data.get(id, fetch(data.API_URL + "/share"))
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
                return data.get(id, data.fetchData('weather-city',
                                              {q: config.location,
                                               units: config.units}))
                    .then(r => r.json())
                    .then((data) => {
                        let icon = data.weather[0] ? data.weather[0].icon : '01d';
                        // Force daily emojis
                        icon = icon.replace('n', 'd');
                        return {
                            temperature: data.main.temp,
                            wind_speed: data.wind.speed,
                            wind_angle: data.wind.deg,
                            clouds: data.clouds.all,
                            emoji: emojiMap[icon] || '\u2600\uFE0F'
                        };
                    });
            }
        },
        space: {
            getISSStatus (id) {
                return data.get(id, data.fetchData('iss'))
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
        },
        rss: {
            getFeed (id, config) {
                return data.get(id, data.fetchData('rss',
                                              { src: config.src }))
                    .then(r => r.json())
                    .then((data) => {
                        return data.slice(0, 10);
                    });
            }
        },
        sports: {
            getResults (id, config) {
                return data.get(id, data.fetchData('rss-sports',
                                              { src: config.src }))
                    .then(r => r.json())
                    .then((data) => {
                        return data.slice(0, 10);
                    });
            }
        },
        clock: {
            noop (id, config) {
                return Promise.resolve();
            }
        }
    },
    lifecycle: {
        stop () {

        }
    },
    config (c) {
        data.API_URL = c.API_URL;
        data.DATA_API_URL = c.DATA_API_URL;
    }
};
