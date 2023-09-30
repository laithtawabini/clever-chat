const usersRouter = require("./controllers/users")
const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const cors = require("cors")
require("express-async-errors")
const helmet = require("helmet")
const clerkRouter = require("./controllers/clerk_auth")
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node")
const logger = require("./utils/logger")
const channelsRouter = require("./controllers/channels")
const chatsRouter = require("./controllers/chats")
const errorHandler = require("./middleware/errorHandler")


const mongoUrl = process.env.CHAT_APP_MONGODB_CONNECTION

mongoose
  .connect(mongoUrl)
  .then(res => {
    console.log("Connected to mongodb.")
  })
  .catch(e => {
    console.log(e)
  })

mongoose.set("strictQuery", false)

const app = express()

app.use(helmet({
    contentSecurityPolicy: false,
}))
app.use(morgan("tiny"))
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

//uncomment request authorization middleware later.
app.use(
  "/api/users",
  ClerkExpressRequireAuth({
    onError: error => {
      logger.error(error)
    },
  }),
  usersRouter
)

app.use(
  "/api/channels",
  ClerkExpressRequireAuth({
    onError: error => {
      logger.error(error)
    },
  }),
  channelsRouter
)

//added comment
app.use(
  "/api/chats",
  ClerkExpressRequireAuth({
    onError: error => {
      logger.error(error)
    },
  }),
  chatsRouter
)

app.use("/clerk-webhook", clerkRouter)
app.use(errorHandler)
module.exports = app
