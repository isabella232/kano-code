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
        'text': 'variables',
        'lists_create_empty': 'variables',
        'lists_create_with': 'variables',
        'lists_repeat': 'variables',
        'lists_length': 'variables',
        'lists_isEmpty': 'variables',
        'lists_indexOf': 'variables',
        'lists_getIndex': 'variables',
        'lists_setIndex': 'variables',
        'random_colour': 'variables',
        'colour_picker': 'variables',
        'math_number': 'variables',
        'variables_set': 'variables',
        'variables_get': 'variables',
        'colour_rgb': 'variables',
        'controls_if': 'control',
        'logic_compare': 'control',
        'loop_forever': 'control',
        'repeat_x_times': 'control',
        'logic_operation': 'control',
        'logic_negate': 'control',
        'logic_boolean': 'control',
        'every_x_seconds': 'control',
        'math_arithmetic': 'operators',
        'text_join': 'operators',
        'math_single': 'operators',
        'math_trig': 'operators',
        'math_constant': 'operators',
        'math_number_property': 'operators',
        'math_round': 'operators',
        'math_modulo': 'operators',
        'math_constrain': 'operators',
        'math_max': 'operators',
        'math_min': 'operators',
        'math_sign': 'operators',
        'math_random': 'operators'
    };

    Challenge.fieldDefaults = {
        'text': '',
        'colour_picker': {
            'COLOUR': '#ff0000'
        },
        'math_number': {
            'NUM': 0
        },
        'variables_set': {
            'VAR': 'item'
        },
        'variables_get': {
            'VAR': 'item'
        },
        'part_event': {
            'EVENT': 'global.start'
        },
        'every_x_seconds': {
            'UNIT': 'seconds'
        },
        'math_arithmetic': {
            'OP': 'ADD'
        },
        'logic_compare': {
            'OP': 'EQ'
        },
        'stroke': {
            'SIZE': 1
        }
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
        console.log(xml);
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
            this.data.steps = this.data.steps.concat(this.nodeToSteps(block));
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

    Challenge.prototype.nodeToSteps = function (node, parentSelector, parentType) {
        var steps = [],
            type = node.getAttribute('type'),
            blockChallengeId,
            fieldDefault,
            categoryId,
            fieldName,
            blockId,
            pieces,
            child,
            i;

        switch (node.tagName) {
            case 'field': {
                if (node.firstChild.nodeValue !== null) {
                    fieldName = parentSelector.shadow || node.getAttribute('name');
                    console.log(fieldName, parentType);
                    if (fieldName) {
                        fieldDefault = Challenge.fieldDefaults[parentType][fieldName];
                    }
                    // Loose check of the value
                    if (node.firstChild.nodeValue != fieldDefault) {
                        // Add a `change value` step to get the right value
                        steps.push({
                            "tooltips": [{
                                "location": {
                                    "block": parentSelector
                                },
                                "position": "top",
                                "text": 'Change to <kano-value-preview>' + node.firstChild.nodeValue + '</kano-value-preview>'
                            }],
                            "validation": {
                                "blockly": {
                                    "value": {
                                        "target": parentSelector,
                                        "value": node.firstChild.nodeValue
                                    }
                                }
                            }
                        });
                    }
                }
                break;
            }
            case 'next':
            case 'value': {
                for (i = 0; i < node.children.length; i++) {
                    if (node.children[i].tagName === 'block') {
                        child = node.children[i];
                        break;
                    }
                }
                if (!child) {
                    child = node.firstChild;
                }
                if (child.tagName === 'shadow') {
                    parentSelector = {
                        id: parentSelector,
                        shadow: node.getAttribute('name')
                    };
                }
                steps = steps.concat(this.nodeToSteps(child, parentSelector, parentType));
                break;
            }
            case 'statement': {
                steps = steps.concat(this.nodeToSteps(node.firstChild, parentSelector, parentType));
                break;
            }
            case 'shadow': {
                pieces = type.split('#');
                if (pieces.length > 1) {
                    categoryId = pieces[0];
                    blockId = pieces[1];
                } else {
                    blockId = pieces[0];
                }
                for (i = 0; i < node.children.length; i++) {
                    child = node.children[i];
                    steps = steps.concat(this.nodeToSteps(child, parentSelector, blockId));
                }
                break;
            }
            case 'block': {
                if (type === 'part_event') {
                    blockChallengeId = 'default_part_event';
                    blockId = 'part_event';
                    steps = steps.concat(this.eventBlockToSteps(node));
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
                                "block": parentSelector
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
                if (parentSelector) {
                    steps.push({
                        "tooltips": [{
                            "location": {
                                "block": parentSelector
                            },
                            "position": "left",
                            "text": "Connect the blocks"
                        }],
                        "validation": {
                            "blockly": {
                                "connect": {
                                    "parent": parentSelector,
                                    "target": blockChallengeId
                                }
                            }
                        }
                    });
                }
                for (i = 0; i < node.children.length; i++) {
                    child = node.children[i];
                    steps = steps.concat(this.nodeToSteps(child, blockChallengeId, blockId));
                }
                break;
            }
            default: {
                console.log(node.tagName);
            }
        }
        return steps;
    };

})(window.Kano = window.Kano || {});
