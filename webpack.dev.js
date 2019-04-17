const { join } = require("path")
const merge = require("webpack-merge")
const { config, dist, src } = require("./webpack.common.js")

// no need to split, minify, or compress

module.exports = merge(config, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    contentBase: dist,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        // pathRewrite: {'^/api' : ''}
      }
    }
  },
  module: {
    exprContextCritical: false, // XXX can remove this, suppresses mocha warnings
    rules: [
      {
        test: /\.css$/,
        include: src,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  output: {
    filename: "[name].js"
  },
})
