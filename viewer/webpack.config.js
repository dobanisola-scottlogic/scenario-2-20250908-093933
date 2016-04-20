var path = require('path');

const PATHS = {
    build: path.join(__dirname, 'build'),
    phaser: path.join(__dirname, '/node_modules/phaser/build/custom/phaser-split.js'),
    pixi: path.join(__dirname, '/node_modules/phaser/build/custom/pixi.js'),
    p2: path.join(__dirname, '/node_modules/phaser/build/custom/p2.js')
};

module.exports = {
    entry: './scripts/entry.js',
    output: {
        path: PATHS.build,
        publicPath: PATHS.build,
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                exclude: [
                    /node_modules/,
                    /pixi\.js/,
                    /phaser-split\.js$/,
                    /p2\.js/
                ],
                loaders: ['eslint']
            }
        ],
        loaders: [
            { test: /pixi\.js/, loader: 'expose?PIXI' },
            { test: /phaser-split\.js$/, loader: 'expose?Phaser' },
            { test: /p2\.js/, loader: 'expose?p2' },
            { test: /\.css$/, loader: 'style!css' },
            {
                test: /\.js$/,
                exclude: [
                    /pixi\.js/,
                    /phaser-split\.js$/,
                    /p2\.js/
                ],
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    resolve: {
        alias: {
            'phaser': PATHS.phaser,
            'pixi': PATHS.pixi,
            'p2': PATHS.p2
        },
        extensions: ['', '.js', '.json']
    }
};
