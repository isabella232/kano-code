/*
 * Language module
 *
 * Stateful, functional module that interprets the draw language
 */

var session = require('./session'),
    modules = require('./modules/index');

/*
 * Reset current drawing session
 *
 * @param {Object} settings
 * @return void
 */
function resetSession(settings) {
    "use strict";
    session.ctx = settings.ctx;
    session.width = settings.width;
    session.height = settings.height;
    session.ratio = settings.ratio || 1;
    session.steps = [];
    modules.general.reset();
}

module.exports = {
    modules: modules,
    session: session,
    resetSession: resetSession
};
