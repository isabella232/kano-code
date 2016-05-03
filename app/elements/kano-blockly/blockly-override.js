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

var d2b = Blockly.Xml.domToBlock;

Blockly.Xml.domToBlock = function (xmlBlock, ws) {
    let block = d2b.apply(Blockly.Xml, arguments);
    if (xmlBlock instanceof Blockly.Workspace) {
        var swap = xmlBlock;
        xmlBlock = ws;
        ws = swap;
    }
    let colour = xmlBlock.getAttribute('colour');
    if (colour) {
        block.setColour(colour);
    }
    return block;
};

/**
 * Move the toolbox to the edge of the workspace.
 */
Blockly.Flyout.prototype.position = function () {
    if (!this.isVisible()) {
        return;
    }
    console.log(this);
    if (!this.clipPath) {
        var _svgNS = 'http://www.w3.org/2000/svg';
        var defs = document.createElementNS(_svgNS, "defs");
        var rect = document.createElementNS(_svgNS, "rect");
        rect.setAttributeNS(null, 'x', 0);
        rect.setAttributeNS(null, 'y', 0);
        rect.setAttributeNS(null, 'width', 20);
        rect.setAttributeNS(null, 'height', 20);
        this.clipPath = document.createElementNS(_svgNS, "clipPath");
        this.clipPath.setAttributeNS(null, 'id', 'flyoutClipPath');
        this.clipPath.appendChild(rect);
        defs.appendChild(this.clipPath);
        this.svgGroup_.appendChild(defs);
        this.svgGroup_.style.clipPath = 'url(#flyoutClipPath)';
    }
    var metrics = this.targetWorkspace_.getMetrics();
    var m = this.workspace_.getMetrics();
    var height = m.contentHeight + 20;
    var triangleRect = this.targetWorkspace_.toolbox_.triangle.getBoundingClientRect();
    var middle = triangleRect.top + 6;
    if (!metrics) {
        // Hidden components will return null.
        return;
    }
    var edgeWidth = this.width_ - this.CORNER_RADIUS + 10;
    if (this.RTL) {
        edgeWidth *= -1;
    }
    height = Math.min(metrics.viewHeight - 40, Math.max(0, height));
    var path = ['M ' + (this.RTL ? this.width_ : 0) + ',0'];
    path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, this.CORNER_RADIUS, -this.CORNER_RADIUS);
    path.push('h', edgeWidth);
    path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, this.CORNER_RADIUS, this.CORNER_RADIUS);
    path.push('v', height);
    path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, -this.CORNER_RADIUS, this.CORNER_RADIUS);
    path.push('h', -edgeWidth);
    path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, -this.CORNER_RADIUS, -this.CORNER_RADIUS);
    path.push('z');
    this.svgBackground_.setAttribute('d', path.join(' '));

    this.svgGroup_.setAttribute('transform',
        `translate(150, ${Math.max(middle - height / 2, 20)})`);

    // Record the height for Blockly.Flyout.getMetrics_.
    this.height_ = height;

    // Update the scrollbar (if one exists).
    if (this.scrollbar_) {
        this.scrollbar_.resize();
    }
};

/**
 * Initializes the toolbox.
 */
Blockly.Toolbox.prototype.init = function() {
  var workspace = this.workspace_,
    svg = workspace.getParentSvg(),
    container = svg.parentNode,
    triangle = document.createElement('div');

  triangle.className = 'blocklyTriangle';
  triangle.setAttribute('id', 'blocklyTriangle');

  // Create an HTML container for the Toolbox menu.
  this.HtmlDiv = goog.dom.createDom('div', 'blocklyToolboxDiv');
  this.HtmlDiv.setAttribute('dir', workspace.RTL ? 'RTL' : 'LTR');
  container.appendChild(this.HtmlDiv);
  container.appendChild(triangle);

  this.triangle = triangle;

  // Clicking on toolbar closes popups.
  Blockly.bindEvent_(this.HtmlDiv, 'mousedown', this,
      function(e) {
        if (Blockly.isRightButton(e) || e.target == this.HtmlDiv) {
          // Close flyout.
          Blockly.hideChaff(false);
        } else {
          // Just close popups.
          Blockly.hideChaff(true);
        }
      });
  var workspaceOptions = {
    disabledPatternId: workspace.options.disabledPatternId,
    parentWorkspace: workspace,
    RTL: workspace.RTL
  };
  /**
   * @type {!Blockly.Flyout}
   * @private
   */
  this.flyout_ = new Blockly.Flyout(workspaceOptions);
  goog.dom.insertSiblingAfter(this.flyout_.createDom(), workspace.svgGroup_);
  this.flyout_.init(workspace);

  this.CONFIG_['cleardotPath'] = workspace.options.pathToMedia + '1x1.gif';
  this.CONFIG_['cssCollapsedFolderIcon'] =
      'blocklyTreeIconClosed' + (workspace.RTL ? 'Rtl' : 'Ltr');
  var tree = new Blockly.Toolbox.TreeControl(this, this.CONFIG_);
  this.tree_ = tree;
  tree.setShowRootNode(false);
  tree.setShowLines(false);
  tree.setShowExpandIcons(false);
  tree.setSelectedItem(null);
  this.populate_(workspace.options.languageTree);
  tree.render(this.HtmlDiv);
  this.addColour_();
  this.position();
};

/**
 * Move the toolbox to the edge.
 */
Blockly.Toolbox.prototype.position = function() {
    var treeDiv = this.HtmlDiv;
    if (!treeDiv) {
        // Not initialized yet.
        return;
    }
    var svg = this.workspace_.getParentSvg();
    var svgPosition = goog.style.getPageOffset(svg);
    var svgSize = Blockly.svgSize(svg);
    if (this.workspace_.RTL) {
        treeDiv.style.left =
            (svgPosition.x + svgSize.width - treeDiv.offsetWidth) + 'px';
    } else {
        treeDiv.style.left = svgPosition.x + 'px';
    }
    treeDiv.style.top = '20px';
    treeDiv.style.left = '20px';
    treeDiv.style.width = '120px';
    this.width = treeDiv.offsetWidth;
    if (!this.workspace_.RTL) {
        // For some reason the LTR toolbox now reports as 1px too wide.
        this.width -= 1;
    }
    this.flyout_.position();
};
Blockly.Toolbox.prototype.addColour_ = function(opt_tree) {
    var tree = opt_tree || this.tree_;
    var children = tree.getChildren();
    var next, previous;
    for (var i = 0, child; child = children[i]; i++) {
        var element = child.getRowElement();
        if (element) {
            if (element.classList.contains('blocklyTreeRow')) {
                next = element.parentNode.nextSibling;
                previous = element.parentNode.previousSibling;
                if (!next || next.querySelector('.blocklyTreeSeparator')) {
                    element.style.borderBottomLeftRadius = '8px';
                    element.style.borderBottomRightRadius = '8px';
                }
                if (!previous || previous.querySelector('.blocklyTreeSeparator')) {
                    element.style.borderTopLeftRadius = '8px';
                    element.style.borderTopRightRadius = '8px';
                }
            }
            element.style.background = (child.hexColour || '#ddd');
        }
        this.addColour_(child);
    }
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
 * Display/hide the flyout when an item is selected.
 * @param {goog.ui.tree.BaseNode} node The item to select.
 * @override
 */
Blockly.Toolbox.TreeControl.prototype.setSelectedItem = function(node) {
    Blockly.removeAllRanges();
    var toolbox = this.toolbox_,
        triangle = toolbox.triangle,
        hexColour,
        containerRect,
        rect,
        rowElement;
    if (node == this.selectedItem_ || node == toolbox.tree_) {
        return;
    }
    if (toolbox.lastCategory_) {

    }
    if (node) {
        rowElement = node.getRowElement();
        hexColour = node.hexColour || '#57e';
        containerRect = toolbox.HtmlDiv.getBoundingClientRect();
        rect = rowElement.getBoundingClientRect();
        rowElement.style.background = hexColour;
        rowElement.className += ' selected';
        triangle.style.display = 'block';
        triangle.style.top = `${rect.top - containerRect.top - 6 + (rect.height / 2) + 20}px`;

        // Add colours to child nodes which may have been collapsed and thus
        // not rendered.
        toolbox.addColour_(node);
    }
    goog.ui.tree.TreeControl.prototype.setSelectedItem.call(this, node);
    if (node && node.blocks && node.blocks.length) {
        toolbox.flyout_.show(node.blocks);
        // Scroll the flyout to the top if the category has changed.
        if (toolbox.lastCategory_ != node) {
            toolbox.flyout_.scrollToStart();
        }
    } else {
        // Hide the flyout.
        toolbox.flyout_.hide();
        triangle.style.display = 'none';
    }
    if (node) {
        toolbox.lastCategory_ = node;
    }
};

/**
 * Create a copy of this block on the workspace.
 * @param {!Blockly.Block} originBlock The flyout block to copy.
 * @return {!Function} Function to call when block is clicked.
 * @private
 */
Blockly.Flyout.prototype.createBlockFunc_ = function(originBlock) {
  var flyout = this;
  var workspace = this.targetWorkspace_;
  return function(e) {
    if (Blockly.isRightButton(e)) {
      // Right-click.  Don't create a block, let the context menu show.
      return;
    }
    if (originBlock.disabled) {
      // Beyond capacity.
      return;
    }
    Blockly.Events.disable();
    // Create the new block by cloning the block in the flyout (via XML).
    var xml = Blockly.Xml.blockToDom(originBlock);
    var block = Blockly.Xml.domToBlock(workspace, xml);
    // Place it in the same spot as the flyout copy.
    var svgRootOld = originBlock.getSvgRoot();
    if (!svgRootOld) {
      throw 'originBlock is not rendered.';
    }
    var xyOld = Blockly.getSvgXY_(svgRootOld, workspace);
    // Scale the scroll (getSvgXY_ did not do this).
    if (flyout.RTL) {
      var width = workspace.getMetrics().viewWidth - flyout.width_;
      xyOld.x += width / workspace.scale - width;
    } else {
      xyOld.x += flyout.workspace_.scrollX / flyout.workspace_.scale -
          flyout.workspace_.scrollX;
    }
    xyOld.y += flyout.workspace_.scrollY / flyout.workspace_.scale -
        flyout.workspace_.scrollY;
    var svgRootNew = block.getSvgRoot();
    if (!svgRootNew) {
      throw 'block is not rendered.';
    }
    var xyNew = Blockly.getSvgXY_(svgRootNew, workspace);
    // Scale the scroll (getSvgXY_ did not do this).
    xyNew.x += workspace.scrollX / workspace.scale - workspace.scrollX;
    xyNew.y += workspace.scrollY / workspace.scale - workspace.scrollY;
    if (workspace.toolbox_ && !workspace.scrollbar) {
      xyNew.x += workspace.toolbox_.width / workspace.scale;
    }
    block.moveBy(xyOld.x - xyNew.x, xyOld.y - xyNew.y);
    Blockly.Events.enable();
    if (Blockly.Events.isEnabled() && !block.isShadow()) {
      Blockly.Events.fire(new Blockly.Events.Create(block));
    }
    if (flyout.autoClose) {
      flyout.hide();
    } else {
      flyout.filterForCapacity_();
    }
    // Start a dragging operation on the new block.
    block.onMouseDown_(e);
    block.setColour(originBlock.getColour());
  };
};

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
Blockly.BlockSvg.SEP_SPACE_Y = 10;
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
Blockly.BlockSvg.TAB_WIDTH = 8;
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
Blockly.BlockSvg.NOTCH_PATH_LEFT = 'l 1,0 3,5 q 2.5 2.5 5 0 l 3,-5 l 3, 0';

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
Blockly.BlockSvg.NOTCH_PATH_RIGHT = 'l -2,0 -3,5 q -2.5 2.5 -5 0 l -3,-5 l -2, 0';
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
Blockly.BlockSvg.TAB_PATH_DOWN = 'v 6 c 0,8 -' + Blockly.BlockSvg.TAB_WIDTH +
    ',-4 -' + Blockly.BlockSvg.TAB_WIDTH + ',6 s ' +
    Blockly.BlockSvg.TAB_WIDTH + ',-2.5 ' + Blockly.BlockSvg.TAB_WIDTH + ',6 v 2';

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
    this.outputConnection.moveTo(connectionsXY.x, connectionsXY.y);
    // This connection will be tightened when the parent renders.
    steps.push('V', Blockly.BlockSvg.TAB_HEIGHT - 2);
    steps.push('c 0,-8 -' + Blockly.BlockSvg.TAB_WIDTH + ',4 -' +
        Blockly.BlockSvg.TAB_WIDTH + ',-6 s ' + Blockly.BlockSvg.TAB_WIDTH +
        ',2.5 ' + Blockly.BlockSvg.TAB_WIDTH + ',-6, v -1.5');

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
      this.svgGroup_ = Blockly.createSvgElement('g',
          {'class': 'blocklyTrash'}, null);
      var rnd = String(Math.random()).substring(2);
      var clip = Blockly.createSvgElement('clipPath',
          {'id': 'blocklyTrashBodyClipPath' + rnd},
          this.svgGroup_);
      Blockly.createSvgElement('rect',
          {'width': this.WIDTH_, 'height': this.BODY_HEIGHT_,
           'y': this.LID_HEIGHT_},
          clip);
      var body = Blockly.createSvgElement('image',
          {'width': Blockly.SPRITE.width, 'height': Blockly.SPRITE.height, 'y': -32,
           'clip-path': 'url(' + location.href + '#blocklyTrashBodyClipPath' + rnd + ')'},
          this.svgGroup_);
      body.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          this.workspace_.options.pathToMedia + Blockly.SPRITE.url);

      var clip = Blockly.createSvgElement('clipPath',
          {'id': 'blocklyTrashLidClipPath' + rnd},
          this.svgGroup_);
      Blockly.createSvgElement('rect',
          {'width': this.WIDTH_, 'height': this.LID_HEIGHT_}, clip);
      this.svgLid_ = Blockly.createSvgElement('image',
          {'width': Blockly.SPRITE.width, 'height': Blockly.SPRITE.height, 'y': -32,
           'clip-path': 'url(' + location.href + '#blocklyTrashLidClipPath' + rnd + ')'},
          this.svgGroup_);
      this.svgLid_.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          this.workspace_.options.pathToMedia + Blockly.SPRITE.url);

      Blockly.bindEvent_(this.svgGroup_, 'mouseup', this, this.click);
      this.animateLid_();
      return this.svgGroup_;
    };




    /**
     * Encode a block subtree as XML.
     * @param {!Blockly.Block} block The root block to encode.
     * @return {!Element} Tree of XML elements.
     */
    Blockly.Xml.blockToDom = function(block) {
      var element = goog.dom.createDom(block.isShadow() ? 'shadow' : 'block');
      element.setAttribute('type', block.type);
      element.setAttribute('id', block.id);
      if (block.getColour()) {
          element.setAttribute('colour', block.getColour());
      }
      if (block.mutationToDom) {
        // Custom data for an advanced block.
        var mutation = block.mutationToDom();
        if (mutation && (mutation.hasChildNodes() || mutation.hasAttributes())) {
          element.appendChild(mutation);
        }
      }
      function fieldToDom(field) {
        if (field.name && field.EDITABLE) {
          var container = goog.dom.createDom('field', null, field.getValue());
          container.setAttribute('name', field.name);
          element.appendChild(container);
        }
      }
      for (var i = 0, input; input = block.inputList[i]; i++) {
        for (var j = 0, field; field = input.fieldRow[j]; j++) {
          fieldToDom(field);
        }
      }

      var commentText = block.getCommentText();
      if (commentText) {
        var commentElement = goog.dom.createDom('comment', null, commentText);
        if (typeof block.comment == 'object') {
          commentElement.setAttribute('pinned', block.comment.isVisible());
          var hw = block.comment.getBubbleSize();
          commentElement.setAttribute('h', hw.height);
          commentElement.setAttribute('w', hw.width);
        }
        element.appendChild(commentElement);
      }

      if (block.data) {
        var dataElement = goog.dom.createDom('data', null, block.data);
        element.appendChild(dataElement);
      }

      for (var i = 0, input; input = block.inputList[i]; i++) {
        var container;
        var empty = true;
        if (input.type == Blockly.DUMMY_INPUT) {
          continue;
        } else {
          var childBlock = input.connection.targetBlock();
          if (input.type == Blockly.INPUT_VALUE) {
            container = goog.dom.createDom('value');
          } else if (input.type == Blockly.NEXT_STATEMENT) {
            container = goog.dom.createDom('statement');
          }
          var shadow = input.connection.getShadowDom();
          if (shadow && (!childBlock || !childBlock.isShadow())) {
            container.appendChild(Blockly.Xml.cloneShadow_(shadow));
          }
          if (childBlock) {
            container.appendChild(Blockly.Xml.blockToDom(childBlock));
            empty = false;
          }
        }
        container.setAttribute('name', input.name);
        if (!empty) {
          element.appendChild(container);
        }
      }
      if (block.inputsInlineDefault != block.inputsInline) {
        element.setAttribute('inline', block.inputsInline);
      }
      if (block.isCollapsed()) {
        element.setAttribute('collapsed', true);
      }
      if (block.disabled) {
        element.setAttribute('disabled', true);
      }
      if (!block.isDeletable() && !block.isShadow()) {
        element.setAttribute('deletable', false);
      }
      if (!block.isMovable() && !block.isShadow()) {
        element.setAttribute('movable', false);
      }
      if (!block.isEditable()) {
        element.setAttribute('editable', false);
      }

      var nextBlock = block.getNextBlock();
      if (nextBlock) {
        var container = goog.dom.createDom('next', null,
            Blockly.Xml.blockToDom(nextBlock));
        element.appendChild(container);
      }
      var shadow = block.nextConnection && block.nextConnection.getShadowDom();
      if (shadow && (!nextBlock || !nextBlock.isShadow())) {
        container.appendChild(Blockly.Xml.cloneShadow_(shadow));
      }

      return element;
    };
