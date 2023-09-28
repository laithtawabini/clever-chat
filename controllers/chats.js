const Channel = require("../models/Channel")
const Chat = require("../models/Chat")
const User = require("../models/User")
const chatsRouter = require("express").Router()

const getFullChatOfChannel = async channel_id => {
  const channel = await Channel.findById(channel_id).populate("users")
  const channelUsers = await Chat.populate(channel.users, "chats")
  const fullChatMessages = channelUsers.reduce((prev, user) => {
    const userChat = user.chats.find(
      chat => chat.channel.toString() === channel.id
    )

    return [
      ...prev,
      { owner_username: user.username, messages: userChat.messages },
    ]
  }, [])

  return fullChatMessages
}

chatsRouter.get("/:channel_id", async (req, res) => {
  if (req.params.channel_id)
    return res.status(200).json({
      chat: await getFullChatOfChannel(req.params.channel_id),
    })
  else
    return res.status(400).json({
      message: "channel id was not provided",
    })
})

chatsRouter.post("/message/:channel_id", async (req, res) => {
  //sends a message to a specified channel
  //make sure user is a member of that channel
  //append the message to the messages
  //inform all users of a new message
  const { message_content } = req.body
  const channelId = req.params.channel_id
  const senderClerkId = req.auth.userId
  const sender = await User.findOne({ clerk_userId: senderClerkId }).populate(
    "chats"
  )

  const senderIsPartOfChannel = sender.chats
    .map(chat => chat.channel.toString())
    .includes(channelId)

  if (senderIsPartOfChannel) {
    const chat = sender.chats.find(
      chat => chat.channel.toString() === channelId
    )

    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chat._id },
      {
        $push: { messages: { content: message_content } },
      },
      { new: true }
    )

    const messagesAfterUpdate = updatedChat.messages
    res.status(200).json({
      message: messagesAfterUpdate[messagesAfterUpdate.length - 1],
    })
  }
})

module.exports = chatsRouter
