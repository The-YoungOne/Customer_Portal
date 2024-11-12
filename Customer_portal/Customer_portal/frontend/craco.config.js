// craco.config.js
const path = require('path');

module.exports = {
  // 1. Configure Babel
  babel: {
    plugins: [
      // Ensure all related plugins have the same 'loose' setting
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    ],
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      '@babel/preset-react'
    ],
  },
  
  // 2. Configure Webpack (unchanged)
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
  
  // 3. Updated Jest Configuration
  jest: {
    configure: {
      moduleNameMapper: {
        '^axios$': require.resolve('axios'),
      },
      transformIgnorePatterns: [
        '/node_modules/(?!(axios)/)'
      ],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            '@babel/preset-react'
          ],
        }],
      },
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
      ],
      moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
      testEnvironment: 'jsdom',
    },
  },
};