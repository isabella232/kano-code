let button;

export default button = {
    type: 'button',
    label: 'Button',
    image: 'assets/part/buttons-icon.png',
    description: 'A button that can trigger all sort of crazy stuff',
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
