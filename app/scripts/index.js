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
        splashTimeoutId,
        splash = {
            MARGIN: 10,
            MIN_WIDTH: 10,
            SPACE_LIMIT: 120,
            DELAY_MIN: 100,
            DELAY_MAX: 400,
            LINES: 7,
            BLOCKS_PER_LINE: 5,
            HIDDEN_STYLE: 'width: 0px;',
            COLOURS: [
                '#3d50b4', '#1f93f3', '#fd9626',
                '#6638b5', '#1ea8f3', '#fcc02d', '#795348',
                '#9b26ae', '#1fbad1', '#fee839', '#9d9d9d',
                '#e81c62', '#169487', '#ccdb37', '#5f7b88',
                '#f34335', '#4bad50', '#8ac349', '#000000',
            ],
            current: 0,
            column: 0,
            colour: 0,
            state: []
        };
    splash.space = splash.SPACE_LIMIT;

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
            loader;
        if (duration < 1500) {
            timeout = setTimeout(onFirstPageLoaded, 1500 - duration);
            return;
        }
        document.removeEventListener('kano-routing-load-finish', onFirstPageLoaded);

        loader = document.getElementById('loader');
        loader.style.opacity = 0;

        loaded = true;
        setTimeout(function () {
            clearTimeout(splashTimeoutId);
            loader.parentNode.removeChild(loader);
        }, 400);
    }

    function splashNewLine() {
        var line = [],
            c;

        splash.current++;
        if (splash.current > splash.LINES - 1) {
            splash.current = splash.LINES - 1;
            splash.state.shift();
            for (c = 0; c < splash.BLOCKS_PER_LINE; c++) {
                line.push(splash.HIDDEN_STYLE);
            }
            splash.state.push(line);
            splashRerender();
        }
    }

    function splashLoop() {
        var block, w, to, style;

        if (splash.space < splash.MARGIN + splash.MIN_WIDTH || splash.column > 4) {
            splash.space = splash.SPACE_LIMIT;
            splash.column = 0;
            splashNewLine();
        }

        w = Math.random() * (splash.space - splash.MARGIN - splash.MIN_WIDTH) + splash.MIN_WIDTH;
        if (w > splash.SPACE_LIMIT * 0.75) {
            w = w * (Math.random() * 0.5 + 0.5);
        }

        splash.space -= w;
        splash.space -= splash.MARGIN;

        block = document.getElementById('line-' + splash.current + '-block-' + splash.column);
        style = 'background-color: ' + splash.COLOURS[splash.colour] + '; width: ' + w + 'px;';
        block.style.cssText = style + 'animation: pop-in .2s;' +
                                      'transform-origin: left;' +
                                      'transition-timing-function: cubic-bezier(0.000, 0.965, 0.875, 1.140);';
        splash.state[splash.current][splash.column] = style;
        splash.colour = (splash.colour + 1) % splash.COLOURS.length;
        splash.column++;


        to = Math.random() * (splash.DELAY_MAX - splash.DELAY_MIN) + splash.DELAY_MIN;
        splashTimeoutId = setTimeout(splashLoop, to);
    }

    function splashInit() {
        var root = document.getElementById('blocks'),
            line,
            block,
            styles, l, c;

        for (l = 0; l < splash.LINES; l++) {
            line = document.createElement('div');
            styles = [];
            line.id = 'line-' + l;
            line.className = 'line';
            root.appendChild(line);

            for (c = 0; c < splash.BLOCKS_PER_LINE; c++) {
                block = document.createElement('div');
                block.id = 'line-' + l + '-block-' + c;
                block.className = 'block';
                block.style.cssText = splash.HIDDEN_STYLE;
                line.appendChild(block);
                styles.push(splash.HIDDEN_STYLE);
            }
            splash.state.push(styles);
        }
    }

    function splashRerender() {
        var block, l, c;
        for (l = 0; l < splash.LINES; l++) {
            for (c = 0; c < splash.BLOCKS_PER_LINE; c++) {
                block = document.getElementById('line-' + l + '-block-' + c);
                block.style.cssText = splash.state[l][c];
            }
        }
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
        splashInit();
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
