export const GeneratorAPIProvider = (editor) => {
    return {
        type: 'module',
        name: 'generator',
        verbose: 'Challenge',
        color: '#676767',
        symbols: [{
            type: 'function',
            name: 'banner',
            parameters: [{
                name: 'text',
                default: "'Banner content'",
                returnType: String,
                blockly: {
                    field: true,
                },
            }],
            blockly: {
                javascript(Blockly, block) {
                    const bannerText = block.getFieldValue('TEXT');
                    return `// @banner: ${bannerText}\n`;
                },
            },
        }, {
            type: 'function',
            name: 'start',
            blockly: {
                javascript(Blockly) {
                    return '// @challenge-start\n';
                },
            },
        }],
    };
};

export default GeneratorAPIProvider;

