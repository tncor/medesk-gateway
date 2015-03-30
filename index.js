'use strict'
var config    = require('config')
var log4js    = require('log4js')
var httpProxy = require('http-proxy')

//---------------------------
var log = log4js.getLogger('config')

var proxy = httpProxy.createProxyServer({
  target: config.target,
  secure: config.secure,
  changeOrigin: true,
  ssl: config.ssl
})

proxy.listen(config.port)

//---------------------------
log.debug('TARGET: %s', config.target)
log.debug('PORT  : %d', config.port)
log.info('Successfully started and listening %d port', config.port)
