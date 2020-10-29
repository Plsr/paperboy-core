const express = require("express");
const router = express.Router();
const Bookmark = require("../models/bookmark");

router.get("/", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find();
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/:id", (req, res) => {});
router.post("/", async (req, res) => {
  const bookmark = new Bookmark({
    title: req.body.title,
    url: req.body.url,
  });

  try {
    const newBookmark = await bookmark.save();
    res.status(201).json(newBookmark);
  } catch (error) {
    res.status(400).json({ message: error.messate });
  }
});

module.exports = router;
