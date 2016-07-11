(function (Kano) {
    Kano.Challenge = {};
    Kano.Challenge.createFromApp = function (app) {
        var data = {};
        data.steps = [];
        data.parts = [];
        data.modules = [];
        data.steps.push({
            "tooltips": [{
                "location": "add-part-button",
                "position": "top",
                "text": "We'll start by adding parts to our app. Click here to see all the parts."
            }],
            "validation": {
                "open-parts": true
            }
        });
        data.steps = data.steps.concat(app.parts.map(function (part, index) {
            var location = "sidebar.parts.part-" + part.type;
            if (data.parts.indexOf(part.type) == -1) {
                data.parts.push(part.type);
            }
            return {
                "tooltips": [{
                    "location": location,
                    "position": "right",
                    "text": "Drag the " + part.name + " to<br />your app"
                }],
                "arrow": {
                    "source": location,
                    "target": "left-panel",
                    "size": 120
                },
                "validation": {
                    "add-part": {
                        "type": part.type,
                        "id": "part_" + index
                    }
                }
            };
        }));
        return data;
    };
})(window.Kano = window.Kano || {});
