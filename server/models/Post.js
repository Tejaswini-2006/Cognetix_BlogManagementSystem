const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a blog title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide a short excerpt or summary'],
      trim: true,
      minlength: [10, 'Excerpt must be at least 10 characters long'],
      maxlength: [400, 'Excerpt cannot exceed 400 characters']
    },
    content: {
      type: String,
      required: [true, 'Please provide the blog content'],
      minlength: [20, 'Content must be at least 20 characters long']
    },
    category: {
      type: String,
      required: [true, 'Please choose or provide a category'],
      trim: true,
      default: 'Technology'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post must be linked to an author']
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast searching and filtering
postSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });

postSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
