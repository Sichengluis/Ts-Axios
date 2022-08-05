/*
 * @Author: Lisc
 * @Date: 2022-03-30 18:42:47
 * @Description: 打包examples中测试代码的webpack配置文件
 */
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',

  /**
   * examples 目录下包含多个子目录，每个子目录是一个功能的demo
   * 每个子目录都会创建一个 app.ts 作为 webpack 构建的入口文件
   * entry的配置值是一个对象,得到的效果为：
   * evtry:{base:['webpack-hot-middleware/client', 'D:\study\hdu-cs-learning\项目\ts-axios\examples\base\app.ts']}
   */
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    // entries 收集了多个目录的入口文件，并且每个入口还引入了一个用于热更新的文件
    // entries 是一个对象，key 为目录名
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'app.ts')

    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      // 配置多入口文件
      // webpack-hot-middleware/client是为了支持模块热替换，注入代理客户端
      // entry是入口文件，比如examples/simple/app.ts(省略了examples之前的绝对路径)
      entries[dir] = ['webpack-hot-middleware/client', entry]
    }
    return entries
  }, {}),

  /**
   * 根据不同的目录名称，打包生成目标 js，名称和目录名一致
   */
  output: {
    // path: path.join(__dirname, '__build__'),
    filename: '[name].js', //name为entry所指定对象中的key
    publicPath: '/__build__/',
  },

  module: {
    rules: [
      // 语法检查
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  plugins: [
    // 为了支持模块热替换
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devServer: {
    // 项目构建路径（打包后文件所在路径）
    contentBase: __dirname,
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true,
  },
}
