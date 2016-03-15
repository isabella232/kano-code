let register = (Blockly) => {

};
let categories = [{
    name: 'Math',
    colour: '#7DC242',
    blocks: [{
        id: 'math_number'
    }]
},{
    name: 'Text',
    colour: '#9C27B0',
    blocks: [{
        id: 'text'
    },{
        id: 'text_join'
    }]
},{
    name: 'Variables',
    colour: '#1BA238',
    blocks: [{
        id: 'variables_set'
    },{
        id: 'variables_get'
    }]
}];

export default {
    register,
    categories
};
