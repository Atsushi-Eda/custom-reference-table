const path = require('path');
const KintonePlugin = require('@kintone/webpack-plugin-kintone-plugin');

module.exports = [
  {
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
              presets: ['@babel/preset-react', '@babel/preset-env'],
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
    externals: {
      luxon: 'luxon',
    },
    plugins: [
      new KintonePlugin({
        manifestJSONPath: './plugin/manifest.json',
        privateKeyPath: './private.ppk',
        pluginZipPath: './plugin.zip'
      })
    ],
    resolve: {
      extensions: ['.js', '.jsx']
    },
    devServer: {
      disableHostCheck: true
    }
  }
]
