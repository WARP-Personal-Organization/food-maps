'use client';

import React from 'react';
import Image from 'next/image';

interface AboutPanelProps {
  onClose: () => void;
  isVisible: boolean;
}

const AboutPanel: React.FC<AboutPanelProps> = ({ onClose, isVisible }) => {
  if (!isVisible) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80">
      <div className="relative bg-white w-full h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-white shrink-0">
          <Image
            src="/images/about-page/dg-logo.png"
            alt="Daily Guardian Logo"
            width={130}
            height={40}
            className="object-contain"
          />
          <button
            onClick={onClose}
            onKeyDown={handleKeyDown}
            className="bg-yellow-300 rounded-md w-8 h-8 flex items-center justify-center text-xl font-bold cursor-pointer"
            aria-label="Close panel"
            tabIndex={0}
          >
            ×
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Banner */}
          <div className="w-full h-[20vh] sm:h-[25vh] md:h-[28vh] relative shrink-0">
            <Image
              src="/images/about-page/dg-about-image.png"
              alt="Filipino food showcase"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="flex flex-col items-center justify-between flex-1 px-4 py-4 md:py-6 overflow-auto">
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
              <div className="bg-yellow-300 w-28 h-8 md:w-32 md:h-9 rounded flex items-center justify-center text-center font-bold text-sm mb-4 md:mb-6">
                ABOUT US
              </div>

              <div className="w-full max-w-3xl px-2 md:px-4">
                <p className="text-center text-xs sm:text-sm md:text-base mb-4">
                  Roberto&apos;s Siopao is an iconic delicacy from Iloilo City,
                  known for its generous size, flavorful fillings, and unique,
                  homemade taste. A must-visit spot for both locals and tourists,
                  Roberto&apos;s has built a strong reputation over the decades
                  for serving siopao that&apos;s packed with a rich combination
                  of ingredients — from savory pork and chicken to Chinese sausage
                  and hard-boiled egg.
                </p>
                <p className="text-center text-xs sm:text-sm md:text-base mb-4">
                  Their famous &quot;Queen Siopao&quot; stands out as the ultimate
                  indulgence, stuffed with a hefty portion of meat, sausage, and
                  egg, making it a satisfying meal on its own. Unlike many siopaos
                  that focus on fluffy buns with minimal filling, Roberto&apos;s
                  ensures each bite is a perfect balance of soft, steamed dough
                  and savory goodness.
                </p>
              </div>
            </div>

            {/* Partners */}
            <div className="w-full mt-6 md:mt-8">
              <h2 className="font-bold text-center text-base md:text-lg mb-4">
                Partners
              </h2>
              <div className="flex justify-center flex-wrap gap-5 md:gap-8 w-full max-w-2xl mx-auto">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 rounded-full w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center"
                  >
                    {/* Placeholder */}
                  </div>
                ))}
              </div>
            </div>

            <div className="h-10 md:h-12 lg:h-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPanel;
