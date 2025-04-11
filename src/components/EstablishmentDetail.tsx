import React, { useState } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import {
  IoTimeOutline,
  IoLocationOutline,
  IoPricetagOutline,
} from 'react-icons/io5';

interface EstablishmentDetailProps {
  onClose: () => void;
}

const EstablishmentDetail: React.FC<EstablishmentDetailProps> = ({
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('Photos');

  // Hardcoded details for Deco's to match the image
  const name = "Deco's";
  const address = 'Iznart Street, Iloilo City';
  const hours = '8:00 AM - 8:00 PM';
  const price = '₱150-300';

  // Sample images of Roberto's that we'll use since we don't have Deco's images
  const images = [
    '/images/robertos/r5.jpg',
    '/images/robertos/r1.webp',
    '/images/robertos/r3.jpg',
    '/images/robertos/r4.jpg',
    '/images/robertos/r2.jpeg',
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden"
      style={{ maxWidth: '1920px', maxHeight: '1080px', margin: '0 auto' }}
    >
      {/* Modal Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 bg-white rounded-full p-3 shadow-md"
        aria-label="Close"
      >
        <FaTimes className="text-gray-700" size={24} />
      </button>

      {/* Main Image */}
      <div className="relative w-full h-[500px]">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 to-black/40"></div>
        <Image
          src={images[0]}
          alt={`${name} featured image`}
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />

        {/* Photo indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full ${
                i === 0 ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Establishment Details */}
        <div className="p-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">{name}</h1>

          <div className="space-y-4">
            {/* Location */}
            <div className="flex items-center gap-4">
              <div className="text-yellow-500">
                <IoLocationOutline size={28} />
              </div>
              <p className="text-gray-600 text-xl">{address}</p>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-4">
              <div className="text-yellow-500">
                <IoTimeOutline size={28} />
              </div>
              <p className="text-gray-600 text-xl">{hours}</p>
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-4">
              <div className="text-yellow-500">
                <IoPricetagOutline size={28} />
              </div>
              <p className="text-gray-600 text-xl">{price}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex text-center px-8">
            <button
              className={`py-5 mr-12 text-xl font-medium relative ${
                activeTab === 'Photos' ? 'text-gray-800' : 'text-gray-400'
              }`}
              onClick={() => setActiveTab('Photos')}
            >
              Photos
              {activeTab === 'Photos' && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-yellow-400 rounded-t"></div>
              )}
            </button>
            <button
              className={`py-5 text-xl font-medium relative ${
                activeTab === 'Menu' ? 'text-gray-800' : 'text-gray-400'
              }`}
              onClick={() => setActiveTab('Menu')}
            >
              Menu
              {activeTab === 'Menu' && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-yellow-400 rounded-t"></div>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'Photos' && (
            <div className="p-8">
              <p className="text-gray-400 text-xl mb-5">See Photos</p>
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`overflow-hidden rounded-md ${
                      index === 0 ? 'col-span-1 row-span-2' : 'col-span-1'
                    }`}
                  >
                    <div
                      className={`${
                        index === 0 ? 'aspect-[1/2]' : 'aspect-square'
                      } relative`}
                    >
                      <Image
                        src={image}
                        alt={`${name} image ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Menu' && (
            <div className="p-8 flex items-center justify-center h-full">
              <p className="text-gray-500 text-center text-xl">
                Menu information not available
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 p-6">
          {/* Order and Book buttons */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button className="h-16 w-full flex items-center justify-center relative overflow-hidden bg-[#00B14F] text-white rounded-md text-lg font-medium">
              Order Now with Grab
            </button>
            <button className="h-16 w-full bg-white border border-gray-300 rounded-md flex items-center justify-center text-gray-700 text-lg font-medium">
              Book GrabCar
            </button>
          </div>

          {/* Get Directions button */}
          <button className="h-16 w-full bg-yellow-400 text-gray-800 font-medium rounded-md flex items-center justify-center text-lg">
            <svg
              className="mr-3 w-6 h-6"
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
    </div>
  );
};

export default EstablishmentDetail;
