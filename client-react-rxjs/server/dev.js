var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("../webpack.config.dev");

new WebpackDevServer(webpack(config), {
  // hot: true,
  historyApiFallback: true,
  proxy: {
    "*": "http://localhost:3000"
  },
  stats: "errors-only"
}).listen(3013, "localhost", function(err, result) {
  if (err) {
    console.log(err);
  }
  console.log("Listening at localhost:3013");
});
