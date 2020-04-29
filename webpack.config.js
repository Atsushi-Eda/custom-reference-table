const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = (env = {}) => {
  return {
    entry: {
      "config.min": './src/config/index.jsx',
      "desktop.min": './src/desktop/index.jsx',
    },
    output: {
      path: path.resolve(__dirname, 'plugin'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /(\.js|\.jsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['react-app','@babel/preset-env'],
              plugins: ["transform-class-properties"]
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader" }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    watch: env.watch,
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          include: /\.min\.js$/,
        })
      ]
    },
    devtool: 'inline-source-map',
    devServer: {
      disableHostCheck: true
    }
  }
}
