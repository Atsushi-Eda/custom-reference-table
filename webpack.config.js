const path = require('path');
const KintonePlugin = require('@kintone/webpack-plugin-kintone-plugin');

module.exports = [
  {
    entry: {
      "config.min": './src/config/index.tsx',
      "desktop.min": './src/desktop/index.tsx',
    },
    output: {
      path: path.resolve(__dirname, 'plugin'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
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
      // noParse: [
      //   require.resolve('react'),
      //   require.resolve('react-dom'),
      // ]
    },
    // externals: {
      // luxon: 'luxon', // "https://js.cybozu.com/luxon/2.0.2/luxon.min.js",
      // Kuc: 'Kuc',
      // "kintone-ui-component": 'Kuc' // Error: Minified React error #130;
      // 'react': {
      //   root: 'React',
      //   commonjs: 'react',
      //   commonjs2: 'react',
      // },
      // 'react-dom': {
      //   root: 'ReactDOM',
      //   commonjs: 'react-dom',
      //   commonjs2: 'react-dom',
      // },
    // },
    plugins: [
      new KintonePlugin({
        manifestJSONPath: './plugin/manifest.json',
        privateKeyPath: './private.ppk',
        pluginZipPath: './plugin.zip'
      })
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    },
    devServer: {
      disableHostCheck: true
    }
  }
]
