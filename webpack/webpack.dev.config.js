const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.config');

module.exports = buildenv => { 
    return merge(commonConfig(buildenv), {
        devtool: 'source-map',
        mode: 'development'
    });
}