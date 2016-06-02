let microphone;

export default microphone = {
    partType: 'hardware',
    type: 'microphone',
    label: 'Microphone',
    component: 'kano-part-microphone',
    image: '/assets/part/microphone.svg',
    colour: '#FFB347',
    blocks: [{
        block: () => {
            return {
                id: 'get_volume',
                message0: 'Microphone: volume',
                output: true
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').volume`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').volume`;
                return [code];
            };
        }
    }]
};
