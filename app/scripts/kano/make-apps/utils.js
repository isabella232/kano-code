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

    Utils.sendToKit = (p, app) => {
        // Create a body object containing the app for the program
        let program = {
            parts: app.parts,
            code: app.code.snapshot.javascript,
            mode: app.mode,
            partsAPI: {}
        },
            headers = new Headers();
        // Fetch the mode part code as text to give to the kit
        fetch(`/scripts/kano/make-apps/behaviors/mode-${app.mode}-behavior.js`)
            .then(r => r.text())
            .then(r => {
                program.partsAPI[app.mode] = r;
            })
            .then(_ => {
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
