import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config.js';

let supabase = null;

// Guard: only init if real credentials are provided
const isConfigured =
  SUPABASE_CONFIG.url &&
  SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL' &&
  SUPABASE_CONFIG.anonKey &&
  SUPABASE_CONFIG.anonKey !== 'YOUR_SUPABASE_ANON_KEY';

if (isConfigured) {
  try {
    supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  } catch (e) {
    console.warn('[Vgmoo Profile] Supabase init failed — using localStorage fallback.', e);
    supabase = null;
  }
} else {
  console.info('[Vgmoo Profile] Supabase not configured — using localStorage fallback.');
}

export { supabase, isConfigured };
