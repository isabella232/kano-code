(function (Kano) {

    Kano.MakeApps = Kano.MakeApps || {};
    Kano.MakeApps.Behaviors = Kano.MakeApps.Behaviors || {};
    Kano.MakeApps.PartsAPI = Kano.MakeApps.PartsAPI || {};

    // Store in two places. One with a name that respect behaviors and one in the PartsAPI to be use by the
    // server to work offline.
    Kano.MakeApps.PartsAPI.base = Kano.MakeApps.Behaviors.PartBaseBehavior = {
        ready () {
            this.userListeners = {};
        },
        start () {
            this.userListeners = {};
        },
        when (name, callback) {
            if (!this.userListeners[name]) {
                this.userListeners[name] = [];
            }
            this.userListeners[name].push(callback);
            this.addEventListener(name, callback);
        },
        stop () {
            Object.keys(this.userListeners).forEach((name) => {
                this.userListeners[name].forEach((callback) => {
                    this.removeEventListener(name, callback);
                });
            });
            this.userListeners = {};
        }
    };

})(window.Kano = window.Kano || {});
