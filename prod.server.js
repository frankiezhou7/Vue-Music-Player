var express = require('express')
var axios = require('axios')
var config = require('./config/index')

var app = express()

var apiRoutes = express.Router()

apiRoutes.get('/getDiscList', function(req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/lyric', function(req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/  ///^\w+\(  ({[^()]+})？？？  \)$/
      var matches = ret.match(reg)
      if (matches) { // MusicJsonCallback({\"retcode\":0,\"code\":0,\"subcode\":0,\"lyric\":\"WQ==\",\"trans\":\"\"})
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', apiRoutes)
app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('listening at http://localhost:' + port + '\n')
})
