module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/tinymce/tinymce.min.js',
      'src/tinymce.js',
      {pattern: 'bower_components/tinymce/themes/modern/theme.min.js', served: true},
      'test/*.spec.js'
    ],
    singleRun: false,
    autoWatch: true,
    browsers: [ 'Chrome' ],
  });
};