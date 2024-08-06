const express = require("express")
const app = express()
const path = require("path")
const {Server} = require("socket.io")
const io = new Server()

// Serve the static files
app.use(express.static(path.join(__dirname, "..", "public")))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

io.of("/").on("connection", (socket) => {
  console.log(socket.connected)
  // Users event
  socket.on("users:create", (packet) => {
    socket.emit("users:create", packet)
  })
  //   Disconnect
  socket.on("disconnect", (reason) => {
    console.log(`disconnect ${socket.id} due to ${reason}`)
  })
})

module.exports = {app, io}
