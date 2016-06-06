let pictureList;

export default pictureList = {
    partType: 'ui',
    type: 'picture-list',
    label: 'Picture List',
    image: '/assets/part/box.svg',
    colour: '#E73544',
    blocks: [{
        block: (ui) => {
            return {
                id: 'length',
                message0: `${ui.name}: length`,
                output: 'Number'
            };
        },
        javascript: (ui) => {
            return function (block) {
                return [`devices.get('${ui.id}').listLength;`];
            };
        },
        pseudo: (ui) => {
            return function (block) {
                return [`devices.get('${ui.id}').listLength;`];
            };
        }
    }]
};
