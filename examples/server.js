const express = require('express')
const rewrite = require('express-urlrewrite')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const WebpackConfig = require('./webpack.config')
const args = process.argv.slice(2)

const app = express()

if (args.indexOf('--no-build') < 0) {
  app.use(webpackDevMiddleware(webpack(WebpackConfig), {
    publicPath: '/__build__/',
    stats: {
      colors: true,
      chunks: false
    }
  }))
}

const fs = require('fs')
const path = require('path')

fs.readdirSync(__dirname).forEach(file => {
  if (file !== '__build__' && fs.statSync(path.join(__dirname, file)).isDirectory()) {
    app.use(rewrite('/' + file + '/*', '/' + file + '/index.html'))
  }
})

app.use(express.static(__dirname))

const port = process.env.PORT || 8080
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
