/* global Blockly */

/**
 * Set the workspace to have focus in the browser.
 * @private
 */
Blockly.WorkspaceSvg.prototype.setBrowserFocus = function () {
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

Blockly.WorkspaceSvg.prototype.scrollBlockIntoView = function (block, animate) {
    var xy = block.getRelativeToSurfaceXY();
    var metrics = this.getMetrics();
    var transitionCallback;
    if (animate) {
        transitionCallback = function () {
            this.svgBlockCanvas_.removeEventListener('transitionend', transitionCallback);
            Blockly.utils.removeClass(this.svgBlockCanvas_, 'smoothScroll');
        }.bind(this);
        Blockly.utils.addClass(this.svgBlockCanvas_, 'smoothScroll');
        this.svgBlockCanvas_.addEventListener('transitionend', transitionCallback);
    }
    let x = this.scrollX,
        y = this.scrollY,
        wasDragging;
    // if a block was dragging, terminate the drag. It will be resumed after the translation
    if (Blockly.selected && Blockly.dragMode_ === Blockly.DRAG_FREE) {
        wasDragging = Blockly.selected;
        //Blockly.Touch.clearTouchIdentifier();
        //Blockly.terminateDrag_();
    }
    this.scrollbar.set(xy.x * this.scale - metrics.contentLeft - metrics.viewWidth  * 0.2,
                        xy.y * this.scale - metrics.contentTop  - metrics.viewHeight * 0.3);
    if (wasDragging) {
        // Cancel the translation on the block that was dragged
        var dx = x - this.scrollX,
            dy = y - this.scrollY;
        var xy = wasDragging.getRelativeToSurfaceXY();
        wasDragging.translate(xy.x + dx, xy.y + dy);
        wasDragging.moveConnections_(dx, dy);
        wasDragging.dragStartXY_.x += dx;
        wasDragging.dragStartXY_.y += dy;
        this.dragDeltaXY_.x += dx;
        this.dragDeltaXY_.y += dy;
    }
};
