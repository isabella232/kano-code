const fs = require('fs');
const path = require('path');
const PluginError = require('gulp-util').PluginError;
const through = require('through2');
const PO = require('pofile');

const PLUGIN_NAME = 'gulp-kano-i18n';

const lineReg = / *([^ ]+) ?= ?["|'](.*)["\'];?/;

/**
 * Gets and sets values in a object tree using a path structure
 */
var Path = {
    /**
     * Converts array-based paths to flattened path
     * @param {string | !Array<string|number>} path
     * @return {string}
     */
    normalize: function(path) {
      if (Array.isArray(path)) {
        var parts = [];
        for (var i=0; i<path.length; i++) {
          var args = path[i].toString().split('.');
          for (var j=0; j<args.length; j++) {
            parts.push(args[j]);
          }
        }
        return parts.join('.');
      } else {
        return path;
      }
    },
    /**
     * Split a path into an array
     * @param {string | !Array<string|number>} path
     * @return {!Array<string>}
     */
    split: function(path) {
      if (Array.isArray(path)) {
        return this.normalize(path).split('.');
      }
      return path.toString().split('.');
    },
    /**
     * @param {Object} root
     * @param {string | !Array<string|number>} path
     * @param {Object=} info
     * @return {*}
     */
    get: function(root, path, info) {
      var prop = root;
      var parts = this.split(path);
      // Loop over path parts[0..n-1] and dereference
      for (var i=0; i<parts.length; i++) {
        if (!prop) {
          return;
        }
        var part = parts[i];
        prop = prop[part];
      }
      if (info) {
        info.path = parts.join('.');
      }
      return prop;
    },
    /**
     * @param {Object} root
     * @param {string | !Array<string|number>} path
     * @param {*} value
     * @return {string | undefined}
     */
    set: function(root, path, value) {
      var prop = root;
      var parts = this.split(path);
      var last = parts[parts.length-1];
      if (parts.length > 1) {
        // Loop over path parts[0..n-2] and dereference
        for (var i=0; i<parts.length-1; i++) {
          var part = parts[i];
          prop = prop[part];
          if (!prop) {
            return;
          }
        }
        // Set value to object at end of path
        prop[last] = value;
      } else {
        // Simple property set
        prop[path] = value;
      }
      return parts.join('.');
    }
};

var poify = {
    process: function (contents) {
        let lines = contents.split('\n'),
            po = new PO();

        po.items = lines.map(line => {
            return line.match(lineReg);
        }).filter(match => match && match[1] && match[2]).map(match => {
            let item = new PO.Item();
            item.msgid = match[2];
            item.references = [match[1]];
            return item;
        });
        return po.toString();
    },
    processChallenge: function (challenge) {
        let po = new PO();

        function addField(path) {
            let item = new PO.Item();
            item.msgid = Path.get(challenge, path);
            item.references = [path];
            po.items.push(item);
        }

        function getTextPaths(node, p) {
            let paths = [];
            p = p || '';
            if (Array.isArray(node)) {
                node.forEach((child, index) => {
                    paths = paths.concat(getTextPaths(child, p + '.' + index));
                });
            } else if (typeof node === 'object' && node !== null) {
                Object.keys(node).forEach(key => {
                    if (key === 'translate_paths') {
                        paths = paths.concat(node[key].map(tp => p + '.' + tp));
                    }
                    paths = paths.concat(getTextPaths(node[key], p + '.' + key));
                });
            } else if (p.split('.').pop() === 'text') {
                paths.push(p);
            }
            return paths;
        }

        po.items = [];
        
        addField('name');
        addField('description');

        if (challenge.scenes) {
            let paths = getTextPaths(challenge.scenes, 'scenes');
            paths.forEach(p => addField(p));
        }

        return po.toString();
    },
    messages: function () {
        return through.obj(function (file, encoding, callback) {
            if (file.isNull()) {
                // nothing to do
                return callback(null, file);
            }

            if (file.isStream()) {
                // file.contents is a Stream - https://nodejs.org/api/stream.html
                this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
            } else if (file.isBuffer()) {

                let contents = file.contents.toString();

                file.contents = Buffer.from(poify.process(contents));

                callback(null, file);

            }
        });
    },
    challenge: function () {
        return through.obj(function (file, encoding, callback) {
            if (file.isNull()) {
                // nothing to do
                return callback(null, file);
            }

            if (file.isStream()) {
                // file.contents is a Stream - https://nodejs.org/api/stream.html
                this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
            } else if (file.isBuffer()) {

                let contents = file.contents.toString(),
                    challenge = JSON.parse(contents);

                /**
                 * Merges the data files with the challenge definition
                 */
                Promise.all(challenge.scenes.map(scene => {
                    if (scene.data_path) {
                        return new Promise((resolve, reject) => {
                            let filePath = path.join(path.dirname(file.path), scene.data_path);
                            fs.readFile(filePath, (err, contents) => {
                                if (err) {
                                    return reject(err);
                                }
                                scene.data = scene.data || {};
                                Object.assign(scene.data, JSON.parse(contents));
                                return resolve();
                            });
                        });
                    }
                    return Promise.resolve();
                })).catch(() => {}).then(() => {
                    let filePath = path.dirname(file.path) + '.pot';
                    file.contents = Buffer.from(poify.processChallenge(challenge));
                    file.path = filePath;

                    callback(null, file);
                });
            }
        });
    }
};

module.exports = (gulp, $) => {
    function toPot(file, name) {
        return gulp.src(file)
            .pipe(poify.messages())
            .pipe($.rename(name + '.pot'))
            .pipe(gulp.dest('app/po'));
    }
    gulp.task('po-base', () => {
        return toPot('app/scripts/kano/make-apps/msg/en.js', 'base');
    });
    gulp.task('po-blockly', () => {
        return toPot('app/scripts/kano/make-apps/blockly/msg/en.js', 'blockly');
    });
    gulp.task('po-challenges', () => {
        return gulp.src('app/assets/stories/locales/en/**/index.json', { base: 'app/assets/stories/locales/en/' })
            .pipe(poify.challenge())
            .pipe(gulp.dest('app/po'));
    });

    gulp.task('pot', ['po-base', 'po-blockly', 'po-challenges']);
};
