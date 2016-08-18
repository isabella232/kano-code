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
                    localStorage.setItem('previousApp', localStorage.getItem('savedApp'));
                    localStorage.setItem('savedApp', e.target.result);
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

})(window.Kano = window.Kano || {});
