let iss;

export default iss = {
    partType: 'data',
    type: 'iss',
    label: 'ISS',
    cover: 'http://www.unoosa.org/res/timeline/index_html/space-2.jpg',
    colour: '#1f1f1f url("http://i.huffpost.com/gadgets/slideshows/290159/slide_290159_2299290_sq50.jpg")',
    description: 'The ISS (International Space Station) is the largest artificial body in orbit. Scientists use it to conduct experiments in zero gravity. Here, you can track its position in real time',
    parameters: [],
    refreshFreq: 5,
    minRefreshFreq: 5,
    method: 'space.getISSStatus',
    dataKeys: [{
        label: 'Latitude',
        key: 'latitude',
        description: 'Latitude of the ISS'
    },{
        label: 'Longitude',
        key: 'longitude',
        description: 'Longitude of the ISS'
    }]
};
