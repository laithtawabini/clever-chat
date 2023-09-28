require("dotenv").config()
const { createServer } = require("http")
const { Server } = require("socket.io")
const { instrument } = require("@socket.io/admin-ui")
const app = require("./app")
const socketAuth = require("./middleware/socketAuth")

const PORT = process.env.PORT || 3002

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: ["/", "http://localhost:3000", "https://admin.socket.io"],
    methods: ["POST", "GET"],
    credentials: true,
  },
})

io.use(socketAuth)
io.on("connection", socket => {
  socket.on("join-channel", ({ channel }) => {
    console.log(`${socket.id} joined channelId: `, channel)
    socket.rooms.add(channel)
    socket.join(channel)
  })

  socket.on("send-message", ({ channel, message }) => {
    socket.to(channel).emit("message-sent", message)
  })

  socket.on("disconnect", () => {
    console.log(`socket io connection disconnected.`)
  })
})

instrument(io, {
  auth: false,
})

httpServer.listen(PORT, (req, res) => {
  console.log("Listening on port ", PORT)
})
