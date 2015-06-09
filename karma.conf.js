module.exports = function(config) {
  config.set({
    files: [
      'node_modules/angular/angular.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'autofocus.js',
      'autofocus.spec.js'
    ],
    frameworks: [
      'jasmine'
    ],
    browsers: [
      'PhantomJS'
    ],
    reporters: [
      'spec'
    ]
  });
};
