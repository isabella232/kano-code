let register = (Blockly) => {

};
let categories = [{
    name: 'Math',
    colour: 234,
    blocks: [{
        id: 'math_number'
    }]
},{
    name: 'Text',
    colour: 131,
    blocks: [{
        id: 'text'
    },{
        id: 'text_join'
    }]
},{
    name: 'Variables',
    colour: 5,
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
