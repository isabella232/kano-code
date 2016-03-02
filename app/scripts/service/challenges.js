class Challenges {
    constructor () {

    }
    getById (id) {
        return fetch(`/assets/challenges/${id}/index.json`)
            .then(r => r.json());
    }
    getBoardByIndex (challenge, index) {
        return fetch(`/assets/challenges/${challenge.id}/${challenge.boards[index]}.json`)
            .then(r => r.json());
    }
}

let ChallengesService = new Challenges();

export default ChallengesService;
