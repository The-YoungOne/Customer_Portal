const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      "https": require.resolve("https-browserify"),  // Polyfill for `https` module
    },
  },
  entry: './src/index.js',  // Make sure this is your actual entry file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,  // Transform JS and JSX files
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,  // Apply loaders for Tailwind CSS
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  mode: 'development',
};
