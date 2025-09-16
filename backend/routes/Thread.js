const express = require("express");
const { createThread, replyThread, getThreads, getThread } = require("../controllers/Thread");
const { auth, isStudent } = require("../middlewares/auth");
const router = express.Router();

router.post("/create", auth, isStudent, createThread);
router.post("/reply/:threadId", auth, isStudent, replyThread);
router.get("/threads/:courseId?", auth, getThreads);
router.get("/thread/:threadId", auth, getThread);

module.exports = router;