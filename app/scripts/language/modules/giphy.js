let giphy;

export default giphy = {
    methods: {
        random () {
            return fetch('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&rating=y')
                .then(r => r.json())
                .then((res) => {
                    return res.data.image_url;
                });
        }
    },
    lifecycle: {
        stop () {

        }
    }
};
