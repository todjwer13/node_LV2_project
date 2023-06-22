const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    defalt: Date.now(),
},
})

// postSchema.set("timestamps",true);미국 시간

module.exports = mongoose.model("comments",commentSchema);