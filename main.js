const http = require('http')

const server = http.createServer()

// 引入路由
const router = require('./router.js')
// 引入extend
const extend = require('./extend.js')

server.on('request', (req, res) => {
  extend(res)

  router(req,res)
  
})

server.listen(8001, () => {
  console.log('http://localhost:8001')
})

