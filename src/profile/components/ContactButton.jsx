import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check } from 'lucide-react';
import { CONTACT_EMAIL } from '../config/config.js';

export default function ContactButton({ onToast }) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(async () => {
    if (copied) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
      } else {
        // Fallback for older browsers / non-HTTPS
        const el = document.createElement('textarea');
        el.value = CONTACT_EMAIL;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      onToast?.('Email copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      onToast?.(`Email: ${CONTACT_EMAIL}`, 'info');
      console.warn('[ContactButton] clipboard write failed', err);
    }
  }, [copied, onToast]);

  return (
    <motion.button
      onClick={handleClick}
      className="btn btn-icon"
      whileTap={{ scale: 0.9 }}
      title={copied ? 'Copied!' : `Copy email: ${CONTACT_EMAIL}`}
      aria-label={copied ? 'Email copied' : 'Copy email address'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <Check size={16} strokeWidth={2.5} color="#4ade80" />
          </motion.span>
        ) : (
          <motion.span
            key="mail"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <Mail size={16} strokeWidth={2} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
