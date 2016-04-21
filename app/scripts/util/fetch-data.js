import config from '../config';

/**
 * A wrapper around the fetch API for our data proxy.
 */
function fetchData (srcId, queryParams) {
    var baseUrl = config.DATA_API_URL + '/data-src/' + srcId + '/',
        queryString = '';

    if (queryParams) {
        queryString = Object.keys(queryParams).reduce((prev, key) => {
            var pair = key + "=" + encodeURIComponent(queryParams[key]);

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
                var s,
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
}

export default fetchData;
