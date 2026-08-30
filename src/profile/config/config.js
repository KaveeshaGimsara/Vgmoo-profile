// ============================================================
// Central configuration file — edit ONE place to update all.
// ============================================================

export const CONTACT_EMAIL = 'hello@vgmoo.com';

export const PROFILE = {
  username: 'vgmoo',
  displayName: 'Vgmoo',
  tagline: 'Creative Studio',
  bio: '✦ We Create. We Connect. We Make Ideas Happen.\n🎨 Branding · Digital · Motion · Events · Workforce\n📩 hello@vgmoo.com',
  website: 'https://vgmoo.com',
  websiteLabel: 'vgmoo.com',
  // Counts are seed values — real follower count comes from Supabase
  baseFollowers: 200,
  following: 0,
  posts: 9,
  verified: true,
  avatarSrc: '/logo/vgmoo logo.png',
};

// Supabase config — replace with your real project values
export const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL',
  anonKey: 'YOUR_SUPABASE_ANON_KEY',
};

// The single profile being viewed
export const PROFILE_ID = 'vgmoo-main';
