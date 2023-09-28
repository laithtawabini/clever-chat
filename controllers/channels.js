const channelsRouter = require("express").Router()
const Channel = require("../models/Channel")
const Chat = require("../models/Chat")
const User = require("../models/User")

channelsRouter.post("/create", async (req, res) => {
  const { channelUsersClerkIds } = req.body
  const creatorClerkId = req.auth.userId

  const channelUsers = await User.find({
    clerk_userId: { $in: channelUsersClerkIds },
  })

  const channel = await Channel.findOne({
    users: { $all: channelUsers.map(u => u._id), $size: channelUsers.length },
  }).populate('users')

  if (channel) {
    const creator = await User.findOne({
      clerk_userId: creatorClerkId,
    }).populate("chats")

    const creatorHasChannel = creator.chats
      .map(chat => chat.channel.toString())
      .includes(channel.id)

    if (creatorHasChannel)
      return res.status(200).json({
        channel: {
          id: channel.id,
          users: channel.users,
        },
      })
    else
      return res.status(400).json({
        message:
          "Channel exists but the user trying to create/get it is not a member of it.",
      })
  }

  const newChannelUnpopulated = await Channel.create({
    creation_date: Date.now(),
    users: channelUsers.map(user => user._id),
  })

  const newChannel = await Channel.populate(newChannelUnpopulated, 'users')

  channelUsers.forEach(async user => {
    const newChat = await Chat.create({
      channel: newChannel._id,
      messages: [],
    })

    user.chats = [...user.chats, newChat._id]
    await user.save()
  })

  return res.status(200).json({
    channel: {
      id: newChannel.id,
      users: newChannel.users,
    },
  })
})

module.exports = channelsRouter
