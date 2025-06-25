// NewspaperAnimation.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface NewspaperAnimationProps {
  onComplete: () => void;
}

export default function NewspaperAnimation({ onComplete }: NewspaperAnimationProps) {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingText, setLoadingText] = useState<string>('Cooking up something special just for you...');

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (loadingProgress < 100) {
      timer = setTimeout(() => {
        setLoadingProgress((prev) => Math.min(prev + 1, 100));
      }, 30);
    }

    return () => clearTimeout(timer);
  }, [loadingProgress]);

  useEffect(() => {
    const textSequences: string[] = [
      'Serving in 3, 2, 1...',
      'Finding food spots...',
      'Mapping delicious locations...',
      'Almost ready...',
      'Cooking up something special just for you...', 
    ];

    const textIndex = Math.floor((loadingProgress / 250) * textSequences.length);
    setLoadingText(textSequences[Math.min(textIndex, textSequences.length - 1)]);
  }, [loadingProgress]); 

  return (
    <motion.div
      initial={{ rotateY: 0 }}
      animate={{ rotateY: -180 }}
      transition={{ 
        duration: 1.5, 
        ease: [0.4, 0, 0.2, 1],
        delay: 0.5
      }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-40"
      style={{ 
        transformStyle: 'preserve-3d',
        transformOrigin: 'left center'
      }}
    >
      {/* Your exact LoadingScreen content */}
      <div className="absolute inset-0 backface-hidden">
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
        >
          {/* Full background image */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/DGBG.png')" }}
          />

          {/* DailyGuardian logo */}
          <div className="absolute top-[7%] z-10 w-40 h-auto md:w-48"> 
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

          {/* Main content */}
          <div className="flex flex-col items-center justify-center z-10 px-4 space-y-4">
            <div className="text-center">
              <div className="w-80 h-auto md:w-[500px] lg:w-[600px]"> 
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

          <div className="absolute bottom-[15%] flex flex-col items-center z-10">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-black text-sm">{loadingText}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}