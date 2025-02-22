const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        launchOptions.args.push("--disable-web-security");
        return launchOptions;
      });
    },
  },
});
