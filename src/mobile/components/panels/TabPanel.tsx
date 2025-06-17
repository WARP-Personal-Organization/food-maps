'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface FoodPrintTabsProps {
  photos?: string[];
  menuItems?: string[];
  reviewItems?: string;
}

const FoodPrintTabs: React.FC<FoodPrintTabsProps> = ({
  photos = [],
  menuItems = [],

}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'menu' >('photos');

  return (
    <div className="w-full">
      {/* Tab Switcher */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`flex-1 text-center py-2 font-semibold ${
            activeTab === 'photos'
              ? 'border-b-4 border-yellow-400 text-yellow-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('photos')}
        >
          Photos
        </button>
        <button
          className={`flex-1 text-center py-2 font-semibold ${
            activeTab === 'menu'
              ? 'border-b-4 border-yellow-400 text-yellow-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('menu')}
        >
          Menu
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'photos' && (
        <div className="grid grid-cols-2 gap-2 mb-6">
          {photos.length > 0 ? (
            photos.map((url, idx) => (
              <div key={idx} className="relative w-full h-32 rounded overflow-hidden">
                <Image src={url} alt={`Photo ${idx + 1}`} fill className="object-cover" />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No photos available.</p>
          )}
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="mb-6">
          {menuItems.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {menuItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No menu available.</p>
          )}
        </div>
      )}

    </div>
  );
};

export default FoodPrintTabs;
