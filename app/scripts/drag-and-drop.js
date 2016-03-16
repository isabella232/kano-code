let DragAndDrop;


export default DragAndDrop = {
    workspaceRect: {},
    workspaceFullSize: {},
    init (opts) {
        this.workspaceFullSize = opts.workspaceFullSize || {};
    },
    setWorkspaceRect (workspaceRect) {
        this.workspaceRect = workspaceRect || {};
    },
    scaleToWorkspace (point) {
        let rect = this.workspaceRect,
            fullSize = this.workspaceFullSize;
        return {
            x: point.x / rect.width * fullSize.width,
            y: point.y / rect.height * fullSize.height
        };
    },
    getDragMoveListener (scale=false) {
        return (event) => {
            let target = event.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy,
                pos = { x, y };

            if (scale) {
                pos = this.scaleToWorkspace(pos);
            }

            // translate the element
            target.style.webkitTransform =
            target.style.transform =
            'translate(' + pos.x + 'px, ' + pos.y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        };
    }
};
