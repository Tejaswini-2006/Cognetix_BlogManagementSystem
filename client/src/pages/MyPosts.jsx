import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import DeleteModal from '../components/DeleteModal';
import Alert from '../components/Alert';
import {
  BookOpen,
  PlusCircle,
  FileText,
  Search,
  Tag,
  PenTool,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const MyPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & filter within My Posts
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const fetchMyPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.posts.getMine({
        category: selectedCategory,
        search
      });
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Failed to load user posts:', err);
      setError(err.message || 'Unable to retrieve your blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, [selectedCategory, search]);

  const handleDeleteTrigger = (post) => {
    setDeleteTarget(post);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.posts.delete(deleteTarget._id);
      setDeleteSuccess(`"${deleteTarget.title}" was deleted successfully.`);
      setPosts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
      setTimeout(() => setDeleteSuccess(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to delete post.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate author stats
  const totalWords = posts.reduce(
    (acc, p) => acc + (p.content || '').split(/\s+/).filter(Boolean).length,
    0
  );

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

  return (
    <div className="container" style={{ margin: '2rem auto' }} id="my-posts-page">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Author Portal
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem' }}>My Articles</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Welcome back, <strong>{user?.name}</strong>. Manage your publication portfolio and track insights.
          </p>
        </div>

        <div>
          <Link to="/create" className="btn btn-primary" id="btn-create-post-dashboard">
            <PlusCircle size={18} /> New Article
          </Link>
        </div>
      </div>

      {deleteSuccess && (
        <Alert type="success" message={deleteSuccess} onClose={() => setDeleteSuccess('')} />
      )}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Author Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-value">{posts.length}</div>
            <div className="stat-label">Published Articles</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <FileText size={24} />
          </div>
          <div>
            <div className="stat-value">{totalWords.toLocaleString()}</div>
            <div className="stat-label">Total Words Written</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-value">{categories.length}</div>
            <div className="stat-label">Topics Covered</div>
          </div>
        </div>
      </div>

      {/* Filter and Search within My Posts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px', maxWidth: '450px' }}>
          <div className="input-wrapper" style={{ width: '100%' }}>
            <Search size={18} className="input-icon" />
            <input
              type="text"
              placeholder="Filter your articles by keyword..."
              className="form-input has-icon"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="my-posts-search"
            />
          </div>
        </div>

        {categories.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`category-chip ${selectedCategory === 'All' ? 'active' : ''}`}
            >
              All Topics
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`category-chip ${selectedCategory === c ? 'active' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading your publications...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <PenTool size={32} />
          </div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Articles Yet</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            {search || selectedCategory !== 'All'
              ? 'No articles match your search filter. Try clearing your search.'
              : 'You have not published any articles yet. Start writing today to build your portfolio!'}
          </p>
          {search || selectedCategory !== 'All' ? (
            <button onClick={() => { setSearch(''); setSelectedCategory('All'); }} className="btn btn-secondary">
              Clear Filters
            </button>
          ) : (
            <Link to="/create" className="btn btn-primary">
              <PlusCircle size={16} /> Write First Article
            </Link>
          )}
        </div>
      )}

      {/* Posts Grid with Edit & Delete actions */}
      {!loading && posts.length > 0 && (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              isOwner={true}
              onDelete={handleDeleteTrigger}
            />
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        postTitle={deleteTarget?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default MyPosts;
