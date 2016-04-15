var config = require("./webpack.config.common");

Object.assign(config, {
  entry: "./app.js"
});

module.exports = config;
