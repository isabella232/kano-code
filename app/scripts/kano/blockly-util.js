(function (Kano) {
    var BlocklyUtil = {};
    Kano.BlocklyUtil = BlocklyUtil;

    BlocklyUtil.updateBlockColour = function (def, colour) {
        let oldInit = def.init;
        def.init = function () {
            var r = oldInit.apply(this, arguments);
            this.setColour(colour);
            return r;
        };
    };

})(window.Kano = window.Kano || {});
