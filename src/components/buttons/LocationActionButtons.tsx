import React from 'react';
import Image from 'next/image';
import GetDirectionsButton from '@/components/buttons/GetDirectionsButton';

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
        <GetDirectionsButton className="w-full bg-yellow-300 p-2"/>
      </div>
      <div className='pb-3'></div>
    </div>
  );
};

export default LocationActionButtons;
