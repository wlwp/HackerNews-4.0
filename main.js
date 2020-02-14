const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const url = require('url')
const template = require('art-template')
const querystring = require('querystring')
const dbpath = path.join(__dirname, './data/data.json')

const server = http.createServer()

server.on('request', (req, res) => {
  // 3.封装渲染页面
  res.ml_render = function(filepath, obj) {
    let html = template(filepath, obj)
    res.end(html)
  }

  // 4.重定向
  res.redirect = function() {
    res.statusCode = 301
    res.setHeader('location', '/')
    res.end()
  }
  // index
  if (req.url === '/index' || req.url === '/') {
    const filepath = path.join(__dirname, './views/index.html')
    // fs.readFile(filepath, (err, data) => {
    //   res.end(data)
    // })
    ml_readNewsData(data => {
      // let html = template(filepath, { list: data })
      // res.end(html)
      res.ml_render(filepath, { list: data })
    })
  }
  // details
  else if (req.url.startsWith('/details')) {
    const filepath = path.join(__dirname, './views/details.html')
    // fs.readFile(filepath, (err, data) => {
    //   res.end(data)
    // })

    let id = url.parse(req.url, true).query.id
    ml_readNewsData(data => {
      let obj = data.find(item => item.id == id)
      obj.id = +new Date()
      // let html = template(filepath, obj)
      // res.end(html)
      res.ml_render(filepath, obj)
    })
  }
  // submit
  else if (req.url === '/submit') {
    const filepath = path.join(__dirname, './views/submit.html')
    fs.readFile(filepath, (err, data) => {
      res.end(data)
    })
  }
  // add get
  else if (req.url.startsWith('/add') && req.method === 'GET') {
    let obj = url.parse(req.url, true).query
    obj.id = +new Date()
    ml_readNewsData(data => {
      data.unshift(obj)
      ml_writeNewsData(data, () => {
        // res.statusCode = 301
        // res.setHeader('location', '/')
        // res.end()
        res.redirect()
      })
    })
  }
  //add post
  else if (req.url.startsWith('/add') && req.method === 'POST') {
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
          // res.statusCode = 301
          // res.setHeader('location', '/')
          // res.end()
          res.redirect()
        })
      })
    })
  }

  // 静态资源
  else if (req.url.startsWith('/assets')) {
    // 处理警告
    res.setHeader('content-type', mime.getType(req.url))
    const filepath = path.join(__dirname, req.url)
    fs.readFile(filepath, (err, data) => {
      res.end(data)
    })
  }
  // 其他
  else {
    res.setHeader('content-type', 'text/plain;charset=utf-8')
    res.end('您访问的页面不存在')
  }
})

server.listen(8001, () => {
  console.log('http://localhost:8001')
})

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
