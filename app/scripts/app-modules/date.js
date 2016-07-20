let date;

export default date = {
    name: "Date",
    methods: {
        getCurrent () {
            let current = {},
                date = new Date();
            current.year = date.getFullYear();
            current.month = date.getMonth() + 1;
            current.day = date.getDate();
            current.hour = date.getHours();
            current.minute = date.getMinutes();
            current.seconds = date.getSeconds();
            return current;
        },
        getFormattedDate () {
            return (new Date()).toLocaleDateString();
        },
        getFormattedTime () {
            return (new Date()).toLocaleTimeString();
        }
    },
    lifecycle: {

    }
};
