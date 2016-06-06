/* globals Headers */
let HardwareAPI;

const MODULES = {
          lightboard: 'lightboard'
      },
      ACTIONS = {
          'allon': 'allon',
          'alloff': 'alloff',
          'on': 'on'
      };

export default HardwareAPI = {
    config (c) {
        this.endpoint = c.HARDWARE_API_URL;
    },
    getPath (module, action) {
        return `${this.endpoint}/${MODULES[module]}/${ACTIONS[action]}`;
    },
    light: {
        getPath (action) {
            return HardwareAPI.getPath('lightboard', action);
        },
        allOn (color) {
            return fetch(HardwareAPI.light.getPath('allon'), {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ colour: color })
            }).then(() => {});
        },
        allOff () {
            return fetch(HardwareAPI.light.getPath('alloff'), {
                method: 'POST'
            }).then(() => {});
        },
        singleOn (index, color) {
            let path = HardwareAPI.light.getPath('on');
            return fetch(`${path}/${index}`, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ colour: color })
            }).then(() => {});
        },
        on (bitmap) {
            return fetch(HardwareAPI.light.getPath('on'), {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ pixels: bitmap })
            }).then(() => {});
        }
    }
};
