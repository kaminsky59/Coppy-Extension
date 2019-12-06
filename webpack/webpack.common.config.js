const webpack = require("webpack");
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CrxPlugin = require("webpack-crx");
const HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
var ConcatPlugin = require('webpack-concat-plugin');

const _ = require('lodash');

//Build Variables
const BUILD_EXTENSION = {'firefox': 'xpi', 'chrome': 'zip'};
const DEST = path.join(__dirname,  '../dist/screenshotsExt/');

module.exports = buildenv => {
    return {
        entry: {
            'app': path.join(__dirname, '../src/app/index.tsx'),
            'background/background': path.join(__dirname, '../src/app/Background.tsx')
        },
        output: {
            path: path.join(DEST,  buildenv.browser),
            filename: '[name].js'
        },
        optimization: {
            splitChunks: {
                name: 'vendor',
                chunks: "initial"
            }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                // {
                //     test: /\.ts$/,
                //     enforce: 'pre',
                //     use: [
                //         {
                //             loader: 'tslint-loader'
                //         }
                //     ]
                // },
                {
                    test: /\.css$/i,
                    use: ['style-loader', {
                        loader: 'css-loader',
                        options: 
                            {
                                url: (url, resourcePath) => {
                                  // resourcePath - path to css file
                      
                                  // Don't handle `img.png` urls
                                  if (url.includes('png') || url.includes('svg')) {
                                    return false;
                                  }
                      
                                  return true;
                                },
                        }
                    }
                    ],
                },
                {
                    test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                    use: [{
                      loader: 'file-loader',
                      options: {
                        name: '[name].[ext]',
                        // outputPath: 'fonts/',    // where the fonts will go
                        publicPath: '../'       // override the default path
                      }
                    }]
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin(
                Object.assign(
                  {},
                  {
                    inject: true,
                    template: 'public/index.html',
                    excludeAssets: [/background.*.js/]
                  }
                )
            ),
            new HtmlWebpackExcludeAssetsPlugin(),
            // exclude locale files in moment
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new CopyPlugin([
                {from: './public/images/*', to: './images', flatten: true},
                {from: './public/manifest.json', to: './manifest.json', toType: 'file'},
            ]),
            new ConcatPlugin({
                name: 'contentscripts',
                fileName: '[name].js',
                filesToConcat: ['./src/js/**/*']
            })
        ]
    };
};