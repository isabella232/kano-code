/* globals Blockly, goog */
Blockly.Blocks.colour.HUE = '#ffff00';
Blockly.Blocks.logic.HUE = '#7DC242';
Blockly.Blocks.variables.HUE = '#34A836';
Blockly.Blocks.loops.HUE = '#ffff00';
Blockly.Blocks.math.HUE = '#7DC242';
Blockly.Blocks.texts.HUE = '#9C27B0';
Blockly.Blocks.lists.HUE = '#ffff00';
Blockly.Blocks.procedures.HUE = '#ffff00';

Blockly.Scrollbar.scrollbarThickness = 10;

if (location.search.match('lookup=true')) {
    Blockly.SEARCH_PLUS_ENABLED = true;
}

const FIELD_COLORS = {
    "black": "#000000",
    "darkgrey": "#213542",
    "steelgrey": "#596870",
    "lightgrey": "#bdccd4",
    "white": "#ffffff",
    "red": "#f6412c",
    "darkorange": "#ff5505",
    "orange": "#ff6b00",
    "lightorange": "#ff9800",
    "darkyellow": "#ffc101",
    "yellow": "#ffec14",
    "ligthgreen": "#ccdd1e",
    "green": "#88c440",
    "forestgreen": "#46af4b",
    "aquamarine": "#019687",
    "cyan": "#01bbd5",
    "blue": "#00a6f6",
    "darkblue": "#3d4db7",
    "darkpurple": "#6633b9",
    "purple": "#9c1ab1",
    "magenta": "#eb1360",
    "pink": "#ff2c82"
};

Blockly.FieldColour.COLOUR_NAMES = Object.keys(FIELD_COLORS);
Blockly.FieldColour.HEX_REGEXP = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
if (Blockly.SEARCH_PLUS_ENABLED) {
    Blockly.FieldColour.COLOURS = Blockly.FieldColour.COLOUR_NAMES.map(key => FIELD_COLORS[key]);
    Blockly.FieldColour.COLUMNS = 7;
}

// Reload the custom messages as Blockly overrides them
if (window.CustomBlocklyMsg) {
    Object.assign(Blockly.Msg, window.CustomBlocklyMsg);
}

Blockly.isAnimationsDisabled = function () {
    return false;
};

function lightenColor (hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}
	return rgb;
}

function hslToRgb(h, s, l) {
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}
function rgbToHex(r,g,b){
    var bin = r << 16 | g << 8 | b;
    return (function(h){
        return new Array(7-h.length).join("0")+h
    })(bin.toString(16).toUpperCase())
}

/**
 * Sets the state or property of an element.
 * @param {!Element} element DOM node where we set state.
 * @param {!(goog.a11y.aria.State|string)} stateName State attribute being set.
 *     Automatically adds prefix 'aria-' to the state name if the attribute is
 *     not an extra attribute.
 * @param {string|boolean|number|!Array<string>} value Value
 * for the state attribute.
 */
goog.a11y.aria.setState = function(element, stateName, value) {
  if (goog.isArray(value)) {
    value = value.join(' ');
  }
  var attrStateName = goog.a11y.aria.getAriaAttributeName_(stateName);
  if (!element) {
      return;
  }
  if (value === '' || value == undefined) {
    var defaultValueMap = goog.a11y.aria.datatables.getDefaultValuesMap();
    // Work around for browsers that don't properly support ARIA.
    // According to the ARIA W3C standard, user agents should allow
    // setting empty value which results in setting the default value
    // for the ARIA state if such exists. The exact text from the ARIA W3C
    // standard (http://www.w3.org/TR/wai-aria/states_and_properties):
    // "When a value is indicated as the default, the user agent
    // MUST follow the behavior prescribed by this value when the state or
    // property is empty or undefined."
    // The defaultValueMap contains the default values for the ARIA states
    // and has as a key the goog.a11y.aria.State constant for the state.
    if (stateName in defaultValueMap) {
      element.setAttribute(attrStateName, defaultValueMap[stateName]);
    } else {
      element.removeAttribute(attrStateName);
    }
  } else {
    element.setAttribute(attrStateName, value);
  }
};


/**
 * Is this event targeting a text input widget?
 * @param {!Event} e An event.
 * @return {boolean} True if text input.
 * @private
 */
Blockly.utils.isTargetInput = function(e) {
  // In a shadow DOM the first element of the path is more accurate
  var target = e.path ? e.path[0] : e.target;
  return target.type == 'textarea' || target.type == 'text' ||
         target.type == 'number' || target.type == 'email' ||
         target.type == 'password' || target.type == 'search' ||
         target.type == 'tel' || target.type == 'url' ||
         target.isContentEditable;
};

Blockly.Variables.variablesDB = {};


Blockly.Variables.allUsedVariables = function(root) {
  var blocks;
  if (root instanceof Blockly.Block) {
    // Root is Block.
    blocks = root.getDescendants();
  } else if (root.getAllBlocks) {
    // Root is Workspace.
    blocks = root.getAllBlocks();
  } else {
    throw 'Not Block or Workspace: ' + root;
  }
  var variableHash = Object.create(null);
  // Iterate through every block and add each variable to the hash.
  for (var x = 0; x < blocks.length; x++) {
    var blockVariables = blocks[x].getVars();
    if (blockVariables) {
      for (var y = 0; y < blockVariables.length; y++) {
        var varName = blockVariables[y];
        // Variable name may be null if the block is only half-built.
        if (varName) {
          variableHash[varName.toLowerCase()] = varName;
        }
      }
    }
  }
  // Flatten the hash into a list.
  var variableList = [];
  for (var name in variableHash) {
    variableList.push(variableHash[name]);
  }
  if (Blockly.Variables.variablesDB[root.id]) {
      variableList = variableList.concat(Blockly.Variables.variablesDB[root.id]);
  }
  variableList = variableList.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
  return variableList;
};

Blockly.Variables.addVariable = function(variable, root) {
    if (!Blockly.Variables.variablesDB[root.id]) {
        Blockly.Variables.variablesDB[root.id] = [];
    }
    if (Blockly.Variables.variablesDB[root.id].indexOf(variable) === -1) {
        Blockly.Variables.variablesDB[root.id].push(variable);
    }
};

Blockly.getSvgXY_ = function(element, workspace) {
  var x = 0;
  var y = 0;
  var scale = 1;
  if (goog.dom.contains(workspace.getCanvas(), element) ||
      goog.dom.contains(workspace.getBubbleCanvas(), element)) {
    // Before the SVG canvas, scale the coordinates.
    scale = workspace.scale;
  }
  do {
    if (!element.getAttribute) {
        break;
    } 
    // Loop through this block and every parent.
    var xy = Blockly.utils.getRelativeXY(element);
    if (element == workspace.getCanvas() ||
        element == workspace.getBubbleCanvas()) {
      // After the SVG canvas, don't scale the coordinates.
      scale = 1;
    }
    x += xy.x * scale;
    y += xy.y * scale;
    element = element.parentNode;
  } while (element && element != workspace.getParentSvg());
  return new goog.math.Coordinate(x, y);
};

Blockly.Block.colourCache = {};

/**
 * Change the colour of a block.
 * @param {number|string} colour HSV hue value, or #RRGGBB string.
 */
Blockly.Block.prototype.setColour = function(colour) {
    var hslRegex = /hsl\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\).*/,
        hue = parseFloat(colour);

    if (Blockly.Block.colourCache[colour]) {
        colour = Blockly.Block.colourCache[colour];
    } else {
        var m = colour.match(hslRegex),
            newColour;
        if (m) {
            newColour = hslToRgb(parseInt(m[1], 10) / 360, parseInt(m[2], 10) / 100, parseInt(m[3], 10) / 100);
            newColour = '#' + rgbToHex(Math.round(newColour[0]), Math.round(newColour[1]), Math.round(newColour[2]));
            Blockly.Block.colourCache[colour] = newColour;
            colour = newColour;
        }
    }

    if (!isNaN(hue)) {
        this.colour_ = Blockly.hueToRgb(hue);
    } else {
        this.colour_ = colour;
    }
    if (this.rendered) {
        this.updateColour();
    }
};

/**
 * Overrides Blockly color computation to use HEX colors instead of
 * fixed saturation and value
 */
Blockly.hueToRgb = function(color) {
    return color;
};


/**
 * Handle a mouse up event on an editable field.
 * @param {!Event} e Mouse up event.
 * @private
 */
Blockly.Field.prototype.onMouseUp_ = function(e) {
  if ((goog.userAgent.IPHONE || goog.userAgent.IPAD) &&
      !goog.userAgent.isVersionOrHigher('537.51.2') &&
      e.layerX !== 0 && e.layerY !== 0) {
    // Old iOS spawns a bogus event on the next touch after a 'prompt()' edit.
    // Unlike the real events, these have a layerX and layerY set.
    return;
  } else if (Blockly.utils.isRightButton(e)) {
    // Right-click.
    return;
  } else if (this.sourceBlock_.workspace.isDragging() || this.sourceBlock_.isInFlyout) {
    // Drag operation is concluding.  Don't open the editor.
    return;
  } else if (this.sourceBlock_.isEditable()) {
    // Non-abstract sub-classes must define a showEditor_ method.
    this.showEditor_();
    // The field is handling the touch, but we also want the blockSvg onMouseUp
    // handler to fire, so we will leave the touch identifier as it is.
    // The next onMouseUp is responsible for nulling it out.
  }
};

/**
 * Install this field on a block.
 */
Blockly.Field.prototype.init = function() {
  if (this.fieldGroup_) {
    // Field has already been initialized once.
    return;
  }
  // Build the DOM.
  this.fieldGroup_ = Blockly.utils.createSvgElement('g', {}, null);
  if (!this.visible_) {
    this.fieldGroup_.style.display = 'none';
  }
  this.borderRect_ = Blockly.utils.createSvgElement('rect',
      {'rx': 2,
       'ry': 2,
       'x': -Blockly.BlockSvg.SEP_SPACE_X / 2,
       'y': 0,
       'height': 16}, this.fieldGroup_, this.sourceBlock_.workspace);
  /** @type {!Element} */
  this.textElement_ = Blockly.utils.createSvgElement('text',
      {'class': 'blocklyText', 'y': this.size_.height - 12.5},
      this.fieldGroup_);

  this.updateEditable();
  this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);
  this.mouseUpWrapper_ =
      Blockly.bindEventWithChecks_(this.fieldGroup_, 'mouseup', this,
      this.onMouseUp_);
  // Force a render.
  this.render_();
};

Blockly.setPhantomBlock = function (connection, targetBlock) {
    let sourceBlock = connection.getSourceBlock(),
        targetConnection = targetBlock.outputConnection ? targetBlock.outputConnection : targetBlock.previousConnection,
        phantomSvgGroup = document.createElementNS(Blockly.SVG_NS, 'g'),
        phantomSvgPath = document.createElementNS(Blockly.SVG_NS, 'path'),
        phantomSvgText = document.createElementNS(Blockly.SVG_NS, 'text'),
        xy = sourceBlock.getRelativeToSurfaceXY(),
        position = {},
        breathingAnimation, dx, dy;

    if (Blockly.dragMode_ !== 0) {
        dx = connection.x_ - (targetConnection.x_ - targetBlock.dragStartXY_.x);
        dy = connection.y_ - (targetConnection.y_ - targetBlock.dragStartXY_.y);
    } else {
        dx = connection.x_ - (targetConnection.x_ - targetBlock.getBoundingRectangle().topLeft.x) + 8;
        dy = connection.y_ - (targetConnection.y_ - targetBlock.getBoundingRectangle().topLeft.y);
    }
    position.x = dx - xy.x;
    position.y = dy - xy.y;

    phantomSvgPath.setAttribute('d', targetBlock.svgPath_.getAttribute('d'));
    phantomSvgPath.setAttribute('fill', targetBlock.getColour());
    phantomSvgPath.setAttribute('fill-opacity', 0.25);
    phantomSvgPath.setAttribute('stroke', targetBlock.getColour());
    phantomSvgPath.setAttribute('stroke-width', 1);
    phantomSvgPath.setAttribute('stroke-dasharray', 6);

    phantomSvgGroup.appendChild(phantomSvgPath);
    phantomSvgGroup.appendChild(phantomSvgText);
    phantomSvgGroup.setAttribute('transform', `translate(${position.x}, ${position.y})`);

    Blockly.removePhantomBlock();

    sourceBlock.svgGroup_.appendChild(phantomSvgGroup);

    phantomSvgGroup.animate([{
        opacity: 0
    }, {
        opacity: 1
    }], {
        duration: 400,
        easing: 'ease-out'
    });

    breathingAnimation = phantomSvgGroup.animate([{
        opacity: 0.7
    }, {
        opacity: 1
    }, {
        opacity: 0.7
    }], {
        delay: 400,
        duration: 1200,
        easing: 'ease-in-out',
        iterations: Infinity
    });

    Blockly.phantomBlock_ = {
        svgRoot: phantomSvgGroup,
        position,
        animation: breathingAnimation
    };
};

Blockly.removePhantomBlock = function (connection, targetBlock) {
    if (Blockly.phantomBlock_) {
        let translate = `translate(${Blockly.phantomBlock_.position.x}px, ${Blockly.phantomBlock_.position.y}px)`,
            root = Blockly.phantomBlock_.svgRoot;
        // Stop the breathing animation
        Blockly.phantomBlock_.animation.cancel();
        root.style.transformOrigin = 'center center';
        root.animate([{
            transform: `${translate} scale(1)`,
            opacity: 1
        }, {
            transform: `${translate} scale(4)`,
            opacity: 0
        }], {
            duration: 300,
            easing: 'ease-in'
        }).finished.then(() => {
            root.parentNode.removeChild(root);
        });
        Blockly.phantomBlock_ = null;
    }
};

Blockly.Workspace.prototype.openOmnibox = function () {
    if (!this._omnibox) {
        var svg = this.getParentSvg();
        this._omniboxContainer = document.createElement('div');
        this._omniboxContainer.style.position = 'fixed';
        this._omniboxContainer.style.top = 0;
        this._omniboxContainer.style.left = 0;
        this._omniboxContainer.style.width = '100%';
        this._omniboxContainer.style.height = '100%';
        this._omniboxContainer.addEventListener('mousedown', (e) => {
            var target = e.path ? e.path[0] : e.target;
            if (target === this._omniboxContainer) {
                this.closeOmnibox();
            }
        });
        this._omnibox = document.createElement('kano-blockly-omnibox');
        this._omnibox.targetWorkspace = this;
        this._omnibox.noDrag = true;
        this._omniboxContainer.appendChild(this._omnibox);
        svg.parentNode.appendChild(this._omniboxContainer);
        this._omnibox.style.position = 'fixed';
        this._omnibox.style.maxHeight = '345px';
        this._omnibox.style.boxShadow = 'initial';
    } else {
        this._omniboxContainer.style.display = 'block';
    }
    this._omnibox.focus();
    return this._omnibox;
};

Blockly.Workspace.prototype.closeOmnibox = function (doNotNotify) {
    if (this._omnibox) {
        this._omnibox.clear();
        this._omniboxContainer.style.display = 'none';
        if (!doNotNotify) {
            this._omnibox.dispatchEvent(new CustomEvent('close'));
        }
    }
}

Blockly.Block.prototype.renderSearchPlus_ = function () {
    var inputList = this.inputList,
        connections;

    // Only add the listener once, trick to avoid overriding the constructor
    if (!this.listenerAdded) {
        this.listenerAdded = true;
        // Don't do it if in flyout
        if (this.isInFlyout || !this.rendered) {
            return;
        }

        // Grab all the input connections that are eligible for search plus buttons
        connections = inputList.filter(input => input.type === Blockly.INPUT_VALUE || input.type === Blockly.NEXT_STATEMENT)
                                .map(input => input.connection);
        // Create the buttons
        connections.forEach(connection => this.attachSearchToConnection_(connection));
        // Create a button for the nextConnection if exists and store the created block
        this.shadowSearch_ = this.attachSearchToConnection_(this.nextConnection);
        this.workspace.addChangeListener((e) => {
            // On a move event, we might need to remove/add a button to the next connection as it is not dealt with the `shadow block` paradigm
            if (e.type === Blockly.Events.MOVE) {
                // A block was connected to this one and the next connection now contains a block that is not the search plus button
                if (e.newParentId === this.id
                    && this.shadowSearch_
                    && this.nextConnection.targetConnection
                    && this.nextConnection.targetConnection.getSourceBlock() !== this.shadowSearch_) {
                    // Remove the search plus button and dereference it
                    this.shadowSearch_.dispose();
                    this.shadowSearch_ = null;
                } else if (e.oldParentId === this.id
                        && this.nextConnection
                        && !this.nextConnection.targetConnection
                        && this.workspace) {
                    // A block disconnected from this block and the nextConnection is now empty
                    this.attachSearchToConnection_(this.nextConnection);
                }
            }
        });
    }
};

Blockly.Block.prototype.attachSearchToConnection_ = function (connection) {
    // Do not attach if a block is already connected
    if (connection && !connection.targetConnection && this.workspace) {
        let type, block, connectionName;
        // Prevent this manipulation to trigger events
        Blockly.Events.disable();
        // Select the right type of search plus and connection for the current connection
        if (connection.type === Blockly.INPUT_VALUE) {
            type = 'search_output';
            connectionName = 'outputConnection';
        } else if (connection.type === Blockly.NEXT_STATEMENT) {
            type = 'search_statement';
            connectionName = 'previousConnection';
        }
        // Create the search plus block
        block = this.workspace.newBlock(type);
        block.initSvg();
        block.render();
        // Connect to the given connection
        connection.connect(block[connectionName]);
        Blockly.Events.enable();
        return block;
    }
};

/**
 * Create a virtual workspace where virtual blocks will be added
 * This is used to grab instances of blocks and extract data from them, without the need of rendering them
 */
Blockly._dataWorkspace = new Blockly.Workspace();
Blockly._dataBlocks = {};

Blockly.getDataBlock = function (type) {
    if (!Blockly._dataBlocks[type]) {
        Blockly._dataBlocks[type] = new Blockly.Block(Blockly._dataWorkspace, type);
    }
    return Blockly._dataBlocks[type];
};

Blockly.stringMatch = function (s, lookup) {
    return s.toLowerCase().indexOf(lookup.toLowerCase()) !== -1;
};

Blockly.stringMatchScore = function (s, lookup) {
    let matches = s.toLowerCase().match(lookup.toLowerCase());
    if (!matches) {
        return 0;
    }
    return matches[0].length / matches.input.length;
};

Blockly.Block.prototype.matches = function (qs, workspace) {
    let score = 0;
    this.inputList.forEach(input => {
        input.fieldRow.forEach(field => {
            score += (field.matches(qs, workspace) ? 1 : 0);
        });
    });
    return score;
};

Blockly.Block.prototype.fromQuery = function (qs, workspace) {
    if (!qs) {
        return;
    }
    this.inputList.forEach(input => {
        input.fieldRow.forEach(field => {
            field.fromQuery(qs, workspace);
        });
    });
};

Blockly.Field.prototype.getAPIText = function () {
    return this.getText();
};

Blockly.Field.prototype.matches = function (qs) {
    return qs.split(' ').some(piece => Blockly.stringMatch(this.text_, piece));
};

Blockly.Field.prototype.fromQuery = function () {};

Blockly.FieldDropdown.prototype.getAPIText = function () {
    let options = this.getOptions().map(options => options[0]);
    return `[${options.join('|')}]`;
};

Blockly.FieldDropdown.prototype.matches = function (qs) {
    let options = this.getOptions().map(options => options[0]);
    // As soon as we find an option containing a piece of the query string
    return options.some(option => {
        return qs.split(' ').some(piece => Blockly.stringMatch(option, piece));
    });
};

Blockly.FieldDropdown.prototype.fromQuery = function (qs) {
    let options = this.getOptions();
    // As soon as we find an option containing a piece of the query string
    return options.some(option => {
        return qs.split(' ').forEach(piece => {
            if (Blockly.stringMatch(option[0], piece)) {
                this.setValue(option[1]);
            }
        });
    });
};

Blockly.FieldVariable.prototype.getAPIText = function (qs, workspace) {
    let variables = workspace.variableList.slice(0);
    if (qs.split(' ').some(piece => Blockly.stringMatch('variable', piece))) {
        return `<variable>`;
    }
    for (let i = 0; i < variables.length; i++) {
        if (qs.split(' ').some(piece => Blockly.stringMatch(variables[i], piece))) {
            return `(${variables[i]})`;
        }
    }
    return `<variable>`;
};

Blockly.FieldVariable.prototype.matches = function (qs, workspace) {
    let variables = workspace.variableList.slice(0);
    if (qs.split(' ').some(piece => Blockly.stringMatch('variable', piece))) {
        return `<variable>`;
    }
    // As soon as we find an option containing a piece of the query string
    return variables.some(variable => {
        return qs.split(' ').some(piece => Blockly.stringMatch(variable, piece));
    });
};

Blockly.FieldVariable.prototype.fromQuery = function (qs, workspace) {
    let variables = workspace.variableList.slice(0);
    // As soon as we find an option containing a piece of the query string
    for (let i = 0; i < variables.length; i++) {
        if (qs.split(' ').some(piece => Blockly.stringMatch(variables[i], piece))) {
            this.setValue(variables[i]);
            return;
        }
    }
};

Blockly.FieldNumber.prototype.getAPIText = function (qs) {
    return !isNaN(qs) ? `(${qs})` : '<number>';
};

Blockly.FieldNumber.prototype.matches = function (s) {
    return !isNaN(s) || 'number'.indexOf(s) !== -1;
};

Blockly.FieldNumber.prototype.fromQuery = function (qs) {
    let n = parseInt(qs, 10);
    if (!isNaN(n)) {
        this.setValue(n);
    }
};

Blockly.FieldColour.prototype.getAPIText = function (qs) {
    let colors = Blockly.FieldColour.COLOUR_NAMES,
        highestScore = 0,
        highestColor,
        score;
    if (Blockly.FieldColour.HEX_REGEXP.test(qs)) {
        return `Color: ${qs}`;
    }
    for (let i = 0; i < colors.length; i++) {
        score = Blockly.stringMatchScore(colors[i], qs);
        if (score > highestScore) {
            highestScore = score;
            highestColor = colors[i];
        }
    }
    return highestColor ? highestColor : '<color>';
};

Blockly.FieldColour.prototype.matches = function (s) {
    let colors = Blockly.FieldColour.COLOUR_NAMES,
        highestScore = 0,
        highestColor,
        score;
    if (Blockly.FieldColour.HEX_REGEXP.test(s)) {
        return true;
    }
    for (let i = 0; i < colors.length; i++) {
        score = Blockly.stringMatchScore(colors[i], s);
        if (score > highestScore) {
            highestScore = score;
            highestColor = colors[i];
        }
    }
    return !!highestColor || Blockly.stringMatch('color', s);
};

Blockly.FieldColour.prototype.fromQuery = function (qs) {
    let colors = Blockly.FieldColour.COLOUR_NAMES,
        highestScore = 0,
        highestColor,
        score;
    if (Blockly.FieldColour.HEX_REGEXP.test(qs)) {
        this.setValue(qs);
        return;
    }
    for (let i = 0; i < colors.length; i++) {
        score = Blockly.stringMatchScore(colors[i], qs);
        if (score > highestScore) {
            highestScore = score;
            highestColor = colors[i];
        }
    }
    this.setValue(FIELD_COLORS[highestColor]);
};

Blockly.Input.prototype.toAPIString = function (qs, workspace) {
    let s = '';
    s += this.fieldRow.map(field => {
        return field.getAPIText(qs, workspace);
    }).join(' ');
    // Deal with connection displays
    if (this.type === Blockly.INPUT_VALUE) {
        s += ' [ ]';
    } else if (this.type === Blockly.NEXT_STATEMENT) {
        s += ' ...';
    }
    return s;
};

Blockly.Block.prototype.getFirstAvailableSearch = function () {
    let input;
    for (let i = 0; i < this.inputList.length; i++) {
        input = this.inputList[i];
        if (input.connection && input.connection.targetConnection) {
            let block = input.connection.targetConnection.sourceBlock_;
            if (input.connection.type === Blockly.INPUT_VALUE && block.type === 'search_output'
                || input.connection.type === Blockly.NEXT_STATEMENT && block.type === 'search_statement') {
                return block;
            }
        }
    }
};

Blockly.Block.prototype.toAPIString = function (qs, workspace) {
    return this.inputList.map(input => {
        return input.toAPIString(qs, workspace);
    }).join(' ');
};

Blockly.Workspace.prototype.search = function (qs) {
    let blocks = [];
    // lookup blocks in the toolbox
    this.toolbox.toolbox.forEach(category => {
        blocks = blocks.concat(category.blocks.map(block => block.id));
    });
    // Lookup all blocks registered
    //blocks = Object.keys(Blockly.Blocks);
    return blocks
        .map(Blockly.getDataBlock)
        .filter(block => {
            return block.matches(qs, this) > 0;
        });
};

Blockly.FieldLookup = function (text, c) {
    this._text = text;
    this._c = c || '';
    this.size_ = new goog.math.Size(0, Blockly.BlockSvg.MIN_BLOCK_Y);
};
goog.inherits(Blockly.FieldLookup, Blockly.Field);
Blockly.FieldLookup.prototype.init = function () {
    if (this._container) {
        // Field has already been initialized once.
        return;
    }
    // Build the DOM.
    this._container = Blockly.utils.createSvgElement('g', {
        class: 'blocklyLookupField ' + this._c
    }, null);
    this._textEl = Blockly.utils.createSvgElement('text', {
        transform: `translate(0, 12)`
    }, this._container);
    this._textEl.appendChild(document.createTextNode(this._text));
    this.sourceBlock_.getSvgRoot().appendChild(this._container);
    Blockly.bindEvent_(this._container, 'mousedown', this, this._onMouseDown);
};

/**
 * Draws the border with the correct width.
 * Saves the computed width in a property.
 * @private
 */
Blockly.FieldLookup.prototype.render_ = function() {
  if (!this.visible_) {
    this.size_.width = 0;
    return;
  }
  // Replace the text.
  goog.dom.removeChildren(/** @type {!Element} */ (this._textEl));
  var textNode = document.createTextNode(this._text);
  this._textEl.appendChild(textNode);

  var width = Blockly.Field.getCachedWidth(this._textEl);
  this.size_.width = width;
};

Blockly.FieldLookup.prototype._onMouseDown = function (e) {
    if (Blockly.WidgetDiv.isVisible()) {
        Blockly.WidgetDiv.hide();
    } else if (!this.sourceBlock_.isInFlyout) {
        this.showEditor_();
        e.preventDefault();
        e.stopPropagation();
    }
};
Blockly.FieldLookup.prototype.getSvgRoot = function () {
    return this._container;
};
Blockly.FieldLookup.prototype.showEditor_ = function () {
    var block = this.sourceBlock_;
    var xy = Blockly.getSvgXY_(block.svgGroup_, block.workspace);
    var connection = block.outputConnection ? block.outputConnection : block.previousConnection;
    var targetConnection = connection.targetConnection;
    var workspace = this.sourceBlock_.workspace;

    var omnibox = workspace.openOmnibox();
    omnibox.style.top = `${xy.y}px`;
    omnibox.style.left = `${xy.x}px`;

    omnibox.filter = (block) => {
        let blockConnection;
        if (targetConnection.type === Blockly.NEXT_STATEMENT) {
            blockConnection = block.previousConnection;
        } else if (targetConnection.type === Blockly.INPUT_VALUE) {
            blockConnection = block.outputConnection;
        }
        // The connection exists on the block found and it matches the type of the input
        return blockConnection  && (!targetConnection.check_ || !blockConnection.check_
                || targetConnection.check_.some(inputCheck => blockConnection.check_.indexOf(inputCheck) !== -1));
    };
    var onConfirm = (e) => {
        let type;
        omnibox.removeEventListener('confirm', onConfirm);
        omnibox.removeEventListener('close', onConfirm);
        if (e.detail && e.detail.selected) {
            type = e.detail.selected.type;
            if (type) {
                let block = workspace.newBlock(type),
                    searchBlock;
                block.fromQuery(omnibox.query, workspace);
                block.initSvg();
                block.render();
                if (targetConnection.type === Blockly.NEXT_STATEMENT) {
                    targetConnection.connect(block.previousConnection);
                } else if (targetConnection.type === Blockly.INPUT_VALUE) {
                    targetConnection.connect(block.outputConnection);
                }
                setTimeout(() => {
                    // Focus on the first available search block of the inserted block
                    searchBlock = block.getFirstAvailableSearch();
                    if (searchBlock) {
                        searchBlock.getField('SEARCH').focus();
                    }
                });
            }
        }
        workspace.closeOmnibox(true);
    };
    omnibox.addEventListener('confirm', onConfirm);
    omnibox.addEventListener('close', onConfirm);
    if ('animate' in HTMLElement.prototype) {
        let rect = omnibox.getBoundingClientRect(),
            hw = block.getHeightWidth();
        omnibox.style.transformOrigin = '0 0';
        omnibox.animate({
            transform: [`scale(${hw.width / rect.width}, ${hw.height / rect.height})`, 'scale(1, 1)']
        }, {
            duration: 170,
            easing: 'cubic-bezier(0.2, 0, 0.13, 1.5)'
        });
    }
};

Blockly.FieldLookup.prototype.focus = function () {
    let onKeyDown = (e) => {
        window.removeEventListener('keydown', onKeyDown);
        if (e.keyCode === 13) {
            this.showEditor_();
        }
    };
    window.addEventListener('keydown', onKeyDown);
    this._container.classList.add('selected');
};

Blockly.Blocks.search_statement = {
    init: function () {
        let searchField = new Blockly.FieldLookup('Type: __________', 'blocklySearchStatement');
        this.setColour('#bdbdbd');
        this.appendDummyInput('SEARCH')
            .appendField(searchField, 'SEARCH');
        this.setPreviousStatement(true);
        this.setPaddingY(0);
        this.setPaddingX(0);
        this.setShadow(true);
        this.workspace.addChangeListener(() => {
            if (!this.previousConnection.targetConnection) {
                this.dispose();
            }
        });
    }
};

Blockly.Blocks.search_output = {
    init: function () {
        let searchField = new Blockly.FieldLookup('+', 'blocklySearchOutput');
        this.setColour('#bdbdbd');
        this.appendDummyInput('SEARCH')
            .appendField(searchField, 'SEARCH');
        this.setOutput(true);
        this.setShadow(true);
    }
};

Blockly.JavaScript.search_output = function () {
    return '';
};

Blockly.JavaScript.search_statement = function () {
    return '';
};


/**
 * Set the workspace to have focus in the browser.
 * @private
 */
Blockly.WorkspaceSvg.prototype.setBrowserFocus = function() {
  // Blur whatever was focused since explcitly grabbing focus below does not
  // work in Edge.
//   if (document.activeElement) {
//     document.activeElement.blur();
//   }
  try {
    // Focus the workspace SVG - this is for Chrome and Firefox.
    this.getParentSvg().focus();
  }  catch (e) {
    // IE and Edge do not support focus on SVG elements. When that fails
    // above, get the injectionDiv (the workspace's parent) and focus that
    // instead.  This doesn't work in Chrome.
    try {
      // In IE11, use setActive (which is IE only) so the page doesn't scroll
      // to the workspace gaining focus.
      this.getParentSvg().parentNode.setActive();
    } catch (e) {
      // setActive support was discontinued in Edge so when that fails, call
      // focus instead.
      this.getParentSvg().parentNode.focus();
    }
  }
};

/**
 * Class for an editable dropdown field.
 * @param {(!Array.<!Array>|!Function)} menuGenerator An array of options
 *     for a dropdown list, or a function which generates these options.
 * @param {Function=} opt_validator A function that is executed when a new
 *     option is selected, with the newly selected value as its sole argument.
 *     If it returns a value, that value (which must be one of the options) will
 *     become selected in place of the newly selected option, unless the return
 *     value is null, in which case the change is aborted.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldCustomDropdown = function(menuGenerator, opt_validator) {
  let options = menuGenerator.map(item => {
      return [item.label, item.value];
  });
  this.textLabels = menuGenerator.reduce((acc, item) => {
    acc[Blockly.utils.replaceMessageReferences(item.label)] = Blockly.utils.replaceMessageReferences(item.textLabel);
    return acc;
  }, {});

  // Call parent's constructor.
  Blockly.FieldCustomDropdown.superClass_.constructor.call(this, options, opt_validator);
};
goog.inherits(Blockly.FieldCustomDropdown, Blockly.FieldDropdown);

/**
 * Set the text in this field.  Trigger a rerender of the source block.
 * @param {*} newText New text.
 */
Blockly.FieldCustomDropdown.prototype.setText = function(newText) {
    let text = this.textLabels[newText];
    if (!text) {
        return;
    }
    Blockly.FieldCustomDropdown.superClass_.setText.call(this, text);
};

/**
 * Get the text from this field.
 * @return {string} Current text.
 */
Blockly.FieldCustomDropdown.prototype.getText = function() {
    let labels = Object.keys(this.textLabels);
    for (let i = 0; i < labels.length; i++) {
        if (this.text_ === this.textLabels[labels[i]]) {
            return labels[i];
        }
    }
};

/**
 * Install this dropdown on a block.
 */
Blockly.FieldCustomDropdown.prototype.init = function() {
  if (this.fieldGroup_) {
    // Dropdown has already been initialized once.
    return;
  }
  // Add dropdown arrow: "option ▾" (LTR) or "▾ אופציה" (RTL)
  this.arrow_ = Blockly.utils.createSvgElement('tspan', {}, null);
  this.arrow_.appendChild(document.createTextNode(this.sourceBlock_.RTL ?
      Blockly.FieldDropdown.ARROW_CHAR + ' ' :
      ' ' + Blockly.FieldDropdown.ARROW_CHAR));

  Blockly.FieldDropdown.superClass_.init.call(this);
  // Force a reset of the text to add the arrow.
  var text = this.getText();
  this.text_ = null;
  this.setText(text);
}




Blockly.Functions = {};

Blockly.Functions.NAME_TYPE = 'FUNCTION';

class UserFunction {
    constructor (definitionBlock) {
        let onDelete;
        this.definitionBlock = definitionBlock;
        this.params = [];
        this.calls = [];

        onDelete = (e) => {
            if (e.type === Blockly.Events.DELETE && e.blockId === this.definitionBlock.id) {
                this.deleteCalls();
                this.deleteParams();
                Blockly.Workspace.getById(e.workspaceId).removeChangeListener(onDelete);
            }
        }
        this.definitionBlock.workspace.addChangeListener(onDelete);
    }

    addCall (callBlock) {
        let onDelete = (e) => {
            let index;
            if (e.type === Blockly.Events.DELETE && e.blockId === callBlock.id) {
                Blockly.Workspace.getById(e.workspaceId).removeChangeListener(onDelete);
                index = this.calls.indexOf(callBlock);
                if (index !== -1) {
                    this.calls.splice(index, 1);
                }
            }
        };
        for (let i = 0; i < this.calls.length; i++) {
            if (this.calls[i].id === callBlock.id) {
                this.calls.splice(i, 1, callBlock);
                callBlock.workspace.addChangeListener(onDelete);
                return;
            }
        }
        this.calls.push(callBlock);
        callBlock.workspace.addChangeListener(onDelete);
    }

    addParam (paramBlock) {
        let onDelete = (e) => {
            let index;
            if (e.type === Blockly.Events.DELETE && e.blockId === paramBlock.id) {
                Blockly.Workspace.getById(e.workspaceId).removeChangeListener(onDelete);
                index = this.params.indexOf(paramBlock);
                if (index !== -1) {
                    this.params.splice(index, 1);
                }
            }
        };
        for (let i = 0; i < this.params.length; i++) {
            if (this.params[i].id === paramBlock.id) {
                this.params.splice(i, 1, paramBlock);
                paramBlock.workspace.addChangeListener(onDelete);
                return;
            }
        }
        this.params.push(paramBlock);
        paramBlock.workspace.addChangeListener(onDelete);
    }

    deleteCalls () {
        this.calls.forEach(block => block.dispose(false, false));
    }

    deleteParams () {
        this.params.forEach(block => block.dispose(false, false));
    }

    getCallXml () {
        return `<block type="function_call"><mutation definition="${this.definitionBlock.id}"></mutation></block>`;
    }

    getParamsXml () {
        let params = this.getParams();
        return Object.keys(params).map(param => `<block type="function_argument"><mutation param="${param}" definition="${this.definitionBlock.id}"></mutation></block>`);
    }

    getName () {
        return this.definitionBlock.getFieldValue('NAME');
    }

    getParams () {
        return this.definitionBlock.paramFields.reduce((acc, field) => {
            acc[field] = this.definitionBlock.getFieldValue(field);
            return acc;
        }, {});
    }

    getReturns () {
        return this.definitionBlock.returns;
    }

    updateCallBlocks () {
        this.calls.forEach(block => block.updateShape());
        this.definitionBlock.workspace.fireChangeListener({
            type: Blockly.Events.UPDATE_FUNCTIONS,
            blockId: this.definitionBlock.id
        });
    }

    updateParamsBlocks () {
        let params = Object.keys(this.getParams());
        // Delete blocks that used to point to a deleted param
        this.params.forEach((block, index) => {
            if (params.indexOf(block.paramName) === -1) {
                block.dispose(false, false);
                this.params.splice(index, 1);
            }
        });
        this.params.forEach(block => block.updateShape());
    }
}

Blockly.FunctionsRegistry = function (workspace) {
    this.workspace = workspace;
    this.functions = {};
};

Blockly.FunctionsRegistry.prototype.createFunction = function (definitionBlock) {
    this.functions[definitionBlock.id] = new UserFunction(definitionBlock);
};

Blockly.FunctionsRegistry.prototype.createCall = function (id, callBlock) {
    this.getFunction(id).addCall(callBlock);
};

Blockly.FunctionsRegistry.prototype.createParam = function (id, paramBlock) {
    this.getFunction(id).addParam(paramBlock);
};

Blockly.FunctionsRegistry.prototype.getFunction = function (definitionId) {
    return this.functions[definitionId];
};

Blockly.FunctionsRegistry.prototype.getAllFunctions = function () {
    return Object.keys(this.functions).map(defId => this.functions[defId]);
};

Blockly.FunctionsRegistry.prototype.getToolbox = function () {
    let toolbox = Object.keys(this.functions).map(functionId => {
        return {
            custom: this.functions[functionId].getCallXml()
        }
    });

    toolbox.unshift({ id: 'function_definition' });

    return toolbox;
};