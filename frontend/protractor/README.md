# E2E Testing
## Suites
- Tests are split into suites
- Suites are defined inside ./protractor/suites/conf.js file 
- Suite name (suiteName) pattern is: testType.userRole.testName
- You should NOT modify ./protractor/protractor.conf.js file for custom options,
  instead pass them as command line arguments like:
npm run e2e -- --option1 value1 --option2 value2
- List of options that protractor supports can be found here: https://github.com/angular/protractor/blob/master/lib/config.ts

## Running tests
- Tests are run though command line scripts
- Choosing a test suite is done via option argument --suite
- If --suite is not provided default suite will be used (can be modified in ./protractor/suites/conf.js)
- Example 1: npm run e2e
- Example 2: npm run e2e -- --suite suiteName
- NOTICE! Do NOT confuse npm run e2e script with ng e2e because later script does 
  not support test suites
- NOTICE! It is preferred to keep Chrome testing instance window focused during execution of tests
- Test outcomes are logged inside console by default but can be piped to file with npm run e2e -- --suite suiteName >> test.log
