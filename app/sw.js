/* globals caches, self, importScripts */
var CACHE_NAME = 'make-apps-cache-v1',
// The files we want to cache
    urlsToCache = [
    '/',
    '/make',
    '/index.html',
    '/manifest.json',
    '/css/main.css',
    '/scripts/index.js',
    '/app.js',
    '/elements/elements.html',
    '/assets/vendor/webcomponentsjs/webcomponents-lite.min.js'
],
    typesToCache = [
        'application/javascript',
        'text/html; charset=UTF-8',
        'application/font-woff',
        'image/png',
        'image/svg+xml'
    ];

importScripts('/assets/vendor/cache-polyfill/cache-polyfill.js');

function isCacheable(requestURL, response) {
    var type = response.headers.get('content-type');
    if (requestURL.host === 'api-staging.kano.me' && requestURL.pathname === '/auth/session') {
        return true;
    }
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
    }).catch(() => {});
}

// Set the callback for the install step
self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
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
