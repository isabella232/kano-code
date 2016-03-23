class KanoAppEditor {
    beforeRegister () {
        this.is = 'kano-app-editor';
        this.properties = {
            parts: {
                type: Array
            },
            addedParts: {
                type: Array,
                value: () => {
                    return [];
                },
                notify: true
            },
            selectedPart: {
                type: Object,
                computed: 'computeSelectedPart(selected)',
                observer: 'selectedPartChanged'
            },
            selected: {
                type: Number,
                value: null
            },
            running: {
                type: Boolean,
                value: false,
                notify: true
            },
            leftPanelView: {
                type: String,
                value: 'code'
            },
            selectedTrigger: {
                type: Object
            },
            leftViewOpened: {
                type: Boolean,
                value: true,
                observer: 'leftViewOpenedChanged'
            },
            background: {
                type: Object
            },
            defaultCategories: {
                type: Array
            },
            wsSize: {
                type: Object
            }
        };
        this.listeners = {
            'pages.iron-select': 'pageEntered',
            'pages.iron-deselect': 'pageLeft'
        };
    }
    pageEntered (e) {
        // Trigger a resize on blockly when we get back to the
        // code editor page
        if (e.detail.item.getAttribute('name') === 'code') {
            this.$['block-editor'].showCodeEditor();
        }
    }
    pageLeft (e) {
        if (e.detail.item.getAttribute('name') === 'code') {
            this.$['block-editor'].hideCodeEditor();
        }
    }
    computeSelectedPart () {
        return this.addedParts[this.selected];
    }
    selectedPartChanged (newValue) {
        if (newValue) {
            if (!this.leftViewOpened) {
                this.toggleLeftView();
            }
            this.set('leftPanelView', 'code');
        }
    }
    computeBackground () {
        let style = this.background.userStyle;
        return Object.keys(style).reduce((acc, property) => {
            acc += `${property}:${style[property]};`;
            return acc;
        }, '');
    }
    previous () {
        this.set('leftViewOpened', false);
    }
    leftViewOpenedChanged () {
        this.$.workspace.resizeView();
    }
    isPartsOpened () {
        return this.leftViewOpened && this.leftPanelView === 'parts';
    }
    removePart (e) {
        let model = e.detail,
            parts = this.addedParts;
        for (let i = 0, len = parts.length; i < len; i++) {
            if (parts[i].id === model.id) {
                this.splice('addedParts', i, 1);
                if (model.partType === 'module') {
                    this.push('parts', model);
                }
                if (!this.addedParts.length) {
                    this.set('leftPanelView', 'parts');
                }
                return;
            }
        }
    }
    /**
     * Opens the sharing modal and share the app
     */
    share () {
        let modal = this.$['share-modal'];
        modal.open();
    }
    shareModalClosed (e) {
        let reason = e.detail;
        if (reason.confirmed) {
            this.fire('share');
        }
    }
    /**
     * Save the current work in the local storage
     * TODO trigger that every 5sec or so if there is any changes
     */
    save () {
        let savedParts = this.addedParts.reduce((acc, part) => {
            let savedPart = {};
            savedPart.model = part.toJSON();
            savedPart.codes = part.codes;
            acc.push(savedPart);
            return acc;
        }, []),
            savedApp = {};
        savedApp.parts = savedParts;
        savedApp.background = this.background;

        localStorage.setItem('savedApp', JSON.stringify(savedApp));

    }
    /**
     * Load the saved work from the local storage
     */
    load () {
        let savedApp = JSON.parse(localStorage.getItem('savedApp')),
            addedParts;
        if (!savedApp) {
            return;
        }
        addedParts = savedApp.parts.map((savedPart) => {
            let part = new UI(savedPart.model);
            part.codes = savedPart.codes;
            return part;
        });
        this.set('addedParts', addedParts);
        this.set('background', savedApp.background);
    }
    toggleParts () {
        // Either just toggle the showed view or display/hide the whole
        // leftView
        if (!this.leftViewOpened) {
            this.toggleLeftView();
            this.set('leftPanelView', 'parts');
            return;
        }
        this.set('leftPanelView', this.leftPanelView === 'parts' ? 'code' : 'parts');
    }
    toggleLeftView () {
        if (this.running) {
            return;
        }
        this.set('leftViewOpened', !this.leftViewOpened);
        // If we just opened the leftView, show the parts page
        if (this.leftViewOpened) {
            this.set('selectedPage', 'parts');
            this.$['block-editor'].showCodeEditor();
        } else {
            this.$['block-editor'].hideCodeEditor();
        }
    }
    closeUiDrawer () {
        this.$['ui-drawer'].opened = false;
    }
    attached () {
        this.$.workspace.size = this.wsSize;
        interact(this.$.rightPanel).dropzone({
            // TODO rename to kano-part-item
            accept: 'kano-ui-item',
            ondrop: (e) => {
                let part = new UI(e.relatedTarget.model)
                this.push('addedParts', part);
                this.set('selected', this.addedParts.length - 1);
            }
        });
        window.addEventListener('resize', this.updateWorkspaceRect.bind(this));
        this.updateWorkspaceRect();
    }
    detached () {
        window.removeEventListener('resize', this.updateWorkspaceRect.bind(this));
    }
    updateWorkspaceRect () {
        this.set('workspaceRect', this.$.workspace.getRect());
    }
    /**
     * Add draggable properties to the added element in the workspace
     * @param  {Event} e
     */
    workspaceUiReady (e) {
        let element = e.detail;
        interact(element).draggable({
            onmove: this.getDragMoveListener(true),
            restrict: {
                restriction: this.$.workspace.getViewport(),
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            }
        });
        this.set('leftPanelView', 'code');
    }
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
    scaleToWorkspace (point) {
        let rect = this.workspaceRect,
            fullSize = this.wsSize;
        return {
            x: point.x / rect.width * fullSize.width,
            y: point.y / rect.height * fullSize.height
        };
    }
    sidebarUiReady (e) {
        let clone;
        interact(e.detail).draggable({
            onmove: this.getDragMoveListener(),
            restrict: {
                restriction: this.$.section
            },
            onend: () => {
                this.$.section.removeChild(clone);
            }
        }).on('move', (event) => {
            let interaction = event.interaction;

            // if the pointer was moved while being held down
            // and an interaction hasn't started yet
            if (interaction.pointerIsDown && !interaction.interacting()) {
                let original = event.currentTarget,
                    rect = original.getBoundingClientRect(),
                    style;

                // create a clone of the currentTarget element
                clone = Polymer.dom(original).cloneNode(true);
                style = clone.style;
                clone.model = original.model;
                style.position = 'absolute';
                style.top = `${rect.top}px`;
                style.left = `${rect.left}px`;
                style.zIndex = 11;

                // insert the clone to the page
                this.$.section.appendChild(clone);

                // start a drag interaction targeting the clone
                interaction.start({ name: 'drag' },
                                    event.interactable,
                                    clone);
            }
        });
    }
    /**
     * Toggle the running state of the current app
     */
    toggleRunning () {
        this.running = !this.running;
        if (this.running) {
            this.set('leftViewOpened', false);
            this.$['block-editor'].hideCodeEditor();
        } else {
            this.set('leftViewOpened', true);
            this.$['block-editor'].showCodeEditor();
        }
    }
}
Polymer(KanoAppEditor);
