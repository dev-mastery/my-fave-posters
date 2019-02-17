require('@babel/polyfill')
module.exports = {
  preset: 'jest-puppeteer',
  testRegex: './*\\.(spec|test)\\.js$',
  setupTestFrameworkScriptFile: 'expect-puppeteer'
}
