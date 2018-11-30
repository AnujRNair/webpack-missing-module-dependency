const path = require('path');
const webpack = require('webpack');

// name of all entry points and the webpackChunkName async chunks - we will use this to bundle common code into a shared chunk
const sharedBundles = [
  'entry1',
  'entry2',
  'entry3',
  'entry1-async',
  'entry2-async',
  'entry3-async',
];

module.exports = {
  // 3 entry points which mainly import the same 5 functions - this will allow a shared bundle to be created
  entry: {
    entry1: './src/entry/entry-1.js',
    entry2: './src/entry/entry-2.js',
    entry3: './src/entry/entry-3.js',
    html: './src/index.html'
  },

  // remove minification etc
  mode: 'development',

  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve('assets'),
    publicPath: '/assets/',
    crossOriginLoading: 'anonymous',
    pathinfo: true,
  },

  context: path.resolve(__dirname),

  resolve: {
    extensions: ['.js'],
    alias: {
      '@main': path.resolve(__dirname, 'src')
    }
  },

  optimization: {
    runtimeChunk: {
      name: 'runtime-manifest'
    },

    splitChunks: {
      cacheGroups: {
        // create a shared chunk from all entry points and all async chunks
        // remove min size to force one to be created - bug still occurs in bigger repos without minSize disabled
        shared: {
          name: 'shared',
          chunks: (chunk) => sharedBundles.includes(chunk.name),
          minChunks: 3,
          minSize: 0
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          }
        ],
      },

      {
        test: /\.html/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },

  devServer: {
    host: 'localhost',
    port: 1989,
    https: true,
    publicPath: '/assets/'
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin()
  ]
};
