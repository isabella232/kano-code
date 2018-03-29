
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

const loadedModules = new Map();

const importPromises = new Map();

const Mode = {
    define(id, definition) {
        loadedModules.set(id, definition);
    },
    load(id, url) {
        if (importPromises.has(url)) {
            return importPromises.get(url);
        }
        const promise = htmlImport(url)
            .then(() => {
                if (!loadedModules.has(id)) {
                    throw new Error(`Could not find mode '${id}' after loading`);
                }
                return loadedModules.get(id);
            });
        importPromises.set(url, promise);
        return promise;
    },
};

window.Kano = window.Kano || {};
window.Kano.Code = window.Kano.Code || {};
window.Kano.Code.Mode = window.Kano.Code.Mode || {};

export default Mode;
