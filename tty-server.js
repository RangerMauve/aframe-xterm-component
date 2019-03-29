const fs = require('fs');
const https = require('http');
const WebSocket = require('ws');
const os = require('os');
const path = require('path')


const server = new https.createServer()

const wss = new WebSocket.Server({
  server
})

wss.on('connection', (connection) => {
  fs.open('/dev/pts/0', 'r+', (err, fd) => {
    const read = fs.createReadStream('/dev/pts/0', {
      fd
    })

    read.on('data', (data) => {
      connection.send(data)
    })

    const write = fs.createWriteStream('/dev/pts/0', {
      fd
    })

    connection.on('message', (message) => {
      write.write(message)
    })
  });
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
