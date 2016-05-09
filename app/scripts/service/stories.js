class Stories {
    constructor () {

    }
    list () {
        return Promise.resolve([{
            name: 'Random colors',
            id: 'background_color',
            image: '/assets/stories/background_color/background-color.svg',
            available: true
        },{
            name: 'Sports ticker',
            id: 'sports_round',
            image: '/assets/stories/sports_round/sports-round.svg',
            available: true
        },{
            name: 'ISS tracker',
            id: 'space_tracker',
            image: '/assets/stories/space_tracker/space-tracker.svg',
            available: true
        },{
            name: 'Windy mountains',
            id: 'weather',
            image: '/assets/stories/weather/weather.svg',
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
