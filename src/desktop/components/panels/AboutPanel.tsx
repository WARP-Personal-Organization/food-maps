'use client';

import React from 'react';
import Image from 'next/image';
import { Target, Users } from 'lucide-react';

interface AboutPanelProps {
  onClose: () => void;
  isVisible: boolean;
}

const AboutPanel: React.FC<AboutPanelProps> = ({ onClose, isVisible }) => {
  if (!isVisible) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80">
      <div className="relative bg-white w-full h-screen flex flex-col overflow-hidden">
        {/* Header with Logo and Close Button */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center">
            <Image
              src="/images/about-page/dg-logo.png"
              alt="Daily Guardian Logo"
              width={140}
              height={42}
              className="object-contain"
            />
          </div>
          <button
            onClick={onClose}
            className="bg-yellow-400 hover:bg-yellow-500 rounded-lg w-10 h-10 flex items-center justify-center text-xl font-bold cursor-pointer transition-colors duration-200"
            aria-label="Close panel"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            ×
          </button>
        </div>

        {/* Main content container - scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Food Banner Image */}
          <div className="w-full h-[240px] relative shrink-0">
            <Image
              src="/images/about-page/dg-about-image.png"
              alt="Filipino food showcase"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content Container */}
          <div className="px-6 py-8 max-w-4xl mx-auto">
            {/* About FoodPrints Badge */}
            <div className="flex justify-center mb-8">
              <div className="bg-yellow-400 px-6 py-2 rounded-full">
                <span className="font-bold text-sm uppercase tracking-wide">
                  🍴 ABOUT FOODPRINTS
                </span>
              </div>
            </div>

            {/* Main Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Discover Iloilo&apos;s Culinary Heritage
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                Join FoodPrints in your journey to discovering authentic Ilonggo cuisine. From Roberto&apos;s legendary siopao to hidden gems in La Paz Market, we map out the rich culinary heritage that makes Iloilo City a food destination worth exploring.
              </p>
            </div>

            {/* Our Mission Section */}
            <div className="mb-12">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <Target className="w-4 h-4 text-black" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed ml-11">
                We believe every dish tells a story, and every location holds memories. Our mission is to connect food lovers with authentic experiences by supporting community businesses while preserving Iloilo&apos;s culinary traditions for future generations.
              </p>
            </div>

            {/* Features Grid */}


            {/* Partners Section */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-black" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Our Partners</h2>
              </div>
              
              <p className="text-gray-600 mb-8 text-sm">
                Supporting local food businesses and communities
              </p>

              {/* Partner Circles */}
              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-yellow-100 border-2 border-yellow-200 rounded-full w-20 h-20 flex items-center justify-center hover:bg-yellow-200 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-yellow-300 rounded-full opacity-50"></div>
                  </div>
                ))}
              </div>

              <p className="text-gray-500 text-xs italic">
                Partnering with local restaurants, markets, and food communities
              </p>
            </div>

            {/* Bottom Spacing */}
            <div className="h-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPanel;