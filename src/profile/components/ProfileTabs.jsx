import React from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, Play, RefreshCw, User } from 'lucide-react';

const TABS = [
  { id: 'posts',  label: 'Posts',  Icon: Grid3X3  },
  { id: 'reels',  label: 'Reels',  Icon: Play      },
  { id: 'tagged', label: 'Tagged', Icon: User      },
];

const indicatorVariants = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

export default function ProfileTabs({ activeTab, onTabChange }) {
  return (
    <nav className="profile-tabs" role="tablist" aria-label="Profile content tabs">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${id}`}
            id={`tab-${id}`}
            onClick={() => onTabChange(id)}
            className={`tab-btn ${isActive ? 'active' : ''}`}
          >
            <Icon
              size={14}
              strokeWidth={isActive ? 2.5 : 1.8}
              aria-hidden="true"
            />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
