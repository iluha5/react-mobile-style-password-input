const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './example/index.tsx',
    output: {
        filename: './js/main.js',
        path: path.resolve(__dirname, 'example/public/'),
        publicPath: '',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.scss', '.js', '.jsx'],
    },
    devtool: 'inline-source-map',
    optimization: {
        minimizer: [
            // new TerserPlugin(),
            // new OptimizeCSSAssetsPlugin({}),
        ],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ['ts-loader'],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hacktory',
            meta: {
                viewport: 'width=device-width, initial-scale=1',
            },
            hash: true,
            template: './example/index.html',
        }),
    ],
};
