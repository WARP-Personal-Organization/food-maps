'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Location } from '@/types/types';
import CloseButton from '@/components/buttons/CloseButton';
import GetDirectionsButton from '@/components/buttons/GetDirectionsButton';

interface LocationDetailPanelProps {
  location: Location | null;
  isVisible: boolean;
  onClose: () => void;
}

const LocationDetailPanel: React.FC<LocationDetailPanelProps> = ({
  location,
  isVisible,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('photos');

  if (!location) return null;

  // Default data if not provided
  const address = location.address || 'Molo District, Iloilo City';
  const openHours = location.openHours || '10:00 AM - 7:00 PM';
  const priceRange = location.priceRange || '₱100-200';

  return (
    <div
      className={`fixed top-0 left-0 w-[300px] min-w-[300px] md:w-[320px] lg:w-[350px] xl:w-[400px] h-full bg-white shadow-lg z-30 overflow-y-scroll transform transition-transform duration-300 
        ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Main image - Adjusted height */}
      <div className="relative h-[30vh] w-full">
        <div className="rounded-t-xl overflow-hidden h-full w-full">
          <Image
            src={location.photos?.[0] || '/images/robertos/r5.jpg'}
            alt={`${location.name} Image`}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        {/* Close button (X) at top right */}
        <CloseButton onClick={onClose} className="absolute top-4 right-4" />

        {/* Image indicator dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1 md:bottom-4 2xl:gap-2 2xl:bottom-8">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`h-1 w-1 rounded-full ${
                index === 0 ? 'bg-white' : 'bg-white/40'
              } md:h-1 md:w-1 2xl:h-2 2xl:w-2`}
            />
          ))}
        </div>
      </div>

      {/* NEW DIV WRAPPER START */}
      <div className="rounded-t-sm -mt-2 relative z-10 bg-white">
        {/* Title and Info Section - more padding and larger text on bigger screens */}
        <div className="px-6 pt-6 pb-4 md:px-4 md:pt-4 md:pb-3 lg:px-6 lg:pt-5 lg:pb-3 xl:px-8 xl:pt-6 xl:pb-4 2xl:px-10 2xl:pt-8 2xl:pb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:text-2xl md:mb-3 lg:text-2xl lg:mb-2 xl:text-3xl xl:mb-4 2xl:text-5xl 2xl:mb-6 font-serif">
            {location.name}
          </h2>

          {/* Location address */}
          <div className="flex items-start gap-3 mb-2 md:gap-2 md:mb-1.5 lg:gap-2 lg:mb-1.5 xl:gap-3 xl:mb-2.5 2xl:mb-4 2xl:gap-4">
            <div className="text-yellow-500 flex-shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:scale-125"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 leading-tight md:text-xs lg:text-[10px] xl:text-sm 2xl:text-lg font-medium">
              {address}
            </p>
          </div>

          {/* Hours */}
          <div className="flex items-center gap-3 mb-2 md:gap-2 md:mb-1.5 lg:gap-2 lg:mb-1.5 xl:gap-3 xl:mb-2.5 2xl:mb-4 2xl:gap-4">
            <div className="text-yellow-500 flex-shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:scale-125"
              >
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 md:text-xs lg:text-xs xl:text-sm 2xl:text-lg font-medium">
              {openHours}
            </p>
          </div>

          {/* Price range */}
          <div className="flex items-center gap-3 md:gap-2 lg:gap-2 xl:gap-3 2xl:gap-4">
            <div className="text-yellow-500 flex-shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:scale-125"
              >
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 md:text-xs lg:text-xs xl:text-sm 2xl:text-lg font-medium">
              {priceRange}
            </p>
          </div>
        </div>
      </div>
      {/* NEW DIV WRAPPER END */}

      {/* Tabs - larger text and padding for bigger screens */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            className={`flex-1 text-center py-3 text-base relative cursor-pointer ${
              activeTab === 'photos'
                ? 'text-gray-800 font-bold'
                : 'text-gray-400 font bold'
            } md:py-2 md:text-sm lg:py-2 lg:text-sm xl:py-3 xl:text-base 2xl:py-5 2xl:text-xl`}
            onClick={() => setActiveTab('photos')}
          >
            Photos
            {activeTab === 'photos' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 md:h-0.5 lg:h-0.5 xl:h-0.75 2xl:h-1.5"></div>
            )}
          </button>
          <button
            className={`flex-1 text-center py-3 text-base relative cursor-pointer ${
              activeTab === 'menu'
                ? 'text-gray-800 font-bold'
                : 'text-gray-400 font-bold'
            } md:py-2 md:text-sm lg:py-2 lg:text-sm xl:py-3 xl:text-base 2xl:py-5 2xl:text-xl`}
            onClick={() => setActiveTab('menu')}
          >
            Menu
            {activeTab === 'menu' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 md:h-0.5 lg:h-0.5 xl:h-0.75 2xl:h-1.5"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tab content container - consistent sizing for both tabs */}
      <div className="h-[350px] overflow-y-auto md:h-[300px] lg:h-[320px] xl:h-[400px] 2xl:h-[500px]">
        {/* Photos section */}
        {activeTab === 'photos' && (
          <div className="p-4 md:p-3 lg:p-4 xl:p-5 2xl:p-8">
            <p className="text-gray-400 mb-3 md:text-xs md:mb-2 lg:text-xs lg:mb-2 xl:text-sm xl:mb-3 2xl:text-xl 2xl:mb-5">
              See Photos
            </p>
            <div className="grid grid-cols-3 gap-2 md:gap-1.5 lg:gap-2 xl:gap-3 2xl:gap-4">
              <div className="col-span-1 row-span-2 relative rounded overflow-hidden bg-gray-200">
                <div className="aspect-square h-full">
                  <Image
                    src="/images/robertos/r2.jpeg"
                    alt={`${location.name} Interior`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className="col-span-1 relative rounded overflow-hidden bg-gray-200">
                <div className="aspect-square">
                  <Image
                    src="/images/robertos/r3.jpg"
                    alt={`${location.name} Sign`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className="col-span-1 relative rounded overflow-hidden bg-gray-200">
                <div className="aspect-square">
                  <Image
                    src="/images/robertos/r4.jpg"
                    alt={`${location.name} Product`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className="col-span-1 relative rounded overflow-hidden bg-gray-200">
                <div className="aspect-square">
                  <Image
                    src="/images/robertos/r1.webp"
                    alt={`${location.name} Ingredients`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className="col-span-1 relative rounded overflow-hidden bg-gray-200">
                <div className="aspect-square">
                  <Image
                    src="/images/robertos/r5.jpg"
                    alt={`${location.name} Close-up`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu section - exactly matching structure to Photos */}
        {activeTab === 'menu' && (
          <div className="p-4 md:p-3 lg:p-4 xl:p-5 2xl:p-8">
            <p className="text-gray-400 mb-3 md:text-xs md:mb-2 lg:text-xs lg:mb-2 xl:text-sm xl:mb-3 2xl:text-xl 2xl:mb-5">
              Menu
            </p>
            <div className="flex items-center justify-center h-[250px] md:h-[210px] lg:h-[230px] xl:h-[300px] 2xl:h-[370px]">
              <p className="text-gray-500 text-sm md:text-xs lg:text-xs xl:text-sm 2xl:text-lg">
                Menu information not available
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons with fade-out effect - improved sizing for larger screens */}
      <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-20 pb-0 p-5 md:pt-16 md:p-3 lg:pt-18 lg:p-4 xl:pt-24 xl:p-5 2xl:pt-28 2xl:p-6">
       <GetDirectionsButton className="w-full bg-yellow-300 p-2" onClick={() => window.open(location.mapLink, '_blank')}/>
      </div>
    </div>
  );
};

export default LocationDetailPanel;
