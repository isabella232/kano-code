import cats from './cats.json';
let cat;

const COLOUR = '#F29120 url("http://a.deviantart.net/avatars/a/p/appoxity.gif")',
      CAT_API_PREFIX = 'http://random.cat/i/';

export default cat = {
    name: 'Cats',
    colour: COLOUR,
    methods: {
        random () {
            console.log('CAT');
            let index = Math.floor(Math.random() * cats.length);
            return `${CAT_API_PREFIX}${cats[index]}`;
        }
    },
    lifecycle: {}
};
