module.exports = function(grunt){
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    jshint: {
      options: { jshintrc: true },
      all: ['gruntfile.js', '<%= pkg.main %>']
    },
    release: {
      options: {
        file: 'bower.json',
        npm: false
      }
    },
    uglify: {
      options: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      src: {
        files: {
          'angular-marked.min.js': '<%= pkg.main %>'
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('publish', ['jshint','uglify','release']);

};