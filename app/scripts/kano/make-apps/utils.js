(function (Kano) {
    var Utils = {};
    Kano.MakeApps = Kano.MakeApps || {};
    Kano.MakeApps.Utils = Utils;

    Utils.loadApp = () => {
        let i = document.createElement('input');
        i.setAttribute('type', 'file');
        i.style.position = 'fixed';
        i.style.top = i.style.left = '0px';
        i.addEventListener('change', function (evt) {
            let f = evt.target.files[0];
            if (f) {
                let r = new FileReader();
                r.onload = function (e) {
                    // Read the mode
                    let app = JSON.parse(e.target.result);
                    localStorage.setItem('previousApp', localStorage.getItem('savedApp'));
                    // Save the app in the right localstorage slot
                    localStorage.setItem(`savedApp-${app.mode}`, e.target.result);
                };
                r.readAsText(f);
                document.body.removeChild(i);
                location.reload();
            }
        });
        document.body.appendChild(i);
    };

    Utils.saveApp = () => {
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.download = 'my-app.mapps';
        a.href = "data:application/mapps;base64," + btoa(localStorage.getItem('savedApp'));
        a.click();
        document.body.removeChild(a);
    };

    /**
     * Fetch a part API file from the part type and prefix
     */
    function fetchPartAPI(prefix, partType) {
        return fetch(`/scripts/kano/make-apps/behaviors/${prefix}-${partType}-behavior.js`)
            .then(r => {
                if (!r.ok) {
                    return Promise.reject();
                }
                return r.text();
            }).catch(e => {
                
            });
    }

    Utils.sendToKit = (p, app) => {
        // Create a body object containing the app for the program
        let program = {
            parts: app.parts,
            code: app.code.snapshot.javascript,
            mode: app.mode,
            partsAPI: {}
        },
            headers = new Headers(),
            promises;
        // Create a unique array of the types used in this app
        promises = app.parts.map(part => part.type).filter((value, index, self) => self.indexOf(value) === index);
        // Generate promises that will fetch the parts API file
        promises = promises.map(partType => {
            return fetchPartAPI('part', partType)
                .then(r => {
                    program.partsAPI[partType] = r;
                });
        });
        promises = promises.concat(app.parts.map(part => part.partType).filter((value, index, self) => self.indexOf(value) === index).map(type => {
            return fetchPartAPI('part', type)
                .then(r => {
                    program.partsAPI[type] = r;
                });
        }));
        // Fetch the mode part code as text to give to the kit
        promises.push(fetchPartAPI('mode', app.mode).then(r => {
            program.partsAPI[app.mode] = r;
        }));
        // Fetch the part base behavior
        promises.push(fetchPartAPI('part', 'base').then(r => {
            program.partsAPI['base'] = r;
        }));
        Promise.all(promises).then(_ => {
            headers.set('Content-Type', 'application/json');
            // Send the program to the kit
            return fetch(`http://localhost:3000/program/${p}`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ program })
            });
        });
    };

})(window.Kano = window.Kano || {});
