class Stories {
    constructor () {

    }
    list () {
        return Promise.resolve([{
            name: 'Random colours',
            id: 'background_colour',
            image: '/assets/stories/background_colour/background-colour.svg',
            available: true
        },{
            name: 'ISS tracker',
            id: 'space_tracker',
            image: '/assets/stories/space_tracker/space-tracker.svg',
            available: true
        },{
            name: 'Weather',
            id: 'weather',
            image: '/assets/stories/weather/weather.svg',
            available: false
        },{
            name: 'AI Robot',
            id: 'ai_robot',
            image: '/assets/stories/ai-robot.svg',
            available: false
        },{
            name: 'Cat Factory',
            id: 'cat_factory',
            image: '/assets/stories/cat-factory.svg',
            available: false
        }]);
    }
    getById (id) {
        return fetch(`/assets/stories/${id}/index.json`)
            .then(r => r.json());
    }
    getSceneByIndex (story, index) {
        let scene = story.scenes[index];
        if (!scene.data && scene.data_path) {
            return fetch(`/assets/stories/${story.id}/${scene.data_path}`)
                .then(r => r.json())
                .then((data) => {
                    scene.data = data;
                    delete scene.data_path;
                    return scene;
                });
        }
        return Promise.resolve(scene);
    }
}

let StoriesService = new Stories();

export default StoriesService;
