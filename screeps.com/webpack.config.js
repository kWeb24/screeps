/*jshint esversion: 6 */

const path = require('path');
const webpack = require('webpack');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin({
  granularLoaderData: false,
  outputFormat: 'human'
});

// screeps-webpack-plugin screeps-profiler

module.exports = smp.wrap({
    entry: ['./src/default/main.js'],
    output: {
      path: path.resolve(__dirname, 'default'),
      filename: 'main.js',
      library: "App",
      libraryTarget: "commonjs2",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: [['env', {
                      "targets": {
                        "node": "8.9.3"
                      }
                    }]]
                }
            }
        ]
    },
    plugins: [
      new WebpackBuildNotifierPlugin({
        title: "Screeps",
        logo: path.resolve("./img/favicon.png"),
        suppressSuccess: true,
        suppressCompileStart: true
      })
    ],
    stats: {
        colors: true
    },
    mode: 'production',
});
