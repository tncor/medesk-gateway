'use strict'
var fs        = require('fs')
var path      = require('path')
var program   = require('commander')
var validator = require('validator')
var log4js    = require('log4js')

//---------------------------
var log = log4js.getLogger('config')

//---------------------------
var DEF_TARGET    = 'https://api.medesk.md'
var DEF_PORT      = 7000
var DEF_LOG_LEVEL = 'INFO'

function loadKey(v){
  return loadFile(v, 'Invalid SSL private key file %s')
}

function loadCert(v){
  return loadFile(v, 'Invalid SSL certificate file: %s')
}

function loadCa(v){
  return loadFile(v, 'Invalid intermediate certificate bundle file: %s')
}

function loadFile(v, elog){
  if(!fs.existsSync(v)){
    log.fatal(elog, v)
    process.exit(1)
  }
  return fs.readFileSync(v)
}

function targetUrl(v){
  var opts = {protocols: ['http', 'https']}
  if(!validator.isURL(v, opts)){
    log.fatal('Invalid target url: %s', v)
    process.exit(1)
  }
  return v
}

function checkPort(v){
  if(isNaN(v)){
    log.fatal('Invalid port number: %s', v)
    process.exit(1)
  }
  return parseInt(v, 10)
}

//---------------------------
program
  .version('0.0.1')
  .option('-t, --target <url>', 'target url', targetUrl, DEF_TARGET)
  .option('-p, --port <number>', 'Port number, default is', checkPort, 7000)
  .option('--logLevel <level>', 'Verbosity level', 'INFO')
  .option('--ssl-key <file>', 'Private key file', loadKey)
  .option('--ssl-cert <file>', 'Certificate file', loadCert)
  .option('--ssl-ca <file>', 'Instantiate certificate bundle', loadCa)
  .option('--ssl-check-certificate', 'Enfoce target certificate checking', false)
  .parse(process.argv)

if(program.sslCa || program.sslCert || program.sslKey){
  if(!(program.sslKey && program.sslCert)){
    log.fatal('Both key and cert files must be defined')
    process.exit(1)
  }

  program.ssl = {
    key: program.sslKey,
    cert: program.sslCert,
    ca: program.sslCa
  }
}


module.exports = {
  target: program.target,
  port: program.port,
  logLevel: program.logLevel,
  secure: program.sslCheckCertificate,
  ssl: program.ssl
}
