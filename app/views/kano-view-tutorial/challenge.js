(function (Kano) {
    var Challenge = function () {
        // Namespaces for the unique ids
        this.uidNss = {};

        this.data = {};
        this.data.steps = [];
        this.data.parts = [];
        this.data.modules = [];

        this.partsIds = {};
    };
    Kano.MakeApps = Kano.MakeApps || {};
    Kano.MakeApps.Challenge = Challenge;

    Challenge.categoryMap = {
        'random_colour': 'variables'
    };

    Challenge.createFromApp = function (app) {
        var challenge = new Challenge();
        challenge.loadFromApp(app);
        return challenge;
    };

    Challenge.prototype.uid = function (ns) {
        if (typeof this.uidNss[ns] === 'undefined') {
            this.uidNss[ns] = 0;
            return this.uidNss[ns];
        }
        return ++this.uidNss[ns];
    };

    Challenge.prototype.loadFromApp = function (app) {
        var xml = Blockly.Xml.textToDom(app.code.snapshot.blocks),
            block, i;
        this.data.steps.push({
            "tooltips": [{
                "location": "add-part-button",
                "position": "top",
                "text": "We'll start by adding parts to our app. Click here to see all the parts."
            }],
            "validation": {
                "open-parts": true
            }
        });
        this.data.steps = this.data.steps.concat(app.parts.map(function (part, index) {
            var location = "sidebar.parts.part-" + part.type;
            if (this.data.parts.indexOf(part.type) === -1) {
                this.data.parts.push(part.type);
            }
            this.partsIds[part.id] = "part_" + this.uid('part');
            return {
                "tooltips": [{
                    "location": location,
                    "position": "right",
                    "text": "Drag the " + part.name + " to your app"
                }],
                "arrow": {
                    "source": location,
                    "target": "left-panel",
                    "size": 120
                },
                "validation": {
                    "add-part": {
                        "type": part.type,
                        "id": this.partsIds[part.id]
                    }
                }
            };
        }.bind(this)));
        this.data.steps.push({
            "tooltips": [{
                "location": "add-part-button",
                "position": "top",
                "text": "Now we can start coding. Close the tray."
            }],
            "validation": {
                "close-parts": true
            }
        });
        for (i = 0; i < xml.children.length; i++) {
            block = xml.children[i];
            this.data.steps = this.data.steps.concat(this.blockNodeToSteps(block));
        }
        this.data.steps.push({
            "tooltips": [{
                "location": "make-button",
                "position": "bottom",
                "text": "The app is finished, hit the play button."
            }],
            "validation": {
                "running": {
                    "value": true
                }
            }
        });
        this.data.steps.push({
            "tooltips": [{
                "location": "left-panel",
                "position": "right",
                "text": "You can now test the app",
                "next_button": true
            }]
        });
    };

    Challenge.prototype.eventBlockToSteps = function (block) {
        var steps = [],
            blockChallengeId = 'default_part_event',
            pieces,
            part,
            name;
        if (block.children.EVENT.innerText !== 'global.start') {
            pieces = block.children.EVENT.innerText.split('.');
            part = pieces[0];
            name = pieces[1];
            steps.push({
                "tooltips": [{
                    "location": {
                        "block": blockChallengeId
                    },
                    "position": "top",
                    "text": "Change ‘app starts’ to ‘Button is clicked’"
                }],
                "validation": {
                    "blockly": {
                        "value": {
                            "target": blockChallengeId,
                            "value": {
                                "event_from": this.partsIds[part],
                                "event": name
                            }
                        }
                    }
                }
            });
        }
        return steps;
    };

    Challenge.prototype.blockNodeToSteps = function (block, parentId) {
        var steps = [],
            type = block.getAttribute('type'),
            blockChallengeId,
            categoryId,
            childSteps,
            blockId,
            pieces,
            child,
            i;
        if (type === 'part_event') {
            blockChallengeId = 'default_part_event';
            steps = steps.concat(this.eventBlockToSteps(block));
        } else {
            pieces = type.split('#');

            blockChallengeId = 'block_' + this.uid('block');

            if (pieces.length > 1) {
                categoryId = pieces[0];
                blockId = pieces[1];
            } else {
                blockId = pieces[0];
            }

            if (!categoryId) {
                categoryId = Challenge.categoryMap[blockId];
                if (this.data.modules.indexOf(categoryId) === -1) {
                    this.data.modules.push(categoryId);
                }
            }

            steps.push({
                "tooltips": [{
                    "location": {
                        "category": categoryId
                    },
                    "position": "left",
                    "text": "Open the " + categoryId + " tray"
                }],
                "validation": {
                    "blockly": {
                        "open-flyout": categoryId
                    }
                }
            });
            steps.push({
                "tooltips": [{
                    "location": {
                        "flyout_block": type
                    },
                    "position": "left",
                    "text": 'Drag the <kano-blockly-block type="' + type + '"></kano-blockly-block> block onto your code space'
                }],
                "arrow": {
                    "source": {
                        "flyout_block": type
                    },
                    "target": {
                        "block": parentId
                    },
                    "size": 120
                },
                "validation": {
                    "blockly": {
                        "create": {
                            "type": type,
                            "id": blockChallengeId
                        }
                    }
                }
            });
        }
        if (parentId) {
            steps.push({
                "tooltips": [{
                    "location": {
                        "block": parentId
                    },
                    "position": "left",
                    "text": "Connect the blocks"
                }],
                "validation": {
                    "blockly": {
                        "connect": {
                            "parent": parentId,
                            "target": blockChallengeId
                        }
                    }
                }
            });
        }
        for (i = 0; i < block.children.length; i++) {
            child = block.children[i];
            switch (child.tagName) {
                case 'value':
                case 'statement': {
                    childSteps = this.blockNodeToSteps(child.firstChild, blockChallengeId);
                    steps = steps.concat(childSteps);
                    break;
                }
            }

        }
        return steps;
    };

})(window.Kano = window.Kano || {});
