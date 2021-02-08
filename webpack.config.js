const path = require('path');
const TSLintPlugin = require('tslint-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/app.ts'),
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            // JavaScript
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: ['ts-loader'],
            },
        ],
    },
    resolve: {
        extensions: ["d.ts", ".tsx", ".ts", ".js"]
    },
    mode: 'development',
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './dist'),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'webpack Boilerplate',
            template: path.resolve(__dirname, './src/index.html'), // шаблон
            filename: 'index.html', // название выходного файла
        }),
        new webpack.HotModuleReplacementPlugin(),
        new TSLintPlugin({
            files: ['./src/**/*.ts']
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/resources', to: './resources' }
            ]
        })
    ]
}
