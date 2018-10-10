# Kano Code

## Usage

```js
import { Editor } from '@kano/code/index.js';

const editor = new Editor({ sourceType: 'blockly' });

editor.inject(document.body);

```

## The editor

[Editor's documentation](./app/lib/editor/README.md)

[Challenges documentation](./app/lib/challenge/README.md)

## Development

### Setup

```bash
yarn
```

### Serve

```bash
yarn serve
```

### Demos

While serving, visit any of those:

http://localhost:4000/demo/simple/index.html
http://localhost:4000/demo/pong/index.html
