const fs = require('fs');
const https = require('http');
const WebSocket = require('ws');
const os = require('os');
const pty = require('node-pty');
const path = require('path')

const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';

const server = new https.createServer()

const wss = new WebSocket.Server({
  server
})

wss.on('connection', (connection) => {
  const ptyProcess = pty.spawn(shell, [], {
    cols: 80,
    rows: 10,
    cwd: process.env.HOME,
    env: process.env
  })

  ptyProcess.on('data', (data) => {
    connection.send(data)
  })

  connection.on('message', (message) => {
    ptyProcess.write(message)
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
