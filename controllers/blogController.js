const Blog = require("../models/Blog");

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400);
      throw new Error("Please provide both title and content.");
    }

    const blog = await Blog.create({
      title,
      content,
      author: req.user._id,
    });

    // Populate author info before responding
    await blog.populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "Blog post created successfully.",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blog posts (with pagination)
// @route   GET /api/blogs
// @access  Private
const getAllBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Blog.countDocuments();
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single blog post by ID
// @route   GET /api/blogs/:id
// @access  Private
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "name email"
    );

    if (!blog) {
      res.status(404);
      throw new Error("Blog post not found.");
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private (owner only)
const updateBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error("Blog post not found.");
    }

    // Ensure only the author can update the blog
    if (blog.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Access denied. You can only update your own blog posts.");
    }

    // Apply updates
    if (title) blog.title = title;
    if (content) blog.content = content;

    const updatedBlog = await blog.save();
    await updatedBlog.populate("author", "name email");

    res.status(200).json({
      success: true,
      message: "Blog post updated successfully.",
      data: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private (owner only)
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error("Blog post not found.");
    }

    // Ensure only the author can delete the blog
    if (blog.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Access denied. You can only delete your own blog posts.");
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blog post deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
