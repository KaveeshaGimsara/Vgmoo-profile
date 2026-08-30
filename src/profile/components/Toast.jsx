import React, { useEffect, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info } from 'lucide-react';

// Single toast item
function ToastItem({ id, message, type, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const IconComp = type === 'success' ? Check : Info;

  return (
    <motion.div
      layout
      className="toast"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      role="status"
      aria-live="polite"
    >
      <IconComp
        size={15}
        strokeWidth={2.5}
        color={type === 'success' ? '#4ade80' : '#60a5fa'}
      />
      {message}
    </motion.div>
  );
}

// Toast container — receives `toasts` array and `removeToast` fn
export default function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container" aria-label="Notifications">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            id={t.id}
            message={t.message}
            type={t.type}
            onRemove={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook — use in App to manage toasts
let _uid = 0;
export function useToast() {
  const [toasts, setToasts] = React.useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++_uid;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
