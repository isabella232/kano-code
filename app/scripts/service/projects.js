class Projects {
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
        return fetch(`/assets/projects/${id}/index.json`)
            .then(r => r.json());
    }
    getSceneByIndex (project, index) {
        return fetch(`/assets/projects/${project.id}/${project.scenes[index]}.json`)
            .then(r => r.json());
    }
}

let ProjectsService = new Projects();

export default ProjectsService;
