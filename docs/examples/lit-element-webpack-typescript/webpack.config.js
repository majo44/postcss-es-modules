module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
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
