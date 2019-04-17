const { join } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { _title } = require("./package.json")

const rootDir = __dirname;
const dist = join(rootDir, "dist")
const src = join(rootDir, "src", "client")
// webpack4 defaults:
//   target: "web"
//   entry: "./src/index.js"
//   output path: dist/

const config = {
  node: {
    fs: "empty" // XXX needed due to a bug in Webpack 4, remove
  },
  entry: join(src, "index.js"),
  output: {
    path: dist
  },
  plugins: [
    new CleanWebpackPlugin([dist], {
      // makes webpack config file location easier to move later on
      root: rootDir
    }),
    new HtmlWebpackPlugin({
      template: join(src, "index.html"),
      title: _title,
      minify: {
        collapseWhitespace: true
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: src,
        use: {
          // could also look into using babel-preset-react
          loader: "babel-loader",
          options: {
            presets:[[
              "env",{
                loose:false,
                modules: false,
                targets: {
                  browsers: ["last 2 chrome versions"]
                }
              }
            ]],
            plugins: [
              "babel-plugin-transform-react-jsx",
            ] 
          }
        }
      }
    ]
  }
}

module.exports = { dist, src, rootDir, config }
