(function (Kano) {

    Kano.MakeApps = Kano.MakeApps || {};
    Kano.MakeApps.Behaviors = Kano.MakeApps.Behaviors || {};
    Kano.MakeApps.PartsAPI = Kano.MakeApps.PartsAPI || {};

    // Store in two places. One with a name that respect behaviors and one in the PartsAPI to be use by the
    // server to work offline.
    Kano.MakeApps.PartsAPI.lightboard = Kano.MakeApps.Behaviors.LightboardBehavior = {
        ready () {
            this.appModules = Kano.AppModules;
        },
        start () {
            this.userListeners = [];
        },
        stop () {
            this.userListeners = [];
        },
        turnOn (light, color) {
            return this.appModules.getModule('lightboard').turnOn(light, color);
        },
        turnOff (light) {
            return this.appModules.getModule('lightboard').turnOff(light);
        },
        text (text, color, backgroundColor) {
            return this.appModules.getModule('lightboard').text(text, color, backgroundColor);
        },
        scroll (text, color, backgroundColor, speed) {
            return this.appModules.getModule('lightboard').scroll(text, color, backgroundColor, speed);
        },
        onKeyDown (key, callback) {
            let cb = this._keyDownCheck(key, callback);
            this.userListeners.push({
                name: 'button-down',
                cb
            });
            this.appModules.getModule('lightboard').on('button-down', cb);
        },
        _keyDownCheck (key, callback) {
            return (data) => {
                if (data['button-id'] === key) {
                    callback();
                }
            };
        }
    };

})(window.Kano = window.Kano || {});
