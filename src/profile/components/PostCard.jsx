import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pin, Play, Images } from 'lucide-react';

const TYPE_ICONS = {
  video:    Play,
  carousel: Images,
  pinned:   Pin,
};

export default function PostCard({ post, index, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const TypeIcon = TYPE_ICONS[post.type] || null;

  return (
    <motion.div
      className="post-card"
      onClick={() => onClick(post)}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.045,
        ease: [0.16, 1, 0.3, 1],
      }}
      role="button"
      tabIndex={0}
      aria-label={`View post: ${post.alt}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick(post)}
    >
      {/* Skeleton while loading */}
      {!imgLoaded && (
        <div
          className="skeleton"
          style={{ position: 'absolute', inset: 0, borderRadius: 0 }}
        />
      )}

      {/* Image */}
      <img
        src={post.src}
        alt={post.alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setImgLoaded(true)}
        style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.35s' }}
      />

      {/* Hover overlay */}
      <div className="post-overlay" aria-hidden="true" />

      {/* Pinned badge */}
      {post.type === 'pinned' && (
        <div className="post-pinned-badge" aria-label="Pinned post">
          <Pin size={14} fill="white" strokeWidth={0} />
        </div>
      )}

      {/* Type badge (video / carousel) */}
      {(post.type === 'video' || post.type === 'carousel') && TypeIcon && (
        <div className="post-type-badge" aria-label={post.type}>
          <TypeIcon size={18} fill={post.type === 'video' ? 'white' : 'none'} strokeWidth={post.type === 'video' ? 0 : 2} />
        </div>
      )}
    </motion.div>
  );
}
