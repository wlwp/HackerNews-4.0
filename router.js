const http = require('http')

const handle = require('./handle.js')


module.exports = function(req, res) {
  // index
  if (req.url === '/index' || req.url === '/') {
    handle.index(req, res)
  }
  // details
  else if (req.url.startsWith('/details')) {
    handle.details(req, res)
  }
  // submit
  else if (req.url === '/submit') {
    handle.submit(req, res)
  }
  // add get
  else if (req.url.startsWith('/add') && req.method === 'GET') {
    handle.addget(req, res)
  }
  //add post
  else if (req.url.startsWith('/add') && req.method === 'POST') {
    handle.addpost(req, res)
  }

  // 静态资源
  else if (req.url.startsWith('/assets')) {
    handle.assets(req, res)
  }
  // 其他
  else {
    handle.error(res)
  }
}
