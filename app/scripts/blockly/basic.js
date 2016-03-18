let register = (Blockly) => {

};
let categories = [{
    name: 'Logic',
    colour: '#7DC242 url("http://a.deviantart.net/avatars/b/l/black-matrix.gif")',
    blocks: [{
        id: 'controls_if'
    },{
        id: 'controls_if_if'
    },{
        id: 'controls_if_elseif'
    },{
        id: 'controls_if_else'
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
    colour: 'url("/assets/blockly/1-0.png") 0px 0px/20px 20px, linear-gradient(#34A836,#2C9929)',
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
