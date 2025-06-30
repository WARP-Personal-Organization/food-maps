'use client';

import React from 'react';
import Image from 'next/image';
import { X, Users, Award, MapPin, Heart } from 'lucide-react';

interface AboutPanelProps {
  onClose: () => void;
  isVisible: boolean;
}

const AboutPanel: React.FC<AboutPanelProps> = ({ onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-white to-yellow-50 w-full h-screen flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-white border-b-4 border-yellow-300 shadow-sm">
          <div className="flex items-center gap-4">
            <Image
              src="/images/about-page/dg-logo.png"
              alt="Daily Guardian Logo"
              width={120}
              height={44}
              className="object-contain sm:w-[140px] sm:h-[52px]"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">About FoodPrints</h1>
              <p className="text-sm text-gray-600">Discover Local Flavors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 group"
            aria-label="Close panel"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Main content container */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
          {/* Food Banner Image - Fixed Height to Ensure Visibility */}
          <div className="w-full lg:w-1/2 relative" style={{ height: window.innerWidth >= 1024 ? '100%' : '28vh', minHeight: '280px' }}>
            <Image
              src="/images/about-page/dg-about-image.png"
              alt="Filipino food showcase"
              fill
              className="object-cover"
              priority
            />
            {/* Subtle gradient overlay for stats readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            
            {/* Floating stats on image */}
            <div className="absolute bottom-4 left-4 right-4 lg:bottom-8 lg:left-8">
              
            </div>
          </div>

          {/* Content Panel - Responsive */}
          <div className="flex-1 lg:w-1/2 flex flex-col justify-between py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex-1">
              {/* About Badge */}
              <div className="flex justify-center lg:justify-start mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-2 rounded-full text-center font-bold text-sm sm:text-base text-gray-900 shadow-lg">
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    ABOUT FOODPRINTS
                  </span>
                </div>
              </div>

              {/* Enhanced Text content */}
              <div className="w-full max-w-2xl mx-auto lg:mx-0 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-yellow-500" />
                    Discover Iloilo&apos;s Culinary Heritage
                  </h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    FoodPrints is your gateway to discovering authentic Ilonggo cuisine. From Roberto&apos;s legendary siopao to hidden gems in La Paz market, we map out the rich culinary heritage that makes Iloilo City a food destination worth exploring.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Our Mission
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    We believe every dish tells a story, and every location holds memories. Our mission is to connect food lovers with authentic local flavors, supporting community businesses while preserving Iloilo&apos;s culinary traditions for future generations.
                  </p>
                </div>

                {/* Feature highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Interactive Mapping</h4>
                    <p className="text-sm text-gray-600">Precise locations with detailed information</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Community Reviews</h4>
                    <p className="text-sm text-gray-600">Authentic experiences from locals</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Partners Section */}
            <div className="w-full mt-8 lg:mt-12">
              <div className="text-center lg:text-left mb-6">
                <h2 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 flex items-center justify-center lg:justify-start gap-2">
                  <Users className="w-5 h-5 text-yellow-500" />
                  Our Partners
                </h2>
                <p className="text-sm text-gray-600">Supporting local food businesses and communities</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100">
                <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6 gap-4 justify-items-center">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-yellow-300"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-yellow-600">{idx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
                  Partnering with local restaurants, markets, and food communities
                </p>
              </div>

              {/* Call to action */}
              {/* <div className="mt-6 text-center lg:text-left">
                <p className="text-sm text-gray-600 mb-3">
                  Want to partner with us? Let&apos;s preserve Iloilo&apos;s food heritage together.
                </p>
                <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold py-2 px-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                  Get in Touch
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPanel;