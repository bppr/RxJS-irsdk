const path = require('path');
const html = require('html-webpack-plugin');

const mode = process.env['NODE_ENV'] === 'production' ? 'production' : 'development';

const root = (...args) => path.resolve(__dirname, ...args);

module.exports = {
  mode,
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
    new html({ title: 'Stuart', template: root('ui', 'ejs', 'index.ejs') })
  ]
}