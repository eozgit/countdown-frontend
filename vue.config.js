module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/dist/" : "/",
  configureWebpack: {
    devServer: {
      watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 200,
        poll: 1000
      }
    }
  }
};
