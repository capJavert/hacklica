/**
 * Created by javert on 9.3.2018.
 */
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/*global jasmine */
const { SpecReporter } = require('jasmine-spec-reporter');
const suites = require('./suites/conf');

exports.config = {
  allScriptsTimeout: 60000,
  suites: suites,
  suite: "default",
  capabilities: {
    'browserName': 'chrome'
  },
  chromeOnly: true,
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
