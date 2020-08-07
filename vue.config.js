module.exports = {
    configureWebpack: {
        devServer: {
            watchOptions: {
                ignored: /node_modules/,
                aggregateTimeout: 200,
                poll: 1000
            },
        }
    }
}