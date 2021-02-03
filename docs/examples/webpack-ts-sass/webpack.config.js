module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
    },
    mode: 'development',
    devtool: false,
    resolve: {
        extensions: [ '.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                use: {
                    loader: 'ts-loader',
                    // options: {
                    //     transpileOnly: true
                    // }
                }
            },
            { test: /\.scss$/i, use: 'postcss-loader' },
        ],
    }
}
