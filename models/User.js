const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new mongoose.Schema({
  clerk_userId: { type: String, unique: true },
  username: { type: String, required: true, unique: true },
  creation_date: { type: Date, required: true },
  is_online: Boolean,
  email_addresses: [],
  first_name: String,
  last_name: String,
  image_url: String,
  friends: { type: [mongoose.Types.ObjectId], ref: "User" },
  friend_requests: { type: [mongoose.Types.ObjectId], ref: "User" },
  requested_friends: { type: [mongoose.Types.ObjectId], ref: "User" },
  chats: [{type: mongoose.Types.ObjectId, ref: 'Chat'}],
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema, "users")
