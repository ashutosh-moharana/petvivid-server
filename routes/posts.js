const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { petUpload } = require("../config/multer");

const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

router.get("/", getPosts);
router.post("/", auth, petUpload.single("picture"), createPost);
router.put("/:id", auth, petUpload.single("picture"), updatePost);
router.delete("/:id", auth, deletePost);

module.exports = router;
