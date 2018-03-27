
class AppModules {
    constructor(config) {
        const appModules = window.Kano.AppModules.createStandalone();
        appModules.init(config);
        return appModules;
    }
}

export default AppModules;
