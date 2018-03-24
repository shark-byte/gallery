const path = require('path');
const webpack = require('webpack');

const SRC_DIR = path.join(__dirname, '/client/src');
const DIST_DIR = path.join(__dirname, '/client/dist');
const SERVER_DIR = path.join(__dirname, '/client/dist');

module.exports = [{
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR,
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: SRC_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}, {
  target: 'node',
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: 'server-bundle.js',
    path: SERVER_DIR,
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: SRC_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        },
      },
    ],
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\.css$/, 'node-noop'),
  ],
}];
