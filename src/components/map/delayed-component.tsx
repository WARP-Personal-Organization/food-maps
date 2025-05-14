'use client';

import { useState, useEffect } from 'react';

interface DelayedComponentProps {
  children: React.ReactNode;
  delayTime?: number; // Time in milliseconds
}

export function resetCache(): void {
  // This is now just a utility function that can be called from client components
  console.log('Cache reset requested');
}

export default function DelayedComponent({
  children,
  delayTime = 3000, // Default 3 seconds
}: DelayedComponentProps) {
  // Track if we're on the client and if content is ready to show
  const [isMounted, setIsMounted] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);

  // Effect to mark client-side rendering
  useEffect(() => {
    setIsMounted(true);

    // Start the delay timer only on the client
    const timer = setTimeout(() => {
      setIsContentReady(true);
    }, delayTime);

    return () => clearTimeout(timer);
  }, [delayTime]);

  // During SSR and initial client render, just return children to avoid hydration mismatch
  if (!isMounted) {
    return <>{children}</>;
  }

  // After mounted on client but before timer completes, trigger the loading state
  if (!isContentReady) {
    // This is the key part - throw a promise that Suspense will catch, but only on the client
    throw new Promise((resolve) => setTimeout(resolve, delayTime));
  }

  // When the timer completes, render children
  return <>{children}</>;
}
