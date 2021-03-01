// eslint-disable-next-line @typescript-eslint/no-var-requires
const ShebangPlugin = require('webpack-shebang-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  plugins: [new ShebangPlugin()],
  entry: './src/cli.ts',
  devtool: 'inline-source-map',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'gh-checks-cli.js',
    path: path.resolve(__dirname, 'build'),
  },
};
