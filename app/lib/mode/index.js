
function htmlImport(href) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.async = true;
        link.rel = 'import';
        link.onload = () => resolve();
        link.onerror = reject;
        link.href = href;
        document.head.appendChild(link);
    });
}

const Mode = {
    _loadedModules: new Map(),
    define(id, definition) {
        this._loadedModules.set(id, definition);
    },
    load(id, url) {
        return htmlImport(url)
            .then(() => {
                if (!this._loadedModules.has(id)) {
                    throw new Error(`Could not find mode '${id}' after loading`);
                }
                return this._loadedModules.get(id);
            });
    },
};

window.Kano = window.Kano || {};
window.Kano.Code = window.Kano.Code || {};
window.Kano.Code.Mode = window.Kano.Code.Mode || {};

export default Mode;
