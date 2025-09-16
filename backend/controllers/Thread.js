const DiscussThread = require("../models/DiscussThread");

exports.createThread = async (req, res) => {
  try {
    const { title, content, isAnonymous, course } = req.body;
    const user = req.user.id;
    const thread = await DiscussThread.create({
      title,
      content,
      isAnonymous,
      user: isAnonymous ? null : user,
      course: course || null,
    });
    res.status(201).json({ success: true, thread });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.replyThread = async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;
    const user = req.user.id;
    const thread = await DiscussThread.findById(req.params.threadId);
    if (!thread) return res.status(404).json({ success: false, message: "Thread not found" });
    thread.replies.push({
      content,
      isAnonymous,
      user: isAnonymous ? null : user,
    });
    await thread.save();
    res.status(200).json({ success: true, thread });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getThreads = async (req, res) => {
  try {
    const { courseId } = req.params;
    const filter = courseId ? { course: courseId } : {};
    const threads = await DiscussThread.find(filter)
      .populate("user", "firstName lastName image")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, threads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getThread = async (req, res) => {
  try {
    const thread = await DiscussThread.findById(req.params.threadId)
      .populate("user", "firstName lastName image")
      .populate("replies.user", "firstName lastName image");
    if (!thread) return res.status(404).json({ success: false, message: "Thread not found" });
    res.status(200).json({ success: true, thread });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};