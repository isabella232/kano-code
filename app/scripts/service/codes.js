import Devices from './devices';

let Codes;

export default Codes = {
    codes: {},
    add (id, code, rule, xml) {
        this.codes[id] = this.codes[id] || [];
        this.codes[id].push({code,rule,xml});
    },
    remove (id) {
        delete this.codes[id];
    },
    run () {
        let codeList = Object.keys(this.codes).map((key) => {
            return this.codes[key].map((c) => c.code).join(';');
        }),
            wrapUserCode = `window.userCode = function(devices){${codeList.join()}};`;
        Devices.startAll();
        eval(wrapUserCode);
        window.userCode.call(null, Devices);
    },
    stop () {
        Devices.stopAll();
    },
    getRulesFor (id) {
        return this.codes[id].map((c) => {
            return c.rule;
        });
    }
};
