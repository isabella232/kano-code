This file describes the different tools for a content creator to build their story in `make-apps`

### Location

You can define the target of the tooltip using the `location` key.

To target a part of the UI use the dotted notation e.g. `sidebar.parts.part-iss`.

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
