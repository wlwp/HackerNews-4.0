const fs = require('fs')
const path = require('path')
const mime = require('mime')
const url = require('url')
const querystring = require('querystring')
const dbpath = path.join(__dirname, './data/data.json')

// 处理index
module.exports.index = function(req, res) {
  const filepath = path.join(__dirname, './views/index.html')
  ml_readNewsData(data => {
    res.ml_render(filepath, { list: data })
  })
}

// 处理details
module.exports.details = function(req, res) {
  const filepath = path.join(__dirname, './views/details.html')

  let id = url.parse(req.url, true).query.id
  ml_readNewsData(data => {
    let obj = data.find(item => item.id == id)
    obj.id = +new Date()
    res.ml_render(filepath, obj)
  })
}

// 处理submit
module.exports.submit = function(req, res) {
  const filepath = path.join(__dirname, './views/submit.html')
  fs.readFile(filepath, (err, data) => {
    res.end(data)
  })
}
// 处理addget
module.exports.addget = function(req, res) {
  let obj = url.parse(req.url, true).query
  obj.id = +new Date()
  ml_readNewsData(data => {
    data.unshift(obj)
    ml_writeNewsData(data, () => {
      res.redirect()
    })
  })
}

// 处理addpost
module.exports.addpost = function(req, res) {
  let str = ''
  req.on('data', chunk => {
    str += chunk
  })
  req.on('end', () => {
    let obj = querystring.parse(str)
    obj.id = +new Date()
    ml_readNewsData(data => {
      data.unshift(obj)
      ml_writeNewsData(data, () => {
        res.redirect()
      })
    })
  })
}

// 处理assets(静态资源)
module.exports.assets = function(req, res) {
  // 处理警告
  res.setHeader('content-type', mime.getType(req.url))
  const filepath = path.join(__dirname, req.url)
  fs.readFile(filepath, (err, data) => {
    res.end(data)
  })
}

// 处理其他
module.exports.error = function(res) {
  res.setHeader('content-type', 'text/plain;charset=utf-8')
  res.end('您访问的页面不存在')
}
// 1.封装读取新闻数据
function ml_readNewsData(callback) {
  fs.readFile(dbpath, 'utf-8', (err, data) => {
    if (err) {
      return console.log('读取失败')
    }
    data = JSON.parse(data || '[]')
    callback(data)
  })
}

// 2.封装写入新闻数据
function ml_writeNewsData(data, callback) {
  fs.writeFile(dbpath, JSON.stringify(data, null, 2), err => {
    if (err) {
      return console.log('写入失败')
    }
    callback()
  })
}
