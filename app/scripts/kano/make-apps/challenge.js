/* globals Blockly */
(function (Kano) {
    var Challenge = function () {
        // Namespaces for the unique ids
        this.uidNss = {};

        this.data = {};
        this.data.steps = [];
        this.data.parts = [];
        this.data.modules = [];
        this.data.variables = [];

        this.appParts = {};
        this.partsIds = {};
    };
    Kano.MakeApps = Kano.MakeApps || {};
    Kano.MakeApps.Challenge = Challenge;

    Challenge.actionsMap = {
        'add-parts': [
            "We'll start by adding parts to our app.",
            "To build the interface of the app, we need parts"
        ],
        'open-parts-drawer': [
            "Click here to see all the parts.",
            "Open the parts drawer by clicking here."
        ],
        'start-code': [
            "Now we can start coding.",
            "All the parts are here, let's code!"
        ],
        'close-parts-drawer': [
            "Close the drawer.",
            "Hit that button"
        ],
        'connect-blocks': [
            "Connect it to this block"
        ]
    };

    Challenge.randomizedAction = function (action) {
        var values = Challenge.actionsMap[action],
            r;
        if (!values) {
            throw new Error("Action '" + action + "' has no translation associated");
        }
        r = Math.floor(Math.random() * values.length);
        return values[r];
    };

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
        'math_random': 'operators',
        'unary': 'operators',
        'part_event': 'events',
        'create_color': 'misc'
    };

    Challenge.fieldDefaults = {
        'colour_picker': {
            'COLOUR': '#ff0000'
        },
        'math_number': {
            'NUM': 0
        },
        'math_random': {
            'TYPE': 'integer',
            'MIN': 0,
            'MAX': 10
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
            'INTERVAL': 1,
            'UNIT': 'seconds'
        },
        'repeat_x_times': {
            'N': 10
        },
        'unary': {
            'LEFT_HAND': 'item',
            'OPERATOR': '+=',
            'RIGHT_HAND': 1
        },
        'math_arithmetic': {
            'OP': 'ADD'
        },
        'logic_compare': {
            'OP': 'EQ'
        },
        'logic_boolean': {
            'BOOL': 'TRUE'
        },
        'get_time': {
            'FIELD': 'year'
        },
        'text': {
            'TEXT': ''
        },
        'lists_getIndex': {
            'MODE': 'GET'
        },
        'lists_setIndex': {
            'MODE': 'SET'
        },
        'stroke': {
            'SIZE': 1
        },
        'line_to': {
            'X': 5,
            'Y': 5
        },
        'line': {
            'X': 5,
            'Y': 5
        },
        'move_to': {
            'X': 5,
            'Y': 5
        },
        'move': {
            'X': 5,
            'Y': 5
        },
        'circle': {
            'RADIUS': 5
        },
        'ellipse': {
            'RADIUSX': 5,
            'RADIUSY': 5
        },
        'square': {
            'SIZE': 5
        },
        'rectangle': {
            'WIDTH': 5,
            'HEIGHT': 5
        },
        'arc': {
            'RADIUS': 5,
            'START': 0,
            'END': 1,
            'CLOSE': 'TRUE'
        },
        'polygon': {
            'CLOSE': 'TRUE'
        },
        'threshold': {
            'OVER': 'true',
            'VALUE': 70
        },
        'light_x_y': {
            'X': 0,
            'Y': 0
        },
        'ui_show_hide': {
            'VISIBILITY': 'show'
        },
        'light_show_text': {
            'COLOR': '#000000',
            'BACKGROUND_COLOR': '#ffffff'
        },
        'light_scroll_text': {
            'COLOR': '#000000',
            'BACKGROUND_COLOR': '#ffffff',
            'SPEED': 50
        },
        'set_x': {
            'X': 0
        },
        'set_y': {
            'Y': 0
        },
        'set_width': {
            'WIDTH': 0
        },
        'set_height': {
            'HEIGHT': 0
        },
        'set_radius': {
            'RADIUS': 0
        },
        'animation_set_speed': {
            'SPEED': 15
        },
        'animation_go_to_frame': {
            'FRAME': 0
        },
        'animation_display_set_animation': {
            'ANIMATION': 'smiley'
        },
        'animation_display_go_to_frame': {
            'FRAME': 0
        },
        'create_color': {
            'TYPE': 'rgb'
        },
        'picture_list_set_speed': {
            'SPEED': 15
        }
    };

    Challenge.labels = {
        field: {
            'GT': '>',
            'GTE': '>=',
            'LT': '<',
            'LTE': '<=',
            'EQ': '=',
            'DIVIDE': '/',
            'MULTIPLY': 'x',
            'ADD': '+',
            'SUBSTRACT': '-',
            'TRUE': 'true',
            'FALSE': 'false',
            'year': 'Year',
            'month': 'Month',
            'day': 'Day',
            'hour': 'Hour',
            'minute': 'Minute',
            'seconds': 'Seconds'
        },
        category: {
            'variables': 'Variables',
            'operators': 'Operators',
            'control': 'Control'
        }
    };

    Challenge.parseBlockType = function (type) {
        var pieces = type.split('#'),
            result = {};
        if (pieces.length > 1) {
            result.category = pieces[0];
            result.block = pieces[1];
        } else {
            result.block = pieces[0];
        }
        return result;
    };

    Challenge.translate = function (type, key) {
        return Challenge.labels[type] && Challenge.labels[type][key] ? Challenge.labels[type][key] : key;
    };

    Challenge.createFromApp = function (app) {
        var challenge = new Challenge();
        challenge.loadFromApp(app);
        return challenge;
    };

    Challenge.prototype.translate = function (type, key) {
        var result = Challenge.translate(type, key);
        if (result === key) {
            if (type === 'category') {
                result = this.appParts[key] && this.appParts[key].name ? this.appParts[key].name : result;
            }
        }
        return result;
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
        // Support older apps that saved the whole mode
        this.data.mode = app.mode.id || app.mode;
        if (app.parts.length) {
            this.data.steps.push({
                "tooltips": [{
                    "location": "add-part-button",
                    "position": "top",
                    "text": Challenge.randomizedAction('add-parts') + "<br>" + Challenge.randomizedAction('open-parts-drawer')
                }],
                "validation": {
                    "open-parts": true
                }
            });
        }
        this.data.steps = this.data.steps.concat(app.parts.map(function (part, index) {
            var location = "sidebar.parts.part-" + part.type;
            if (this.data.parts.indexOf(part.type) === -1) {
                this.data.parts.push(part.type);
            }
            this.partsIds[part.id] = "part_" + this.uid('part');
            this.appParts[part.id] = part;
            return {
                "tooltips": [{
                    "location": location,
                    "position": "right",
                    "text": "Drag the " + part.name + " to your app"
                }],
                "highlight": location,
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
        if (app.parts.length) {
            this.data.steps.push({
                "tooltips": [{
                    "location": "add-part-button",
                    "position": "top",
                    "text": Challenge.randomizedAction('start-code') + "<br>" + Challenge.randomizedAction('close-parts-drawer')
                }],
                "validation": {
                    "close-parts": true
                }
            });
        }
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
                    "text": `Change ‘app starts’ to ‘${pieces.join('.')}’`
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
            parentBlockType,
            blockChallengeId,
            categoryLabel,
            fieldDefault,
            fieldValue,
            fieldName,
            blockType = Challenge.parseBlockType(type || ''),
            child,
            i;

        switch (node.tagName) {
            case 'field': {
                if (parentType === 'variables_set' && this.data.variables.indexOf(node.firstChild.nodeValue) === -1) {
                    this.data.variables.push(node.firstChild.nodeValue);
                }
                if (node.firstChild.nodeValue !== null) {
                    fieldName = parentSelector.shadow || node.getAttribute('name');
                    if (node.parentNode.tagName === 'shadow') {
                        parentBlockType = Challenge.parseBlockType(node.parentNode.parentNode.parentNode.getAttribute('type'));
                        parentType = parentBlockType.block;
                    }
                    if (fieldName) {
                        if (!Challenge.fieldDefaults[parentType]) {
                            console.log('missing default field: ', parentType, fieldName);
                        } else {
                            fieldDefault = Challenge.fieldDefaults[parentType][fieldName];
                        }
                    }
                    // Loose check of the value
                    if (node.firstChild.nodeValue != fieldDefault) {
                        fieldValue = this.translate('field', node.firstChild.nodeValue);
                        // Add a `change value` step to get the right value
                        steps.push({
                            "tooltips": [{
                                "location": {
                                    "block": parentSelector
                                },
                                "position": "top",
                                "text": 'Change to <kano-value-preview>' + fieldValue + '</kano-value-preview>'
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
                for (i = 0; i < node.children.length; i++) {
                    child = node.children[i];
                    steps = steps.concat(this.nodeToSteps(child, parentSelector, blockType.block));
                }
                break;
            }
            case 'block': {
                var id = node.getAttribute('id');
                if (id === 'default_part_event_id') {
                    blockChallengeId = 'default_part_event';
                    blockType.block = 'part_event';
                    steps = steps.concat(this.eventBlockToSteps(node));
                } else {
                    blockChallengeId = 'block_' + this.uid('block');

                    // Defines the location of the toolbox category. Can be the category itself or from a previously added part
                    var categoryLocation,
                        blockLocation,
                        markdownType,
                        creationType;


                    // The block from the original app isn't from a created part, thus doens't contain a category field
                    if (!blockType.category) {
                        categoryLocation = blockType.category = Challenge.categoryMap[blockType.block];
                        blockLocation = markdownType = blockType.block;
                        creationType = {
                            type: blockLocation,
                            id: blockChallengeId
                        };
                        if (this.data.modules.indexOf(blockType.category) === -1) {
                            this.data.modules.push(blockType.category);
                        }
                    } else if (this.partsIds[blockType.category]) {
                        blockLocation = {
                            part: this.partsIds[blockType.category],
                            type: blockType.block
                        };
                        categoryLocation = {
                            part: blockLocation.part
                        };
                        creationType = {
                            target: blockLocation.part,
                            type: blockLocation.type,
                            id: blockChallengeId
                        };
                        markdownType = blockLocation.part + "#" + blockLocation.type;
                    } else {
                        blockLocation = creationType = markdownType = type;
                        categoryLocation = blockType.category;
                        creationType = {
                            type: blockLocation,
                            id: blockChallengeId
                        };
                    }

                    categoryLabel = this.translate('category', blockType.category);
                    if (categoryLabel !== blockType.category) {
                        categoryLabel = "the " + categoryLabel;
                    } else {
                        categoryLabel = "this";
                    }

                    steps.push({
                        "tooltips": [{
                            "location": {
                                "category": categoryLocation
                            },
                            "position": "left",
                            "text": "Open " + categoryLabel + " tray"
                        }],
                        "validation": {
                            "blockly": {
                                "open-flyout": categoryLocation
                            }
                        }
                    });
                    steps.push({
                        "tooltips": [{
                            "location": {
                                "flyout_block": blockLocation
                            },
                            "position": "left",
                            "text": 'Drag the <kano-blockly-block type="' + markdownType + '"></kano-blockly-block> block onto your code space'
                        }],
                        "arrow": {
                            "target": {
                                "flyout_block": blockLocation
                            },
                            "angle": 315,
                            "size": 80
                        },
                        "validation": {
                            "blockly": {
                                "create": creationType
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
                            "text": Challenge.randomizedAction('connect-blocks')
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
                    steps = steps.concat(this.nodeToSteps(child, blockChallengeId, blockType.block));
                }
                break;
            }
        }
        return steps;
    };

})(window.Kano = window.Kano || {});
