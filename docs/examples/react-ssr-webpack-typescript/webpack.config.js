const { resolve } = require('path');

const common = {
    output: {
        path: resolve(__dirname, 'dist'),
    },
    mode: 'development',
    devtool: 'source-map',
    resolve: {
        extensions: [ '.js', '.ts', '.tsx', '.css']
    },
    module: {
        rules: [
            { test: /\.tsx?$/i, use: 'ts-loader' },
            { test: /\.css$/i, use: 'postcss-loader' },
        ],
    }
}

module.exports = [
    {
        entry: './src/index-server.tsx',
        target: 'node',
        output: {
            filename: 'index-server.js',
            libraryTarget: 'commonjs'
        }
    },
    {
        entry: './src/index-client.tsx',
        target: 'web',
        output: {
            filename: 'index-client.js'
        }
    },
].map(i => ({...common, ...i, output: {...common.output, ...i.output}}));
