module.exports = function(grunt){
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: { jshintrc: true },
      all: ['gruntfile.js', '*.js']
    },
    release: {
      options: {
        file: 'bower.json',
        npm: false
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['jshint']);

};