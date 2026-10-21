import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Feather,
  PlusCircle,
  BookOpen,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar" id="main-navigation">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu} id="brand-link">
          <div className="brand-icon-box">
            <Feather size={22} />
          </div>
          <span className="brand-name">Chronicle</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            id="nav-feed"
          >
            <BookOpen size={18} />
            Feed
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/my-posts"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              id="nav-my-posts"
            >
              <User size={18} />
              My Posts
            </NavLink>
          )}

          <NavLink
            to="/create"
            className="btn btn-primary btn-sm"
            id="nav-write-btn"
          >
            <PlusCircle size={16} />
            Write Post
          </NavLink>
        </div>

        {/* Desktop Auth Actions */}
        <div className="nav-actions nav-actions-desktop">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.35rem 0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div className="author-avatar" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {user?.name?.split(' ')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log out of your account"
                id="btn-logout"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm" id="nav-login">
                <LogIn size={16} />
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">
                <UserPlus size={16} />
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          id="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" id="mobile-menu">
          <NavLink
            to="/"
            end
            onClick={closeMenu}
            className="nav-item"
            style={{ fontSize: '1.1rem', padding: '0.75rem 0' }}
          >
            <BookOpen size={20} />
            Feed
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/my-posts"
              onClick={closeMenu}
              className="nav-item"
              style={{ fontSize: '1.1rem', padding: '0.75rem 0' }}
            >
              <User size={20} />
              My Posts
            </NavLink>
          )}

          <NavLink
            to="/create"
            onClick={closeMenu}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <PlusCircle size={18} />
            Write Post
          </NavLink>

          <hr style={{ borderColor: 'var(--border-subtle)', margin: '1rem 0' }} />

          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="author-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{user?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%' }}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/login" onClick={closeMenu} className="btn btn-secondary" style={{ width: '100%' }}>
                <LogIn size={18} />
                Login
              </Link>
              <Link to="/register" onClick={closeMenu} className="btn btn-primary" style={{ width: '100%' }}>
                <UserPlus size={18} />
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
