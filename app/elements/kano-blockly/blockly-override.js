/* globals Blockly, goog */
Blockly.Blocks.colour.HUE = '#ffff00';
Blockly.Blocks.logic.HUE = '#7DC242';
Blockly.Blocks.variables.HUE = '#34A836';
Blockly.Blocks.loops.HUE = '#ffff00';
Blockly.Blocks.math.HUE = '#7DC242';
Blockly.Blocks.texts.HUE = '#9C27B0';
Blockly.Blocks.lists.HUE = '#ffff00';
Blockly.Blocks.procedures.HUE = '#ffff00';

Blockly.Scrollbar.scrollbarThickness = 5;

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
Blockly.isTargetInput_ = function(e) {
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

/**
 * Move the zoom controls to the bottom-right corner.
 */
Blockly.ZoomControls.prototype.position = function() {
  var metrics = this.workspace_.getMetrics();
  if (!metrics) {
    // There are no metrics available (workspace is probably not visible).
    return;
  }
  this.left_ = metrics.viewWidth + metrics.absoluteLeft - this.WIDTH_ - this.MARGIN_SIDE_ - Blockly.Scrollbar.scrollbarThickness;

  this.top_ = 0;
  this.svgGroup_.setAttribute('transform', 'translate(' + this.left_ + ',' + this.top_ + ')');
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

Blockly.Events.DROP_BLOCK = 'drop-block';
Blockly.Events.OPEN_FLYOUT = 'open-flyout';
Blockly.Events.CLOSE_FLYOUT = 'close-flyout';

/**
 * Overrides Blockly color computation to use HEX colors instead of
 * fixed saturation and value
 */
Blockly.hueToRgb = function(color) {
    return color;
};



// UI constants for rendering blocks.
/**
 * Horizontal space between elements.
 * @const
 */
Blockly.BlockSvg.SEP_SPACE_X = 10;
/**
 * Vertical space between elements.
 * @const
 */
Blockly.BlockSvg.SEP_SPACE_Y = 6;
/**
 * Vertical padding around inline elements.
 * @const
 */
Blockly.BlockSvg.INLINE_PADDING_Y = 5;
/**
 * Minimum height of a block.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y = 25;
/**
 * Height of horizontal puzzle tab.
 * @const
 */
Blockly.BlockSvg.TAB_HEIGHT = 20;
/**
 * Width of horizontal puzzle tab.
 * @const
 */
Blockly.BlockSvg.TAB_WIDTH = 6;
/**
 * Width of vertical tab (inc left margin).
 * @const
 */
Blockly.BlockSvg.NOTCH_WIDTH = 30;
/**
 * Rounded corner radius.
 * @const
 */
Blockly.BlockSvg.CORNER_RADIUS = 4;
/**
 * Do blocks with no previous or output connections have a 'hat' on top?
 * @const
 */
Blockly.BlockSvg.START_HAT = false;
/**
 * Path of the top hat's curve.
 * @const
 */
Blockly.BlockSvg.START_HAT_PATH = 'c 30,-15 70,-15 100,0';
/**
 * Path of the top hat's curve's highlight in LTR.
 * @const
 */
Blockly.BlockSvg.START_HAT_HIGHLIGHT_LTR =
    'c 17.8,-9.2 45.3,-14.9 75,-8.7 M 100.5,0.5';
/**
 * Path of the top hat's curve's highlight in RTL.
 * @const
 */
Blockly.BlockSvg.START_HAT_HIGHLIGHT_RTL =
    'm 25,-8.7 c 29.7,-6.2 57.2,-0.5 75,8.7';
/**
 * Distance from shape edge to intersect with a curved corner at 45 degrees.
 * Applies to highlighting on around the inside of a curve.
 * @const
 */
Blockly.BlockSvg.DISTANCE_45_INSIDE = (1 - Math.SQRT1_2) *
      (Blockly.BlockSvg.CORNER_RADIUS - 0.5) + 0.5;
/**
 * Distance from shape edge to intersect with a curved corner at 45 degrees.
 * Applies to highlighting on around the outside of a curve.
 * @const
 */
Blockly.BlockSvg.DISTANCE_45_OUTSIDE = (1 - Math.SQRT1_2) *
      (Blockly.BlockSvg.CORNER_RADIUS + 0.5) - 0.5;
/**
* SVG path for drawing next/previous notch from left to right.
* @const
*/
Blockly.BlockSvg.NOTCH_PATH_LEFT = 'l 1,0 c 0,6 11,6 11,0 l 3,0';

/**
 * SVG path for drawing next/previous notch from left to right with
 * highlighting.
 * @const
 */
Blockly.BlockSvg.NOTCH_PATH_LEFT_HIGHLIGHT = 'l 8,6 8,-6';
/**
 * SVG path for drawing next/previous notch from right to left.
 * @const
 */
Blockly.BlockSvg.NOTCH_PATH_RIGHT = 'l -3,0 c 0,6 -9,6 -9,0 l -3,0';
/**
 * SVG path for drawing jagged teeth at the end of collapsed blocks.
 * @const
 */
Blockly.BlockSvg.JAGGED_TEETH = 'l 8,0 0,4 8,4 -16,8 8,4';
/**
 * Height of SVG path for jagged teeth at the end of collapsed blocks.
 * @const
 */
Blockly.BlockSvg.JAGGED_TEETH_HEIGHT = 20;
/**
 * Width of SVG path for jagged teeth at the end of collapsed blocks.
 * @const
 */
Blockly.BlockSvg.JAGGED_TEETH_WIDTH = 15;
/**
 * SVG path for drawing a horizontal puzzle tab from top to bottom.
 * @const
 */
Blockly.BlockSvg.TAB_PATH_DOWN = 'v ' + (7 - Blockly.BlockSvg.CORNER_RADIUS) + ' c -' + Blockly.BlockSvg.TAB_WIDTH + ',0 -' + Blockly.BlockSvg.TAB_WIDTH + ',10 0,10 v 3';
Blockly.BlockSvg.TAB_PATH_UP = 'V ' + (Blockly.BlockSvg.TAB_HEIGHT - 4) + ' c -' + Blockly.BlockSvg.TAB_WIDTH + ',0 -' + Blockly.BlockSvg.TAB_WIDTH + ',-8 0,-8';
/**
 * SVG path for drawing a horizontal puzzle tab from top to bottom with
 * highlighting from the upper-right.
 * @const
 */
Blockly.BlockSvg.TAB_PATH_DOWN_HIGHLIGHT_RTL = 'v 6.5 m -' +
    (Blockly.BlockSvg.TAB_WIDTH * 0.97) + ',3 q -' +
    (Blockly.BlockSvg.TAB_WIDTH * 0.05) + ',10 ' +
    (Blockly.BlockSvg.TAB_WIDTH * 0.3) + ',9.5 m ' +
    (Blockly.BlockSvg.TAB_WIDTH * 0.67) + ',-1.9 v 1.4';

/**
 * SVG path for drawing the top-left corner of a statement input.
 * Includes the top notch, a horizontal space, and the rounded inside corner.
 * @const
 */
Blockly.BlockSvg.INNER_TOP_LEFT_CORNER =
    Blockly.BlockSvg.NOTCH_PATH_RIGHT + ' h -' +
    (Blockly.BlockSvg.NOTCH_WIDTH - 15 - Blockly.BlockSvg.CORNER_RADIUS) +
    ' a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 -' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;
/**
 * SVG path for drawing the bottom-left corner of a statement input.
 * Includes the rounded inside corner.
 * @const
 */
Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;
/**
 * SVG path for drawing highlight on the top-left corner of a statement
 * input in RTL.
 * @const
 */
Blockly.BlockSvg.INNER_TOP_LEFT_CORNER_HIGHLIGHT_RTL =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 ' +
    (-Blockly.BlockSvg.DISTANCE_45_OUTSIDE - 0.5) + ',' +
    (Blockly.BlockSvg.CORNER_RADIUS -
    Blockly.BlockSvg.DISTANCE_45_OUTSIDE);


Blockly.BlockSvg.TOP_LEFT_CORNER_START = `m 0, 4`;
/**
 * SVG path for drawing the rounded top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER =
    'A ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ', 0';
/**
 * SVG path for drawing the rounded top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER_INNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 1 0,0 -' +
    Blockly.BlockSvg.CORNER_RADIUS + ', ' + Blockly.BlockSvg.CORNER_RADIUS;
/**
 * SVG path for drawing the rounded top-right corner.
 * @const
 */
Blockly.BlockSvg.TOP_RIGHT_CORNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ', ' + Blockly.BlockSvg.CORNER_RADIUS;
/**
 * SVG path for drawing the rounded top-right corner.
 * @const
 */
Blockly.BlockSvg.TOP_RIGHT_CORNER_INNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 -' +
    Blockly.BlockSvg.CORNER_RADIUS + ', -' + Blockly.BlockSvg.CORNER_RADIUS;
/**
 * SVG path for drawing the rounded top-right highlighted corner.
 * @const
 */
Blockly.BlockSvg.TOP_RIGHT_CORNER_HIGHLIGHT =
    'a ' + (Blockly.BlockSvg.CORNER_RADIUS - 0.5) + ',' +
    (Blockly.BlockSvg.CORNER_RADIUS - 0.5) + ' 0 0,1 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ', ' + (Blockly.BlockSvg.CORNER_RADIUS + 0.5);
/**
 * SVG path for drawing the rounded top-right corner.
 * @const
 */
Blockly.BlockSvg.BOTTOM_RIGHT_CORNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 -' +
    Blockly.BlockSvg.CORNER_RADIUS + ', ' + Blockly.BlockSvg.CORNER_RADIUS;
/**
 * SVG path for drawing the rounded top-right corner.
 * @const
 */
Blockly.BlockSvg.BOTTOM_RIGHT_CORNER_INNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ', -' + Blockly.BlockSvg.CORNER_RADIUS;
/**
 * SVG path for drawing highlight on the bottom-left corner of a statement
 * input in RTL.
 * @const
 */
Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER_HIGHLIGHT_RTL =
    'a ' + (Blockly.BlockSvg.CORNER_RADIUS + 0.5) + ',' +
    (Blockly.BlockSvg.CORNER_RADIUS + 0.5) + ' 0 0,0 ' +
    (Blockly.BlockSvg.CORNER_RADIUS + 0.5) + ',' +
    (Blockly.BlockSvg.CORNER_RADIUS + 0.5);
/**
 * SVG path for drawing highlight on the bottom-left corner of a statement
 * input in LTR.
 * @const
 */
Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER_HIGHLIGHT_LTR =
    'a ' + (Blockly.BlockSvg.CORNER_RADIUS + 0.5) + ',' +
    (Blockly.BlockSvg.CORNER_RADIUS + 0.5) + ' 0 0,0 ' +
    (Blockly.BlockSvg.CORNER_RADIUS -
    Blockly.BlockSvg.DISTANCE_45_OUTSIDE) + ',' +
    (Blockly.BlockSvg.DISTANCE_45_OUTSIDE + 0.5);

/**
 * Render the left edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Array.<string>} highlightSteps Path of block highlights.
 * @param {!Object} connectionsXY Location of block.
 * @param {number} cursorY Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawLeft_ =
    function(steps, highlightSteps, connectionsXY, cursorY) {
  if (this.outputConnection) {
    // Create output connection.
    this.outputConnection.setOffsetInBlock(0, 0);
    // This connection will be tightened when the parent renders.
    steps.push(Blockly.BlockSvg.TAB_PATH_UP);

    if (this.RTL) {
      highlightSteps.push('M', (Blockly.BlockSvg.TAB_WIDTH * -0.25) + ',8.4');
      highlightSteps.push('l', (Blockly.BlockSvg.TAB_WIDTH * -0.45) + ',-2.1');
    } else {
      highlightSteps.push('V', Blockly.BlockSvg.TAB_HEIGHT - 1.5);
      highlightSteps.push('m', (Blockly.BlockSvg.TAB_WIDTH * -0.92) +
                          ',-0.5 q ' + (Blockly.BlockSvg.TAB_WIDTH * -0.19) +
                          ',-5.5 0,-11');
      highlightSteps.push('m', (Blockly.BlockSvg.TAB_WIDTH * 0.92) +
                          ',1 V 0.5 H 1');
    }
    this.width += Blockly.BlockSvg.TAB_WIDTH;
  } else if (!this.RTL) {
    if (this.squareTopLeftCorner_) {
      // Statement block in a stack.
      highlightSteps.push('V', 0.5);
    } else {
      highlightSteps.push('V', Blockly.BlockSvg.CORNER_RADIUS);
    }
  }
  steps.push('z');
};

/**
 * Render the top edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Array.<string>} highlightSteps Path of block highlights.
 * @param {number} rightEdge Minimum width of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawTop_ =
    function(steps, highlightSteps, rightEdge) {
  /* eslint-disable indent */
  // Position the cursor at the top-left starting point.
  this.squareTopLeftCorner_ = false;
  if (this.squareTopLeftCorner_) {
    steps.push('m 0,0');
    highlightSteps.push('m 0.5,0.5');
    if (this.startHat_) {
      steps.push(Blockly.BlockSvg.START_HAT_PATH);
      highlightSteps.push(this.RTL ?
          Blockly.BlockSvg.START_HAT_HIGHLIGHT_RTL :
          Blockly.BlockSvg.START_HAT_HIGHLIGHT_LTR);
    }
  } else {
    steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER_START);
    highlightSteps.push(this.RTL ?
        Blockly.BlockSvg.TOP_LEFT_CORNER_START_HIGHLIGHT_RTL :
        Blockly.BlockSvg.TOP_LEFT_CORNER_START_HIGHLIGHT_LTR);
    // Top-left rounded corner.
    steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER);
    highlightSteps.push(Blockly.BlockSvg.TOP_LEFT_CORNER_HIGHLIGHT);
  }

  // Top edge.
  if (this.previousConnection) {
    steps.push('H', Blockly.BlockSvg.NOTCH_WIDTH - 15);
    highlightSteps.push('H', Blockly.BlockSvg.NOTCH_WIDTH - 15);
    steps.push(Blockly.BlockSvg.NOTCH_PATH_LEFT);
    highlightSteps.push(Blockly.BlockSvg.NOTCH_PATH_LEFT_HIGHLIGHT);

    var connectionX = (this.RTL ?
        -Blockly.BlockSvg.NOTCH_WIDTH : Blockly.BlockSvg.NOTCH_WIDTH);
    this.previousConnection.setOffsetInBlock(connectionX, 0);
  }
  steps.push('H', rightEdge - Blockly.BlockSvg.CORNER_RADIUS);
  highlightSteps.push('H', rightEdge - 0.5 - Blockly.BlockSvg.CORNER_RADIUS);
  this.width = rightEdge;
};  /* eslint-enable indent */

/**
 * Render the right edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Array.<string>} highlightSteps Path of block highlights.
 * @param {!Array.<string>} inlineSteps Inline block outlines.
 * @param {!Array.<string>} highlightInlineSteps Inline block highlights.
 * @param {!Array.<!Array.<!Object>>} inputRows 2D array of objects, each
 *     containing position information.
 * @param {number} iconWidth Offset of first row due to icons.
 * @return {number} Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawRight_ = function(steps, highlightSteps,
    inlineSteps, highlightInlineSteps, inputRows, iconWidth) {
  var cursorX;
  var cursorY = 0;
  var connectionX, connectionY;
  for (var y = 0, row; row = inputRows[y]; y++) {
    cursorX = Blockly.BlockSvg.SEP_SPACE_X;
    if (y == 0) {
      cursorX += this.RTL ? -iconWidth : iconWidth;
    }
    highlightSteps.push('M', (inputRows.rightEdge - 0.5) + ',' +
        (cursorY + 0.5));
    if (this.isCollapsed()) {
      // Jagged right edge.
      var input = row[0];
      var fieldX = cursorX;
      var fieldY = cursorY;
      this.renderFields_(input.fieldRow, fieldX, fieldY);
      steps.push(Blockly.BlockSvg.JAGGED_TEETH);
      highlightSteps.push('h 8');
      var remainder = row.height - Blockly.BlockSvg.JAGGED_TEETH_HEIGHT;
      steps.push('v', remainder);
      if (this.RTL) {
        highlightSteps.push('v 3.9 l 7.2,3.4 m -14.5,8.9 l 7.3,3.5');
        highlightSteps.push('v', remainder - 0.7);
      }
      this.width += Blockly.BlockSvg.JAGGED_TEETH_WIDTH;
    } else if (row.type == Blockly.BlockSvg.INLINE) {
      // Inline inputs.
      for (var x = 0, input; input = row[x]; x++) {
        var fieldX = cursorX;
        var fieldY = cursorY;
        if (row.thicker) {
          // Lower the field slightly.
          fieldY += Blockly.BlockSvg.INLINE_PADDING_Y;
        }
        // TODO: Align inline field rows (left/right/centre).
        cursorX = this.renderFields_(input.fieldRow, fieldX, fieldY);
        if (input.type != Blockly.DUMMY_INPUT) {
          cursorX += input.renderWidth + Blockly.BlockSvg.SEP_SPACE_X;
        }
        if (input.type == Blockly.INPUT_VALUE) {
          inlineSteps.push('M', (cursorX - Blockly.BlockSvg.SEP_SPACE_X) +
                           ',' + (cursorY + Blockly.BlockSvg.INLINE_PADDING_Y + Blockly.BlockSvg.CORNER_RADIUS));
          inlineSteps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER_INNER);
          inlineSteps.push('h', Blockly.BlockSvg.TAB_WIDTH - 2 -
                           input.renderWidth + Blockly.BlockSvg.CORNER_RADIUS * 2);
          inlineSteps.push(Blockly.BlockSvg.TOP_LEFT_CORNER_INNER);
          inlineSteps.push('v', 1);
          inlineSteps.push(Blockly.BlockSvg.TAB_PATH_DOWN);
          inlineSteps.push('v', input.renderHeight -
                                Blockly.BlockSvg.TAB_HEIGHT - Blockly.BlockSvg.CORNER_RADIUS);
          inlineSteps.push(Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER);
          inlineSteps.push('h', input.renderWidth + 2 -
                           Blockly.BlockSvg.TAB_WIDTH - Blockly.BlockSvg.CORNER_RADIUS * 2);
          inlineSteps.push(Blockly.BlockSvg.BOTTOM_RIGHT_CORNER_INNER);
          inlineSteps.push('z');
          if (this.RTL) {
            // Highlight right edge, around back of tab, and bottom.
            highlightInlineSteps.push('M',
                (cursorX - Blockly.BlockSvg.SEP_SPACE_X - 2.5 +
                 Blockly.BlockSvg.TAB_WIDTH - input.renderWidth) + ',' +
                (cursorY + Blockly.BlockSvg.INLINE_PADDING_Y + 0.5));
            highlightInlineSteps.push(
                Blockly.BlockSvg.TAB_PATH_DOWN_HIGHLIGHT_RTL);
            highlightInlineSteps.push('v',
                input.renderHeight - Blockly.BlockSvg.TAB_HEIGHT + 2.5);
            highlightInlineSteps.push('h',
                input.renderWidth - Blockly.BlockSvg.TAB_WIDTH + 2);
          } else {
            // Highlight right edge, bottom.
            highlightInlineSteps.push('M',
                (cursorX - Blockly.BlockSvg.SEP_SPACE_X + 0.5) + ',' +
                (cursorY + Blockly.BlockSvg.INLINE_PADDING_Y + 0.5));
            highlightInlineSteps.push('v', input.renderHeight + 1);
            highlightInlineSteps.push('h', Blockly.BlockSvg.TAB_WIDTH - 2 -
                                           input.renderWidth);
            // Short highlight glint at bottom of tab.
            highlightInlineSteps.push('M',
                (cursorX - input.renderWidth - Blockly.BlockSvg.SEP_SPACE_X +
                 0.9) + ',' + (cursorY + Blockly.BlockSvg.INLINE_PADDING_Y +
                 Blockly.BlockSvg.TAB_HEIGHT - 0.7));
            highlightInlineSteps.push('l',
                (Blockly.BlockSvg.TAB_WIDTH * 0.46) + ',-2.1');
          }
          // Create inline input connection.
          if (this.RTL) {
            connectionX = -cursorX -
                Blockly.BlockSvg.TAB_WIDTH + Blockly.BlockSvg.SEP_SPACE_X +
                input.renderWidth + 1;
          } else {
            connectionX = cursorX +
                Blockly.BlockSvg.TAB_WIDTH - Blockly.BlockSvg.SEP_SPACE_X -
                input.renderWidth - 1;
          }
          connectionY = cursorY + Blockly.BlockSvg.INLINE_PADDING_Y + 1;
          input.connection.setOffsetInBlock(connectionX, connectionY);
        }
      }

      cursorX = Math.max(cursorX, inputRows.rightEdge);
      this.width = Math.max(this.width, cursorX);
      // CUSTOM CODE
      var v = row.height;
      if (y === 0) {
          v -= Blockly.BlockSvg.CORNER_RADIUS;
        steps.push('H', cursorX - Blockly.BlockSvg.CORNER_RADIUS);
        highlightSteps.push('H', cursorX - 0.5 - Blockly.BlockSvg.CORNER_RADIUS);
        steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
        highlightSteps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER_HIGHLIGHT);
      } else {
        steps.push('H', cursorX);
        highlightSteps.push('H', cursorX - 0.5);
      }
      if (y === inputRows.length - 1) {
          v -= Blockly.BlockSvg.CORNER_RADIUS;
      }
      var nextRow = inputRows[y + 1];
      if (nextRow && nextRow.type === Blockly.NEXT_STATEMENT) {
          v -= Blockly.BlockSvg.CORNER_RADIUS;
      }
      steps.push('v', v);
        if (this.RTL) {
            highlightSteps.push('v', v - 1);
        }
      // END
        
      //steps.push('H', cursorX);
      //highlightSteps.push('H', cursorX - 0.5);
      //steps.push('v', row.height);
      //if (this.RTL) {
        //highlightSteps.push('v', row.height - 1);
      //}
    } else if (row.type == Blockly.INPUT_VALUE) {
      // External input.
      var input = row[0];
      var fieldX = cursorX;
      var fieldY = cursorY;
      if (input.align != Blockly.ALIGN_LEFT) {
        var fieldRightX = inputRows.rightEdge - input.fieldWidth -
            Blockly.BlockSvg.TAB_WIDTH - 2 * Blockly.BlockSvg.SEP_SPACE_X;
        if (input.align == Blockly.ALIGN_RIGHT) {
          fieldX += fieldRightX;
        } else if (input.align == Blockly.ALIGN_CENTRE) {
          fieldX += fieldRightX / 2;
        }
      }
      this.renderFields_(input.fieldRow, fieldX, fieldY);
      var v = row.height - Blockly.BlockSvg.TAB_HEIGHT;
      if (y !== 0) {
          steps.push('v ' + Blockly.BlockSvg.CORNER_RADIUS);
      } else {
          steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
          highlightSteps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER_HIGHLIGHT);
      }
      steps.push(Blockly.BlockSvg.TAB_PATH_DOWN);
      if (y === inputRows.length - 1) {
          v -= Blockly.BlockSvg.CORNER_RADIUS;
      }
      var nextRow = inputRows[y + 1];
      if (nextRow && nextRow.type === Blockly.NEXT_STATEMENT) {
          v -= Blockly.BlockSvg.CORNER_RADIUS * 2;
      }
      steps.push('v', v);
      if (this.RTL) {
        // Highlight around back of tab.
        highlightSteps.push(Blockly.BlockSvg.TAB_PATH_DOWN_HIGHLIGHT_RTL);
        highlightSteps.push('v', v + 0.5);
      } else {
        // Short highlight glint at bottom of tab.
        highlightSteps.push('M', (inputRows.rightEdge - 5) + ',' +
            (cursorY + Blockly.BlockSvg.TAB_HEIGHT - 0.7));
        highlightSteps.push('l', (Blockly.BlockSvg.TAB_WIDTH * 0.46) +
            ',-2.1');
      }
      // Create external input connection.
      connectionX = this.RTL ? -inputRows.rightEdge - 1 :
          inputRows.rightEdge + 1;
      input.connection.setOffsetInBlock(connectionX, cursorY);
      if (input.connection.isConnected()) {
        this.width = Math.max(this.width, inputRows.rightEdge +
            input.connection.targetBlock().getHeightWidth().width -
            Blockly.BlockSvg.TAB_WIDTH + 1);
      }
    } else if (row.type == Blockly.DUMMY_INPUT) {
      // External naked field.
      var input = row[0];
      var fieldX = cursorX;
      var fieldY = cursorY;
      var height = row.height;
      // Do not groups as we remove twice when input is both first and last
      if (y === 0) {
          steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
          highlightSteps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER_HIGHLIGHT);
          height -= Blockly.BlockSvg.CORNER_RADIUS;
      }
      if (y === inputRows.length - 1) {
          height -= Blockly.BlockSvg.CORNER_RADIUS;
      }
      if (input.align != Blockly.ALIGN_LEFT) {
        var fieldRightX = inputRows.rightEdge - input.fieldWidth -
            2 * Blockly.BlockSvg.SEP_SPACE_X;
        if (inputRows.hasValue) {
          fieldRightX -= Blockly.BlockSvg.TAB_WIDTH;
        }
        if (input.align == Blockly.ALIGN_RIGHT) {
          fieldX += fieldRightX;
        } else if (input.align == Blockly.ALIGN_CENTRE) {
          fieldX += fieldRightX / 2;
        }
      }
      this.renderFields_(input.fieldRow, fieldX, fieldY);
      var nextRow = inputRows[y + 1];
      if (nextRow && nextRow.type === Blockly.NEXT_STATEMENT) {
          height -= Blockly.BlockSvg.CORNER_RADIUS;
      }
      steps.push('v', height);
      if (this.RTL) {
        highlightSteps.push('v', height - 1);
      }
    } else if (row.type == Blockly.NEXT_STATEMENT) {
      // Nested statement.
      var input = row[0];
      if (y == 0) {
        // If the first input is a statement stack, add a small row on top.
        steps.push('v', Blockly.BlockSvg.SEP_SPACE_Y - Blockly.BlockSvg.CORNER_RADIUS);
        if (this.RTL) {
          highlightSteps.push('v', Blockly.BlockSvg.SEP_SPACE_Y - 1 - Blockly.BlockSvg.CORNER_RADIUS);
        }
        cursorY += Blockly.BlockSvg.SEP_SPACE_Y;
      }
      var fieldX = cursorX;
      var fieldY = cursorY;
      if (input.align != Blockly.ALIGN_LEFT) {
        var fieldRightX = inputRows.statementEdge - input.fieldWidth -
            2 * Blockly.BlockSvg.SEP_SPACE_X;
        if (input.align == Blockly.ALIGN_RIGHT) {
          fieldX += fieldRightX;
        } else if (input.align == Blockly.ALIGN_CENTRE) {
          fieldX += fieldRightX / 2;
        }
      }
      this.renderFields_(input.fieldRow, fieldX, fieldY);
      cursorX = inputRows.statementEdge + Blockly.BlockSvg.NOTCH_WIDTH;
      // CUSTOM CODE
      steps.push(Blockly.BlockSvg.BOTTOM_RIGHT_CORNER);
      // a statementEdge of 20 or less means that there is no field on the statement line
      if (inputRows.statementEdge <= 20) {
        cursorX -= 15;
      }
      //cursorX -= Blockly.BlockSvg.CORNER_RADIUS;
      // END
      steps.push('H', cursorX);
      steps.push(Blockly.BlockSvg.INNER_TOP_LEFT_CORNER);
      steps.push('v', row.height - 2 * Blockly.BlockSvg.CORNER_RADIUS);
      steps.push(Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER);
      // CUSTOM CODE
      var h = inputRows.rightEdge;
      if (y == inputRows.length - 1 ||
          inputRows[y + 1].type == Blockly.NEXT_STATEMENT) {
        // If the final input is a statement stack, add a small row underneath.
        // Consecutive statement stacks are also separated by a small divider.
        h = cursorX + 50;
      }
      h -= Blockly.BlockSvg.CORNER_RADIUS;
      steps.push('H', h);
      steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
      // END
      //steps.push('H', inputRows.rightEdge);
      if (this.RTL) {
        highlightSteps.push('M',
            (cursorX - Blockly.BlockSvg.NOTCH_WIDTH +
             Blockly.BlockSvg.DISTANCE_45_OUTSIDE) +
            ',' + (cursorY + Blockly.BlockSvg.DISTANCE_45_OUTSIDE));
        highlightSteps.push(
            Blockly.BlockSvg.INNER_TOP_LEFT_CORNER_HIGHLIGHT_RTL);
        highlightSteps.push('v',
            row.height - 2 * Blockly.BlockSvg.CORNER_RADIUS);
        highlightSteps.push(
            Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER_HIGHLIGHT_RTL);
        highlightSteps.push('H', inputRows.rightEdge - 0.5);
      } else {
        highlightSteps.push('M',
            (cursorX - Blockly.BlockSvg.NOTCH_WIDTH +
             Blockly.BlockSvg.DISTANCE_45_OUTSIDE) + ',' +
            (cursorY + row.height - Blockly.BlockSvg.DISTANCE_45_OUTSIDE));
        highlightSteps.push(
            Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER_HIGHLIGHT_LTR);
        highlightSteps.push('H', inputRows.rightEdge - 0.5);
      }
      // Create statement connection.
      connectionX = this.RTL ? -cursorX : cursorX + 1;
      input.connection.setOffsetInBlock(connectionX, cursorY + 1);

      if (input.connection.isConnected()) {
        this.width = Math.max(this.width, inputRows.statementEdge +
            input.connection.targetBlock().getHeightWidth().width);
      }
      if (y == inputRows.length - 1 ||
          inputRows[y + 1].type == Blockly.NEXT_STATEMENT) {
        // If the final input is a statement stack, add a small row underneath.
        // Consecutive statement stacks are also separated by a small divider.
        steps.push('v', Blockly.BlockSvg.SEP_SPACE_Y - 2 * Blockly.BlockSvg.CORNER_RADIUS);
        if (this.RTL) {
          highlightSteps.push('v', Blockly.BlockSvg.SEP_SPACE_Y - 1);
        }
        cursorY += Blockly.BlockSvg.SEP_SPACE_Y;
      }
    }
    cursorY += row.height;
  }
  if (!inputRows.length) {
    cursorY = Blockly.BlockSvg.MIN_BLOCK_Y;
    steps.push('V', cursorY);
    if (this.RTL) {
      highlightSteps.push('V', cursorY - 1);
    }
  }
  return cursorY;
};



    /**
     * Create the zoom controls.
     * @return {!Element} The zoom controls SVG group.
     */
    Blockly.ZoomControls.prototype.createDom = function() {
      var workspace = this.workspace_;
      /* Here's the markup that will be generated:
      <g class="blocklyZoom">
        <clippath id="blocklyZoomoutClipPath837493">
          <rect width="32" height="32" y="77"></rect>
        </clippath>
        <image width="96" height="124" x="-64" y="-15" xlink:href="media/sprites.png"
            clip-path="url(#blocklyZoomoutClipPath837493)"></image>
        <clippath id="blocklyZoominClipPath837493">
          <rect width="32" height="32" y="43"></rect>
        </clippath>
        <image width="96" height="124" x="-32" y="-49" xlink:href="media/sprites.png"
            clip-path="url(#blocklyZoominClipPath837493)"></image>
        <clippath id="blocklyZoomresetClipPath837493">
          <rect width="32" height="32"></rect>
        </clippath>
        <image width="96" height="124" y="-92" xlink:href="media/sprites.png"
            clip-path="url(#blocklyZoomresetClipPath837493)"></image>
      </g>
      */
      this.svgGroup_ = Blockly.utils.createSvgElement('g',
          {'class': 'blocklyZoom'}, null);
      var rnd = String(Math.random()).substring(2);

      var clip = Blockly.utils.createSvgElement('clipPath',
          {'id': 'blocklyZoomoutClipPath' + rnd},
          this.svgGroup_);
      Blockly.utils.createSvgElement('rect',
          {'width': 32, 'height': 32, 'y': 77},
          clip);
      var zoomoutSvg = Blockly.utils.createSvgElement('image',
          {'width': Blockly.SPRITE.width,
           'height': Blockly.SPRITE.height, 'x': -64,
           'y': -15,
           'clip-path': 'url(' + location.href + '#blocklyZoomoutClipPath' + rnd + ')'},
          this.svgGroup_);
      zoomoutSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          workspace.options.pathToMedia + Blockly.SPRITE.url);

      var clip = Blockly.utils.createSvgElement('clipPath',
          {'id': 'blocklyZoominClipPath' + rnd},
          this.svgGroup_);
      Blockly.utils.createSvgElement('rect',
          {'width': 32, 'height': 32, 'y': 43},
          clip);
      var zoominSvg = Blockly.utils.createSvgElement('image',
          {'width': Blockly.SPRITE.width,
           'height': Blockly.SPRITE.height,
           'x': -32,
           'y': -49,
           'clip-path': 'url(' + location.href + '#blocklyZoominClipPath' + rnd + ')'},
          this.svgGroup_);
      zoominSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          workspace.options.pathToMedia + Blockly.SPRITE.url);

      var clip = Blockly.utils.createSvgElement('clipPath',
          {'id': 'blocklyZoomresetClipPath' + rnd},
          this.svgGroup_);
      Blockly.utils.createSvgElement('rect',
          {'width': 32, 'height': 32},
          clip);
      var zoomresetSvg = Blockly.utils.createSvgElement('image',
          {'width': Blockly.SPRITE.width,
           'height': Blockly.SPRITE.height, 'y': -92,
           'clip-path': 'url(' + location.href + '#blocklyZoomresetClipPath' + rnd + ')'},
          this.svgGroup_);
      zoomresetSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          workspace.options.pathToMedia + Blockly.SPRITE.url);

      // Attach event listeners.
      Blockly.bindEvent_(zoomresetSvg, 'mousedown',  workspace, workspace.zoomReset);
      Blockly.bindEvent_(zoominSvg, 'mousedown', null, function(e) {
        workspace.zoomCenter(1);
        e.stopPropagation();  // Don't start a workspace scroll.
        e.preventDefault();  // Stop double-clicking from selecting text.
      });
      Blockly.bindEvent_(zoomoutSvg, 'mousedown', null, function(e) {
        workspace.zoomCenter(-1);
        e.stopPropagation();  // Don't start a workspace scroll.
        e.preventDefault();  // Stop double-clicking from selecting text.
      });

      return this.svgGroup_;
    };

    /**
     * Move the zoom controls to the bottom-right corner.
     */
    Blockly.ZoomControls.prototype.position = function() {
        var metrics = this.workspace_.getMetrics();
        if (!metrics) {
            // There are no metrics available (workspace is probably not visible).
            return;
        }
        if (this.workspace_.RTL) {
            this.left_ = this.MARGIN_SIDE_ + Blockly.Scrollbar.scrollbarThickness;
            if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_LEFT) {
            this.left_ += metrics.flyoutWidth;
            if (this.workspace_.toolbox_) {
                this.left_ += metrics.absoluteLeft;
            }
            }
        } else {
            this.left_ = metrics.viewWidth + metrics.absoluteLeft -
                this.WIDTH_ - this.MARGIN_SIDE_ - Blockly.Scrollbar.scrollbarThickness;

            if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_RIGHT) {
            this.left_ -= metrics.flyoutWidth;
            }
        }
        this.top_ = metrics.viewHeight + metrics.absoluteTop -
            this.HEIGHT_ - this.bottom_;
        if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_BOTTOM) {
            this.top_ -= metrics.flyoutHeight;
        }
        this.svgGroup_.setAttribute('transform',
            'translate(' + this.left_ + ',' + this.top_ + ')');
    };



    /**
     * Create the trash can elements.
     * @return {!Element} The trash can's SVG group.
     */
    Blockly.Trashcan.prototype.createDom = function() {
      /* Here's the markup that will be generated:
      <g class="blocklyTrash">
        <clippath id="blocklyTrashBodyClipPath837493">
          <rect width="47" height="45" y="15"></rect>
        </clippath>
        <image width="64" height="92" y="-32" xlink:href="media/sprites.png"
            clip-path="url(#blocklyTrashBodyClipPath837493)"></image>
        <clippath id="blocklyTrashLidClipPath837493">
          <rect width="47" height="15"></rect>
        </clippath>
        <image width="84" height="92" y="-32" xlink:href="media/sprites.png"
            clip-path="url(#blocklyTrashLidClipPath837493)"></image>
      </g>
      */
      this.svgGroup_ = Blockly.utils.createSvgElement('g',
          {'class': 'blocklyTrash'}, null);
      var rnd = String(Math.random()).substring(2);
      var clip = Blockly.utils.createSvgElement('clipPath',
          {'id': 'blocklyTrashBodyClipPath' + rnd},
          this.svgGroup_);
      Blockly.utils.createSvgElement('rect',
          {'width': this.WIDTH_, 'height': this.BODY_HEIGHT_,
           'y': this.LID_HEIGHT_},
          clip);
      var body = Blockly.utils.createSvgElement('image',
          {'width': Blockly.SPRITE.width, 'height': Blockly.SPRITE.height, 'y': -32,
           'clip-path': 'url(' + location.href + '#blocklyTrashBodyClipPath' + rnd + ')'},
          this.svgGroup_);
      body.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          this.workspace_.options.pathToMedia + Blockly.SPRITE.url);

      var clip = Blockly.utils.createSvgElement('clipPath',
          {'id': 'blocklyTrashLidClipPath' + rnd},
          this.svgGroup_);
      Blockly.utils.createSvgElement('rect',
          {'width': this.WIDTH_, 'height': this.LID_HEIGHT_}, clip);
      this.svgLid_ = Blockly.utils.createSvgElement('image',
          {'width': Blockly.SPRITE.width, 'height': Blockly.SPRITE.height, 'y': -32,
           'clip-path': 'url(' + location.href + '#blocklyTrashLidClipPath' + rnd + ')'},
          this.svgGroup_);
      this.svgLid_.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          this.workspace_.options.pathToMedia + Blockly.SPRITE.url);

      Blockly.bindEvent_(this.svgGroup_, 'mouseup', this, this.click);
      this.animateLid_();
      return this.svgGroup_;
    };


Blockly.Variables.asyncPromptName = function (workspace, promptText, defaultText) {
    var promptFunction;
    // Default prompt behavior from Blockly
    function defaultPromptFunction (promptText, defaultText) {
        return Promise.resolve(Blockly.Variables.promptName(promptText, defaultText));
    }
    promptFunction = workspace.options.modalFunction || defaultPromptFunction;

    return promptFunction(promptText, defaultText).then((newVar) => {
        // Merge runs of whitespace.  Strip leading and trailing whitespace.
        // Beyond this, all names are legal.
        if (newVar) {
            newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
            if (newVar == Blockly.Msg.RENAME_VARIABLE ||
                newVar == Blockly.Msg.NEW_VARIABLE) {
            // Ok, not ALL names are legal...
            newVar = null;
            }
        }
        return newVar;
    });
};

/**
 * Create a new variable on the given workspace.
 * @param {!Blockly.Workspace} workspace The workspace on which to create the
 *     variable.
 * @return {null|undefined|string} An acceptable new variable name, or null if
 *     change is to be aborted (cancel button), or undefined if an existing
 *     variable was chosen.
 */
Blockly.Variables.createVariable = function(workspace) {
    return Blockly.Variables.asyncPromptName(workspace, Blockly.Msg.NEW_VARIABLE_TITLE, '').then(text => {
        if (text) {
            workspace.createVariable(text);
        }
    });
};

/**
 * Event handler for a change in variable name.
 * Special case the 'Rename variable...' and 'Delete variable...' options.
 * In the rename case, prompt the user for a new name.
 * @param {string} text The selected dropdown menu option.
 * @return {null|undefined|string} An acceptable new variable name, or null if
 *     change is to be either aborted (cancel button) or has been already
 *     handled (rename), or undefined if an existing variable was chosen.
 */
Blockly.FieldVariable.prototype.classValidator = function(text) {
  var workspace = this.sourceBlock_.workspace;
  if (text == Blockly.Msg.RENAME_VARIABLE) {
    var oldVar = this.getText();
    Blockly.hideChaff();
    Blockly.Variables.asyncPromptName(workspace, Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldVar), oldVar)
        .then(t => {
            if (text) {
            workspace.renameVariable(oldVar, t);
            }
        });
    return null;
  } else if (text == 'New variable') {
      Blockly.hideChaff();
      Blockly.Variables.asyncPromptName(workspace, 'Give your variable a name', oldVar)
          .then(t => {
              if (text) {
                workspace.createVariable(t);
                this.setValue(t);
              }
         });
      return null;
  } else if (text == Blockly.Msg.DELETE_VARIABLE.replace('%1', this.getText())) {
    workspace.deleteVariable(this.getText());
    return null;
  }
  return undefined;
};

/**
 * Return a sorted list of variable names for variable dropdown menus.
 * Include a special option at the end for creating a new variable name.
 * @return {!Array.<string>} Array of variable names.
 * @this {!Blockly.FieldVariable}
 */
Blockly.FieldVariable.dropdownCreate = function() {
  if (this.sourceBlock_ && this.sourceBlock_.workspace) {
    // Get a copy of the list, so that adding rename and new variable options
    // doesn't modify the workspace's list.
    var variableList = this.sourceBlock_.workspace.variableList.slice(0);
  } else {
    var variableList = [];
  }
  // Ensure that the currently selected variable is an option.
  var name = this.getText();
  if (name && variableList.indexOf(name) == -1) {
    variableList.push(name);
  }
  variableList.sort(goog.string.caseInsensitiveCompare);
  variableList.push('New variable');
  variableList.push(Blockly.Msg.RENAME_VARIABLE);
  // Variables are not language-specific, use the name as both the user-facing
  // text and the internal representation.
  var options = [];
  for (var i = 0; i < variableList.length; i++) {
    options[i] = [variableList[i], variableList[i]];
  }
  return options;
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

Blockly.BlockSvg.prototype.render = function(opt_bubble) {
  Blockly.Field.startCache();
  this.rendered = true;

  var cursorX = Blockly.BlockSvg.SEP_SPACE_X;
  if (this.RTL) {
    cursorX = -cursorX;
  }
  // Move the icons into position.
  var icons = this.getIcons();
  for (var i = 0; i < icons.length; i++) {
    cursorX = icons[i].renderIcon(cursorX);
  }
  cursorX += this.RTL ?
      Blockly.BlockSvg.SEP_SPACE_X : -Blockly.BlockSvg.SEP_SPACE_X;
  // If there are no icons, cursorX will be 0, otherwise it will be the
  // width that the first label needs to move over by.

  var inputRows = this.renderCompute_(cursorX);
  this.renderDraw_(cursorX, inputRows);
  this.renderMoveConnections_();

  this.renderSearchPlus_();

  if (opt_bubble !== false) {
    // Render all blocks above this one (propagate a reflow).
    var parentBlock = this.getParent();
    if (parentBlock) {
      parentBlock.render(true);
    } else {
      // Top-most block.  Fire an event to allow scrollbars to resize.
      this.workspace.resizeContents();
    }
  }
  Blockly.Field.stopCache();
};

/**
 * Render the bottom edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Array.<string>} highlightSteps Path of block highlights.
 * @param {number} cursorY Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawBottom_ =
    function(steps, highlightSteps, cursorY) {
  /* eslint-disable indent */
  this.height += cursorY + 1;  // Add one for the shadow.
  steps.push(Blockly.BlockSvg.BOTTOM_RIGHT_CORNER);
  if (this.nextConnection) {
    steps.push('H', (Blockly.BlockSvg.NOTCH_WIDTH + (this.RTL ? 0.5 : - 0.5)) +
        ' ' + Blockly.BlockSvg.NOTCH_PATH_RIGHT);
    // Create next block connection.
    var connectionX;
    if (this.RTL) {
      connectionX = -Blockly.BlockSvg.NOTCH_WIDTH;
    } else {
      connectionX = Blockly.BlockSvg.NOTCH_WIDTH;
    }
    this.nextConnection.setOffsetInBlock(connectionX, cursorY + 1);
    this.height += 4;  // Height of tab.
  }

  this.squareBottomLeftCorner_ = false;

  // Should the bottom-left corner be rounded or square?
  if (this.squareBottomLeftCorner_) {
    steps.push('H 0');
    if (!this.RTL) {
      highlightSteps.push('M', '0.5,' + (cursorY - 0.5));
    }
  } else {
    steps.push('H', Blockly.BlockSvg.CORNER_RADIUS);
    steps.push('a', Blockly.BlockSvg.CORNER_RADIUS + ',' +
               Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 -' +
               Blockly.BlockSvg.CORNER_RADIUS + ',-' +
               Blockly.BlockSvg.CORNER_RADIUS);
    if (!this.RTL) {
      highlightSteps.push('M', Blockly.BlockSvg.DISTANCE_45_INSIDE + ',' +
          (cursorY - Blockly.BlockSvg.DISTANCE_45_INSIDE));
      highlightSteps.push('A', (Blockly.BlockSvg.CORNER_RADIUS - 0.5) + ',' +
          (Blockly.BlockSvg.CORNER_RADIUS - 0.5) + ' 0 0,1 ' +
          '0.5,' + (cursorY - Blockly.BlockSvg.CORNER_RADIUS));
    }
  }
};  /* eslint-enable indent */

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
        this._omnibox.style.maxHeight = '200px';
        this._omnibox.addEventListener('confirm', () => {
            this.closeOmnibox(true);
        });
        this._omnibox.addEventListener('block-clicked', () => {
            this.closeOmnibox(true);
        });
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
    var inputList = this.inputList;

    if (!this.workspace.searchPlusReady) {
        let workspace = this.workspace;
        workspace.searchPlusReady = true;
        workspace.addChangeListener((e) => {
            if (e.type === Blockly.Events.MOVE || e.type === Blockly.Events.DELETE) {
                let blocks = workspace.getAllBlocks();
                blocks.forEach(b => b.renderSearchPlus_());
            }
        });
    }

    inputList.forEach((input) => {
        if (input.connection && !input.connection.targetConnection) {
            if (!input.button) {
                let offsetX = 0,
                    offsetY = 0;
                if (input.connection.type === Blockly.NEXT_STATEMENT) {
                    offsetX = -19;
                    offsetY = 1;
                } else if (input.connection.type === Blockly.INPUT_VALUE) {
                    offsetX = 1;
                    offsetY = 2;
                }
                input.button = Blockly.utils.createSvgElement('g', {
                    class: 'searchPlus',
                    width: 20,
                    height: 20,
                    transform: `translate(${input.connection.x_ + offsetX}, ${input.connection.y_ + offsetY})`
                }, this.svgGroup_);
                Blockly.utils.createSvgElement('rect', {
                    width: 20,
                    height: 20
                }, input.button);
                var plus = Blockly.utils.createSvgElement('text', {
                    transform: 'translate(6.5, 13.5)'
                }, input.button);
                plus.appendChild(document.createTextNode('+'));
                input.button.addEventListener('mousedown', () => {
                    var rect = input.button.getBoundingClientRect(),
                        omnibox = this.workspace.openOmnibox();
                    omnibox.style.top = `${rect.top}px`;
                    omnibox.style.left = `${rect.left}px`;
                    var onConfirm = (e) => {
                        let type;
                        omnibox.removeEventListener('confirm', onConfirm);
                        omnibox.removeEventListener('close', onConfirm);
                        omnibox.removeEventListener('block-clicked', onConfirm);
                        if (e.detail) {
                            if (e.detail.type) {
                                type = e.detail.type;
                            } else if (e.detail.selected) {
                                type = e.detail.selected.id;
                            }
                            if (type) {
                                let block = this.workspace.newBlock(type);
                                block.initSvg();
                                block.render();
                                if (input.connection.type === Blockly.NEXT_STATEMENT) {
                                    input.connection.connect(block.previousConnection);
                                } else if (input.connection.type === Blockly.INPUT_VALUE) {
                                    input.connection.connect(block.outputConnection);
                                }
                            }
                        }
                        
                    };
                    omnibox.addEventListener('confirm', onConfirm);
                    omnibox.addEventListener('close', onConfirm);
                    omnibox.addEventListener('block-clicked', onConfirm);
                    if ('animate' in HTMLElement.prototype) {
                        let rect = omnibox.getBoundingClientRect();
                        omnibox.style.transformOrigin = '0 0';
                        omnibox.animate({
                            transform: [`scale(${20 / rect.width}, ${20 / rect.height})`, 'scale(1, 1)']
                        }, {
                            duration: 170,
                            easing: 'cubic-bezier(0.2, 0, 0.13, 1.5)'
                        });
                    }
                });
            }
            if (this.isInFlyout) {
                input.button.style.display = 'none';
            } else {
                input.button.style.display = 'block';
            }
        } else {
            if (input.button) {
                input.button.style.display = 'none';
            }
        }
    });
};


