'use client';

import {useState, useEffect} from 'react';

export function useOffline() {
  const [isOffline, setIsOffline] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    const demoMode = localStorage.getItem('mindspark-demo-mode') === 'true';
    setIsDemoMode(demoMode);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mindspark-demo-mode') {
        setIsDemoMode(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!isMounted) {
    return false;
  }

  return isDemoMode || isOffline;
}
