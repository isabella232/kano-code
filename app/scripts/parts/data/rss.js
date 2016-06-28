let rss;

export default rss = {
    partType: 'data',
    type: 'rss',
    label: 'RSS',
    colour: '#cddc39',
    image: '/assets/part/rss.svg',
    dataType: 'list',
    dataLength: 10,
    parameters: [{
        label: 'Source',
        key: 'src',
        type: 'list',
        value: 'headlines',
        options: [{
            value: 'headlines',
            label: 'Headlines'
        },{
            value: 'world',
            label: 'World'
        },{
            value: 'uk',
            label: 'UK'
        },{
            value: 'edu',
            label: 'Education'
        },{
            value: 'sci_env',
            label: 'Science & Environment'
        },{
            value: 'tech',
            label: 'Technology'
        },{
            value: 'ent_arts',
            label: 'Entertainment & Art'
        }]
    }],
    refreshFreq: 5,
    minRefreshFreq: 5,
    method: 'rss.getFeed',
    dataKeys: [{
        label: 'Title',
        key: 'title',
        description: 'The title of the article'
    }]
};
