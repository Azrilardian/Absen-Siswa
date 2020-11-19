"use strict";

var htmlWebpackPlugin = require("html-webpack-plugin");

var path = require("path");

module.exports = {
  entry: "./App/index.js",
  output: {
    path: path.resolve(__dirname, "Dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader"
      }]
    }]
  },
  plugins: [new htmlWebpackPlugin({
    template: "./App/index.html",
    filename: "index.html"
  }), new htmlWebpackPlugin({
    template: "./App/absen.html",
    filename: "absen.html"
  })]
};