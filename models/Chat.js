

const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
  channel: { type: mongoose.Types.ObjectId, ref: "Channel" },
  messages: [
    {
      content: { type: String, required: true },
      post_date: { type: Date, default: Date.now },
    },
  ],
})

module.exports = mongoose.model("Chat", chatSchema, "chats")
