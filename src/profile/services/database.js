/**
 * Database service for the Vgmoo profile Follow system.
 * Powered by Firebase Firestore with offline localStorage resilience.
 */

import { db, doc, getDoc, setDoc, collection, query, where, getDocs, serverTimestamp } from '../config/firebase.js';
import { PROFILE_ID, PROFILE } from '../config/config.js';

// ── Visitor ID (stable per browser) ─────────────────────────────────────────
function getVisitorId() {
  const key = 'vgmoo_visitor_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id =
      'visitor_' +
      Date.now().toString(36) +
      '_' +
      Math.random().toString(36).slice(2, 9);
    localStorage.setItem(key, id);
  }
  return id;
}

// ── localStorage fallback helpers ────────────────────────────────────────────
const LS_FOLLOWED_KEY = `vgmoo_followed_${PROFILE_ID}`;
const LS_COUNT_KEY = `vgmoo_follower_count_${PROFILE_ID}`;

function lsGetFollowed() {
  return localStorage.getItem(LS_FOLLOWED_KEY) === 'true';
}
function lsSetFollowed(val) {
  localStorage.setItem(LS_FOLLOWED_KEY, String(val));
}
function lsGetCount(base) {
  const stored = localStorage.getItem(LS_COUNT_KEY);
  return stored !== null ? Number(stored) : base;
}
function lsSetCount(n) {
  localStorage.setItem(LS_COUNT_KEY, String(n));
}

// ── Firestore helpers ────────────────────────────────────────────────────────
function getFollowDocRef(visitorId) {
  const docId = `${PROFILE_ID}_${visitorId}`;
  return doc(db, 'followers', docId);
}

async function fsGetCount() {
  try {
    const q = query(
      collection(db, 'followers'),
      where('profile_id', '==', PROFILE_ID),
      where('followed', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (err) {
    console.warn('[Firebase] fsGetCount fallback to stats/local:', err);
    return null;
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns { followed: boolean, count: number }
 */
export async function getFollowState(baseCount) {
  const visitorId = getVisitorId();
  try {
    const docRef = getFollowDocRef(visitorId);
    const docSnap = await getDoc(docRef);
    
    let followed = false;
    if (docSnap.exists()) {
      followed = Boolean(docSnap.data()?.followed);
    } else {
      followed = lsGetFollowed();
    }
    lsSetFollowed(followed);

    const onlineCount = await fsGetCount();
    const finalCount = onlineCount !== null ? baseCount + onlineCount : lsGetCount(baseCount);
    lsSetCount(finalCount);

    return { followed, count: finalCount };
  } catch (e) {
    console.warn('[Firebase] getFollowState failed, using localStorage:', e);
    return { followed: lsGetFollowed(), count: lsGetCount(baseCount) };
  }
}

/**
 * Follow the profile. Returns updated count.
 */
export async function followUser(currentCount) {
  const visitorId = getVisitorId();
  const optimisticNext = currentCount + 1;
  lsSetFollowed(true);
  lsSetCount(optimisticNext);

  try {
    const docRef = getFollowDocRef(visitorId);
    await setDoc(docRef, {
      profile_id: PROFILE_ID,
      visitor_id: visitorId,
      followed: true,
      updated_at: serverTimestamp(),
      created_at: serverTimestamp()
    }, { merge: true });

    const onlineCount = await fsGetCount();
    if (onlineCount !== null) {
      const realNext = PROFILE.baseFollowers + onlineCount;
      lsSetCount(realNext);
      return realNext;
    }
    return optimisticNext;
  } catch (e) {
    console.warn('[Firebase] followUser error:', e);
    return optimisticNext;
  }
}

/**
 * Unfollow the profile. Returns updated count.
 */
export async function unfollowUser(currentCount) {
  const visitorId = getVisitorId();
  const optimisticNext = Math.max(0, currentCount - 1);
  lsSetFollowed(false);
  lsSetCount(optimisticNext);

  try {
    const docRef = getFollowDocRef(visitorId);
    await setDoc(docRef, {
      profile_id: PROFILE_ID,
      visitor_id: visitorId,
      followed: false,
      updated_at: serverTimestamp()
    }, { merge: true });

    const onlineCount = await fsGetCount();
    if (onlineCount !== null) {
      const realNext = PROFILE.baseFollowers + onlineCount;
      lsSetCount(realNext);
      return realNext;
    }
    return optimisticNext;
  } catch (e) {
    console.warn('[Firebase] unfollowUser error:', e);
    return optimisticNext;
  }
}

/**
 * Get total follower count only.
 */
export async function getFollowerCount(baseCount) {
  try {
    const onlineCount = await fsGetCount();
    if (onlineCount !== null) return baseCount + onlineCount;
  } catch (e) {
    // fallback
  }
  return lsGetCount(baseCount);
}
