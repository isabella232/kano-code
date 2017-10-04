## Definition

This document will define the features expected from a challenge engine library that will be used across the Kano platforms to define challenges.

### Challenge

A challenge is a series of steps, each of these steps expect an action from the user to progress to the next step. Once every step were validated, the challenge is completed.

### Step

A step of a challenge contains the information for the application to display UI hints to the user and to know what to wait for until going to the next step.

```json
{
    "banner": { "text": "Click on the button" },
    "tooltip": { "position": "top" },
    "validation": { "button-clicked": true }
}
```

The `validation` property is reserved for the engine, but every other property is free to be defined.

### Validation

A validation is defined under the `validation` key in a step. Each key under this object will make the step listen to an event. If multiple events are defined, they will be treated as a logic `OR`

```json
{
    "validation": {
        "button-tapped": true,
        "dialog-opened": true
    }
}
```

Setting the event to true, will make the engine just listen to the event and validate the step right away without checking the details of the event.

```json
{
    "validation": {
        "button-tapped": {
            "right-click": true,
            "colour": "green"
        }
    }
}
```

More data can be defined in an event validation. This space is free to customise since the validation definition
will make use of this data or not.

### UI tools

It is very likely that during a challenge some UI hints will need to be positioned next to on screen elements. To provide an easy access to these elements, an element registry is available.

The element registry would store references to DOM elements that could then be easily accessed from a challenge step definition or a validator.

## API

### Challenge

A challenge needs to have its steps behaviors and shorthands defined before the steps are processed, this is why, the steps are only expanded when the challenge starts

#### `Challenge#start`

Expand the steps, start the challenge with the first step. Before starting, the challenge is in an idle state.

#### `Challenge#getStep`

Returns the current step object.

#### `Challenge#nextStep`

Moves to the next step.

#### `Challenge#addStep`

Adds a step at a provided index in the challenge. if the step is a shorthand, it will expand it in place. If the step is added after the challenge started, the engine must shift the current step by the number of added steps to keep the current step the same.

#### `Challenge#defineBehavior`

Defines a callback that will run every time a custom property in a step changes. This can be used to display UI hints to the user.

```js
Challenge.defineBehavior('banner', data => {
    // data will be the contents of the `banner` property
    // You can use this to customise your UI
    myBannerEl.textContent = data.text;
});
```

#### `Challenge#defineShorthand`

Some parts of the challenges will be very similar, you can define shorthands for groups of steps in your challenges that will be expanded by the engine before running the challenge.

```json
{
    "type": "button-and-dialog",
    "buttonCopy": "Click on the button",
    "dialogCopy": "open the dialog"
}
```

```js
// This would define a shortcut with static validations but flexible copies
Challenge.defineShorthand('button-and-dialog', data => {
    //data: { type: 'button-and-dialog', buttonCopy: 'Click on the button', dialogCopy: 'open the dialog' }
    return [{
        banner: buttonCopy,
        validation: {/* ... */}
    }, {
        banner: dialogCopy,
        validation: {/* ... */}
    }]
});
```

#### `Challenge#triggerEvent`

Notifies the engine of an event. This will make the engine checks for the current validation

```js
Challenge.triggerEvent('button-tapped', { rightClick: true });
```

### Validator

#### `Validator#add`

Adds a validation for a specific event. When this event is triggered, the engine will run the function
to know if the event matches the validation.

```js
// Previously `addValidator`
Validator.add('button-tapped', (validation, event) => {
    // validation is the validation object defined in the JSON challenge
    // event is the details of the event matching the type

    // The function returns a boolean to indicate if the event matches completely the validation
    return event.aProperty === 'aValue';
});

```

#### `Validator#addMatchFallback`

If the event was triggered, but didn't pass the validation, the match fallback will run.
This allows you to define UI actions to help the user get back on track if needed

```js
// Previously `addMatchFallback`
Validator.addMatchFallback('button-tapped', (validation, event) => {
    if (validation.requiredValue === 'red' && event.value === 'blue') {
        displayUIHelp('Try a different colour');
    }
});

```

#### `Validator#addOppositeAction`

When waiting for an event, but a different one is triggered some actions can be performed using `addOppositeAction`

```js
// Previously `addOppositeAction`
Validator.addOppositeAction('button-tapped', 'dialog-opened', (validation, event) => {
    // We expected the user to tap the button, but instead they opened the dialog
    // we can use this to display some indications
    displayUIHelp(`Do not open the dialog right now, we'll need that later, but for now, it's all about tapping that button`);
});
```

### ElementsRegistry

#### `ElementsRegistry#add`

Adds an element to the regitry with an id.

```js
// This would make the element available globally from the id `next-button`
ElementsRegistry.add('next-button', document.getElementById('nxt-btn'));
```

#### `ElementsRegistry#get`

Get an element from the regitry.

```js
// In a step behavior for example
Challenge.defineBehavior('bouncing-arrow', data => {
    // Get the element defined in the step
    const target = ElementsRegistry.get(data.target);
    // Create a bouncing arrow to show the user where to click
    const arrow = new BouncingArrow();
    // Set the target of the arrow to the element
    arrow.setTarget(target);
    // Bounce
    arrow.bounce();
});
```

## Example: Kano Code integration

Here are a few examples of how this could be integrated to Kano Code and help with challenge creation:

### Creating a part

This shorthand definition would expand a simple group of actions into the required steps:

```js
// This would define a shortcut with static validations but flexible copies
StepDefinition.defineShorthand('create-part', data => {
    // Maybe add a utility method to ensure the required properties exist?
    StepDefinition.ensureProperty(data, 'partType');
    StepDefinition.ensureProperty(data, 'partId');
    return [{
        banner: { text: data.openDialogCopy || "Click on the add part button" },
        beacon: { target: 'add-part-button' },
        validation: {
            'open-parts': true
        }
    }, {
        tooltips: [{
            position: 'top',
            location: 'parts-panel',
            text: data.addPartCopy || `Click on the ${data.partType} part`
        }],
        beacon: { target: `parts-panel-${data.partType}` },
        validation: {
            'add-part': {
                type: data.partType,
                id: data.partId
            }
        }
    }]
});
```

This snippet would expand to the two steps required to create a part

```json
{
    "partType": "speaker",
    "partId": "part_0"
}
```

And the copy of each step can be customisable

```json
{
    "openDialogCopy": "Click on this button to add your super part",
    "addPartCopy": "Click on the part to add  it",
    "partType": "speaker",
    "partId": "part_0"
}
```

### Creating a block

This shorthand definition would expand a simple group of actions into the required steps:

```js
// This would define a shortcut with static validations but flexible copies
StepDefinition.defineShorthand('create-block', data => {
    // Maybe add a utility method to ensure the required properties exist?
    StepDefinition.ensureProperty(data, 'blockId');
    StepDefinition.ensureProperty(data, 'blockType');

    let blocklyCreate = { id: data.blockId, type: data.blockType },
        flyoutTarget;
    
    if (data.part) {
        flyoutTarget = { part: data.part };
        blocklyCreate.target = data.part;
    } else {
        flyoutTarget = data.category;
    }

    const steps = [{
        banner: { text: data.openFlyoutCopy || "Open this category" },
        beacon: { target: { category: flyoutTarget },
        validation: {
            'open-flyout': flyoutTarget
        }
    }, {
        banner: { text: data.dragBlockCopy || "Grab this block" },
        beacon: {
            target: {
                flyout_block: {
                    part: blocklyCreate.part,
                    type: blocklyCreate.type
                }
            }
        },
        validation: {
            blockly: {
                create: blocklyCreate
            }
        }
    }];

    if (data.connectTo) {
        steps.push({
            validation: {
                blockly: {
                    connect: data.connectTo,
                    target: data.blockId
                }
            },
            phantom_block: {
                location: {
                    block: data.connectTo
                },
                target: data.connectTo.inputName
            },
            banner: { text: data.connectCopy || "Connect it to this block" }
        });
    } else {
        steps.push({
            validation: {
                blockly: {
                    drop: {
                        target: data.blockId
                    }
                }
            },
            banner: { text: data.dropCopy || "Drop it anywhere" }
        });
    }
    return steps;
});
```

This snippet would expand to the two steps required to create a block, and optionally connect it to another block

Simple block from a category with default copy:

```json
{
    "blockId": "block_1",
    "category": "control",
    "blockType": "repeat_x_times"
}
```

Create a block from a part (default copy):

```json
{
    "blockId": "block_1",
    "part": "part_0",
    "blockType": "set_sticker"
}
```


Create a block from a part and connect to a previous block (custom copy)

```json
{
    "openFlyoutCopy": "Open this category",
    "dragCopy": "Grab this block",
    "connectCopy": "Connect it to this block",
    "blockId": "block_1",
    "part": "part_0",
    "blockType": "set_sticker",
    "connectTo": {
        "id": "block_0",
        "inputName": "PICTURE"
    }
}
```

### API style

```js

// Can extend class for challenge abstraction and resusability
// Here we only define behaviors and validations spcific to blockly challenges
class BlocklyChallenge extends Challenge {
    constructor (elementsRegistry) {
        super(elementsRegistry);
        this.defineBehavior('phantom_block', data => {
            displayPhantomBlock(data);
        });
    }
}

// A Kano Code challenge would be an extension of a blockly challenge as it also contains its own UI
class KanoCodeChallenge extends BlocklyChallenge {
    constructor (elementsRegistry) {
        super(elementsRegistry);
        this.beacon = document.createElement('kano-beacon');
        this.defineBehavior('beacon', data => {
            this.beacon.target = this.elementsRegistry.get(data.target);
        });
    }
}
```