require("dotenv").config()
const { createServer } = require("http")
const { Server } = require("socket.io")
const { instrument } = require("@socket.io/admin-ui")
const app = require("./app")
const socketAuth = require("./middleware/socketAuth")
const logger = require('./utils/logger')
const PORT = process.env.PORT || 3004

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
    logger.message(`${socket.id} joined channelId: `, channel)
    socket.rooms.add(channel)
    socket.join(channel)
  })

  socket.on("send-message", ({ channel, message }) => {
    socket.to(channel).emit("message-sent", message)
  })

  socket.on("disconnect", () => {
    logger.message(`socket io connection disconnected.`)
  })
})

instrument(io, {
  auth: false,
})

httpServer.listen(PORT, (req, res) => {
  logger.message("Listening on port ", PORT)
})
