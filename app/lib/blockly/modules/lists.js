const COLOR = '#ccdd1e';

const register = (Blockly, registry) => {
    registry.upgradeCategoryColours('lists', COLOR);
};

const category = {
    name: Blockly.Msg.CATEGORY_LISTS,
    id: 'lists',
    colour: COLOR,
    blocks: [
        'lists_create_empty',
        'lists_create_with',
        'lists_repeat',
        'lists_length',
        'lists_isEmpty',
        'lists_indexOf',
        'lists_getIndex',
        'lists_setIndex',
    ],
};

const defaults = {
    lists_getIndex: {
        MODE: 'GET',
    },
    lists_setIndex: {
        MODE: 'SET',
    },
};

export default {
    id: category.id,
    register,
    category,
    defaults,
};
