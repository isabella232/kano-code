let register = (Blockly) => {

};
let categories = [{
    name: 'Logic',
    colour: '#7DC242',
    blocks: [{
        id: 'controls_if'
    },{
        id: 'logic_compare'
    },{
        id: 'logic_operation'
    },{
        id: 'logic_negate'
    },{
        id: 'logic_boolean'
    },{
        id: 'logic_null'
    },{
        id: 'logic_ternary'
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
    colour: 'linear-gradient(#34A836,#2C9929)',
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
