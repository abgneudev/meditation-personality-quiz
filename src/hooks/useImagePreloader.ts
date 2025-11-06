import { useState, useEffect, useRef } from 'react';

interface UseImagePreloaderReturn {
  isLoading: boolean;
  loadingProgress: number;
}

export function useImagePreloader(imagePaths: readonly string[]): UseImagePreloaderReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const isLoadingRef = useRef(true);

  useEffect(() => {
    if (imagePaths.length === 0) {
      setIsLoading(false);
      setLoadingProgress(100);
      isLoadingRef.current = false;
      return;
    }

    let loadedCount = 0;
    const totalImages = imagePaths.length;
    isLoadingRef.current = true;

    const updateProgress = () => {
      loadedCount++;
      const progress = Math.round((loadedCount / totalImages) * 100);
      setLoadingProgress(progress);

      if (loadedCount === totalImages) {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    };

    // Preload all images
    const preloadPromises = imagePaths.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          updateProgress();
          resolve();
        };
        img.onerror = (error) => {
          console.error(`Failed to load image: ${src}`, error);
          updateProgress(); // Still count as loaded to not break the app
          resolve();
        };
        img.src = src;
      });
    });

    // Set a timeout to ensure we don't wait forever
    const timeout = setTimeout(() => {
      if (isLoadingRef.current) {
        console.warn('Image preloading timed out after 3 seconds');
        setIsLoading(false);
        setLoadingProgress(100);
        isLoadingRef.current = false;
      }
    }, 3000);

    Promise.all(preloadPromises).then(() => {
      clearTimeout(timeout);
      if (isLoadingRef.current) {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    });

    return () => {
      clearTimeout(timeout);
      isLoadingRef.current = false;
    };
  }, [imagePaths]);

  return { isLoading, loadingProgress };
}