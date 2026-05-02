const express = require("express");
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect } = require("../middleware/authMiddleware");

// All blog routes are protected — apply middleware to the whole router
router.use(protect);

// GET  /api/blogs       - Get all blogs
// POST /api/blogs       - Create a blog
router.route("/").get(getAllBlogs).post(createBlog);

// GET    /api/blogs/:id  - Get single blog
// PUT    /api/blogs/:id  - Update blog
// DELETE /api/blogs/:id  - Delete blog
router.route("/:id").get(getBlogById).put(updateBlog).delete(deleteBlog);

module.exports = router;
