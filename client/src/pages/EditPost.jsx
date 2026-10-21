import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { PenSquare, Eye, Save, ArrowLeft, Tag, AlertTriangle } from 'lucide-react';

const PRESET_CATEGORIES = [
  'Technology',
  'Web Development',
  'Artificial Intelligence',
  'Software Engineering',
  'Design & UI/UX',
  'Career & Tips',
  'Tutorials',
  'Other (Custom)'
];

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    customCategory: '',
    excerpt: '',
    content: ''
  });

  const [activeTab, setActiveTab] = useState('edit');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.posts.getById(id);
        const post = data.post;

        // Check ownership
        const authorId = post.author?._id || post.author;
        if (user && authorId !== user._id) {
          setIsUnauthorized(true);
          setError('Unauthorized: You can only edit your own blog posts.');
          setLoading(false);
          return;
        }

        const isPreset = PRESET_CATEGORIES.includes(post.category);

        setFormData({
          title: post.title || '',
          category: isPreset ? post.category : 'Other (Custom)',
          customCategory: isPreset ? '' : post.category,
          excerpt: post.excerpt || '',
          content: post.content || ''
        });
      } catch (err) {
        console.error('Failed to load post for editing:', err);
        setError(err.message || 'The requested article could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPost();
    }
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      return 'Please enter a title for your blog post.';
    }
    if (formData.title.trim().length < 3) {
      return 'Title must be at least 3 characters long.';
    }
    if (formData.category === 'Other (Custom)' && !formData.customCategory.trim()) {
      return 'Please specify your custom category name.';
    }
    if (!formData.excerpt.trim()) {
      return 'Please write a brief summary/excerpt for the feed.';
    }
    if (formData.excerpt.trim().length < 10) {
      return 'Excerpt must be at least 10 characters long.';
    }
    if (!formData.content.trim()) {
      return 'Please write the main content for your post.';
    }
    if (formData.content.trim().length < 20) {
      return 'Content must be at least 20 characters long.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError('');

    const finalCategory =
      formData.category === 'Other (Custom)'
        ? formData.customCategory.trim()
        : formData.category;

    try {
      await api.posts.update(id, {
        title: formData.title.trim(),
        category: finalCategory,
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim()
      });

      setSuccess('Article updated successfully! Returning to story...');
      setTimeout(() => {
        navigate(`/posts/${id}`);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to update blog post.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading article data for editor...</p>
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="container" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '1.25rem', background: 'rgba(244,63,94,0.1)', borderRadius: '50%', color: '#f43f5e', marginBottom: '1.5rem' }}>
          <AlertTriangle size={36} />
        </div>
        <h2 style={{ marginBottom: '0.75rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
          You do not have permission to edit this article. Server-side security restricts modifications strictly to the author.
        </p>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Return to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '2rem auto' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ marginBottom: '0.5rem' }}>
            <Link to={`/posts/${id}`} className="btn btn-secondary btn-sm">
              <ArrowLeft size={14} /> Back to Article
            </Link>
          </div>
          <h1 style={{ fontSize: '2.25rem' }}>Edit Article</h1>
        </div>

        {/* Edit / Preview Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '0.3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`btn btn-sm ${activeTab === 'edit' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <PenSquare size={14} /> Edit Mode
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`btn btn-sm ${activeTab === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <Eye size={14} /> Preview Changes
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} />}

      {activeTab === 'edit' ? (
        <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: '100%', margin: 0 }}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="edit-post-title">
              Article Title *
            </label>
            <input
              type="text"
              id="edit-post-title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              maxLength={200}
              required
            />
            <div className="input-counter">{formData.title.length}/200 characters</div>
          </div>

          {/* Category */}
          <div style={{ display: 'grid', gridTemplateColumns: formData.category === 'Other (Custom)' ? '1fr 1fr' : '1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label" htmlFor="edit-post-category">
                Category *
              </label>
              <select
                id="edit-post-category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {formData.category === 'Other (Custom)' && (
              <div>
                <label className="form-label" htmlFor="edit-post-custom-category">
                  Custom Category Name *
                </label>
                <input
                  type="text"
                  id="edit-post-custom-category"
                  name="customCategory"
                  className="form-input"
                  value={formData.customCategory}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div className="form-group">
            <label className="form-label" htmlFor="edit-post-excerpt">
              Short Summary / Excerpt *
            </label>
            <textarea
              id="edit-post-excerpt"
              name="excerpt"
              className="form-textarea"
              style={{ minHeight: '90px' }}
              value={formData.excerpt}
              onChange={handleChange}
              maxLength={400}
              required
            />
            <div className="input-counter">{formData.excerpt.length}/400 characters</div>
          </div>

          {/* Full Content */}
          <div className="form-group">
            <label className="form-label" htmlFor="edit-post-content">
              Article Body *
            </label>
            <textarea
              id="edit-post-content"
              name="content"
              className="form-textarea"
              style={{ minHeight: '320px', fontFamily: 'inherit' }}
              value={formData.content}
              onChange={handleChange}
              required
            />
            <div className="input-counter">
              {formData.content.split(/\s+/).filter(Boolean).length} words &bull;{' '}
              {formData.content.length} characters
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={() => navigate(`/posts/${id}`)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              id="save-changes-btn"
            >
              <Save size={16} />
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        /* Live Preview */
        <div className="form-card" style={{ maxWidth: '100%', margin: 0 }}>
          <div className="post-header-card" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
            <span className="card-category-badge">
              <Tag size={12} />
              {formData.category === 'Other (Custom)' ? formData.customCategory || 'Custom' : formData.category}
            </span>
            <h1 style={{ fontSize: '2.5rem', marginTop: '0.75rem', marginBottom: '1rem' }}>
              {formData.title || 'Untitled Article'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontStyle: 'italic' }}>
              {formData.excerpt}
            </p>
          </div>
          <div className="post-body-content" style={{ marginTop: '2rem' }}>
            {formData.content ? (
              formData.content.split('\n\n').map((p, idx) => <p key={idx}>{p}</p>)
            ) : (
              <p style={{ color: 'var(--text-dim)' }}>No content entered yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPost;
