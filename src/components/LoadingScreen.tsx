// NewspaperAnimation.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface NewspaperAnimationProps {
  onComplete?: () => void;
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
    <div className="fixed inset-0 z-40 overflow-hidden" style={{ perspective: '1500px' }}>
      {/* Magazine Page with Curved Flip */}
      <motion.div
        initial={{ 
          rotateY: 0,
          rotateX: 0,
          rotateZ: 0,
          scale: 1,
          skewY: 0,
          transformOrigin: 'left center'
        }}
        animate={{ 
          rotateY: [0, -8, -25, -50, -85, -120, -155, -180],
          rotateX: [0, 2, 8, 15, 12, 8, 3, 0],
          rotateZ: [0, 1, 3, 6, 4, 2, 0.5, 0],
          scale: [1, 0.99, 0.96, 0.92, 0.94, 0.97, 0.99, 1],
          skewY: [0, -1, -3, -5, -3, -1, 0, 0],
          x: [0, 2, 8, 15, 12, 8, 3, 0],
          y: [0, -1, -3, -5, -3, -1, 0, 0]
        }}
        transition={{ 
          duration: 2.5,
          delay: 0.6,
          times: [0, 0.1, 0.25, 0.45, 0.65, 0.8, 0.95, 1],
          ease: "easeInOut"
        }}
        onAnimationComplete={onComplete}
        className="absolute inset-0"
        style={{ 
          transformStyle: 'preserve-3d',
          transformOrigin: 'left center',
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
        }}
      >
        {/* Front of the magazine page */}
        <div className="absolute inset-0 backface-hidden bg-white" style={{ borderRadius: '0 8px 8px 0' }}>
          {/* Curved fold shadow that follows paper physics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.1, 0.3, 0.6, 0.8, 0.5, 0.2, 0],
              background: [
                'radial-gradient(ellipse 100px 400px at 0% 50%, transparent 0%, transparent 100%)',
                'radial-gradient(ellipse 120px 400px at 10% 50%, rgba(0,0,0,0.1) 0%, transparent 70%)',
                'radial-gradient(ellipse 150px 400px at 25% 50%, rgba(0,0,0,0.2) 0%, transparent 60%)',
                'radial-gradient(ellipse 200px 400px at 45% 50%, rgba(0,0,0,0.35) 0%, transparent 50%)',
                'radial-gradient(ellipse 250px 400px at 65% 50%, rgba(0,0,0,0.4) 0%, transparent 40%)',
                'radial-gradient(ellipse 200px 400px at 80% 50%, rgba(0,0,0,0.25) 0%, transparent 50%)',
                'radial-gradient(ellipse 150px 400px at 95% 50%, rgba(0,0,0,0.1) 0%, transparent 70%)',
                'radial-gradient(ellipse 100px 400px at 100% 50%, transparent 0%, transparent 100%)'
              ]
            }}
            transition={{ 
              duration: 2.5,
              delay: 0.6,
              times: [0, 0.1, 0.25, 0.45, 0.65, 0.8, 0.95, 1]
            }}
            className="absolute inset-0 z-10 pointer-events-none"
          />

          {/* Paper wrinkle/bend lines */}
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ 
              opacity: [0, 0.2, 0.4, 0.6, 0.5, 0.3, 0.1, 0],
              x: [0, 50, 120, 250, 400, 550, 700, 800],
              scaleX: [0, 0.5, 1, 1.5, 1.2, 0.8, 0.3, 0]
            }}
            transition={{ 
              duration: 2.5,
              delay: 0.6,
              times: [0, 0.1, 0.25, 0.45, 0.65, 0.8, 0.95, 1]
            }}
            className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-transparent via-gray-400/30 to-transparent"
            style={{ 
              filter: 'blur(0.5px)',
              transformOrigin: 'center center'
            }}
          />

          {/* Curved highlight that follows the fold */}
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0.6, 0.8, 0.6, 0.3, 0.1, 0],
              x: [0, 40, 100, 200, 320, 480, 650, 800],
              scaleY: [0.5, 0.7, 1, 1.3, 1.1, 0.8, 0.5, 0.2]
            }}
            transition={{ 
              duration: 2.5,
              delay: 0.6,
              times: [0, 0.1, 0.25, 0.45, 0.65, 0.8, 0.95, 1]
            }}
            className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-white/80 to-transparent"
            style={{ 
              filter: 'blur(1px)',
              transformOrigin: 'center center'
            }}
          />

          {/* Your exact LoadingScreen content */}
          <motion.div
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

        {/* Back of the page */}
        <div 
          className="absolute inset-0 bg-gray-50 backface-hidden"
          style={{ 
            transform: 'rotateY(180deg)',
            borderRadius: '8px 0 0 8px'
          }}
        />
      </motion.div>

      {/* Curved page curl/wave effect */}
      <motion.div
        initial={{ 
          opacity: 0,
          scaleX: 0,
          rotateY: 0
        }}
        animate={{ 
          opacity: [0, 0.4, 0.7, 0.9, 0.7, 0.4, 0.1, 0],
          scaleX: [0, 0.3, 0.6, 1, 0.8, 0.5, 0.2, 0],
          rotateY: [0, -10, -25, -45, -70, -120, -160, -180],
          x: [0, 15, 40, 80, 120, 180, 250, 320]
        }}
        transition={{ 
          duration: 2.5,
          delay: 0.6,
          times: [0, 0.1, 0.25, 0.45, 0.65, 0.8, 0.95, 1]
        }}
        className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent"
        style={{ 
          transformStyle: 'preserve-3d',
          transformOrigin: 'left center',
          width: '80px',
          left: '0',
          filter: 'blur(8px)'
        }}
      />

      {/* Flowing paper wave effect */}
      <motion.div
        initial={{ 
          opacity: 0,
          rotateY: 0,
          scaleY: 1
        }}
        animate={{ 
          opacity: [0, 0.2, 0.5, 0.7, 0.5, 0.2, 0],
          rotateY: [0, -5, -15, -30, -50, -80, -180],
          scaleY: [1, 1.1, 1.3, 1.5, 1.2, 0.9, 0.5],
          x: [0, 10, 30, 60, 100, 150, 200]
        }}
        transition={{ 
          duration: 2.5,
          delay: 0.6,
          times: [0, 0.1, 0.25, 0.45, 0.65, 0.8, 1],
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white/20 to-transparent"
        style={{ 
          transformOrigin: 'left center',
          filter: 'blur(2px)'
        }}
      />

      {/* Organic drop shadow with curve */}
      <motion.div
        initial={{ 
          opacity: 0,
          x: 0,
          rotateY: 0
        }}
     animate={{ 
  rotateY: [0, 30, 60, 90, 120, 145, 160, 170],
  rotateX: [0, -4, -8, -10, -6, -3, 0, 2],
  z: [0, 30, 60, 90, 120, 140, 160, 180]
}}
  transition={{ 
  duration: 4.2, // slightly longer
  delay: 0.8,
  times: [0, 0.1, 0.25, 0.45, 0.6, 0.75, 0.9, 1],
  ease: "easeInOut"
}}
        className="absolute inset-0 bg-black/40"
        style={{ 
          filter: 'blur(25px)',
          transformOrigin: 'left center',
          zIndex: -1,
          transform: 'translateY(10px)'
        }}
      />

      {/* Ambient lighting with curve effect */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: [1, 0.9, 0.7, 0.5, 0.7, 0.9, 1],
          background: [
            'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(255,248,220,0.1) 0%, transparent 100%)',
            'radial-gradient(ellipse 60% 80% at 30% 50%, rgba(255,248,220,0.2) 0%, transparent 80%)',
            'radial-gradient(ellipse 40% 100% at 50% 50%, rgba(255,248,220,0.3) 0%, transparent 70%)',
            'radial-gradient(ellipse 60% 80% at 70% 50%, rgba(255,248,220,0.2) 0%, transparent 80%)',
            'radial-gradient(ellipse 80% 60% at 80% 50%, rgba(255,248,220,0.1) 0%, transparent 100%)',
            'radial-gradient(ellipse 100% 40% at 90% 50%, rgba(255,248,220,0.05) 0%, transparent 100%)',
            'transparent'
          ]
        }}
        transition={{ 
          duration: 2.5,
          delay: 0.6,
          times: [0, 0.1, 0.25, 0.45, 0.65, 0.8, 1]
        }}
        className="absolute inset-0 pointer-events-none"
      />
    </div>
  );
}