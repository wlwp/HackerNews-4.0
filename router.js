const express = require('express')
const fs = require('fs')
const path = require('path')
const dbpath = path.join(__dirname, './data/data.json')

const router = express.Router()
// 重定向
router.get('/', (req, res) => {
  res.redirect('/index')
})
// index
router.get('/index', (req, res) => {
  ml_readNewsData(data => {
    res.render('index', { list: data })
  })
})
// details
router.get('/details', (req, res) => {
  let id = req.query.id
  ml_readNewsData(data => {
    let obj = data.find(item => item.id == id)
    res.render('details', obj)
  })
})
// submit
router.get('/submit', (req, res) => {
  res.render('submit')
})
// addget
router.get('/add', (req, res) => {
  let obj = req.query
  obj.id = +new Date()
  ml_readNewsData(data => {
    data.unshift(obj)
    ml_writeNewsData(data, () => {
      res.redirect('/')
    })
  })
})
// addpost
router.post('/add', (req, res) => {
  let obj = req.body
  obj.id = +new Date()
  ml_readNewsData(data => {
    data.unshift(obj)

    ml_writeNewsData(data, () => {
      res.redirect('/')
    })
  })
})

module.exports = router

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
