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
    // 
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
