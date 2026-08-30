import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { followUser, unfollowUser } from '../services/database.js';

export default function FollowButton({ followed, followerCount, onStateChange }) {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (followed) {
        const newCount = await unfollowUser(followerCount);
        onStateChange(false, newCount);
      } else {
        const newCount = await followUser(followerCount);
        onStateChange(true, newCount);
      }
    } catch (err) {
      console.error('[FollowButton]', err);
    } finally {
      setLoading(false);
    }
  }, [followed, followerCount, loading, onStateChange]);

  return (
    <motion.button
      onClick={handleClick}
      className={`btn ${followed ? 'btn-following' : 'btn-follow'} ${loading ? 'btn-loading' : ''}`}
      whileTap={{ scale: 0.95 }}
      layout
      aria-label={followed ? 'Unfollow' : 'Follow'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="btn-spinner"
          />
        ) : followed ? (
          <motion.span
            key="following"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <Check size={14} strokeWidth={2.5} />
            Following
          </motion.span>
        ) : (
          <motion.span
            key="follow"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            Follow
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
