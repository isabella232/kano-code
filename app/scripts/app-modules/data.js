const THROTTLE_DELAY = 1000;

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
    cache: {},
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
    buildUrl (srcId, queryParams) {
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

        return baseUrl + queryString;
    },
    /**
     * A wrapper around the fetch API for our data proxy.
     */
    fetchData (url) {
        let currentDate = Date.now();

        // The responses are caches with a timestamp of the request, the cached response is returned
        // if the THROTTLE_DELAY time hasn't passed between the previous call and this one
        if (!data.cache[url] || currentDate - data.cache[url].timestamp > THROTTLE_DELAY) {
            let promise = fetch(url)
                .then((r) => {
                    return r.json().then((d) => {
                        let s,
                            init = {"status" : r.status, "statusText" : r.statusText},
                            response;

                        if (d.success) {
                            s = JSON.stringify(d.value);
                        } else {
                            console.error('Failed to retrieve data');
                            s = '{}';
                        }

                        response = new Response(s, init);

                        data.cache[url].response = response.clone();

                        return response;
                    });
                });
            data.cache[url] = {
                timestamp: currentDate,
                finished: promise
            };
            return promise;
        } else {
            if (data.cache[url].response) {
                // Returns a cloned version of the response
                return Promise.resolve(data.cache[url].response.clone());
            } else {
                // Wait for the request to finish before returning the response
                return data.cache[url].finished.then(() => {
                    return data.cache[url].response.clone()
                });
            }
        }
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
                return data.get(id, data.fetchData(data.API_URL + "/share"))
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
                let body = {
                    q: config.location,
                    units: config.units
                },
                    url = data.buildUrl('weather-city', body);
                return data.get(id, data.fetchData(url))
                    .then(r => r.json())
                    .then((data) => {
                        let weather = data.weather[0],
                            icon = weather ? weather.icon : '01d';
                        // Force daily emojis
                        icon = icon.replace('n', 'd');
                        return {
                            temperature: data.main.temp,
                            wind_speed: data.wind.speed,
                            wind_angle: data.wind.deg,
                            clouds: data.clouds.all,
                            emoji: emojiMap[icon] || '\u2600\uFE0F',
                            isSunny: (weather.id === 800),
                            isRainy: (weather.id >= 500 && weather.id < 600),
                            isSnowy: (weather.id >= 600 && weather.id < 700),
                            isCloudy: (weather.id >= 801 && weather.id < 900)
                        };
                    });
            },
            is (status, data) {
                switch (status) {
                    case 'sunny': {
                        return data.isSunny;
                    }
                    case 'rainy': {
                        return data.isRainy;
                    }
                    case 'snowy': {
                        return data.isSnowy;
                    }
                    case 'cloudy': {
                        return data.isCloudy;
                    }
                }
            }
        },
        space: {
            getISSStatus (id) {
                return data.get(id, data.fetchData(data.buildUrl('iss')))
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
                let body = { src: config.src },
                    url = data.buildUrl('rss', body);
                return data.get(id, data.fetchData(url))
                    .then(r => r.json())
                    .then((data) => {
                        return data.slice(0, 10);
                    });
            }
        },
        sports: {
            getResults (id, config) {
                let body = { src: config.src },
                    url = data.buildUrl('rss-sports', body);
                return data.get(id, data.fetchData(url))
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
