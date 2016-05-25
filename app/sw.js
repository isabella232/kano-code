/* globals caches, self, importScripts, Request, Headers */
var CACHE_NAME = 'make-apps-cache-v1',
// The files we want to cache
    urlsToCache = [/* build:cacheable */],
    typesToCache = [
        'application/javascript',
        'text/html; charset=UTF-8',
        'application/font-woff',
        'image/png',
        'image/svg+xml'
    ],
    routes = /(\/|\/make|\/apps|\/story\/.*)/;

importScripts('/assets/vendor/cache-polyfill/cache-polyfill.js');

function isCacheable(requestURL, response) {
    var type = response.headers.get('content-type');
    return response &&
            response.status === 200 &&
            response.type === 'basic' &&
            typesToCache.indexOf(type) !== -1;
}

// Fetch the file and caches it if matches the caching conditions
function updateCache(request) {
    var fetchRequest = request.clone(),
        requestURL = new URL(request.url),
        responseToCache;

    return fetch(fetchRequest).then(function (response) {
        if (isCacheable(requestURL, response)) {
            responseToCache = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
                cache.put(request, responseToCache);
            });
        }
        return response;
    }).catch((e) => {
        let url = new URL(request.url);
        if (routes.test(url.pathname)) {
            let spaRequest = new Request('index.html', {
                method: 'GET',
                headers: new Headers()
            });
            return caches.open(CACHE_NAME).then(function (cache) {
                return cache.match(spaRequest);
            });
        }
    });
}

// Set the callback for the install step
self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function (cache) {
            return cache.addAll(urlsToCache)
                .then(self.skipWaiting());
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim());
});


// Every network call made by the page
self.addEventListener('fetch', function (event) {
    event.respondWith(
        // Get the potential response from the cache
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - Update cache for next time - return cached response
                if (response) {
                    updateCache(event.request);
                    return response;
                }

                // Nothing in cache, update the cache and return the new reponse
                return updateCache(event.request);
            }
        )
    );
});
