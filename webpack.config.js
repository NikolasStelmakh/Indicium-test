const path = require('path');

module.exports = {
    mode: 'development',
    target: 'node',
    devtool: 'inline-source-map',
    entry: {
        main: './cli.ts',
    },
    output: {
        path: path.resolve(__dirname, './'),
        filename: 'cli.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
        ],
    },
};
