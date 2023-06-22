const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },updatedAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = mongoose.model("posts",postSchema);