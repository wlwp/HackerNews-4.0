const template = require('art-template')
module.exports = function(res) {
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
}
