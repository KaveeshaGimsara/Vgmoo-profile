import React, { useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, Copy } from 'lucide-react';

// ── Statistic item ─────────────────────────────────────────────
export function StatItem({ value, label }) {
  const formatted = formatCount(value);
  return (
    <div className="stat-item">
      <div className="stat-value">{formatted}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// ── Mobile stat row ────────────────────────────────────────────
export function MobileStatRow({ posts, followers, following }) {
  return (
    <div className="mobile-stats-row">
      <div className="mobile-stat-item">
        <span className="mobile-stat-value">{posts}</span>
        <span className="mobile-stat-label">posts</span>
      </div>
      <div className="mobile-stat-item">
        <span className="mobile-stat-value">{formatCount(followers)}</span>
        <span className="mobile-stat-label">followers</span>
      </div>
      <div className="mobile-stat-item">
        <span className="mobile-stat-value">{formatCount(following)}</span>
        <span className="mobile-stat-label">following</span>
      </div>
    </div>
  );
}

function formatCount(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace('.0', '') + 'K';
  return String(n);
}

export default function ProfileStats({ posts, followers, following }) {
  return (
    <div className="stats-row">
      <StatItem value={posts}     label="posts"     />
      <StatItem value={followers} label="followers" />
      <StatItem value={following} label="following" />
    </div>
  );
}
