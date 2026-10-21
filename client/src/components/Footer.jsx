import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Heart, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand Info */}
          <div>
            <div className="brand-logo" style={{ marginBottom: '1rem' }}>
              <div className="brand-icon-box" style={{ width: '32px', height: '32px' }}>
                <Feather size={18} />
              </div>
              <span className="brand-name" style={{ fontSize: '1.25rem' }}>Chronicle</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '380px', lineHeight: 1.6 }}>
              A high-performance modern blog management platform featuring end-to-end authentication,
              RESTful architecture, and persistent MongoDB storage.
            </p>
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, background: 'rgba(99,102,241,0.1)', padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
                Cognetix Internship Task 4
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: '#fff' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-muted)' }} onMouseOver={(e) => (e.target.style.color = '#fff')} onMouseOut={(e) => (e.target.style.color = 'var(--text-muted)')}>
                  All Articles
                </Link>
              </li>
              <li>
                <Link to="/create" style={{ color: 'var(--text-muted)' }} onMouseOver={(e) => (e.target.style.color = '#fff')} onMouseOut={(e) => (e.target.style.color = 'var(--text-muted)')}>
                  Publish New Post
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'var(--text-muted)' }} onMouseOver={(e) => (e.target.style.color = '#fff')} onMouseOut={(e) => (e.target.style.color = 'var(--text-muted)')}>
                  Author Login
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: 'var(--text-muted)' }} onMouseOver={(e) => (e.target.style.color = '#fff')} onMouseOut={(e) => (e.target.style.color = 'var(--text-muted)')}>
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Repository */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: '#fff' }}>Tech Stack</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {['React 18', 'Vite', 'Express', 'MongoDB', 'Node.js', 'JWT', 'Bcrypt'].map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.55rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
            <a
              href="https://github.com/Tejaswini-2006/Cognetix_BlogManagementSystem"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', gap: '0.5rem', marginTop: '0.5rem' }}
            >
              <Github size={15} />
              GitHub Repository
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Chronicle Blog System. Built by <strong>Tejaswini-2006</strong> for Cognetix Technology Internship.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)' }}>
            <span>Crafted with</span>
            <Heart size={14} color="#ec4899" fill="#ec4899" />
            <span>using MERN Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
