/**
 * Data Loader Hook
 * Implementation from: Section 8.2 "Data Loading Strategy" - immoflow_logic_architecture.md
 * 
 * Features:
 * - Progressive loading (shell → critical → secondary → background)
 * - Smart prefetching based on user patterns
 * - Cache management with invalidation
 * - Loading states and error handling
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppState } from '../state/app-state-context';

export interface LoadingState {
  shell: boolean;
  critical: boolean;
  secondary: boolean;
  background: boolean;
}

export interface DataLoaderOptions {
  /**
   * Skip loading if cache is fresh
   * Default: true
   */
  useCache?: boolean;
  
  /**
   * Cache max age in milliseconds
   * Default: 5 minutes (from architecture doc)
   */
  cacheMaxAge?: number;
  
  /**
   * Enable smart prefetching
   * Default: true
   */
  prefetch?: boolean;
  
  /**
   * Auto-refresh interval in milliseconds
   * Default: null (no auto-refresh)
   */
  refreshInterval?: number | null;
}

export interface LoadResult<T> {
  data: T | null;
  loading: LoadingState;
  error: Error | null;
  refetch: () => Promise<void>;
  isStale: boolean;
}

/**
 * Generic data loader hook with progressive loading
 */
export function useDataLoader<T>(
  fetchFn: () => Promise<T>,
  cacheKey: string,
  options: DataLoaderOptions = {}
): LoadResult<T> {
  const {
    useCache = true,
    cacheMaxAge = 5 * 60 * 1000, // 5 minutes
    prefetch = true,
    refreshInterval = null,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    shell: true,
    critical: true,
    secondary: true,
    background: true,
  });
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);
  
  const isMountedRef = useRef(true);
  const cacheRef = useRef<{ data: T; timestamp: number } | null>(null);

  /**
   * Check if cached data is still fresh
   */
  const isCacheFresh = useCallback(() => {
    if (!cacheRef.current) return false;
    const age = Date.now() - cacheRef.current.timestamp;
    return age < cacheMaxAge;
  }, [cacheMaxAge]);

  /**
   * Fetch data with error handling
   */
  const fetchData = useCallback(async (stage: keyof LoadingState = 'critical') => {
    try {
      setLoading(prev => ({ ...prev, [stage]: true }));
      setError(null);

      // Use cache if fresh and enabled
      if (useCache && isCacheFresh() && cacheRef.current) {
        if (isMountedRef.current) {
          setData(cacheRef.current.data);
          setLoading(prev => ({ ...prev, [stage]: false }));
          setIsStale(false);
        }
        return;
      }

      // Fetch fresh data
      const result = await fetchFn();
      
      if (isMountedRef.current) {
        setData(result);
        cacheRef.current = { data: result, timestamp: Date.now() };
        setLoading(prev => ({ ...prev, [stage]: false }));
        setIsStale(false);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(prev => ({ ...prev, [stage]: false }));
      }
      console.error(`Error fetching ${cacheKey}:`, err);
    }
  }, [fetchFn, cacheKey, useCache, isCacheFresh]);

  /**
   * Progressive loading sequence
   * From Section 8.2: Shell → Critical → Secondary → Background
   */
  useEffect(() => {
    isMountedRef.current = true;

    const loadProgressively = async () => {
      // 1. Shell (immediate)
      setLoading(prev => ({ ...prev, shell: false }));

      // 2. Critical Data (<300ms)
      await fetchData('critical');

      // 3. Secondary Content (<1s)
      setTimeout(() => {
        setLoading(prev => ({ ...prev, secondary: false }));
      }, 300);

      // 4. Background Data (1-3s)
      setTimeout(() => {
        setLoading(prev => ({ ...prev, background: false }));
      }, 1000);
    };

    loadProgressively();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData]);

  /**
   * Auto-refresh interval
   */
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      if (isMountedRef.current) {
        fetchData('background');
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchData]);

  /**
   * Mark cache as stale after max age
   */
  useEffect(() => {
    if (!cacheRef.current) return;

    const timeout = setTimeout(() => {
      setIsStale(true);
    }, cacheMaxAge);

    return () => clearTimeout(timeout);
  }, [cacheMaxAge, data]);

  /**
   * Manual refetch
   */
  const refetch = useCallback(async () => {
    cacheRef.current = null; // Invalidate cache
    await fetchData('critical');
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    isStale,
  };
}

/**
 * Hook for prefetching data in the background
 * From Section 8.2: Smart Prefetching
 */
export function usePrefetch() {
  const prefetchedData = useRef<Map<string, { data: any; timestamp: number }>>(new Map());

  /**
   * Prefetch data for likely next pages
   * @param key - Cache key
   * @param fetchFn - Function to fetch data
   * @param probability - Likelihood user will navigate (0-1)
   */
  const prefetch = useCallback(async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    probability: number = 0.5
  ) => {
    // Only prefetch if probability is high enough
    if (probability < 0.3) return;

    try {
      // Check if already prefetched recently
      const cached = prefetchedData.current.get(key);
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
        return;
      }

      const data = await fetchFn();
      prefetchedData.current.set(key, { data, timestamp: Date.now() });
    } catch (err) {
      console.error(`Prefetch error for ${key}:`, err);
    }
  }, []);

  /**
   * Get prefetched data if available
   */
  const getPrefetched = useCallback(<T>(key: string): T | null => {
    const cached = prefetchedData.current.get(key);
    if (!cached) return null;

    // Check if still fresh (5 minutes)
    if (Date.now() - cached.timestamp > 5 * 60 * 1000) {
      prefetchedData.current.delete(key);
      return null;
    }

    return cached.data;
  }, []);

  /**
   * Clear all prefetched data
   */
  const clearPrefetch = useCallback(() => {
    prefetchedData.current.clear();
  }, []);

  return {
    prefetch,
    getPrefetched,
    clearPrefetch,
  };
}

/**
 * Hook for tracking user patterns and smart prefetching
 * From Section 8.2: User pattern analysis
 */
export function useSmartPrefetch() {
  const { prefetch } = usePrefetch();
  const userPatterns = useRef<Map<string, string[]>>(new Map());

  /**
   * Track page navigation to learn patterns
   */
  const trackNavigation = useCallback((fromPage: string, toPage: string) => {
    const pattern = userPatterns.current.get(fromPage) || [];
    pattern.push(toPage);
    
    // Keep only last 10 navigations per page
    userPatterns.current.set(fromPage, pattern.slice(-10));
  }, []);

  /**
   * Get predicted next page based on patterns
   */
  const predictNextPage = useCallback((currentPage: string): Array<{ page: string; probability: number }> => {
    const pattern = userPatterns.current.get(currentPage) || [];
    if (pattern.length === 0) return [];

    // Calculate frequency of each next page
    const frequency = pattern.reduce((acc, page) => {
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert to probabilities
    const total = pattern.length;
    return Object.entries(frequency)
      .map(([page, count]) => ({
        page,
        probability: count / total,
      }))
      .sort((a, b) => b.probability - a.probability);
  }, []);

  /**
   * Auto-prefetch based on current page
   */
  const autoPrefetch = useCallback(async (
    currentPage: string,
    fetchFunctions: Record<string, () => Promise<any>>
  ) => {
    const predictions = predictNextPage(currentPage);
    
    for (const { page, probability } of predictions) {
      const fetchFn = fetchFunctions[page];
      if (fetchFn) {
        await prefetch(page, fetchFn, probability);
      }
    }
  }, [predictNextPage, prefetch]);

  return {
    trackNavigation,
    predictNextPage,
    autoPrefetch,
  };
}
