import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for persisting state safely in localStorage with cross-tab synchronization.
 * @param {string} key 
 * @param {any} initialValue 
 * @returns {[any, Function]}
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Synchronize state across open browser tabs via StorageEvent
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key !== key) return;
      try {
        if (e.newValue !== null) {
          setStoredValue(JSON.parse(e.newValue));
        } else {
          setStoredValue(initialValue);
        }
      } catch (err) {
        console.warn(`Error synchronizing storage key "${key}" across tabs:`, err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  const setValue = useCallback((value) => {
    setStoredValue((prev) => {
      const nextValue = typeof value === 'function' ? value(prev) : value;
      return nextValue;
    });
  }, []);

  return [storedValue, setValue];
}
