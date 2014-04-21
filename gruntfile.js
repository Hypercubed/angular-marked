module.exports = function(grunt){
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    jshint: {
      options: { jshintrc: true },
      all: ['gruntfile.js', '<%= pkg.name %>.js']
    },
    release: {
      options: {
        file: 'bower.json',
        npm: false
      }
    },
    uglify: {
      options: {
        banner: '/*\n * <%= pkg.title || pkg.name %>\n' +
          ' * (c) <%= grunt.template.today("yyyy") %> <%= pkg.authors.join(" ") %>\n' +
          ' * Licensed <%= pkg.license %>\n */\n'
      },
      src: {
        files: {
          '<%= pkg.name %>.min.js': '<%= pkg.name %>.js'
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['jshint', 'uglify']);
  grunt.registerTask('publish', ['build','release']);

};