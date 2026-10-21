import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/PostCard';
import Alert from '../components/Alert';
import { Search, Sparkles, Filter, ChevronLeft, ChevronRight, RefreshCw, PenTool } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technology',
  'Web Development',
  'Artificial Intelligence',
  'Software Engineering',
  'Design & UI/UX',
  'Career & Tips'
];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.posts.getAll({
        page: currentPage,
        limit: 9,
        category: selectedCategory,
        search: searchQuery
      });
      setPosts(data.posts || []);
      setTotalPages(data.totalPages || 1);
      setTotalPosts(data.total || 0);
    } catch (err) {
      console.error('Failed to load blog posts:', err);
      setError(err.message || 'Unable to connect to the blog server. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchQuery, selectedCategory, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCategorySelect = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-badge">
            <Sparkles size={14} />
            Cognetix Technology Internship Task 4
          </div>
          <h1 className="hero-title">
            Where Modern Ideas & <br />
            <span className="brand-name">Code Stories Flourish</span>
          </h1>
          <p className="hero-subtitle">
            Discover in-depth engineering guides, industry insights, and developer journeys
            crafted by our passionate community of tech innovators.
          </p>

          {/* Search & Filter Bar */}
          <div className="search-filter-box">
            <form onSubmit={handleSearchSubmit} className="search-input-group">
              <Search size={20} className="search-icon-left" />
              <input
                type="text"
                placeholder="Search articles by title, topic, or keyword..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                id="search-posts-input"
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ position: 'absolute', right: '8px', padding: '0.6rem 1.25rem' }}
                id="search-submit-btn"
              >
                Search
              </button>
            </form>

            {/* Category Chips */}
            <div className="category-chips">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                  id={`filter-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Blog Feed Container */}
      <main className="container" style={{ marginTop: '1rem' }}>
        {/* Results summary bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            {loading ? (
              'Updating posts...'
            ) : (
              <>
                Showing <strong style={{ color: '#fff' }}>{posts.length}</strong> of{' '}
                <strong style={{ color: '#fff' }}>{totalPosts}</strong> published{' '}
                {totalPosts === 1 ? 'article' : 'articles'}
                {selectedCategory !== 'All' && <span> in <strong style={{ color: 'var(--accent-primary)' }}>{selectedCategory}</strong></span>}
                {searchQuery && <span> matching "<strong style={{ color: 'var(--accent-primary)' }}>{searchQuery}</strong>"</span>}
              </>
            )}
          </div>

          {(selectedCategory !== 'All' || searchQuery) && (
            <button
              onClick={resetFilters}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', gap: '0.35rem' }}
            >
              <RefreshCw size={13} />
              Reset Filters
            </button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <Alert type="error" message={error} />
            <button onClick={fetchPosts} className="btn btn-secondary btn-sm" style={{ margin: '0 auto', display: 'flex', gap: '0.5rem' }}>
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Fetching latest posts...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <PenTool size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Blog Posts Found</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              {searchQuery || selectedCategory !== 'All'
                ? 'No published articles match your current search criteria. Try a different keyword or reset the filter.'
                : 'There are currently no blog posts published. Be the first to share your insights with the community!'}
            </p>
            {searchQuery || selectedCategory !== 'All' ? (
              <button onClick={resetFilters} className="btn btn-secondary">
                Clear Filters
              </button>
            ) : (
              <a href="/create" className="btn btn-primary">
                Write First Post
              </a>
            )}
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="Previous page"
              id="pagination-prev"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`page-btn ${currentPage === num ? 'active' : ''}`}
                onClick={() => handlePageChange(num)}
                id={`pagination-page-${num}`}
              >
                {num}
              </button>
            ))}

            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
              id="pagination-next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
