const sports = {
    partType: 'data',
    type: 'sports',
    label: Kano.MakeApps.Msg.PART_DATA_SPORTS_NAME,
    colour: '#cddc39',
    image: '/assets/part/sports.svg',
    dataType: 'list',
    dataLength: 10,
    parameters: [{
        label: Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_TITLE,
        key: 'src',
        type: 'list',
        value: 'headlines',
        options: [{
            value: 'headlines',
            label: Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_HEADLINES,
        }, {
            value: 'football',
            label: Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_FOOTBALL,
        }, {
            value: 'cricket',
            label: Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_CRICKET,
        }, {
            value: 'rugby-union',
            label: Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_RUGBY_UNION,
        }, {
            value: 'rugby-league',
            label: Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_RUGBY_LEAGUE,
        }, {
            value: 'tennis',
            label: Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_TENNIS,
        }, {
            value: 'golf',
            label: 'Golf',
        }],
    }],
    refreshFreq: 5,
    minRefreshFreq: 5,
    method: 'sports.getResults',
    dataKeys: [{
        label: Kano.MakeApps.Msg.PART_DATA_RSS_TITLE_TITLE,
        key: 'title',
        description: Kano.MakeApps.Msg.PART_DATA_RSS_TITLE_DESC,
    }],
};

export default sports;
