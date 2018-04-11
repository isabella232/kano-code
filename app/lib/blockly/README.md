# Blockly Modules

Blockly Modules defines what blocks will be in a entry of the Blockly toolbox.

A Module takes care of two things: 
 - Register the blocks
 - Define the contents of the toolbox entry

Module template: 

```js

class BlocklyPotato {
    static get id() { return 'potato'; }
    /**
     * Register the Block and its generator(s)
     */
    static register(Blockly, registry) {
        Blockly.Blocks.sweet_potato = {
            init() {
                const json = {
                    id: 'sweet_potato',
                    message0: localize('BLOCKLY_SWEET_POTATO', 'Sweet Potato %1'),
                    args0: [{
                        type: 'input_value',
                        name: 'VALUE',
                        check: 'Number',
                    }]
                    output: 'Potato',
                };
                this.jsonInit(json);
            }
        };

        Blockly.JavaScript.sweet_potato = (block) => {
            return [42];
        };
    }
    /**
     * Defines the contents of the toolbox entry
     */
    static get category() {
        return {
            id: BlocklyPotato.id,
            name: localize('CATEGORY_POTATO', 'Potato'),
            colour: '#ff0055',
            blocks: [{
                id: 'sweet_potato',
                defaults: ['VALUE'],
            }],
        }
    }
    /**
     * Defines default values for the inputs of the blocks
     */
    static get defaults() {
        return {
            sweet_potato: {
                VALUE: 42,
            };
        }
    }
}

```

## Details

If these modules are defined as classes with static methods/properties it is to avoid a locale loading race condition.
If this module was an objectliteral, it would be executed right away and the values in the I18n registry would not be populated yet.
A static property will only run its getter once the property needs to be evaluated, which will be once an editor reads the toolbox entry, well after the locales should be loaded.

## Future

In the future these modules will only be responsible for the definition of the toolbox entries as the registration will be done together with the AppModule or Part definition through the MetaAPI