/*
 * @Author: Lisc
 * @Date: 2022-03-30 18:42:47
 * @Description: 直接在 Node.js中调用 Webpack Api执行构建
 */
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const multipart = require('connect-multiparty')
const atob = require('atob')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const path = require('path')

require('./server2')
const app = express()
const compiler = webpack(WebpackConfig) //返回一个 Compiler 实例，启动构建时传入
    // 通过 webpack-dev-middleware打包
app.use(
    // 通过 webpack-dev-middleware 将一个DevServer 集成到现有服务器中，
    //让现有的服务器能返回 Webpack 构建出的内容，而不是在开发时启动多个服务器。

    //从 webpack-dev-middleware 中导出的 webpackMiddleware 是一个函数，
    //该函数需要接收一个 Compiler 实例，同时支持一个对象类型的配置项

    //webpackMiddleware 函数的返回结果是一个 Expressjs 的中间件，该中间件有以下功能
    //接收来自 Webpack Compiler 实例输出的文件，但不会把文件输出到硬盘，而是保存在内存中
    //往 Expressjs app 上注册路由，拦截 HTTP 收到的请求，根据请求路径响应对应的文件内容
    webpackDevMiddleware(compiler, {
        // Webpack 输出资源绑定在服务器上的根目录
        publicPath: '/__build__/',
        // 统计信息输出样式
        stats: {
            colors: true,
            chunks: false
        }
    })
)

// 为了支持模块热替换，源文件进行修改后自动重新打包
app.use(webpackHotMiddleware(compiler))

app.use(
    express.static(__dirname, {
        setHeaders(res) {
            res.cookie('XSRF-TOKEN-D', '1234abc')
        }
    })
)
app.use(bodyParser.json())
    // app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

app.use(
    multipart({
        uploadDir: path.resolve(__dirname, 'upload-file')
    })
)

const router = express.Router()

registerSimpleRouter()

registerBaseRouter()

registerErrorRouter()

registerExtendRouter()

registerInterceptorRouter()

registerConfigRouter()

registerCancelRouter()

registerMoreRouter()

app.use(router)

const port = process.env.PORT || 8888
module.exports = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})

function registerSimpleRouter() {
    router.get('/simple/get', function(req, res) {
        res.json({
            msg: `hello world`
        })
    })
}

function registerBaseRouter() {
    router.get('/base/get', function(req, res) {
        res.json(req.query)
    })

    router.post('/base/post', function(req, res) {
        res.json(req.body)
    })

    router.post('/base/buffer', function(req, res) {
        let msg = []
        req.on('data', chunk => {
            if (chunk) {
                msg.push(chunk)
            }
        })
        req.on('end', () => {
            let buf = Buffer.concat(msg)
            res.json(buf.toJSON())
        })
    })
}

function registerErrorRouter() {
    router.get('/error/get', function(req, res) {
        // if (Math.random() > 0.5) {
        //     res.json({
        //         msg: `hello world`
        //     })
        // } else {
        res.status(500)
        res.end()
            // }
    })

    router.get('/error/timeout', function(req, res) {
        setTimeout(() => {
            res.json({
                msg: `hello world`
            })
        }, 3000)
    })
}

function registerExtendRouter() {
    router.get('/extend/get', function(req, res) {
        res.json({
            msg: 'hello world'
        })
    })

    router.options('/extend/options', function(req, res) {
        res.end()
    })

    router.delete('/extend/delete', function(req, res) {
        res.end()
    })

    router.head('/extend/head', function(req, res) {
        res.end()
    })

    router.post('/extend/post', function(req, res) {
        res.json(req.body)
    })

    router.put('/extend/put', function(req, res) {
        res.json(req.body)
    })

    router.patch('/extend/patch', function(req, res) {
        res.json(req.body)
    })

    router.get('/extend/user', function(req, res) {
        res.json({
            code: 0,
            message: 'ok',
            result: {
                name: 'jack',
                age: 18
            }
        })
    })
}

function registerInterceptorRouter() {
    router.get('/interceptor/get', function(req, res) {
        res.end('hello')
    })
}

function registerConfigRouter() {
    router.post('/config/post', function(req, res) {
        res.json(req.body)
    })
}

function registerCancelRouter() {
    router.get('/cancel/get', function(req, res) {
        setTimeout(() => {
            res.json('hello')
        }, 1000)
    })

    router.post('/cancel/post', function(req, res) {
        setTimeout(() => {
            res.json(req.body)
        }, 1000)
    })
}

function registerMoreRouter() {
    router.get('/more/get', function(req, res) {
        res.json(req.cookies)
    })

    router.post('/more/upload', function(req, res) {
        console.log(req.body, req.files)
        res.end('upload success!')
    })

    router.post('/more/post', function(req, res) {
        const auth = req.headers.authorization
        const [type, credentials] = auth.split(' ')
        console.log(atob(credentials))
        const [username, password] = atob(credentials).split(':')
        if (type === 'Basic' && username === 'Yee' && password === '123456') {
            res.json(req.body)
        } else {
            res.status(401)
            res.end('UnAuthorization')
        }
    })

    router.get('/more/304', function(req, res) {
        res.status(304)
        res.end()
    })

    router.get('/more/A', function(req, res) {
        res.end('A')
    })

    router.get('/more/B', function(req, res) {
        res.end('B')
    })
}