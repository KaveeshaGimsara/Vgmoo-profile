import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PROFILE } from '../config/config.js';

export default function PostModal({ post, onClose }) {
  // Prevent body scroll while modal is open
  useEffect(() => {
    if (post) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [post]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {post && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          role="dialog"
          aria-modal="true"
          aria-label="Post preview"
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close post preview"
            >
              <X size={16} strokeWidth={2} />
            </button>

            {/* Image */}
            <div className="modal-img-wrap">
              <img
                src={post.src}
                alt={post.alt}
                className="modal-img"
                loading="eager"
              />
            </div>

            {/* Footer with caption */}
            <div className="modal-footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <img
                  src={PROFILE.avatarSrc}
                  alt={PROFILE.displayName}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    objectFit: 'contain', background: '#ffffff', padding: 4,
                    border: '1px solid rgba(255,255,255,0.12)'
                  }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{PROFILE.username}</span>
              </div>
              <p className="modal-caption">{post.caption}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
