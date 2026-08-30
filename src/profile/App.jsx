import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { PROFILE } from './config/config.js';
import { getFollowState } from './services/database.js';

import LoadingScreen from './components/LoadingScreen.jsx';
import ProfileHeader from './components/ProfileHeader.jsx';
import ProfileTabs from './components/ProfileTabs.jsx';
import PostGrid from './components/PostGrid.jsx';
import PostModal from './components/PostModal.jsx';
import Toast, { useToast } from './components/Toast.jsx';
import { SkeletonHeader, SkeletonGrid } from './components/SkeletonLoader.jsx';

import './index.css';

const pageVariants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function App() {
  // ── State ──────────────────────────────────────────────────────
  const [appLoading,   setAppLoading]   = useState(true);
  const [dbLoading,    setDbLoading]    = useState(true);
  const [isFollowed,   setIsFollowed]   = useState(false);
  const [followerCount,setFollowerCount]= useState(PROFILE.baseFollowers);
  const [activeTab,    setActiveTab]    = useState('posts');
  const [openPost,     setOpenPost]     = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  // ── Load DB state on mount ─────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const { followed, count } = await getFollowState(PROFILE.baseFollowers);
        if (!cancelled) {
          setIsFollowed(followed);
          setFollowerCount(count);
        }
      } catch (err) {
        console.error('[App] Failed to load follow state:', err);
      } finally {
        if (!cancelled) setDbLoading(false);
      }
    }

    init();

    // Hide loading screen after minimum display + db load
    const minTimer = setTimeout(() => {
      setAppLoading(false);
    }, 1800);

    return () => {
      cancelled = true;
      clearTimeout(minTimer);
    };
  }, []);

  // ── Callbacks ──────────────────────────────────────────────────
  const handleFollowChange = useCallback((followed, count) => {
    setIsFollowed(followed);
    setFollowerCount(count);
    addToast(
      followed ? 'You are now following Vgmoo!' : 'You unfollowed Vgmoo.',
      'success'
    );
  }, [addToast]);

  const handleToast = useCallback((msg, type) => {
    addToast(msg, type);
  }, [addToast]);

  const handleOpenPost  = useCallback((post) => setOpenPost(post), []);
  const handleClosePost = useCallback(() => setOpenPost(null), []);

  // ── Render ─────────────────────────────────────────────────────
  const isLoading = appLoading || dbLoading;

  return (
    <>
      {/* Loading screen */}
      <LoadingScreen visible={isLoading} />

      {/* Main content */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Top Navigation Bar with official Vgmoo Logo */}
            <header style={{
              width: '100%',
              borderBottom: '1px solid var(--border)',
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(16px)',
              position: 'sticky',
              top: 0,
              zIndex: 40
            }}>
              <div style={{
                maxWidth: 935,
                margin: '0 auto',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <a href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <img
                    src="/logo/vgmoo logo.png"
                    alt="Vgmoo"
                    style={{ height: 28, width: 'auto', objectFit: 'contain', backgroundColor: '#fff', padding: '4px', borderRadius: '4px' }}
                  />
                </a>
                <a
                  href="/"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  vgmoo.com ↗
                </a>
              </div>
            </header>

            <div className="page-wrapper">
              {/* Profile header */}
              <ProfileHeader
                followerCount={followerCount}
                isFollowed={isFollowed}
                onFollowChange={handleFollowChange}
                onToast={handleToast}
              />

              {/* Tabs */}
              <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

              {/* Tab panels */}
              <div style={{ marginTop: 3 }}>
                <AnimatePresence mode="wait">
                  {activeTab === 'posts' && (
                    <motion.div
                      key="posts"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <PostGrid onPostClick={handleOpenPost} />
                    </motion.div>
                  )}

                  {activeTab === 'reels' && (
                    <motion.div
                      key="reels"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className="tab-placeholder" id="tabpanel-reels" role="tabpanel" aria-labelledby="tab-reels">
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
                        <p style={{ fontWeight: 600, marginBottom: 6 }}>No Reels Yet</p>
                        <p style={{ fontSize: 13 }}>Check back soon for behind-the-scenes content.</p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'tagged' && (
                    <motion.div
                      key="tagged"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className="tab-placeholder" id="tabpanel-tagged" role="tabpanel" aria-labelledby="tab-tagged">
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🏷️</div>
                        <p style={{ fontWeight: 600, marginBottom: 6 }}>No Tagged Posts</p>
                        <p style={{ fontSize: 13 }}>Posts you're tagged in will appear here.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox modal */}
      <PostModal post={openPost} onClose={handleClosePost} />

      {/* Toast notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  );
}
