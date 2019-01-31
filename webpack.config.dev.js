import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const webpack = require("webpack");

const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')
const img = path.resolve(__dirname, 'img/')

let conf = {};
try {
    conf = JSON.stringify(require("./config/default"));
} catch (e) {
    console.log(e);
    conf = {};
}

export default {
    mode: 'development',
    entry: src + '/index.js',
    output: {
        path: dist,
        filename: 'bundle.js'
    },
    resolve: {
        alias: {
            Images: img
        }
    },
    devServer: {
        contentBase: dist,
        port: 3001,
        inline: true,
        open: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /.*\.(zip|gif|png|jpe?g)$/i,
                use: [
                    {loader: 'file-loader'}
                ]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: src + '/index.html',
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({CONFIG: conf})
    ]
}
