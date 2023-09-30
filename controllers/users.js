const User = require("../models/User")
const logger = require("../utils/logger")
const jwt = require("jsonwebtoken")
const usersRouter = require("express").Router()

usersRouter.get("/", async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).json({ users })
  } catch (e) {
    logger.error(e)
    res.status(400).send(e.message)
  }
})

usersRouter.get("/friends", async (req, res) => {
  const clerk_userId = req.auth.userId

  try {
    const result = await User.aggregate([
      {
        $match: { clerk_userId: clerk_userId },
      },
      {
        $project: { friends: 1, _id: 0 },
      },
    ])

    const friends = await User.populate(result[0], "friends")

    return res.status(200).json({
      friends: friends.friends,
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

usersRouter.get("/non-friends", async (req, res) => {
  const clerk_userId = req.auth.userId
  try {
    const user = await User.findOne({ clerk_userId })
    if (!user)
      return res.status(400).json({
        message: "Error, user requesting does not exist on database.",
      })
    const nonFriendsOfUser = await User.find({
      _id: {
        $nin: [
          ...user.friends,
          ...user.requested_friends,
          ...user.friend_requests,
          user._id,
        ],
      },
    })

    return res.status(200).json({
      nonFriends: nonFriendsOfUser,
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

usersRouter.post("/request/:id", async (req, res) => {
  const addedUserId = req.params.id
  const adderId = req.auth.userId

  try {
    const adderUser = await User.findOne({ clerk_userId: adderId })
    const addedUser = await User.findOne({ clerk_userId: addedUserId })

    if (adderUser.friend_requests.includes(addedUser.id))
      return res.status(400).json({
        message: `Failed to add ${addedUser.username}. friend was already requested.`,
      })

    adderUser.requested_friends.push(addedUser.id)
    adderUser.save()

    addedUser.friend_requests.push(adderUser.id)
    await addedUser.save()

    //inform the requested user

    res.status(204).json({
      message: `Successfully requested ${addedUser.username}`,
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

usersRouter.get("/requested", async (req, res) => {
  const userId = req.auth.userId
  try {
    const dbUser = await User.findOne({ clerk_userId: userId }).populate(
      "requested_friends"
    )
    res.status(200).json({
      requested_friends: dbUser.requested_friends,
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

usersRouter.get("/requests", async (req, res) => {
  const userId = req.auth.userId
  try {
    const dbUser = await User.findOne({ clerk_userId: userId }).populate(
      "friend_requests"
    )
    res.status(200).json({
      friend_requests: dbUser.friend_requests,
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

usersRouter.post("/accept/:id", async (req, res) => {
  const acceptedUserId = req.params.id
  const accepterId = req.auth.userId
  try {
    const accepter = await User.findOne({ clerk_userId: accepterId }) //me
    const accepted = await User.findOne({ clerk_userId: acceptedUserId }) //someone who added me

    if (!accepter.friend_requests.includes(accepted._id))
      return res.status(400).json({
        message: `Failed to accept ${accepted.username}. You must first be requested.`,
      })

    if (accepter.friends.includes(accepted._id))
      return res.status(400).json({
        message: `Failed to accept ${accepted.username}. Friend was already added.`,
      })

    accepter.friend_requests = accepter.friend_requests.filter(
      id => id.toString() !== accepted.id
    )
    accepter.friends.push(accepted.id)
    await accepter.save()

    accepted.friends.push(accepter.id)
    accepted.requested_friends = accepted.requested_friends.filter(
      id => id.toString() !== accepter.id
    )
    await accepted.save()

    //inform both users

    res.status(204).json({
      message: `Successfully added ${accepted.username}.`,
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

usersRouter.post("/decline/:id", async (req, res) => {
  try {
    const declinerId = req.auth.userId
    const declinedUserId = req.params.id

    const decliner = await User.findOne({ clerk_userId: declinerId })
    const declined = await User.findOne({ clerk_userId: declinedUserId })

    decliner.requested_friends = decliner.requested_friends.filter(
      id => id.toString() !== declined.id
    )
    await decliner.save()

    decliner.requested_friends = declined.friend_requests.filter(
      id => id.toString() !== decliner.id
    )
    await declined.save()

    //inform the declined user

    res.status(204).json({
      message: `Successfully declined ${removed.username} request.`,
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

usersRouter.post("/remove/:id", async (req, res) => {
  try {
    const removedUserId = req.params.id
    const removerId = req.auth.userId

    const remover = await User.findOne({ clerk_userId: removerId })
    const removed = await User.findOne({ clerk_userId: removedUserId })

    remover.friends = remover.friends.filter(id => id.toString() !== removed.id)
    await remover.save()

    removed.friends = removed.friends.filter(id => id.toString() !== remover.id)
    await removed.save()

    //inform the removed user

    res.status(204).json({
      message: `Successfully removed ${removed.username}.`,
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

module.exports = usersRouter
