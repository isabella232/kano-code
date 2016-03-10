let cat;

export default cat = {
    methods: {
        random () {
            return fetch('http://random.cat/meow')
                .then((res) => res.json())
                .then((j) => j.file);
        }
    },
    lifecycle: {
        stop () {

        }
    }
};
