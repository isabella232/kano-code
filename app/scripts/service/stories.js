class Stories {
    constructor () {

    }
    list () {
        return Promise.resolve([{
            name: 'Dummy',
            id: 'dummy',
            image: 'http://siliconvalleyrealtyworld.com/files/2011/09/Crash_Test_Dummy.jpg'
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
