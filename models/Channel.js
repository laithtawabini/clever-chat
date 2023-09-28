const mongoose = require("mongoose")

const channelSchema = new mongoose.Schema({
  users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  creation_date: { type: Date, required: true, default: Date.now },
})

module.exports = mongoose.model("Channel", channelSchema, "channels")
