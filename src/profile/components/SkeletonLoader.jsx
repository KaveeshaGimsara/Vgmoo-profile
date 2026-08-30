import React from 'react';

// Generic shimmer skeleton block
export function SkeletonBlock({ width = '100%', height = 16, rounded = 8, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: rounded, flexShrink: 0, ...style }}
    />
  );
}

// Circular skeleton (avatar)
export function SkeletonCircle({ size = 80 }) {
  return (
    <div
      className="skeleton"
      style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0 }}
    />
  );
}

// Full profile header skeleton
export function SkeletonHeader() {
  return (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', padding: '28px 0 24px' }}>
      {/* Avatar */}
      <div style={{ flexShrink: 0 }}>
        <SkeletonCircle size={150} />
      </div>
      {/* Info col */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SkeletonBlock width={160} height={22} rounded={6} />
        <div style={{ display: 'flex', gap: 40 }}>
          {[80, 100, 90].map((w, i) => (
            <SkeletonBlock key={i} width={w} height={14} rounded={4} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <SkeletonBlock width={130} height={32} rounded={8} />
          <SkeletonBlock width={130} height={32} rounded={8} />
          <SkeletonBlock width={36} height={32} rounded={8} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <SkeletonBlock width={100} height={13} rounded={4} />
          <SkeletonBlock width={240} height={13} rounded={4} />
          <SkeletonBlock width={180} height={13} rounded={4} />
        </div>
      </div>
    </div>
  );
}

// Square post skeleton
export function SkeletonPost() {
  return (
    <div
      className="skeleton"
      style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 0 }}
    />
  );
}

// 3×3 grid skeleton
export function SkeletonGrid() {
  return (
    <div className="post-grid">
      {Array.from({ length: 9 }).map((_, i) => (
        <SkeletonPost key={i} />
      ))}
    </div>
  );
}
