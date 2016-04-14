/* globals Polymer */
/* globals app */
class KanoViewStories {
    beforeRegister () {
        this.is = 'kano-view-stories';
    }
    attached () {
        app.stories.list()
            .then((stories) => {
                this.set('stories', stories);
            });
    }
}

Polymer(KanoViewStories);
