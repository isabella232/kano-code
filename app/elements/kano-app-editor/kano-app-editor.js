/* globals Polymer, KanoBehaviors, interact, Part */

const TOOLTIP_PADDING = 10;

class KanoAppEditor {

    get behaviors () {
        return [KanoBehaviors.AppEditorBehavior];
    }

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
            code: {
                type: Object,
                notify: true
            },
            selected: {
                type: Object,
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
            background: {
                type: Object
            },
            defaultCategories: {
                type: Object,
                value: () => {
                    return {};
                }
            },
            wsSize: {
                type: Object
            },
            isResizing: {
                type: Boolean,
                value: false
            },
            partsPanelState: {
                type: String
            },
            selectedParts: {
                type: Array
            },
            showShareButton: Boolean,
            drawerPage: {
                type: String,
                value: 'sidebar'
            }
        };
        this.observers = [
            'addedPartsChanged(addedParts.*)',
            'selectedPartChanged(selected.*)',
            'backgroundChanged(background.*)',
            'updateColors(addedParts.splices)'
        ];
        this.listeners = {
            'previous': 'clearEditorStyle'
        };
    }
    toggleMenu () {
        this.fire('toggle-menu');
    }
    setColorRange (hs, range, items = []) {
        // Set the increment value, which will decide how much to change the lightness between all colors
        let increment = range / (items.length + 1);
        // Grab the HS values from the color map
        items.forEach((item, i) => {
            // Calculate the lightness
            let L = (50 - (range / 2)) + (increment * (i + 1)); // unary + is to coerce String j into number
            // Set the color
            item.colour = `hsl(${hs[0]}, ${hs[1]}%, ${L}%)`;
        });
    }
    updateColors () {
        this.debounce('updateColors', () => {
            let range = 33.33,
                colorMapHS = {
                    system: [206, 100],
                    ui: [89, 52],
                    hardware: [289, 32],
                    data: [1, 61]
                },
                grouped = this.addedParts.reduce((acc, part) => {
                    acc[part.partType] = acc[part.partType] || [];
                    acc[part.partType].push(part);
                    return acc;
                }, {});

            grouped.ui = grouped.ui || [];
            if (this.defaultCategories.background) {
                grouped.ui.unshift(this.defaultCategories.background);
            }

            Object.keys(grouped).forEach((partType) => {
                let parts = grouped[partType];
                this.setColorRange(colorMapHS[partType], range, parts);
            });
        }, 10);
    }
    isPartDeletionDisabled () {
        return this.partEditorOpened || this.backgroundEditorOpened || this.running;
    }
    openPartEditor (e) {
        let controls;
        if (this.selected.partType === 'hardware') {
            return;
        }
        controls = this.$['workspace-controls'].getBoundingClientRect();
        this.$['part-editor-tooltip'].style.bottom = `${window.innerHeight - controls.top}px`;
        this.partEditorTarget = e.detail;
        this.partEditorOpened = true;
        this.notifyChange('open-part-config', { part: this.selected });
    }
    openBackgroundEditor (e) {
        let controls = this.$['workspace-controls'].getBoundingClientRect();
        this.$['background-editor-tooltip'].style.bottom = `${window.innerHeight - controls.top}px`;
        this.backgroundEditorTarget = e.detail;
        this.backgroundEditorOpened = true;
    }
    closePartEditor () {
        this.partEditorOpened = false;
        this.notifyChange('close-part-editor', {});
    }
    closeBackgroundEditor () {
        this.backgroundEditorOpened = false;
    }
    backgroundChanged (e) {
        let property = e.path.split('.');
        property.shift();
        property = property.join('.');
        this.$.workspace.setBackgroundColor(e.value);
        this.notifyChange('background', {
            property,
            value: e.value
        });
    }
    selectedPartChanged (e) {
        let property = e.path.split('.');
        property.shift();
        property = property.join('.');
        this.notifyChange('selected-part-change', {
            property,
            value: e.value
        });
    }
    addedPartsChanged () {
        this.fire('change');
    }
    computeBackground () {
        let style = this.background.userStyle;
        return Object.keys(style).reduce((acc, property) => {
            acc += `${property}:${style[property]};`;
            return acc;
        }, '');
    }
    previous () {
        if (this.leftPanelView === 'background') {
            this.set('leftViewOpened', false);
        } else {
            this.set('leftPanelView', 'background');
        }
    }
    /**
     * Save the current work in the local storage
     */
    save (snapshot=false) {
        let savedParts = this.addedParts.reduce((acc, part) => {
            acc.push(part.toJSON());
            return acc;
        }, []),
            savedApp = {};
        savedApp.parts = savedParts;
        savedApp.code = this.code;
        savedApp.background = this.background;
        if (snapshot) {
            savedApp.snapshot = true;
            savedApp.selectedPart = this.addedParts.indexOf(this.selected);
            savedApp.blockEditorPage = this.$['part-editor-tooltip'].selectedPage;
            savedApp.selectedTrigger = this.$['part-editor-tooltip'].trigger;
        }

        return savedApp;
    }
    share () {
        let workspace = this.$.workspace,
            backgroundColor = this.computeBackground();
        workspace.generateCover(backgroundColor).then(image => {
            this.fire('share', {
                cover: image,
                workspaceInfo: JSON.stringify(this.save()),
                background: backgroundColor,
                size: this.wsSize,
                code: this.code,
                parts: this.addedParts
            });
        });
    }
    /**
     * Load the saved work from the local storage
     */
    load (savedApp, parts) {
        let addedParts,
            part;
        if (!savedApp) {
            return;
        }
        addedParts = savedApp.parts.map((savedPart) => {
            for (let i = 0, len = parts.length; i < len; i++) {
                if (parts[i].type === savedPart.type) {
                    savedPart = Object.assign({}, parts[i], savedPart);
                    break;
                }
            }
            part = Part.create(savedPart, this.wsSize);
            return part;
        });
        this.set('code', savedApp.code);
        this.set('addedParts', addedParts);
        this.set('background', savedApp.background);
        if (savedApp.snapshot) {
            this.$['workspace-controls'].selectPart(addedParts[savedApp.selectedPart]);
            this.$['part-editor-tooltip'].set('trigger', savedApp.selectedTrigger);
            this.$['part-editor-tooltip'].showPage(savedApp.blockEditorPage);
        }
        this.updateColors();
    }
    toggleParts () {
        this.$.partsPanel.togglePanel();
    }
    panelStateChanged () {
        let eventName = 'open-parts';
        if (this.partsPanelState !== 'drawer') { /* When closing the panel */
            eventName = 'close-parts';
        }
        this.notifyChange(eventName);
    }
    onPartReady (e) {
        let clone;
        interact(e.detail).draggable({
            onmove: (event) => {
                let target = event.target,
                    // keep the dragged position in the data-x/data-y attributes
                    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                // translate the element
                target.style.webkitTransform =
                target.style.transform =
                    'translate(' + x + 'px, ' + y + 'px)';

                // update the posiion attributes
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
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
    triggerResize () {
        window.dispatchEvent(new Event('resize'));
    }
    bindEvents () {
        let sidebar = this.$.sidebar;
        this.updateWorkspaceRect = this.updateWorkspaceRect.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.panelStateChanged = this.panelStateChanged.bind(this);

        this.$.workspace.addEventListener('viewport-resize', this.updateWorkspaceRect);
        if (sidebar.classList.contains('animatable')) {
            sidebar.addEventListener('transitionend', this.panelStateChanged);
        } else {
            this.$.partsPanel.addEventListener('selected-changed', this.panelStateChanged);
        }
        window.addEventListener('resize', this.onWindowResize);
    }
    detachEvents () {
        this.$.workspace.removeEventListener('viewport-resize', this.updateWorkspaceRect);
        this.$.sidebar.removeEventListener('transitionend', this.panelStateChanged);
        window.removeEventListener('resize', this.onWindowResize);
    }
    ready () {
        this.makeButtonIconPaths = {
            stopped: 'M 10,4 l 16, 12, 0, 0, -16, 12, z',
            running: 'M 4,4 l 24, 0 0, 24, -24, 0, z'
        };
    }
    attached () {
        this.partEditorOpened = false;
        this.backgroundEditorOpened = false;
        this.$.workspace.size = this.wsSize;

        interact(this.$['left-panel']).dropzone({
            // TODO rename to kano-part-item
            accept: 'kano-ui-item:not([instance])',
            ondrop: (e) => {
                let model = e.relatedTarget.model,
                    part;
                model.position = null;
                part = Part.create(model, this.wsSize);
                this.push('addedParts', part);
                this.fire('change', {
                    type: 'add-part',
                    part
                });
            }
        });
        this.bindEvents();
        setTimeout(() => {
            this.triggerResize();
        }, 200);
        this.onWindowResize();
    }
    onWindowResize () {
        let rect = this.$['left-panel'].getBoundingClientRect(),
            partEditor = this.$['part-editor-tooltip'],
            backgroundEditor = this.$['background-editor-tooltip'];
        backgroundEditor.leftBound = rect.left + TOOLTIP_PADDING;
        backgroundEditor.rightBound = rect.left + rect.width - TOOLTIP_PADDING;
        partEditor.leftBound = rect.left + TOOLTIP_PADDING;
        partEditor.rightBound = rect.left + rect.width - TOOLTIP_PADDING;
    }
    detached () {
        Part.clear();
        this.detachEvents();
    }
    updateWorkspaceRect (e) {
        this.set('workspaceRect', e.detail);
    }
    /**
     * Add draggable properties to the added element in the workspace
     * @param  {Event} e
     */
    workspaceUiReady (e) {
        let element = e.detail;
        if (element.instance) {
            return ;
        }
        interact(element).draggable({
            onmove: this.getDragMoveListener(true),
            onend: (e) => {
                let model = e.target.model;
                this.fire('change', {
                    type: 'move-part',
                    part: model
                });
            },
            restrict: {
                restriction: this.$['left-panel'],
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            }
        });
    }
    getDragMoveListener (scale=false) {
        return (event) => {
            let target = event.target,
                pos = target.model.position,
                delta = {
                    x: event.dx,
                    y: event.dy
                };

            // Do not move when running
            if (this.running) {
                return;
            }

            if (scale) {
                delta = this.scaleToWorkspace(delta);
            }

            pos.x += delta.x;
            pos.y += delta.y;

            target.set('model.position.x', pos.x);
            target.set('model.position.y', pos.y);
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
    /**
     * Toggle the running state of the current app
     */
    toggleRunning () {
        this.running = !this.running;
        this.notifyChange('running', {
            value: this.running
        });
    }

    getMakeButtonClass () {
        if (this.running) {
            return 'running';
        }

        return 'stopped';
    }

    getMakeButtonLabel () {
        if (this.running) {
            return 'Stop';
        }

        return 'Make';
    }

    /**
     * Resize the workspace
     */
    resizeWorkspace (e) {
        this.pauseEvent(e);
        this.isResizing = true;
    }

    /**
     * Completed the resize action
     */
    completedResizing () {
        this.isResizing = false;
    }
    /**
     * Used to prevent text selection when dragging
     */
    pauseEvent (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }

    /**
     * Mouse moved handler
     */
    mouseMoved (e) {
        let leftPanel = this.$['left-panel'],
            container = this.$.section,
            offsetLeftPanel;

        if (!this.isResizing) {
            return;
        }
        this.pauseEvent(e);

        offsetLeftPanel = e.clientX - container.getBoundingClientRect().left;
        offsetLeftPanel = offsetLeftPanel;
        leftPanel.style.width = `${offsetLeftPanel}px`;

        //We need to trigger the resize of the kano-ui-workspace and the blockly workspace
        window.dispatchEvent(new Event('resize'));
    }

    /**
     * Restore the editor style
     */
    clearEditorStyle () {
        this.$['left-panel'].style.maxWidth = '62%';
    }

    getBlocklyWorkspace () {
        return this.$['root-view'].getBlocklyWorkspace();
    }

    partsMenuLabel () {
        return this.partsPanelState === 'drawer' ? 'Close' : 'Add';
    }

    applyOpenClass () {
        return this.partsPanelState === 'drawer' ? 'open' : '';
    }
}
Polymer(KanoAppEditor);
