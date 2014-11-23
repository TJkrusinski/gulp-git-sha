'use strict';

var through = require('through2');
var sha = require('git-sha');
var path = require('path');

/**
 *  Expose `append`
 */

module.exports = append;

/**
 *  Append the git sha to a stream
 *
 *  @param {Object} options
 */

function append(options) {

  options = options || {};

  function prefixStream(shaBuffer) {
    var stream = through();
    stream.write(shaBuffer);
    return stream;
  };

  function _append(file, enc, cb) {
    var self = this;

    sha(function(err, commit){
      if (err) return cb();

      var shaBuffer = new Buffer('/* '+commit.replace('\n', '')+' */\n');

      if (file.isBuffer()) {
        file.contents = Buffer.concat([shaBuffer, file.contents]);
      };

      if (file.isStream()) {
        file.contents = file.contents.pipe(prefixStream(shaBuffer));
      };

      self.push(file);

      cb();
    });
  };

  return through.obj(_append);
};
