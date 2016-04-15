var config = require("./webpack.config.common");

Object.assign(config, {
  devtool: "eval",
  entry: [
    "webpack-dev-server/client?http://localhost:3013",
    "./app.js"
  ]
});

module.exports = config;
