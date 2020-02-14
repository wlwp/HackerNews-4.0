const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId

const mc = mongodb.MongoClient

const url = 'mongodb://127.0.0.1:27017'

// 读取全部新闻数据
module.exports.readAllNewsData = function(callback) {
  mc.connect(url, (err, client) => {
    if (err) {
      return console.log('连接失败')
    }
    client
      .db('HN')
      .collection('news')
      .find()
      .toArray((err, docs) => {
        if (err) {
          return console.log('查询失败')
        }
        callback(docs)
      })
    client.close()
  })
}

// 读取单条新闻数据
module.exports.readOneNewsData = function(id, callback) {
  mc.connect(url, (err, client) => {
    if (err) {
      return console.log('连接失败')
    }
    let objid = new ObjectId(id)
    client
      .db('HN')
      .collection('news')
      .findOne({ _id: objid }, (err, doc) => {
        if (err) {
          return console.log('查询失败')
        }
        callback(doc)
      })
    client.close()
  })
}

// 插入单条新闻数据
module.exports.insertOneNewsData = function(obj, callback) {
  mc.connect(url, (err, client) => {
    if (err) {
      return console.log('连接失败')
    }
    client
      .db('HN')
      .collection('news')
      .insertOne(obj, (err, res) => {
        if (err) {
          return console.log('插入失败')
        }
        callback()
      })
    client.close()
  })
}
