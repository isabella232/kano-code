(function() {
    var webComponentsSupported = ('registerElement' in document &&
            'import' in document.createElement('link') &&
            'content' in document.createElement('template')),
        loaded = false,
        loadEventFired = false,
        kanoAppInserted = false,
        loadTimeoutId, started,
        timeout, wcPoly,
        isCore, userAgent,
        isPi;

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

    function showMobileAlert(showButton) {
        function hideSplash(){
            var splash = document.getElementById('splash');
            splash.style.opacity = 0;
            setTimeout(function() {
                clearTimeout(window.splashTimeoutId);
                splash.parentNode.removeChild(splash);
            }, 400);
        }
        function addAlertMessageBox() {
            var splash = document.getElementById('splash');
            var alertBox = document.createElement('DIV');
            alertBox.className = 'alert';
            alertBox.id = 'alert';
            alertBox.innerHTML = 'Please try to access from larger screen, like Laptop, Tablet, Desktop. <br /> Would you like to continue anyway?';
            splash.appendChild(alertBox);
        }

        function addContinueButton() {
            var alertBox = document.getElementById('alert');
            var button = document.createElement('SPAN');
            button.className = 'continuebtn';
            button.innerHTML = 'continue';
            alertBox.appendChild(button);
            button.addEventListener('click', function(e) {
             
            });
        }

        function isMobile() {
            var mobileDevice = false;
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
                mobileDevice = true;
            return mobileDevice
        }

        if (isMobile()) {
            if (!showButton){
                addAlertMessageBox();
            }else{
                addContinueButton();
            }
            
        }else{
            if (showButton){
                hideSplash();
            }
        }
    }

    showMobileAlert(false);

    /**
     * Makes the transition between the splash and the app itself
     * Makes sure that the splash is displayed at least 1.5s to prevent flashing
     */
    function onFirstPageLoaded() {
        var duration = new Date() - started,
            splash;
        if (duration < 1500) {
            timeout = setTimeout(onFirstPageLoaded, 1500 - duration);
            return;
        }
        document.removeEventListener('kano-routing-load-finish', onFirstPageLoaded);
        showMobileAlert(true);
        loaded = true;

    }

    function onElementsLoaded() {
        if (kanoAppInserted) {
            return;
        }
        var app = document.createElement('kano-app'),
            splash = document.getElementById('splash');
        document.body.insertBefore(app, splash);
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

        elements.forEach(function(elementURL) {
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
            .then(function() {
                // SW registration successfull
            })
            .catch(function(e) {
                console.error(e);
            });
    } else {
        // Add fallback using appcache
        document.write('<iframe src="/appcache.html" width="0" height="0" style="display: none"></iframe>');
    }

})();
