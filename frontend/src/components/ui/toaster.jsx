import React from 'react';
import { useToast } from '@/hooks/use-toast';

export const Toaster = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-background border border-border rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-right-full"
          onClick={() => dismiss(toast.id)}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-1">
              {toast.title && (
                <h4 className="text-sm font-medium text-foreground">
                  {toast.title}
                </h4>
              )}
              {toast.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismiss(toast.id);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 