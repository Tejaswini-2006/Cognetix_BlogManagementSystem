import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(99, 102, 241, 0.12)',
          color: 'var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}
      >
        <Compass size={36} />
      </div>
      <h1 style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 2rem', fontSize: '1.1rem' }}>
        The article or destination you are searching for does not exist, has been removed, or moved to another URL.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        <ArrowLeft size={18} /> Return to Home Feed
      </Link>
    </div>
  );
};

export default NotFound;
