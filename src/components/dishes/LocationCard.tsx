'use client';

import React from 'react';

interface LocationCardProps {
  name: string;
  image: string;
  location: string;
  duration: string;
  rating: number;
  tags: string[];
}

const LocationCard: React.FC<LocationCardProps> = ({
  name,
  image,
  location,
  duration,
  rating,
  tags,
}) => {
  return (
    <div className="mb-4 mx-6 bg-gray-50 rounded-xl shadow-sm border border-gray-100 cursor-pointer">
      <div className="p-4">
        <div className="flex">
          <div className="h-16 w-16 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/filter-dish/siopao.png'; // Fallback image
              }}
            />
          </div>
          <div className="ml-4 flex-grow">
            <div className="flex justify-between">
              <h3 className="font-medium text-gray-900">{name}</h3>
              <div className="flex items-center">
                <span className="text-sm">{rating}</span>
                <span className="text-yellow-400 ml-1">★</span>
              </div>
            </div>
            <div className="flex items-center mt-1">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <span className="text-xs text-gray-500 ml-1">
                {location} • {duration}
              </span>
            </div>
            <div className="flex mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={`bg-yellow-300 text-xs px-3 py-1 rounded-full text-gray-800 ${
                    index < tags.length - 1 ? 'mr-2' : ''
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
