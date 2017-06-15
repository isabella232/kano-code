/* global Blockly */

Blockly.ZoomControls.prototype.IMAGES = {};
Blockly.ZoomControls.prototype.HEIGHT_ = 150;
Blockly.ZoomControls.prototype.WIDTH_ = 24;

Blockly.ZoomControls.prototype.IMAGES.base = '/assets/icons/'

Blockly.ZoomControls.prototype.IMAGES.zoomIn = 'zoom-in';
Blockly.ZoomControls.prototype.IMAGES.zoomOut = 'zoom-out';
Blockly.ZoomControls.prototype.IMAGES.target = 'target';
Blockly.ZoomControls.prototype.ICON_SIZE = 16;

/**
 * Create the zoom controls.
 * @return {!Element} The zoom controls SVG group.
 */
Blockly.ZoomControls.prototype.createDom = function () {
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
    this.svgGroup_ = Blockly.utils.createSvgElement('g', {'class': 'blocklyZoom'}, null);
    let boxHeight = this.ICON_SIZE * 4 + 2,
        spaceLeft = this.HEIGHT_ - this.ICON_SIZE;
    let g = Blockly.utils.createSvgElement('g', {
        'transform': 'translate(0, ' + ((spaceLeft - boxHeight) / 2 + this.ICON_SIZE + 9) + ')'
    }, this.svgGroup_);
    var zoomoutSvg = Blockly.utils.createSvgElement('image',
        {'class': 'button',
        'width': this.ICON_SIZE,
        'height': this.ICON_SIZE,
        'x': (this.WIDTH_ - this.ICON_SIZE) / 2,
        'y': this.ICON_SIZE * 3 + 2},
        g);
    zoomoutSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
        Blockly.ZoomControls.prototype.IMAGES.base + Blockly.ZoomControls.prototype.IMAGES.zoomOut + '.svg');

    var zoominSvg = Blockly.utils.createSvgElement('image',
        {'class': 'button',
        'width': this.ICON_SIZE,
        'height': this.ICON_SIZE,
        'x': (this.WIDTH_ - this.ICON_SIZE) / 2,
        'y': 0},
        g);
    zoominSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
        Blockly.ZoomControls.prototype.IMAGES.base + Blockly.ZoomControls.prototype.IMAGES.zoomIn + '.svg');

    Blockly.utils.createSvgElement('rect',
        {'width': this.WIDTH_,
        'height': 2,
        'x': 0,
        'y': this.ICON_SIZE * 2,
        'fill': 'white',
        'opacity': 0.25},
        g);

    var zoomresetSvg = Blockly.utils.createSvgElement('image',
        {'class': 'button',
        'width': this.ICON_SIZE + 6,
        'height': this.ICON_SIZE + 6,
        'x': (this.WIDTH_ - this.ICON_SIZE - 4) / 2,
        'y': 0},
        this.svgGroup_);
    zoomresetSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
        Blockly.ZoomControls.prototype.IMAGES.base + Blockly.ZoomControls.prototype.IMAGES.target + '.svg');

    // Attach event listeners.
    Blockly.bindEventWithChecks_(zoomresetSvg, 'mousedown', null, function (e) {
        workspace.markFocused();
        workspace.setScale(workspace.options.zoomOptions.startScale);
        workspace.scrollCenter();
        Blockly.Touch.clearTouchIdentifier();  // Don't block future drags.
        e.stopPropagation();  // Don't start a workspace scroll.
        e.preventDefault();  // Stop double-clicking from selecting text.
    });
    Blockly.bindEventWithChecks_(zoominSvg, 'mousedown', null, function (e) {
        workspace.markFocused();
        workspace.zoomCenter(1);
        Blockly.Touch.clearTouchIdentifier();  // Don't block future drags.
        e.stopPropagation();  // Don't start a workspace scroll.
        e.preventDefault();  // Stop double-clicking from selecting text.
    });
    Blockly.bindEventWithChecks_(zoomoutSvg, 'mousedown', null, function (e) {
        workspace.markFocused();
        workspace.zoomCenter(-1);
        Blockly.Touch.clearTouchIdentifier();  // Don't block future drags.
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
    this.left_ -= 1;
    this.svgGroup_.setAttribute('transform',
        'translate(' + this.left_ + ',' + this.top_ + ')');
};