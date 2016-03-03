class KanoViewProjects {
    beforeRegister () {
        this.is = 'kano-view-projects';
    }
    attached () {
        app.projects.list()
            .then((projects) => {
                this.set('projects', projects);
            });
    }
}

Polymer(KanoViewProjects);
