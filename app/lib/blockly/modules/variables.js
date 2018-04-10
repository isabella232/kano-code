const COLOR = '#ffc100';

const register = (Blockly, registry) => {
    registry.upgradeCategoryColours('variables', COLOR);
};

const category = {
    name: Blockly.Msg.CATEGORY_VARIABLES,
    id: 'variables',
    colour: COLOR,
    blocks: [
        'math_number',
        'text',
        'text_join',
        'variables_set',
        'variables_get',
    ],
};

const defaults = {
    variables_set: {
        VAR: 'item',
    },
    variables_get: {
        VAR: 'item',
    },
};

export default {
    id: category.id,
    register,
    category,
    defaults,
};

