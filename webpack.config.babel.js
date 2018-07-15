const path = require('path');

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src')
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      port: 8001
    }
};

module.exports = config;
