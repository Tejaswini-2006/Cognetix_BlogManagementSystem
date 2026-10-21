import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Alert from '../components/Alert';
import { PenSquare, Eye, Send, ArrowLeft, Tag, FileText, AlignLeft } from 'lucide-react';

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

const CreatePost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    customCategory: '',
    excerpt: '',
    content: ''
  });

  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

    setLoading(true);
    setError('');

    const finalCategory =
      formData.category === 'Other (Custom)'
        ? formData.customCategory.trim()
        : formData.category;

    try {
      const data = await api.posts.create({
        title: formData.title.trim(),
        category: finalCategory,
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim()
      });

      setSuccess('Article published successfully! Taking you to your story...');
      setTimeout(() => {
        navigate(`/posts/${data.post._id}`);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to publish blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '2rem auto' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>Create New Article</h1>
          <p style={{ color: 'var(--text-muted)' }}>Publish your insights to the Chronicle tech community</p>
        </div>

        {/* Edit / Preview Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '0.3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`btn btn-sm ${activeTab === 'edit' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
            id="tab-edit-post"
          >
            <PenSquare size={14} /> Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`btn btn-sm ${activeTab === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
            id="tab-preview-post"
          >
            <Eye size={14} /> Live Preview
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} />}

      {activeTab === 'edit' ? (
        <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: '100%', margin: 0 }}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="post-title">
              Article Title *
            </label>
            <input
              type="text"
              id="post-title"
              name="title"
              className="form-input"
              placeholder="e.g. Architectural Patterns in Scalable Microservices"
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
              <label className="form-label" htmlFor="post-category">
                Category *
              </label>
              <select
                id="post-category"
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
                <label className="form-label" htmlFor="post-custom-category">
                  Custom Category Name *
                </label>
                <input
                  type="text"
                  id="post-custom-category"
                  name="customCategory"
                  className="form-input"
                  placeholder="e.g. DevOps & Cloud"
                  value={formData.customCategory}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div className="form-group">
            <label className="form-label" htmlFor="post-excerpt">
              Short Summary / Excerpt *
            </label>
            <textarea
              id="post-excerpt"
              name="excerpt"
              className="form-textarea"
              style={{ minHeight: '90px' }}
              placeholder="A concise summary (1-2 sentences) shown on the feed cards to attract readers..."
              value={formData.excerpt}
              onChange={handleChange}
              maxLength={400}
              required
            />
            <div className="input-counter">{formData.excerpt.length}/400 characters</div>
          </div>

          {/* Full Content */}
          <div className="form-group">
            <label className="form-label" htmlFor="post-content">
              Article Body *
            </label>
            <textarea
              id="post-content"
              name="content"
              className="form-textarea"
              style={{ minHeight: '320px', fontFamily: 'inherit' }}
              placeholder="Share your full thoughts, code walk-throughs, technical insights, or tutorial steps here. Separate paragraphs with double newlines..."
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
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              id="submit-post-btn"
            >
              <Send size={16} />
              {loading ? 'Publishing Article...' : 'Publish Article'}
            </button>
          </div>
        </form>
      ) : (
        /* Live Preview Pane */
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
              {formData.excerpt || 'Article summary excerpt will appear here...'}
            </p>
          </div>
          <div className="post-body-content" style={{ marginTop: '2rem' }}>
            {formData.content ? (
              formData.content.split('\n\n').map((p, idx) => <p key={idx}>{p}</p>)
            ) : (
              <p style={{ color: 'var(--text-dim)' }}>Start typing your content to see it previewed live here.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
