
Blockly.Blocks.colour.HUE = '#ffffff';
Blockly.Blocks.logic.HUE = '#ffffff';
Blockly.Blocks.variables.HUE = '#ffffff';
Blockly.Blocks.loops.HUE = '#ffffff';
Blockly.Blocks.math.HUE = '#ffffff';
Blockly.Blocks.texts.HUE = '#ffffff';
Blockly.Blocks.lists.HUE = '#ffffff';
Blockly.Blocks.procedures.HUE = '#ffffff';

Blockly.Scrollbar.scrollbarThickness = 5;


/**
 * Move the toolbox to the edge of the workspace.
 */
Blockly.Flyout.prototype.position = function () {
    if (!this.isVisible()) {
        return;
    }
    var metrics = this.targetWorkspace_.getMetrics();
    if (!metrics) {
        // Hidden components will return null.
        return;
    }
    var edgeWidth = this.width_;
    if (this.RTL) {
        edgeWidth *= -1;
    }
    var path = ['M ' + (this.RTL ? this.width_ : 0) + ',0'];
    path.push('h', edgeWidth);
    path.push('v', Math.max(0, metrics.viewHeight));
    path.push('h', -edgeWidth);
    path.push('z');
    this.svgBackground_.setAttribute('d', path.join(' '));

    var x = metrics.absoluteLeft;
    if (this.RTL) {
        x += metrics.viewWidth;
        x -= this.width_;
    }
    this.svgGroup_.setAttribute('transform',
        'translate(' + x + ',' + metrics.absoluteTop + ')');

    // Record the height for Blockly.Flyout.getMetrics_.
    this.height_ = metrics.viewHeight;

    // Update the scrollbar (if one exists).
    if (this.scrollbar_) {
        this.scrollbar_.resize();
    }
    var button = this.buttons_[0];
    if (button) {
        var colour = button.parentNode
            .querySelector('.blocklyDraggable>.blocklyPathDark')
            .getAttribute('fill');
        this.svgBackground_.style.fill = colour;
    }
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
    treeDiv.style.height = svgSize.height + 'px';
    treeDiv.style.width = svgSize.width / 4 + 'px';
    treeDiv.style.top = svgPosition.y + 'px';
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
    for (var i = 0, child; child = children[i]; i++) {
        var element = child.getRowElement();
        if (element) {
            element.style.background = (child.hexColour || '#ddd');
        }
        this.addColour_(child);
    }
};

/**
 * Change the colour of a block.
 * @param {number|string} colour HSV hue value, or #RRGGBB string.
 */
Blockly.Block.prototype.setColour = function(colour) {
    var hexReg = /^#[0-9a-fA-F]{6}$/;
    var m = /#[0-9a-fA-F]{6}/.exec(colour);
    if (m && m[0]) {
        colour = m[0];
    }
    var hue = parseFloat(colour);
    if (!isNaN(hue)) {
        this.colour_ = Blockly.hueToRgb(hue);
    } else if (goog.isString(colour) && colour.match(hexReg)) {
        this.colour_ = colour;
    } else {
        throw 'Invalid colour: ' + colour;
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
    var toolbox = this.toolbox_;
    if (node == this.selectedItem_ || node == toolbox.tree_) {
        return;
    }
    if (node) {
        var hexColour = node.hexColour || '#57e';
        node.getRowElement().style.background = hexColour;
        // Add colours to child nodes which may have been collapsed and thus
        // not rendered.
        toolbox.addColour_(node);
        var treeDiv = toolbox.HtmlDiv;
        treeDiv.style.backgroundColor = hexColour;
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
    }
    if (node) {
        toolbox.lastCategory_ = node;
    }
};

/**
 * Overrides Blockly color computation to use HEX colors instead of
 * fixed saturation and value
 */
Blockly.hueToRgb = function(color) {
    return color;
};
