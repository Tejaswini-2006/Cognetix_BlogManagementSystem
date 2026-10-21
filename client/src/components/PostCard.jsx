import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Edit3, Trash2, Tag } from 'lucide-react';

const PostCard = ({ post, isOwner = false, onDelete }) => {
  // Calculate read time
  const wordCount = (post.content || post.excerpt || '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 180));

  // Format date
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const authorName = post.author?.name || 'Anonymous Author';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <article className="post-card" id={`post-card-${post._id}`}>
      <div>
        {/* Category & Read Time */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span className="card-category-badge">
            <Tag size={12} />
            {post.category || 'General'}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={12} />
            {readTime} min read
          </span>
        </div>

        {/* Title */}
        <h3 className="card-title">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="card-excerpt">{post.excerpt}</p>
      </div>

      <div>
        {/* Footer info: Author, Date, Actions */}
        <div className="card-footer">
          <div className="card-author-info">
            <div className="author-avatar">{authorInitial}</div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>
                {authorName}
              </div>
              <div className="card-date" style={{ fontSize: '0.75rem' }}>
                <Calendar size={12} />
                {formattedDate}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isOwner ? (
              <>
                <Link
                  to={`/edit/${post._id}`}
                  className="btn btn-secondary btn-sm"
                  title="Edit post"
                  id={`edit-btn-${post._id}`}
                >
                  <Edit3 size={14} />
                </Link>
                <button
                  onClick={() => onDelete(post)}
                  className="btn btn-danger btn-sm"
                  title="Delete post"
                  id={`delete-btn-${post._id}`}
                >
                  <Trash2 size={14} />
                </button>
              </>
            ) : (
              <Link
                to={`/posts/${post._id}`}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem 0.65rem' }}
                title="Read complete post"
              >
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
