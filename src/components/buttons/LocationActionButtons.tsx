import React from 'react';
import GetDirectionsButton from '@/components/buttons/GetDirectionsButton';

const LocationActionButtons: React.FC = () => {
  return (
    <div className="w-full">
      <div>
        <GetDirectionsButton className="w-full bg-yellow-300 p-2"/>
      </div>
      <div className='pb-3'></div>
    </div>
  );
};

export default LocationActionButtons;
