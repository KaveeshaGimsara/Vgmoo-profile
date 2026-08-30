import React from 'react';
import { motion } from 'framer-motion';
import PostCard from './PostCard.jsx';
import { POSTS } from '../data/posts.js';

export default function PostGrid({ onPostClick }) {
  return (
    <section
      id="tabpanel-posts"
      role="tabpanel"
      aria-labelledby="tab-posts"
    >
      <div className="post-grid">
        {POSTS.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            index={index}
            onClick={onPostClick}
          />
        ))}
      </div>
    </section>
  );
}
