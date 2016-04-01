let iss;

export default iss = {
    partType: 'data',
    type: 'list',
    label: 'List',
    colour: '#1f1f1f',
    description: 'Fake data source to display list items',
    dataType: 'list',
    parameters: [],
    refreshFreq: 5,
    minRefreshFreq: 5,
    method: 'list.getData',
    dataKeys: [{
        label: 'Title',
        key: 'title',
        description: 'Title of the item'
    },{
        label: 'Content',
        key: 'content',
        description: 'Content of the item'
    }]
};
