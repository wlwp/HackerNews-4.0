const express = require('express')
const path = require('path')

const app = express()
const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({ extended: false }))

const router = require('./router.js')
app.use(router)

// 配置模板引擎
app.engine('html', require('express-art-template'))
// 忽略文件
app.set('views', path.join(__dirname, './views'))
// 忽略后缀
app.set('view engine', 'html')

// 处理静态资源
app.use('/assets', express.static(path.join(__dirname, './assets')))
app.listen(8001, () => {
  console.log('http://localhost:8001')
})
