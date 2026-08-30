import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, MessageCircle, UserPlus } from 'lucide-react';
import { PROFILE } from '../config/config.js';
import ProfileStats, { MobileStatRow } from './ProfileStats.jsx';
import FollowButton from './FollowButton.jsx';
import ContactButton from './ContactButton.jsx';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function ProfileHeader({ followerCount, isFollowed, onFollowChange, onToast }) {
  return (
    <motion.header
      className="profile-header"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── LEFT COL: Avatar + mobile stats ──────────────────── */}
      <motion.div className="profile-avatar-col" variants={itemVariants}>
        <div
          className={`avatar-ring ${isFollowed ? '' : 'no-ring'}`}
        >
          <div className="avatar-inner">
              <img
                src={PROFILE.avatarSrc}
                alt={`${PROFILE.displayName} profile photo`}
                className="avatar-img"
                style={{ backgroundColor: '#fff', padding: '16px', objectFit: 'contain' }}
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${PROFILE.displayName}&background=111&color=fff&size=150`;
                }}
              />
          </div>
        </div>

        {/* Mobile-only stats beside avatar */}
        <div className="stats-row" style={{ display: 'none' }}>
          {/* hidden on desktop; shown via mobile-stats-row */}
        </div>
      </motion.div>

      {/* ── RIGHT COL: Info ───────────────────────────────────── */}
      <div className="profile-info">
        {/* Name + verified */}
        <motion.div className="profile-name-row" variants={itemVariants}>
          <span className="profile-username">{PROFILE.username}</span>
          {PROFILE.verified && (
            <span className="verified-badge" aria-label="Verified">
              <BadgeCheck size={13} strokeWidth={2.5} />
            </span>
          )}
        </motion.div>

        {/* Desktop stats */}
        <motion.div variants={itemVariants}>
          <ProfileStats
            posts={PROFILE.posts}
            followers={followerCount}
            following={PROFILE.following}
          />
        </motion.div>

        {/* Actions row */}
        <motion.div className="profile-action-row" variants={itemVariants}>
          <FollowButton
            followed={isFollowed}
            followerCount={followerCount}
            onStateChange={onFollowChange}
          />
          <button className="btn btn-message" aria-label="Send message">
            <MessageCircle size={15} strokeWidth={2} />
            <span>Message</span>
          </button>
          <ContactButton onToast={onToast} />
        </motion.div>

        {/* Bio block */}
        <motion.div className="profile-bio-block" variants={itemVariants}>
          <span className="profile-display-name">{PROFILE.displayName}</span>
          <span className="profile-bio">{PROFILE.bio}</span>
          <a
            href={PROFILE.website}
            target="_blank"
            rel="noopener noreferrer"
            className="profile-link"
          >
            🔗 {PROFILE.websiteLabel}
          </a>
        </motion.div>
      </div>

      {/* Mobile stats row (full-width, below header) */}
      <MobileStatRow
        posts={PROFILE.posts}
        followers={followerCount}
        following={PROFILE.following}
      />
    </motion.header>
  );
}
