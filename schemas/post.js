const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password: {
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
    defalt: Date.now(),
  },
})

// postSchema.set("timestamps",true); // 미국 시간

module.exports = mongoose.model("posts",postSchema);