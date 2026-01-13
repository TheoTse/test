/*
Copyright (C) 2017-2020 Haute Ecole Robert Schuman.

This file is part of hers-stagekine.

  hers-stagekine is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or (at your
  option) any later version.

  hers-stagekine is distributed in the hope that it will be useful, but
  WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
  or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public
  License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with hers-stagekine.  If not, see <http://www.gnu.org/licenses/>.
*/

const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin')

const resolve = (...p) => path.resolve(__dirname, ...p)
const dev = process.env.ENV === 'dev'


module.exports = {
  entry: {
    vendor: ['jquery', 'popper.js', 'bootstrap'],
    app: resolve('assets', 'js', 'app.js'),
  },
  watch: dev,
  output: {
    path: resolve('static'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: ExtractTextPlugin.extract(
          {
            fallback: ['style-loader'],
            use:
            [
              {
                loader: 'css-loader',
                options: { minimize: ! dev ? {"discardComments": {"removeAll": true}} : false },
              },

              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [
                    require('precss'),
                    require('autoprefixer')
                  ]
                }
              },
              {
                loader: 'sass-loader',
              }
            ],
          }
        )
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(ttf|eot|woff2?)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "fonts/",
          publicPath: "/static/",
        }
      },
      {
        test: /\.(svg|png|jpe?g)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "img/",
          publicPath: "/static/",
        }
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(resolve('static'), {verbose: true, exclude: ['.gitkeep']}),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Popper: ['popper.js', 'default'],
      moment: 'moment'
    }),
    new ExtractTextPlugin("[name].css"),
  ],
}

if (! dev) {
  module.exports.plugins.push(new UglifyJSPlugin())
}
