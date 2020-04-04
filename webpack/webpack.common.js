const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//const { InjectManifest } = require('workbox-webpack-plugin')

module.exports = {
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js',".jsx"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, include: path.join(__dirname, '../src'), loader: 'ts-loader' }, 
            {   test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["@babel/env"] }},
         {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]}
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    filename: '[name].bundle.js'
                }
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({ gameName: 'Shadowpox:Stay Home', template: 'src/index.html' }),
        new CopyWebpackPlugin([
            { from: 'src/assets', to: 'assets' },
            //   { from: 'pwa', to: '' },
            //   { from: 'src/favicon.ico', to: '' }
        ]),
        // new InjectManifest({
        //   swSrc: path.resolve(__dirname, '../pwa/sw.js')
        // })
    ]
}