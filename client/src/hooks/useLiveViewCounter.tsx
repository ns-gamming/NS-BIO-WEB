
import { useState, useEffect } from 'react';

export function useLiveViewCounter(initialViews: number, incrementInterval: number = 3000) {
  const [views, setViews] = useState(Math.max(initialViews, 100));

  useEffect(() => {
    const interval = setInterval(() => {
      setViews((prev) => {
        // Random increment between 1-5 views
        const increment = Math.floor(Math.random() * 5) + 1;
        return prev + increment;
      });
    }, incrementInterval);

    return () => clearInterval(interval);
  }, [incrementInterval]);

  return views;
}
