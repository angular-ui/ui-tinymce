module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/tinymce/tinymce.min.js',
      'src/tinymce.js',
      'test/*.spec.js',
      {pattern: 'bower_components/tinymce/themes/**', included: false},
      {pattern: 'bower_components/tinymce/skins/lightgray/**', included: false}
    ],
    singleRun: false,
    autoWatch: true,
    browsers: [ 'Chrome' ],
  });
};
