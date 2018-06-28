# Kano Code Challenge Plugin

##

## Generator

This plugin embeds a challenge generator. This generator will add an entry to the settings button on the WorkspaceView.

This entry allows to go in and out of challenge creation mode. This gives two features:
 - The ability to download challenges file from the settings button
 - A set of Challenge blocks allowing the customisation of the generated challenge

### Blocks

#### Start

The start block will tell the generator where the challenge should really start. It will then generate the preloaded app up until that block as well as all the steps to complete the challenge from there

#### Banner

This block will inject a banner step after the creation of the previous block and before the creation of the next one

### Comments

In creator mode, when adding openning a block comment for the first time (or if the comment has no content) it will
fill it with a JSON object containing

```json
{
    "openFlyoutCopy": "Open this tray",
    "grabBlockCopy": "Drag the block onto your code space",
    "connectCopy": "Connect to this block"
}
```

This data will be used to generate the step creating the very same block