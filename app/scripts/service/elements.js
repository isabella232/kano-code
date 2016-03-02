let Elements;

export default Elements = {
    elements: {},
    add (id, element) {
        this.elements[id] = element;
    },
    remove (id) {
        delete this.elements[id];
    },
    get (id) {
        return this.elements[id];
    }
};
