(function () {
    var webComponentsSupported = ('registerElement' in document &&
        'import' in document.createElement('link') &&
        'content' in document.createElement('template')),
        loaded = false,
        loadEventFired = false,
        kanoAppInserted = false,
        loadTimeoutId, started,
        timeout, wcPoly,
        isCore, userAgent,
        isPi,
        splashTimeoutId;

    var lines = 0,
        current,
        space,
        col = 0,
        colours = [
            ['#00ffff', '#2dfffe', '#45afff'], //, '#6ccece'], // cyan
            ['#ff00f9', '#fc27f6', '#ff118b'], //, '#d282d0'], // magenta
            ['#ffff00', '#fffd38', '#ff842a'], //, '#dfde89'], //yellow
            ['#00ff67', '#2afd6f', '#00ff2b'] //, '#71d591']  // green
        ],
        MARGIN = 10,
        MIN_WIDTH = 10,
        SPACE_LIMIT = 120,
        DELAY_MIN = 100,
        DELAY_MAX = 400,
        MAX_LINES = 7;



    /**
     * Redirects to the projects page on the Core Kit™ on first landing
     */
    isCore = window.Kano.MakeApps.config.TARGET === 'osonline';
    userAgent = window.navigator.userAgent;
    isPi = userAgent.indexOf('armv6l') !== -1 || userAgent.indexOf('armv7l') !== -1;

    if (isCore && document.referrer === "") {
        location.href = 'https://world.kano.me/projects';
        return;
    }
    if (isPi && location.href.indexOf('apps.kano.me') !== -1) {
        location.href = location.href.replace('apps.kano.me', 'make-apps-kit.kano.me');
        return;
    }

    /**
     * Makes the transition between the loader and the app itself
     * Makes sure that the loader is displayed at least 1.5s to prevent flashing
     */
    function onFirstPageLoaded() {
        var duration = new Date() - started,
            loader,
            logo;
        if (duration < 1500) {
            timeout = setTimeout(onFirstPageLoaded, 1500 - duration);
            return;
        }
        document.removeEventListener('kano-routing-load-finish', onFirstPageLoaded);
        clearTimeout(splashTimeoutId);

        loader = document.getElementById('loader');

        loaded = true;
        setTimeout(function () {
            loader.parentNode.removeChild(loader);
        }, 400);
    }

    function splashNewLine() {
        var line = document.createElement('div'),
            blocksNode = document.getElementById('blocks');

        line.className = 'line';

        if (blocksNode.childNodes.length >= MAX_LINES) {
            blocksNode.removeChild(blocksNode.childNodes[0]);
        }

        blocksNode.appendChild(line);

        return line;
    }

    function splashLoop() {
        var block, w, to;
        if (!current || space < MARGIN + MIN_WIDTH) {
            space = SPACE_LIMIT;
            current = splashNewLine();
        }

        w = Math.random() * (space - MARGIN - MIN_WIDTH) + MIN_WIDTH;
        if (w > SPACE_LIMIT * 0.75) {
            w = w * (Math.random() * 0.5 + 0.5);
        }

        space -= w;
        space -= 10;

        block = document.createElement('div');
        block.className = 'block';
        block.style.width = w + 'px';
        block.style['background-color'] = colours[col][Math.floor(Math.random() * colours[col].length)];
        col = (col + 1) % colours.length;

        current.appendChild(block);

        to = Math.random() * (DELAY_MAX - DELAY_MIN) + DELAY_MIN;
        splashTimeoutId = setTimeout(splashLoop, to);
    }

    function onElementsLoaded() {
        if (kanoAppInserted) {
            return;
        }
        var app = document.createElement('kano-app'),
            loader = document.getElementById('loader');
        document.body.insertBefore(app, loader);
        document.addEventListener('kano-routing-load-finish', onFirstPageLoaded);
        kanoAppInserted = true;
    }

    /**
     * Imports the elements bundle
     */
    function lazyLoadElements() {
        var elements = [
            '/elements/elements.html'
        ];

        elements.forEach(function (elementURL) {
            var elImport = document.createElement('link');
            elImport.rel = 'import';
            elImport.href = elementURL;
            elImport.addEventListener('load', onElementsLoaded);
            document.head.appendChild(elImport);
        });
    }

    /**
     * Optionally load the webcomponents polyfill and then load the elements bundle
     */
    function deferLoading() {
        // Race condition cause of safari fix hack
        if (loadEventFired) {
            return;
        }
        loadEventFired = true;
        clearTimeout(loadTimeoutId);
        splashLoop();
        if (!webComponentsSupported) {
            wcPoly = document.createElement('script');
            wcPoly.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
            wcPoly.onload = lazyLoadElements;
            document.head.appendChild(wcPoly);
        } else {
            lazyLoadElements();
        }
    }

    // Attach the loading of the dependencies when the page is loaded
    if (window.addEventListener) {
        window.addEventListener("load", deferLoading, false);
    } else if (window.attachEvent) {
        window.attachEvent("onload", deferLoading);
    } else {
        window.onload = deferLoading;
    }

    // I am ashamed of this hack, but sometimes safari just doesn't fire the load event :(
    loadTimeoutId = setTimeout(deferLoading, 1000);

    window.Polymer = {
        dom: 'shadow',
        lazyRegister: false,
        useNativeCSSProperties: true
    };

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(function () {
                // SW registration successfull
            })
            .catch(function (e) {
                console.error(e);
            });
    } else {
        // Add fallback using appcache
        document.write('<iframe src="/appcache.html" width="0" height="0" style="display: none"></iframe>');
    }

})();
