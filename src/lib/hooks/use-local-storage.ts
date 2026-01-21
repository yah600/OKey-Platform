import { useState, useEffect, useCallback } from 'react';

// Custom hook for persisting state in localStorage
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get stored value or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          
          // Dispatch custom event to sync across tabs
          window.dispatchEvent(
            new CustomEvent('local-storage', {
              detail: { key, value: valueToStore },
            })
          );
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        
        window.dispatchEvent(
          new CustomEvent('local-storage', {
            detail: { key, value: undefined },
          })
        );
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sync state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if ('key' in e && e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${key}":`, error);
        }
      } else if ('detail' in e && e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('local-storage', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('local-storage', handleStorageChange as EventListener);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Hook for managing multiple localStorage keys as a single object
export function useLocalStorageObject<T extends Record<string, any>>(
  keyPrefix: string,
  initialState: T
): [T, (updates: Partial<T>) => void, (key: keyof T) => void, () => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialState;
    }

    const loadedState: Partial<T> = {};
    
    Object.keys(initialState).forEach((key) => {
      try {
        const item = window.localStorage.getItem(`${keyPrefix}.${key}`);
        if (item !== null) {
          loadedState[key as keyof T] = JSON.parse(item);
        }
      } catch (error) {
        console.warn(`Error loading localStorage key "${keyPrefix}.${key}":`, error);
      }
    });

    return { ...initialState, ...loadedState };
  });

  const updateState = useCallback(
    (updates: Partial<T>) => {
      setState((prev) => {
        const newState = { ...prev, ...updates };
        
        if (typeof window !== 'undefined') {
          Object.entries(updates).forEach(([key, value]) => {
            try {
              window.localStorage.setItem(`${keyPrefix}.${key}`, JSON.stringify(value));
            } catch (error) {
              console.warn(`Error setting localStorage key "${keyPrefix}.${key}":`, error);
            }
          });
        }
        
        return newState;
      });
    },
    [keyPrefix]
  );

  const removeKey = useCallback(
    (key: keyof T) => {
      setState((prev) => {
        const newState = { ...prev };
        delete newState[key];
        
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.removeItem(`${keyPrefix}.${String(key)}`);
          } catch (error) {
            console.warn(`Error removing localStorage key "${keyPrefix}.${String(key)}":`, error);
          }
        }
        
        return newState;
      });
    },
    [keyPrefix]
  );

  const clearAll = useCallback(() => {
    if (typeof window !== 'undefined') {
      Object.keys(initialState).forEach((key) => {
        try {
          window.localStorage.removeItem(`${keyPrefix}.${key}`);
        } catch (error) {
          console.warn(`Error removing localStorage key "${keyPrefix}.${key}":`, error);
        }
      });
    }
    
    setState(initialState);
  }, [keyPrefix, initialState]);

  return [state, updateState, removeKey, clearAll];
}

// Hook for managing user preferences
export interface UserPreferences {
  language: 'en' | 'fr';
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  compactMode: boolean;
  defaultPropertyId?: string;
}

export function useUserPreferences() {
  const defaultPreferences: UserPreferences = {
    language: 'en',
    theme: 'light',
    sidebarCollapsed: false,
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    compactMode: false,
  };

  return useLocalStorage<UserPreferences>('rovida_user_preferences', defaultPreferences);
}

// Hook for managing recently viewed items
export interface RecentlyViewed {
  id: string;
  type: 'property' | 'issue' | 'resident' | 'document' | 'meeting';
  title: string;
  timestamp: number;
}

export function useRecentlyViewed(maxItems: number = 10) {
  const [items, setItems] = useLocalStorage<RecentlyViewed[]>('rovida_recently_viewed', []);

  const addItem = useCallback(
    (item: Omit<RecentlyViewed, 'timestamp'>) => {
      setItems((prev) => {
        // Remove duplicates
        const filtered = prev.filter((i) => i.id !== item.id || i.type !== item.type);
        
        // Add new item at the beginning
        const updated = [{ ...item, timestamp: Date.now() }, ...filtered];
        
        // Limit to maxItems
        return updated.slice(0, maxItems);
      });
    },
    [setItems, maxItems]
  );

  const clearItems = useCallback(() => {
    setItems([]);
  }, [setItems]);

  return {
    items,
    addItem,
    clearItems,
  };
}
