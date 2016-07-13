const istanbul = require('browserify-istanbul');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'browserify'],
    files: [
      // paths loaded by Karma
      { pattern: 'node_modules/rxjs/bundles/Rx.umd.js', included: true, served: true, watched: false },

      // paths loaded via module imports
      { pattern: 'dist/vstack-graph/**/*.js', watched: true, served: true, included: true },

      // paths to support debugging with source maps in dev tools
      { pattern: 'vstack-graph/**/*.ts', included: false, watched: false, served: true },
      { pattern: 'dist/vstack-graph/**/*.js.map', included: false, watched: false, served: true }
    ],

    preprocessors: {
      'dist/**/*.js': ['browserify']
    },

    reporters: ['dots', 'progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Firefox'],
    singleRun: true,
    concurrency: 1,
    browserNoActivityTimeout: 30000,

    browserify: {
      debug: true,
      transform: [istanbul({
        ignore: ['**/node_modules/**', 'dist/**/*.spec.js'],
      })],
    },

    coverageReporter: {
      reporters: [
        { type: 'json', subdir: '.', file: 'coverage-final.json' },
        { type: 'lcov', subdir: '.', file: 'lcov.info' },
      ]
    },
  });
};