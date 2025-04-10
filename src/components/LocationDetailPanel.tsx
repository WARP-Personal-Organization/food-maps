'use client';

import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import { Location } from '@/lib/locationData';

interface LocationDetailPanelProps {
  location: Location | null;
  onClose: () => void;
}

const LocationDetailPanel: React.FC<LocationDetailPanelProps> = ({
  location,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('photos');

  if (!location) return null;

  // Default data if not provided
  const address =
    location.address ||
    'Rizal Street, La Paz Public Market, La Paz, Iloilo City';
  const openHours = location.openHours || '10:00 AM - 9:00 PM';
  const priceRange = location.priceRange || '₱200-400';

  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden w-full max-w-md mx-auto flex flex-col h-full">
      {/* Main image with siopao unwrapped showing filling */}
      <div className="relative h-48 lg:h-52 xl:h-60 w-full bg-amber-100">
        <Image
          src="/images/robertos/r5.jpg"
          alt="Roberto's Siopao Unwrapped"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />

        {/* Close button (X) at top right */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 bg-white rounded-full p-1 shadow-md"
          aria-label="Close details"
        >
          <FaTimes size={16} className="text-gray-700" />
        </button>

        {/* Image indicator dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={index}
              className={`h-1 w-1 rounded-full ${
                index === 0 ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="px-3 lg:px-4 pt-3 lg:pt-4 pb-2">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
          Roberto&apos;s Siopao
        </h2>
      </div>

      {/* Info items with yellow icons */}
      <div className="px-3 lg:px-4 pb-3 space-y-2">
        {/* Location address */}
        <div className="flex items-start gap-2 lg:gap-3">
          <div className="text-yellow-500 mt-1 flex-shrink-0">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="opacity-80"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <p className="text-xs text-gray-600 leading-tight">{address}</p>
        </div>

        {/* Hours */}
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="text-yellow-500 flex-shrink-0">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="opacity-80"
            >
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
          </div>
          <p className="text-xs text-gray-600">{openHours}</p>
        </div>

        {/* Price range */}
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="text-yellow-500 flex-shrink-0">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="opacity-80"
            >
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
          </div>
          <p className="text-xs text-gray-600">{priceRange}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            className={`flex-1 text-center py-2 px-2 lg:px-4 text-sm relative cursor-pointer ${
              activeTab === 'photos'
                ? 'text-gray-800 font-medium'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('photos')}
          >
            Photos
            {activeTab === 'photos' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
            )}
          </button>
          <button
            className={`flex-1 text-center py-2 px-2 lg:px-4 text-sm relative cursor-pointer ${
              activeTab === 'menu'
                ? 'text-gray-800 font-medium'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('menu')}
          >
            Menu
            {activeTab === 'menu' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
            )}
          </button>
        </div>
      </div>

      {/* Photos section */}
      {activeTab === 'photos' && (
        <div className="p-3 lg:p-4">
          <div className="flex items-center text-yellow-500 mb-2">
            <span className="text-xs font-medium">See Photos</span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {/* First photo - larger storefront view */}
            <div className="col-span-1 row-span-2 relative aspect-[1/2] rounded overflow-hidden bg-gray-200">
              <Image
                src="/images/robertos/r1.webp"
                alt="Roberto's Storefront"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Wrapped "Queen" siopao */}
            <div className="col-span-1 relative aspect-square rounded overflow-hidden bg-gray-200">
              <Image
                src="/images/robertos/r2.jpeg"
                alt="Roberto's Queen Siopao Package"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Unwrapped siopao showing filling */}
            <div className="col-span-1 relative aspect-square rounded overflow-hidden bg-gray-200">
              <Image
                src="/images/robertos/r3.jpg"
                alt="Roberto's Siopao Filling"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Street view with siopao wrapper */}
            <div className="col-span-2 relative aspect-[2/1] rounded overflow-hidden bg-gray-200">
              <Image
                src="/images/robertos/r4.jpg"
                alt="Roberto's Siopao Street View"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Menu section (empty for now) */}
      {activeTab === 'menu' && (
        <div className="p-3 lg:p-4">
          <p className="text-gray-500 text-center py-4 text-sm">
            Menu information not available
          </p>
        </div>
      )}

      {/* Get Directions button */}
      <div className="mt-auto p-3 lg:p-4 pb-4 lg:pb-5">
        <button className="w-full bg-yellow-500 text-white py-2.5 lg:py-3 font-medium rounded-md flex items-center justify-center">
          <svg
            className="mr-2"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22.43 10.59l-9.01-9.01c-.75-.75-2.07-.76-2.83 0l-9 9c-.78.78-.78 2.04 0 2.82l9 9c.39.39.9.58 1.41.58.51 0 1.02-.19 1.41-.58l8.99-8.99c.79-.76.8-2.02.03-2.82zm-10.42 10.4l-9-9 9-9 9 9-9 9z" />
            <path d="M8 11v4h2v-3h4v2.5l3.5-3.5L14 7.5V10H9c-.55 0-1 .45-1 1z" />
          </svg>
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default LocationDetailPanel;
