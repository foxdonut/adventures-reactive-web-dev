var path = require("path");

module.exports = {
  output: {
    path: path.join(__dirname, "../public"),
    filename: "generated-app.js"
  },
  module: {
    loaders: [
      {
        loader: "babel-loader",
        test: /\.jsx?$/,
        exclude: /node_modules/
      }
    ]
  }
};
