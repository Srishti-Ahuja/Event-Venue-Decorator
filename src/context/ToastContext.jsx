import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

/**
 * Toast Provider that injects an accessible toast container at the viewport bottom
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ message, type = 'success', duration = 3000 }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast = { id, message, type };

    setToasts((prev) => [...prev.slice(-3), newToast]); // keep at most 4 active toasts

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const contextValue = useMemo(() => ({
    addToast,
    removeToast,
    success: (message, duration) => addToast({ message, type: 'success', duration }),
    error: (message, duration) => addToast({ message, type: 'error', duration }),
    info: (message, duration) => addToast({ message, type: 'info', duration })
  }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Accessible Floating Toast Region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label="Notification alerts"
        className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border backdrop-blur-md shadow-lg transition-all animate-fadeIn ${
                isSuccess
                  ? 'bg-charcoal-900/95 border-emerald-500/40 text-emerald-200'
                  : isError
                  ? 'bg-charcoal-900/95 border-rose-500/40 text-rose-200'
                  : 'bg-charcoal-900/95 border-hotpink-500/40 text-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {isError && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                {!isSuccess && !isError && <Info className="w-4 h-4 text-hotpink-400 shrink-0" />}
                <span className="text-xs font-medium">{toast.message}</span>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="ml-3 p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-hotpink-500"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Hook to consume toast notifications anywhere in the app
 * Returns { addToast, removeToast, success, error, info }
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Provide safe no-op fallbacks if used outside provider in standalone unit tests
    return {
      addToast: () => '',
      removeToast: () => {},
      success: () => '',
      error: () => '',
      info: () => ''
    };
  }
  return ctx;
}