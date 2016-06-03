/* globals Headers */
let HadrdwareAPI;

export default HadrdwareAPI = {
    config (c) {
        this.endpoint = c.endpoint;
    },
    light: {
        allOn (color) {
            return fetch(`${this.endpoint}/allon`, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ colour: color })
            }).then(() => {});
        },
        allOff () {
            return fetch(`${this.endpoint}/alloff`, {
                method: 'POST'
            }).then(() => {});
        }
    }
};
