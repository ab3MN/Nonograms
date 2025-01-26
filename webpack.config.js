const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: join(__dirname, 'src', 'js', 'app.js'),
  output: {
    path: join(__dirname, 'dist'),
    filename: 'bundle.js',
    assetModuleFilename: 'assets/[name][hash][ext][query]',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash][ext][query]',
        },
      },
    ],
  },
  resolve: { extensions: ['.js'] },
  plugins: [
    new HtmlWebpackPlugin({
      template: join(__dirname, 'src', 'index.html'),
    }),
  ],
};
