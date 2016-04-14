let button;

export default button = {
    partType: 'ui',
    type: 'button',
    label: 'Button',
    image: '/assets/part/buttons-icon.png',
    description: 'A button that can trigger all sort of crazy stuff',
    colour: '#3f51b5',
    customizable: {
        properties: [{
            key: 'text',
            type: 'text',
            label: 'Text'
        }],
        style: ['background-color']
    },
    userProperties: {
        text: 'Click me'
    },
    events: [{
        label: 'is clicked',
        id: 'clicked'
    }]
};
