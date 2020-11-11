const HtmlWebpackPlugin = require('html-webpack-plugin');
const { name } = require('./package');


// //获取本机ip地址
// function getIPAdress() {
//   var interfaces = require('os').networkInterfaces();　　
//   for (var devName in interfaces) {　　　　
//       var iface = interfaces[devName];　　　　　　
//       for (var i = 0; i < iface.length; i++) {
//           var alias = iface[i];
//           if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
//               return alias.address;
//           }
//       }　　
//   }
// }

// var ip = getIPAdress();
// console.log("\n--------IP地址：" + ip+ "------\n");


module.exports = {
  entry: './index.js',
  devtool: 'source-map',
  devServer: {
    host:'127.0.0.1',
    port: '7099',
    clientLogLevel: 'warning',
    disableHostCheck: true,
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    overlay: { warnings: false, errors: true },
  },
  output: {
    publicPath: '/',
  },
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-react-jsx'],
          },
        },
      },
      {
        test: /\.(le|c)ss$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
  ],
};
