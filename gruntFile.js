module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  // Default task.
  grunt.registerTask('default', ['jshint', 'karma', 'uglify']);

  var karmaConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, singleRun: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  // Project configuration.
  grunt.initConfig({
    karma: {
      unit: karmaConfig('test/karma.conf.js')
    },
    jshint:{
      files:['src/**/*.js', 'test/**/*.js', 'demo/**/*.js'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    },
    changelog: {
      options: {
        dest: 'CHANGELOG.md'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/tinymce.min.js': ['src/tinymce.js']
        }
      }
    }
  });

};
