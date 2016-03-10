let cons;

export default cons = {
    methods: {
        log: (message) => {
            if (message instanceof Promise) {
                message.then(cons.methods.log);
            } else {
                console.log(message);
            }
        }
    }
};
