let sports;

export default sports = {
    partType: 'data',
    type: 'sports',
    label: 'Sports',
    colour: '#cddc39',
    image: '/assets/part/sports.svg',
    dataType: 'list',
    dataLength: 10,
    parameters: [{
        label: 'Sport',
        key: 'src',
        type: 'list',
        value: 'headlines',
        options: [{
            value: 'headlines',
            label: 'Headlines'
        },{
            value: 'football',
            label: 'Football'
        },{
            value: 'cricket',
            label: 'Cricket'
        },{
            value: 'rugby-union',
            label: 'Rugby Union'
        },{
            value: 'rugby-league',
            label: 'Rugby League'
        },{
            value: 'tennis',
            label: 'Tennis'
        },{
            value: 'golf',
            label: 'Golf'
        }]
    }],
    refreshFreq: 5,
    minRefreshFreq: 5,
    method: 'sports.getResults',
    dataKeys: [{
        label: 'Title',
        key: 'title',
        description: 'The title of the article'
    }]
};
