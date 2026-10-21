import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DeleteModal from '../components/DeleteModal';
import Alert from '../components/Alert';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Tag,
  Edit3,
  Trash2,
  Share2,
  Check,
  User,
  ShieldCheck
} from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Deletion modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.posts.getById(id);
        setPost(data.post);
      } catch (err) {
        console.error('Failed to load post details:', err);
        setError(err.message || 'The requested article could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Ownership check
  const isOwner =
    user && post && (post.author?._id === user._id || post.author === user._id);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await api.posts.delete(id);
      setIsDeleteModalOpen(false);
      navigate('/my-posts', { replace: true });
    } catch (err) {
      alert(err.message || 'Failed to delete blog post.');
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ maxWidth: '600px', margin: '4rem auto' }}>
        <Alert type="error" message={error || 'Article not found.'} />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" className="btn btn-secondary">
            <ArrowLeft size={16} /> Return to Articles
          </Link>
        </div>
      </div>
    );
  }

  const wordCount = (post.content || '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 180));
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const authorName = post.author?.name || 'Anonymous Author';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <article className="container post-detail-container" id="post-detail-view">
      {/* Top Navigation */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" className="btn btn-secondary btn-sm" id="back-to-feed-btn">
          <ArrowLeft size={16} /> Back to Articles
        </Link>
      </div>

      {/* Header section */}
      <header className="post-header-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <span className="card-category-badge" style={{ fontSize: '0.85rem', padding: '0.4rem 0.95rem' }}>
            <Tag size={14} />
            {post.category || 'General'}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={14} />
            {readTime} min read
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
          {post.title}
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '2rem' }}>
          "{post.excerpt}"
        </p>

        {/* Author row & Owner controls */}
        <div className="post-meta-row">
          <div className="post-author-block">
            <div className="post-author-avatar-lg">{authorInitial}</div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                {authorName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                <Calendar size={14} />
                <span>Published on {formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="post-owner-actions">
            <button
              onClick={handleShare}
              className="btn btn-secondary btn-sm"
              title="Copy article link to clipboard"
              id="share-article-btn"
            >
              {copied ? <Check size={16} color="#10b981" /> : <Share2 size={16} />}
              {copied ? 'Link Copied!' : 'Share'}
            </button>

            {isOwner && (
              <>
                <Link
                  to={`/edit/${post._id}`}
                  className="btn btn-secondary btn-sm"
                  id="owner-edit-btn"
                >
                  <Edit3 size={16} /> Edit Post
                </Link>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="btn btn-danger btn-sm"
                  id="owner-delete-btn"
                >
                  <Trash2 size={16} /> Delete Post
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <section className="post-body-content" id="post-content-body">
        {post.content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </section>

      {/* Post Footer Information */}
      <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          <ShieldCheck size={18} color="var(--accent-primary)" />
          <span>Authentic article verified in Cognetix Blog System</span>
        </div>
        <Link to="/" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Browse More Posts
        </Link>
      </footer>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        postTitle={post.title}
        isDeleting={isDeleting}
      />
    </article>
  );
};

export default PostDetail;
