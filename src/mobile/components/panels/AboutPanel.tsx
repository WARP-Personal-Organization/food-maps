'use client';

import React from 'react';
import Image from 'next/image';

interface AboutPanelProps {
  onClose: () => void;
  isVisible: boolean;
}

const AboutPanel: React.FC<AboutPanelProps> = ({ onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80">
      <div className="relative bg-white w-full h-screen flex flex-col">
        {/* Header with Logo and Close Button */}
        <div className="flex items-center justify-between px-6 py-4 bg-white">
          <div className="flex items-center">
            <Image
              src="/about-page/dg-logo.png"
              alt="Daily Guardian Logo"
              width={120}
              height={44}
              className="object-contain"
            />
          </div>
          <button
            onClick={onClose}
            className="bg-yellow-300 rounded-md w-8 h-8 flex items-center justify-center text-xl font-bold cursor-pointer"
            aria-label="Close panel"
            tabIndex={0}
          >
            ×
          </button>
        </div>

        {/* Main content container */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Food Banner Image */}
          <div className="w-full relative" style={{ height: '28vh' }}>
            <Image
              src="/about-page/dg-about-image.png"
              alt="Filipino food showcase"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* About Content */}
          <div className="flex-1 flex flex-col items-center justify-between py-6 px-4">
            <div className="w-full flex flex-col items-center">
              <div className="bg-yellow-300 px-6 py-1 rounded text-center font-bold text-sm mb-6">
                ABOUT US
              </div>

              {/* Text content */}
              <div className="w-full max-w-3xl px-4">
                <p className="text-center text-xs sm:text-sm mb-4">
                  Roberto&apos;s Siopao is an iconic delicacy from Iloilo City,
                  known for its generous size, flavorful fillings, and unique,
                  homemade taste. A must-visit spot for both locals and
                  tourists, Roberto&apos;s has built a strong reputation over
                  the decades for serving siopao that&apos;s packed with a rich
                  combination of ingredients — from savory pork and chicken to
                  Chinese sausage and hard-boiled egg.
                </p>

                <p className="text-center text-xs sm:text-sm">
                  Their famous &quot;Queen Siopao&quot; stands out as the
                  ultimate indulgence, stuffed with a hefty portion of meat,
                  sausage, and egg, making it a satisfying meal on its own.
                  Unlike many siopaos that focus on fluffy buns with minimal
                  filling, Roberto&apos;s ensures each bite is a perfect balance
                  of soft, steamed dough and savory goodness.
                </p>
              </div>
            </div>

            {/* Partners Section */}
            <div className="w-full mt-10">
              <h2 className="font-bold text-center text-base mb-4">Partners</h2>

              <div className="flex justify-center flex-wrap gap-5 w-full mx-auto">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center"
                  >
                    {/* Empty circle as shown in the image */}
                  </div>
                ))}
              </div>

              {/* Extra bottom space */}
              <div className="h-10 sm:h-12"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPanel;
