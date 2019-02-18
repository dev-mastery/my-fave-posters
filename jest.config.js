require('@babel/polyfill')
module.exports = {
  preset: 'jest-puppeteer',
  testRegex: './*\\.spec\\.js$',
  setupTestFrameworkScriptFile: 'expect-puppeteer'
}
