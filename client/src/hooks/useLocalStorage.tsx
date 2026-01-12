// src/hooks/use-local-storage.tsx
// ⚠️ IMPORTANT SECURITY NOTE:
// This hook is intended ONLY for NON-SENSITIVE UI state,
// such as theme, onboarding flag, toggle preferences, animation settings, etc.
// Do NOT use this hook for journals, mood logs, profile, favorites, chat history.
// Sensitive data MUST be stored using the encrypted Vault API.

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {

  // --- Safety Check: Warn if large/sensitive objects are stored ----
  const isPossiblySensitive = (value: any) => {
    if (typeof value === "object" && value !== null) {
      const size = JSON.stringify(value).length;
      if (size > 300) {
        console.warn(
          `%c[SECURITY WARNING] useLocalStorage: Large object (${size} chars) might contain sensitive data. 
Do NOT store journals, profile, mood logs, chat, favorites here. Use Vault instead.`,
          "background: #ff4444; color: white; padding: 4px;"
        );
      }
    }
  };

  // --- Load initial value ---
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      const parsed = item ? JSON.parse(item) : initialValue;
      isPossiblySensitive(parsed);
      return parsed;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // --- Setter that also saves to localStorage ---
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      isPossiblySensitive(valueToStore);  // warn developer

      // Update React state
      setStoredValue(valueToStore);

      // Write to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // --- Sync across tabs ---
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue);
          isPossiblySensitive(parsed);
          setStoredValue(parsed);
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
