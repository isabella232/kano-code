const sources = [{
        value: 'headlines',
        label: Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_HEADLINES
    },{
        value: 'world',
        label: Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_WORLD
    },{
        value: 'uk',
        label: Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_UK
    },{
        value: 'edu',
        label: Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_EDUCATION
    },{
        value: 'sci_env',
        label: Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_SCI_ENV
    },{
        value: 'tech',
        label: Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_TECH
    },{
        value: 'ent_arts',
        label: Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_ENT_ARTS
    }],

    rss = {
    partType: 'data',
    type: 'rss',
    label: Kano.MakeApps.Msg.PART_DATA_RSS_NAME,
    colour: '#cddc39',
    image: '/assets/part/rss.svg',
    dataType: 'list',
    dataLength: 10,
    parameters: [{
        label: Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_TITLE,
        key: 'src',
        type: 'list',
        value: 'headlines',
        options: sources
    }],
    refreshFreq: 5,
    minRefreshFreq: 5,
    method: 'rss.getFeed',
    dataKeys: [{
        label: Kano.MakeApps.Msg.PART_DATA_RSS_TITLE_TITLE,
        key: 'title',
        description: Kano.MakeApps.Msg.PART_DATA_RSS_TITLE_DESC
    }],
    blocks: [{
        block: (ui) => {
            return {
                id: 'rss_source',
                message0: `${ui.name}: %1`,
                output: 'String',
                args0: [{
                    type: "field_dropdown",
                    name: "FIELD",
                    options: sources.map((source) => {
                        return [source.label, source.value]
                    })
                }]
            };
        },
        javascript: () => {
            return (block) => {
                let field = block.getFieldValue('FIELD'),
                    code = `'${field}'`;
                return [code];
            };
        }
    }, {
        block: (ui) => {
            return {
                id: 'set_rss_source',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_RSS_SET_SOURCE}`,
                inputsInline: false,
                args0: [{
                    type: "input_value",
                    name: "SRC",
                    check: 'String'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let src = Blockly.JavaScript.valueToCode(block, 'SRC') || `'headlines'`,
                    code = `devices.get('${part.id}').setConfig('src', ${src});\n`;
                return code;
            };
        }
    }]
};

export default rss;
