This file describes the different tools for a content creator to build their story in `make-apps`

# The guts of a story

In `make-apps` a story is a sequence of scenes. Each scene can be a ready made component, like a full screen video or the app editor itself. But you can also create your own.

The order and metadata of each scenes are defines in the `index.json` file. Here is an example of this file:

```js
{
    "id": "my_story", // Defines the id of the story
    "description": "", // Optional description (not implemented yet)
    // list of scenes. Will be displayed in that order
    "scenes": [{
        "id": "_0", // Scene id (not implemented yet)
        "component": "my_story/my-story-intro-1", // Scene component
        "data": {} // Additional data to give to the component
    },{
        "id": "_1",
        "component": "my_story/my-story-intro-2",
        "data_path": "my_story_1_data.json"
    },{
        "id": "_5",
        "component": "common/editor",
        "data_path": "space_tracker_1_data.json"
    }]
}
```

The `component` key defines what will be displayed on the screen. You can choose a ready-made one by starting with `common` or a custom one with the name of your story's folder

You build the component like so `<common|[your_story_folder]>/<[name_of_the_scene]>`

The available ready-made scenes are:
 - video
 - editor

## Creating your own scene

To do so, create a folder inside which you will put an html file. The folder and html file MUST use the same name

### Naming

You MUST use this naming convention:
 - Start with `kano-scene-<name-of-your-app>-<additional-info>`
 - You must only use lowercase letters, numbers and dashes
 - You are free to add more info (Like `intro`, `outro`, `video-break`) and can use numbers if you have for example a long intro.

### Content

To fit in the story editor, you must use this skeleton code inside your html file:

```html
<dom-module id="kano-scene-<my-scene>">
    <style>
    /* Here add some styling */
    :host {
        display: block;
    }
    /* Start your selectors with :host e.g.
    :host .myClass {

    }
    */
    </style>
    <template>
        <!-- Here lies the content of your scene -->
    </template>
</dom-module>
<script type="text/javascript">
    /* globals Polymer, KanoBehaviors */
    // In this class, you can add methods that you will be able to call from the template
    class KanoSceneMyScene {

        get behaviors () {
            return [KanoBehaviors.SceneComponentBehavior];
        }

        beforeRegister () {
            this.is = 'kano-scene-<my-scene>';
        }

        // Code inside this method will run at the beginning
        ready () {

        }

    }
    Polymer(KanoSceneMyScene);
</script>

```

Just write HTML/CSS and javascript to make a nice scene.

#### Access the elements

You can access your html elements with this shorthand: `this.$['element-id']` e.g.

```html

<dom-module id="kano-scene-my-scene">
    <style>
    :host {
        display: block;
    }
    :host h1 {
        opacity: 0;
        transform: opacity ease-in 300ms;
    }
    </style>
    <template>
        <h1 id="title">My awesome title</h1>
    </template>
</dom-module>
<script type="text/javascript">
    /* globals Polymer, KanoBehaviors */
    class KanoSceneMyScene {
        get behaviors () {
            return [KanoBehaviors.SceneComponentBehavior];
        }
        beforeRegister () {
            this.is = 'kano-scene-my-scene';
        }
        ready () {
            this.$['title'].style.opacity = 1; // This accesses the title using its id and changes its opacity to display it
            // Since a transform on the opacity is specified in the CSS, the title will fade in over 300ms
        }
    }
    Polymer(KanoSceneMyScene);
</script>

```

#### Event binding

You can bind functions to events quite easily using the `on-` prefix. e.g:

```html

<dom-module id="kano-scene-my-scene">
    <style>
    :host {
        display: block;
    }
    </style>
    <template>
        <button on-tap="whenTapped">Next</button>
    </template>
</dom-module>
<script type="text/javascript">
    /* globals Polymer, KanoBehaviors */
    class KanoSceneMyScene {
        get behaviors () {
            return [KanoBehaviors.SceneComponentBehavior];
        }
        beforeRegister () {
            this.is = 'kano-scene-my-scene';
        }
        ready () {

        }
        whenTapped () {
            // This function will be called when a mouse click/finger tap happen on the button
        }
    }
    Polymer(KanoSceneMyScene);
</script>

```

You can find a list of events available for elements in here: [Event reference](https://developer.mozilla.org/en-US/docs/Web/Events)

#### Finishing the scene

To switch to the next scene or end the story, you can use the `finish` method. This method is available by default and can be used as any other method e.g.

```html
<button on-tap="finish">Next</button>
```

Or

```js

ready () {
    // End the scene 5secs after its beginning
    // Here, using () => {} instead of function () {} will allow you to use `this`
    setTimeout(() => {
        this.finish();
    }, 5000);
}

```

## Using ready-made scenes

### Video

There is not much to configure, just use `common/video` as component and define the src in the `data`:

```json
{
    "component": "common/video",
    "data": {
        "src": "/path/to/the/video"
    }
}
```

### App editor

This one is a big piece. The json file containing the data to create step by step guided stories through the app editor is usually quite big. So you should use `data_path` and write the steps in a separate file e.g.


```json
{
    "id": "my-story",
    "scenes": {
        "component": "common/editor",
        "data_src": "my_story_editor.json"
    }
}
```

Then you can create the `my_story_editor.json` file and start creating the steps.

#### Main properties

Here is how the JSON file can look like:

```json
{
    "parts": ["map", "iss"],
    "modules": ["control", "operators", "variables"],
    "steps": ["..."]
}
```

 - `parts`: An array containing the parts you want to be available from the `add parts` menu
 - `modules`: An array containing the default categories listed in the blocks view. available are: (`controls`, `operators`, `variables`, `background`). The `events` category is here by default
 - `steps`: This array contain objects defining each step of the scene and is the most complicated

#### Step

The main property of a step is the validation. It is a rule that describe the action the user must do to jump to the next step. e.g.

```json

{
    "validation": {
        "open-parts": true
    }
}

```

This is one of the simplest validation, waiting for an event. During the lifetime of the app editor, almost every action made by the user will trigger an event.
By using the name of the event and using `true`, your are just saying *Wait for that event and go to next step*.

But for most events, you need to add more validation:

#### Match property (`background`, `selected-part-change`)

You can define a `property` key that will check that a value has changed.
The property is a path. e.g. `position.x`, `position.y`, `rotation`...
But you can also use the `*` to watch any events

Examples:

Wait for the background to change
```json

{
    "validation": {
        "background": {
            "property": "userStyle.background"
        }
    }
}
```

You can also use the `count` key to wait for a number of events before jump to the next step.
Wait for a part to move. Here `position.x` and `position.y` will be watched. The validator will wait for 30 changes in the position.

```json

{
    "validation": {
        "selected-part-change": {
            "property": "position.*",
            "count": 30
        }
    }
}
```

#### Match part type (`add-part`, `select-new-part`)

This allows you to specify an action on a part type. Used on the creation of a part or its selection on the `add parts` menu.


This wait for the user to select the `ISS` part in the `add parts` menu
```json
"validation": {
    "select-new-part": {
        "type": "iss"
    }
}
```

In the case of the creation of a part by the user, you can specify an `id` that will hold a reference to the newly added part so that you can use it later on.

This wait for the user to create a `Map` part
```json
"validation": {
    "add-part": {
        "type": "map",
        "id": "map_1"
    }
}
```

#### Match part target (`select-part`, `open-part-config`, `enable-refresh`, `disable-refresh`, `manual-refresh`, `selected-part-change`)

This one allows you to wait for an event on a particular part using the `target` key. This is to use with the saved `id` in `Match part type`.


Here you wait for the user to open the configuration menu of the `Map` part created earlier that you saved under the id `map_1`
```json
"validation": {
    "open-part-config": {
        "target": "map_1"
    }
}
```

#### Highlight

You can highlight an element in the UI using the `focus` key. The key needs to be an location (See location a bit further).

#### Tooltips

You can display tooltips on the screen that points to a UI element using the `tooltips` key. This is an array of objects like this:

```json
{
    "location": "<target ui element (See a bit further)>",
    "position": "<[top|right|bottom|left]>",
    "text": "<markdown content>",
    "next_button": "<[true|false]>"
}
```

If the `next_button` key is set, a `Next` button will be added at the end of the tooltip and will go to the next step when clicked on. When using this key, no need to specify a validation

### Location

You can define the target of the tooltip using the `location` key.

To target a part of the UI use the dotted notation e.g. `sidebar.parts.part-iss`.
Each name in the chain is the id of an element on the screen.

To target a dynamically created part during the story, define the path and part using an object with `path` and `part` keys e.g.

You wait for a part to be created with this validation:

```json
{
    "add-part": {
        "type": "iss",
        "id": "iss_1"
    }
}
```

Later on you will be able to target this part using:

```json
{
    "path": "workspace-controls",
    "part": "iss_1"
}
```

To target a created block in a blockly workspace, define an object and use the `block` key e.g.

You wait for the block to be created with this validation:
```json
{
    "blockly": {
        "create": {
            "target": "map_1",
            "type": "show_marker",
            "id": "show_marker"
        }
    }
}
```
Later on you will be able to target this block using:
```json
{
    "block": "show_marker"
}
```
