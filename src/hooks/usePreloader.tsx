
import React, { useState, useEffect } from 'react';

interface UsePreloaderOptions {
  minDuration?: number;
  checkAssets?: boolean;
}

export const usePreloader = (options: UsePreloaderOptions = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { minDuration = 2000, checkAssets = true } = options;

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let minTimeoutId: NodeJS.Timeout;
    let assetsLoaded = false;
    let minTimePassed = false;

    // Simulate progress
    progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    // Check if minimum time has passed
    minTimeoutId = setTimeout(() => {
      minTimePassed = true;
      if (assetsLoaded || !checkAssets) {
        setProgress(100);
        setTimeout(() => setIsLoading(false), 300);
      }
    }, minDuration);

    // Check if assets are loaded
    if (checkAssets) {
      const checkAssetsLoaded = () => {
        // Check if document is ready
        if (document.readyState === 'complete') {
          assetsLoaded = true;
          if (minTimePassed) {
            setProgress(100);
            setTimeout(() => setIsLoading(false), 300);
          }
        } else {
          setTimeout(checkAssetsLoaded, 100);
        }
      };
      checkAssetsLoaded();
    }

    return () => {
      clearInterval(progressInterval);
      clearTimeout(minTimeoutId);
    };
  }, [minDuration, checkAssets]);

  return { isLoading, progress };
};
