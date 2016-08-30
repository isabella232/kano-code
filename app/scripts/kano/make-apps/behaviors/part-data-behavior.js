(function (Kano) {

    Kano.MakeApps = Kano.MakeApps || {};
    Kano.MakeApps.Behaviors = Kano.MakeApps.Behaviors || {};
    Kano.MakeApps.PartsAPI = Kano.MakeApps.PartsAPI || {};

    // Store in two places. One with a name that respect behaviors and one in the PartsAPI to be use by the
    // server to work offline.
    Kano.MakeApps.PartsAPI.data = Kano.MakeApps.Behaviors.DataBehavior = {
        ready () {
            this.appModules = Kano.AppModules;
        },
        start () {
            let model = this.model;
            if (model.refreshEnabled) {
                this.refreshInterval = setInterval(this.refresh.bind(this), Math.max(1, model.refreshFreq) * 1000);
            }
            // Call a refresh at the begining
            this.refresh();
        },
        stop () {
            clearInterval(this.refreshInterval);
            Object.keys(this.listeners).forEach((name) => {
                this.listeners[name].forEach((callback) => {
                    this.removeEventListener(name, callback);
                });
            });
            this.listeners = {};
        },
        refresh () {
            return this.appModules.getModule('data').generateRequest(this.model.id, this.model.method, this.model.config)
                .then((data) => {
                    this.set('model.data', data);
                    this.fire('update');
                });
        },
        setConfig (name, value) {
            this.set(`model.config.${name}`, value);
            this.refresh();
        },
        getValue (path) {
            return this.get(`model.data.${path}`) || this.get(`model.config.${path}`);
        },
        getData () {
            return this.get('model.data');
        }
    };

})(window.Kano = window.Kano || {});
