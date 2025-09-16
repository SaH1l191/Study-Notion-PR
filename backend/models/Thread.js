const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  content: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const discussThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  isAnonymous: { type: Boolean, default: false },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: false },
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DiscussThread", discussThreadSchema);