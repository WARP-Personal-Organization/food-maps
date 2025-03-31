'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Serving in 3, 2, 1...');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadingProgress < 100) {
        setLoadingProgress((prev) => Math.min(prev + 1, 100));
      }
    }, 30);

    return () => clearTimeout(timer);
  }, [loadingProgress]);

  // Define text sequences for the loading counter
  useEffect(() => {
    const textSequences = [
      'Serving in 3, 2, 1...',
      'Finding food spots...',
      'Mapping delicious locations...',
      'Almost ready...',
    ];

    const textInterval = setInterval(() => {
      const textIndex = Math.floor(
        (loadingProgress / 100) * textSequences.length
      );
      setLoadingText(
        textSequences[Math.min(textIndex, textSequences.length - 1)]
      );
    }, 1000);

    return () => clearInterval(textInterval);
  }, [loadingProgress]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Full background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/DGBG.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* DailyGuardian logo */}
      <div className="absolute top-[7%] flex justify-center w-full z-10">
        <div className="w-45 h-auto">
          <img
            src="/images/DGLogo.png"
            alt="Daily Guardian Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center z-10 px-4 space-y-4">
        <div className="flex flex-col items-center">
          <div className="text-center">
            <div className="w-80 md:w-[500px] lg:w-[600px] h-auto">
              <img
                src="/images/food-prints.png"
                alt="Foodprints Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-[15%] flex flex-col items-center z-10">
        <div className="w-32 h-1 bg-black/20 rounded-full mb-4">
          <div
            className="h-full bg-black rounded-full transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <p className="text-black text-sm">{loadingText}</p>
      </div>
    </div>
  );
}
