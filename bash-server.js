const fs = require('fs');
const https = require('http');
const WebSocket = require('ws');
const os = require('os');
const path = require('path')
const net = require('net')
const child_process = require('child_process')

const server = new https.createServer()

const wss = new WebSocket.Server({
  server
})

wss.on('connection', (connection) => {
  const pty = child_process.spawn('/bin/bash', {
    cwd: process.env.HOME,
    env: process.env
  })

  pty.stdout.on('data', (data) => {
    connection.send(data)
  })

  connection.on('message', (message) => {
    pty.stdin.write(message)
  })
})

server.on('request', (request, response) => {
  // console.log(request)
  const requestPath = request.url
  const finalPath = path.join(__dirname, requestPath)

  fs.readFile(finalPath, 'utf8', (err, data) => {
    if(err) return
    response.end(data)
  })
})

server.listen(8080)

console.log("Server running on port 8080")
console.log("Open http://localhost:8080/index.html")
