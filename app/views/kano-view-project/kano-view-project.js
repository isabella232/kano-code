class KanoViewProject {
    beforeRegister () {
        this.is = 'kano-view-project';
        this.properties = {
            selected: {
                type: Number,
                value: 0,
                observer: 'selectedChanged'
            },
            project: {
                type: Object,
                observer: 'selectedChanged'
            }
        };
    }
    attached () {
        app.projects.getById(app.ctx.params.id)
            .then((project) => {
                this.set('project', project);
            });
    }
    isSelected (index) {
        return index === this.selected;
    }
    nextScene () {
        if (this.selected < this.project.scenes.length - 1) {
            this.selected++;
        }
    }
    selectedChanged () {
        if (!this.project) {
            return;
        }
        app.projects.getSceneByIndex(this.project, this.selected)
            .then((scene) => {
                this.set('scene', scene);
            });
    }
}

Polymer(KanoViewProject);
