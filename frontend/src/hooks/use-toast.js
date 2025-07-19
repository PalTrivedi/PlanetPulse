import { useState, useCallback } from 'react';

let toastInstance = null;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, duration = 5000 }) => {
    const id = Date.now();
    const newToast = { id, title, description, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
    
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toast, dismiss, toasts };
};

// Global toast function for components that don't use the hook
export const toast = ({ title, description, duration = 5000 }) => {
  if (toastInstance) {
    return toastInstance({ title, description, duration });
  }
  
  // Fallback to alert if no toast instance is available
  alert(`${title}: ${description}`);
}; 