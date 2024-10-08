const path = require('path');

module.exports = {
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "https": require.resolve("https-browserify"),
        "http": require.resolve("stream-http"),
        "url": require.resolve("url"),
        "buffer": require.resolve("buffer"),
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"), 
      };
      return webpackConfig;
    },
  },
};



