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
            codes: {
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
                type: Array,
                value: () => {
                    return [];
                }
            },
            wsSize: {
                type: Object
            },
            isResizing: {
                type: Boolean,
                value: false
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
                }, {}),
                partList,
                increment,
                HS;

            grouped.system = this.defaultCategories;

            Object.keys(grouped).forEach((partType) => {
                partList = grouped[partType] || [];
                // Set the increment value, which will decide how much to change the lightness between all colors
                increment = range / (partList.length + 1);
                // Grab the HS values from the color map
                HS = colorMapHS[partType];
                partList.forEach((part, i) => {
                    // Calculate the lightness
                    let L = (50 - (range / 2)) + (increment * (i + 1)); // unary + is to coerce String j into number
                    // Set the color
                    part.colour = `hsl(${HS[0]}, ${HS[1]}%, ${L}%)`;
                });
            });

            // Update the colours
            this.defaultCategories.forEach((cat) => {
                cat.blocks.forEach((block) => {
                    block.colour = cat.colour;
                });
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
        savedApp.codes = this.codes;
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
                codes: this.codes,
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
        this.set('codes', savedApp.codes);
        this.set('addedParts', addedParts);
        this.set('background', savedApp.background);
        if (savedApp.snapshot) {
            this.$['workspace-controls'].selectPart(addedParts[savedApp.selectedPart]);
            this.$['part-editor-tooltip'].set('trigger', savedApp.selectedTrigger);
            this.$['part-editor-tooltip'].showPage(savedApp.blockEditorPage);
        }
        this.updateColors();
    }
    openParts () {
        this.partsOpened = true;
    }
    closeParts (e) {
        let parts = e.detail;
        this.partsOpened = false;
        if (!Array.isArray(parts)) {
            return;
        }
        parts.forEach((model) => {
            let part = Part.create(model, this.wsSize);
            this.push('addedParts', part);
            this.notifyChange('add-part', { part });
        });
    }
    triggerResize () {
        window.dispatchEvent(new Event('resize'));
    }
    attached () {
        this.partsOpened = false;
        this.partEditorOpened = false;
        this.backgroundEditorOpened = false;
        this.$.workspace.size = this.wsSize;
        setTimeout(() => {
            this.triggerResize();
        }, 200);
        this.$.workspace.addEventListener('viewport-resize', this.updateWorkspaceRect.bind(this));
        window.addEventListener('resize', this.onWindowResize.bind(this));
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
        window.removeEventListener('resize', this.onWindowResize.bind(this));
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
                restriction: this.$.workspace.getViewport(),
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
            return 'make-button-running';
        }

        return 'make-button';
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
}
Polymer(KanoAppEditor);
