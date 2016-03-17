import Observable from '../observable';
import ObservableProducer from '../observable-producer';
let twitter;

export default twitter = {
    observableProducer: new ObservableProducer(),
    getLastTweet (username) {
        if (!username || !username.length) {
            return 'The username is not defined';
        }
        return Promise.resolve(`I am a tweet from ${username}`);
    },
    methods: {
        getLastTweet (username) {
            return twitter.observableProducer
                .createObservable(twitter.getLastTweet.bind(twitter), arguments);
        },
        refresh () {
            twitter.observableProducer.refresh();
        }
    },
    lifecycle: {
        stop () {
            twitter.observableProducer.clear();
        }
    }
};
