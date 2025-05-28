'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  const [loadingProgress, setLoadingProgress] = useState<number>(0); // Explicitly type useState
  const [loadingText, setLoadingText] = useState<string>('Serving in 3, 2, 1...'); // Explicitly type useState

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadingProgress < 100) {
        setLoadingProgress((prev) => Math.min(prev + 1, 100));
      }
    }, 30);

    return () => clearTimeout(timer);
  }, [loadingProgress]);

  useEffect(() => {
    const textSequences: string[] = [ // Explicitly type the array
      'Serving in 3, 2, 1...',
      'Finding food spots...',
      'Mapping delicious locations...',
      'Almost ready...',
    ];

    const textInterval = setInterval(() => {
      const textIndex = Math.floor((loadingProgress / 100) * textSequences.length);
      setLoadingText(textSequences[Math.min(textIndex, textSequences.length - 1)]);
    }, 1000);

    return () => clearInterval(textInterval);
  }, [loadingProgress]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
    >
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
        <div className="w-45 h-auto relative" style={{ width: '180px', height: 'auto' }}>
          <Image
            src="/images/DGLogo.png"
            alt="Daily Guardian Logo"
            layout="responsive"
            width={180}
            height={60}
            objectFit="contain"
            priority
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center z-10 px-4 space-y-4">
        <div className="flex flex-col items-center">
          <div className="text-center">
            <div className="w-80 md:w-[500px] lg:w-[600px] h-auto relative">
              <Image
                src="/images/food-prints.png"
                alt="Foodprints Logo"
                layout="responsive"
                width={600}
                height={200}
                objectFit="contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[15%] flex flex-col items-center z-10">
        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-black text-sm">{loadingText}</p>
      </div>
    </motion.div>
  );
}