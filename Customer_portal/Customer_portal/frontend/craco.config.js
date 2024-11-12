// craco.config.js
const path = require('path');

module.exports = {
  // Configure Babel
  babel: {
    plugins: ['@babel/plugin-proposal-private-property-in-object'],
  },
  // Configure Webpack
  webpack: {
    alias: {},
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        https: require.resolve('https-browserify'),
        http: require.resolve('stream-http'),
        url: require.resolve('url'),
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
      };
      return webpackConfig;
    },
  },
  // Configure Jest
  jest: {
    configure: {
      transformIgnorePatterns: ['/node_modules/(?!(axios)/)'],
    },
  },
};
