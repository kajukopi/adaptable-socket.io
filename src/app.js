require("dotenv").config()
const express = require("express")
const app = express()
const path = require("path")
const {Server} = require("socket.io")
const io = new Server()
const {Client, RemoteAuth} = require("whatsapp-web.js")
const {MongoStore} = require("wwebjs-mongo")
const mongoose = require("mongoose")
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    const store = new MongoStore({mongoose: mongoose})
    const client = new Client({
      authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: 300000,
      }),
    })
    const socketQrCode = require("./handler/usersHandler")(io)

    client.once("ready", (payload) => {
      console.log("You're online!")
    })

    client.on("qr", socketQrCode)

    client.on("message_create", (payload) => {
      console.log("New Message")
    })

    client.initialize()
  })
  .finally(() => console.log("Connected to mongodb!"))

// Serve the static files
app.use(express.static(path.join(__dirname, "..", "public")))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

io.of("/").on("connection", (socket) => {
  // When the client is ready, run this code (only once)

  if (socket.connected) socket.emit("users:connected", {connected: true})
  // Users event
  socket.on("users:create", (packet) => {
    socket.emit("users:create", {...packet, back: true})
  })
  //   Disconnect
  socket.on("disconnect", (reason) => {
    console.log(`disconnect ${socket.id} due to ${reason}`)
  })
})

module.exports = {app, io}
