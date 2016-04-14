let share;

export default share = {
    partType: 'data',
    type: 'share',
    label: 'Kano Shares',
    image: '/assets/icons/judoka-face.svg',
    colour: '#1f1f1f',
    description: 'When something is shared on **Kano World**, everything is saved on our servers. You can ask theses servers about the shares here',
    dataType: 'list',
    dataLength: 9,
    parameters: [],
    refreshFreq: 5,
    minRefreshFreq: 5,
    method: 'kano.getShares',
    dataKeys: [{
        label: 'Title',
        key: 'title',
        description: 'Title of the share'
    },{
        label: 'Likes',
        key: 'likes',
        description: 'how many likes the share got'
    },{
        label: 'User',
        key: 'user',
        description: 'Name of the author of the share'
    },{
        label: 'Image',
        key: 'image',
        description: 'Image of the share'
    }]
};
