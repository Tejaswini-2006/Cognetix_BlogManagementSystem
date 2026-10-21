const mongoose = require('mongoose');
const Post = require('../models/Post');

// @desc    Get all published posts with search, filter, and pagination
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const startIndex = (page - 1) * limit;

    const query = {};

    // Filter by Category
    if (req.query.category && req.query.category !== 'All') {
      query.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
    }

    // Search query in title, excerpt, or content
    if (req.query.search && req.query.search.trim() !== '') {
      const searchRegex = { $regex: req.query.search.trim(), $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex }
      ];
    }

    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limit) || 1;

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
      posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog post ID format.'
      });
    }

    const post = await Post.findById(id).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'The requested blog post was not found.'
      });
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private (Owner)
const createPost = async (req, res, next) => {
  try {
    const { title, excerpt, content, category } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, excerpt, and content.'
      });
    }

    if (title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Title must be at least 3 characters long.'
      });
    }

    if (excerpt.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Excerpt must be at least 10 characters long to provide a good summary.'
      });
    }

    if (content.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Blog content must be at least 20 characters long.'
      });
    }

    const post = await Post.create({
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      category: category && category.trim() ? category.trim() : 'Technology',
      author: req.user._id
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Blog post published successfully.',
      post: populatedPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog post
// @route   PUT /api/posts/:id
// @access  Private (Owner only)
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog post ID format.'
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'The blog post you want to edit does not exist.'
      });
    }

    // Ownership check (strictly enforced on server)
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Authorization forbidden: You are only allowed to modify your own posts.'
      });
    }

    const { title, excerpt, content, category } = req.body;

    if (title !== undefined) {
      if (title.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Title must be at least 3 characters long.'
        });
      }
      post.title = title.trim();
    }

    if (excerpt !== undefined) {
      if (excerpt.trim().length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Excerpt must be at least 10 characters long.'
        });
      }
      post.excerpt = excerpt.trim();
    }

    if (content !== undefined) {
      if (content.trim().length < 20) {
        return res.status(400).json({
          success: false,
          message: 'Blog content must be at least 20 characters long.'
        });
      }
      post.content = content.trim();
    }

    if (category !== undefined && category.trim()) {
      post.category = category.trim();
    }

    await post.save();

    const updatedPost = await Post.findById(post._id).populate('author', 'name email');

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully.',
      post: updatedPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Private (Owner only)
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog post ID format.'
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'The blog post you want to delete does not exist.'
      });
    }

    // Server-side ownership verification
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Authorization forbidden: You can only delete your own blog posts.'
      });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts by current logged-in user
// @route   GET /api/posts/mine
// @access  Private
const getMyPosts = async (req, res, next) => {
  try {
    const query = { author: req.user._id };

    if (req.query.category && req.query.category !== 'All') {
      query.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
    }

    if (req.query.search && req.query.search.trim() !== '') {
      const searchRegex = { $regex: req.query.search.trim(), $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex }
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of unique categories
// @route   GET /api/posts/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const defaultCategories = [
      'Technology',
      'Web Development',
      'Artificial Intelligence',
      'Software Engineering',
      'Design & UI/UX',
      'Career & Tips',
      'Tutorials'
    ];
    const dbCategories = await Post.distinct('category');
    const allCategories = Array.from(new Set([...defaultCategories, ...dbCategories])).filter(Boolean);

    res.status(200).json({
      success: true,
      categories: allCategories
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
  getCategories
};
