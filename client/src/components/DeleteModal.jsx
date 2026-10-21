import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, postTitle, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} id="delete-modal-overlay">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
        id="delete-modal"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="modal-icon-box">
            <AlertTriangle size={28} />
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--text-dim)', padding: '0.25rem' }}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <h3 className="modal-title" id="modal-headline">
          Delete Blog Post
        </h3>
        <p className="modal-description">
          Are you sure you want to permanently delete{' '}
          <strong style={{ color: '#fff' }}>"{postTitle || 'this post'}"</strong>?
          This action cannot be undone and will remove the post completely from the database.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isDeleting}
            id="cancel-delete-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={isDeleting}
            id="confirm-delete-btn"
          >
            <Trash2 size={16} />
            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
