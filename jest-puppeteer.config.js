module.exports = {
  launch: {
    headless: false
  },
  server: {
    command: `serve -s build`,
    port: 5000,
    launchTimeout: 10000,
    debug: true
  }
}
