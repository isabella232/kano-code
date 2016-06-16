let data;

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
