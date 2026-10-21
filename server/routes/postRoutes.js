const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
  getCategories
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

// Public endpoints
router.get('/', getPosts);
router.get('/categories', getCategories);

// Protected endpoint for authenticated user's own posts (MUST be before /:id)
router.get('/mine', protect, getMyPosts);

// Single post operations
router.get('/:id', getPostById);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
