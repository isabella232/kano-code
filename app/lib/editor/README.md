# Editor

## Toolbox

The editor will have a `toolbox` property. This property allows you to define the toolbox for the source code editor.
You can define the entries of the toolbox through `setEntries`:

```js
const editor = new Editor();

editor.toolbox.setEntries([MathToolbox, ColorToolbox]);
```

The entries provided to the toolbox must be MetaAPI module definitions.