import React from 'react';
import Image from 'next/image';

const LocationActionButtons: React.FC = () => {
  return (
    <div className="w-full">
      {/* Order and Book buttons */}
      <div className="grid grid-cols-2 gap-3 m-1">
        <button className="cursor-pointer transform hover:scale-105 transition-transform">
          <Image
            src="/order-now-grab.svg"
            alt="Order Now with Grab"
            width={200}
            height={60}
            className="w-full h-auto min-[900px]:scale-110"
            priority
          />
        </button>

        <button className="cursor-pointer transform hover:scale-105 transition-transform">
          <Image
            src="/book-grabcar.svg"
            alt="Book GrabCar"
            width={200}
            height={60}
            className="w-full h-auto min-[900px]:scale-110"
            priority
          />
        </button>
      </div>

      {/* Get Directions button */}
      <div>
        <button className="w-full py-2 min-[900px]:py-2.5 bg-yellow-400 text-black text-sm min-[900px]:text-base font-medium rounded flex items-center justify-center hover:bg-yellow-500 transition-colors">
          <svg
            className="mr-2 w-4 h-4 min-[900px]:w-5 min-[900px]:h-5"
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

export default LocationActionButtons;
