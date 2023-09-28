const User = require("../models/User")
const clerkRouter = require("express").Router()
const { Webhook } = require("svix")
const logger = require("../utils/logger")

const handleUserCreation = async (data, res) => {
  const newUserData = {
    clerk_userId: data.id,
    username: data.username || "dummy_username",
    creation_date: new Date(data.created_at),
    is_online: false,
    email_addresses: data.email_addresses || [],
    first_name: data.first_name || "",
    last_name: data.last_name || "",
    image_url: data.image_url || "",
    friends: [],
    friend_requests: [],
    requested_friends: [],
    chats: []
  }

  logger.message("New user created: ", newUserData)
  try {
    const newUser = new User({ ...newUserData })
    await newUser.save()
    return res.status(200).json({
      success: true,
      message: `Event was handled.`,
    })
  } catch (e) {
    logger.error("Error in handleUserCreation: ", e.message)
    res.status(200).json({ error: e.message })
  }
}

const handleUserDeletion = async (data, res) => {
  try {
    await User.findOneAndDelete({ clerk_userId: data.id })
    return res.status(200).json({
      success: true,
      message: `Event was handled.`,
    })
  } catch (e) {
    logger.error("Error in handleUserDeletion: ", e.message)
    res.status(200).json({ error: e.message })
  }
}

const handleUserUpdate = async (data, res) => {
  await User.findOneAndDelete({ clerk_userId: data.id })
  await handleUserCreation(data, res)
}

const handleSessionStart = async (data, res) => {
  try {
    await User.findOneAndUpdate({ clerk_userId: data.id }, { is_online: true })
    return res.status(200).json({
      success: true,
      message: `Event was handled.`,
    })
  } catch (e) {
    logger.error("Error in handleSessionStart: ", e.message)
    res.status(200).json({ error: e.message })
  }
}

const handleSessionEnd = async (data, res) => {
  try {
    await User.findOneAndUpdate({ clerk_userId: data.id }, { is_online: false })
    return res.status(200).json({
      success: true,
      message: `Event was handled.`,
    })
  } catch (e) {
    logger.error("Error in handleSessionEnd: ", e.message)
    res.status(200).json({ error: e.message })
  }
}

const handleSessionRemove = async (data, res) => {
  try {
    await User.findOneAndUpdate({ clerk_userId: data.id }, { is_online: false })
    return res.status(200).json({
      success: true,
      message: `Event was handled.`,
    })
  } catch (e) {
    logger.error("Error in handleSessionEnd: ", e.message)
    res.status(200).json({ error: e.message })
  }
}

clerkRouter.post("/", async (req, res) => {
  try {
    //verify the request is from Clerk
    const payload = req.body
    const headers = req.headers

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY)
    const evt = wh.verify(JSON.stringify(payload), headers)
    const { id } = evt.data

    // Handle the webhook
    const eventType = evt.type
    logger.message("An event occured: ")
    logger.message(`User ${id} was ${eventType}`)

    switch (eventType) {
      case "user.created":
        await handleUserCreation(evt.data, res)
        break

      case "user.deleted":
        await handleUserDeletion(evt.data, res)
        break

      case "user.updated":
        await handleUserUpdate(evt.data, res)
        break

      case "session.created":
        await handleSessionStart(evt.data, res)
        break

      case "session.ended":
        await handleSessionEnd(evt.data, res)
        break

      case "session.removed":
        await handleSessionRemove(evt.data, res)
        break

      default:
        return res.status(400).json({
          success: false,
          message: `Client clerk event has no handler, event: ${eventType}.`,
        })
    }
  } catch (err) {
    logger.error(err.message)
    res.status(400).json({
      success: false,
      message: err.message,
    })
  }
})

module.exports = clerkRouter
