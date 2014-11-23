'use strict';

var append = require('..');
var assert = require('chai').assert;
var gutil = require('gulp-util');
var es = require('event-stream');
var path = require('path');
var fs = require('fs');

describe('append', function () {
  it('should return a stream', function(){
    var s = append(); 
    assert.isFunction(s.on);
    assert.isFunction(s.write);
  });
});

describe('append', function () {
  it('should append the git has to file contents', function(d){
    var file = new gutil.File({
      path: 'test/fixtures/one.js',
      cwd: 'test/',
      base: 'test/fixtures/',
      contents: fs.createReadStream(path.join(__dirname, '/fixtures/one.js'))
    });

    var stream = append();

    stream.once('data', function(e){
      assert.ok(e.isStream()); 

      e.contents.pipe(es.wait(function(err, data){
        assert.isString(data.toString());
        d();
      }));
    });

    stream.write(file);
  });
});
