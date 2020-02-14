const express = require('express')

const db = require('./db.js')

const router = express.Router()
// 重定向
router.get('/', (req, res) => {
  res.redirect('/index')
})
// index
router.get('/index', (req, res) => {
  db.readAllNewsData(data => {
    res.render('index', { list: data.reverse() })
  })
})
// details
router.get('/details', (req, res) => {
  let id = req.query.id

  db.readOneNewsData(id, obj => {
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
  db.insertOneNewsData(obj, () => {
    res.redirect('/')
  })
})
// addpost
router.post('/add', (req, res) => {
  let obj = req.body
  db.insertOneNewsData(obj, () => {
    res.redirect('/')
  })
})

module.exports = router


