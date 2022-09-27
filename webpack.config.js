const path = require('path');
const html = require('html-webpack-plugin');

const mode = process.env['NODE_ENV'] == 'production' ? 'production' : 'development';
const devtool = mode == 'production' ? 'source-map' : 'inline-cheap-module-source-map';

const root = (...args) => path.resolve(__dirname, ...args);

module.exports = {
  mode,
  devtool,
  entry: './ui/main.tsx',
  output: {
    path: root('build', 'ui'),
    filename: 'ui.bundle.js',
  },
  module: {
    rules: [
      { test: /\.tsx?/, loader: 'ts-loader', exclude: /node_modules/ }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new html({ title: 'Stuart' })
  ]
}