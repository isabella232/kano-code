/* global Blockly */

/**
 * Handle a mouse-move on SVG drawing surface.
 * @param {!Event} e Mouse move event.
 * @private
 */
Blockly.onMouseMove_ = function (e) {
    var workspace = Blockly.getMainWorkspace();
    if (workspace.dragMode_ != Blockly.DRAG_NONE) {
        var dx = e.clientX - workspace.startDragMouseX;
        var dy = e.clientY - workspace.startDragMouseY;
        var metrics = workspace.startDragMetrics;
        var x = workspace.startScrollX + dx;
        var y = workspace.startScrollY + dy;
        var toolboxMetrics, toolboxWidth = 0;
        if (workspace.toolbox) {
            toolboxMetrics = workspace.toolbox.getMetrics();
            toolboxWidth = toolboxMetrics.width;
        }
        x = Math.min(x, -metrics.contentLeft);
        y = Math.min(y, -metrics.contentTop);
        x = Math.max(x, metrics.viewWidth - metrics.contentLeft -
                        metrics.contentWidth + toolboxWidth);
        y = Math.max(y, metrics.viewHeight - metrics.contentTop -
                        metrics.contentHeight);

        // Move the scrollbars and the page will scroll automatically.
        workspace.scrollbar.set(-x - metrics.contentLeft,
                                -y - metrics.contentTop);
        // Cancel the long-press if the drag has moved too far.
        if (Math.sqrt(dx * dx + dy * dy) > Blockly.DRAG_RADIUS) {
            Blockly.longStop_();
            workspace.dragMode_ = Blockly.DRAG_FREE;
        }
        e.stopPropagation();
        e.preventDefault();
    }
};