# Activity bar API

The Activity Bar is the bar sitting on the left of the editor:

Design Implementation:

![alt text](./activity-bar.jpg "Activity Bar")

Provides a way to add items to the Activity Bar.

```js

class MyActivityBarEntryProvider extends code.ActivityBarEntryProvider {
    get icon() {
        return '/assets/icons/info.svg';
    }
    get alt() {
        return 'Hello';
    }
}

const activityBarEntry = editor.activityBar.registerEntry(new MyActivityBarEntryProvider());

activityBarEntry.on('activate', () => {});

activityBarEntry.dispose();
```

With tooltip (Will not trigger the activate event):

```js

class MyActivityBarEntryProvider extends code.ActivityBarEntryProvider {
    constructor() {
        super();
        this.dom = document.createElement('div');
        this.dom.innerHTML = 'Hello there!';
    }
    get tooltipRoot() {
        return this.dom;
    }
    get icon() {
        return '/assets/icons/info.svg';
    }
    get alt() {
        return 'Hello';
    }
}

const activityBarEntry = editor.activityBar.registerEntry(new MyActivityBarEntryProvider());

activityBarEntry.dispose();
```