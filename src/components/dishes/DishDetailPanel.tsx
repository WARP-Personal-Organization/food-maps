'use client';

import React from 'react';
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import { Dish } from '@/lib/dishData';

interface DishDetailPanelProps {
  dishes: Dish[];
  activeIndex: number;
  onPrevDish: () => void;
  onNextDish: () => void;
}

const DishDetailPanel: React.FC<DishDetailPanelProps> = ({
  dishes,
  activeIndex,
  onPrevDish,
  onNextDish,
}) => {
  if (!dishes || dishes.length === 0) {
    return <div className="text-gray-500">No dish information available</div>;
  }

  const currentDish = dishes[activeIndex];

  return (
    <>
      <h2 className="italic text-gray-600 text-lg">
        Ilonggo&apos;s Best Dishes
      </h2>
      <h1 className="text-4xl font-bold mt-2">{currentDish.name}</h1>
      <h3 className="italic text-gray-500 text-lg">{currentDish.tagline}</h3>

      {/* Description */}
      <p className="text-gray-700 mt-4">{currentDish.description}</p>

      {/* Navigation Slider */}
      <div className="mt-6 flex items-center gap-4">
        <FaCircleChevronLeft
          className="text-3xl cursor-pointer text-yellow-500"
          onClick={onPrevDish}
        />
        <div className="flex gap-2">
          {dishes.map((_, index) => (
            <span
              key={index}
              className={`h-3 w-3 rounded-full ${
                activeIndex === index ? 'bg-yellow-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <FaCircleChevronRight
          className="text-3xl cursor-pointer text-yellow-500"
          onClick={onNextDish}
        />
      </div>
    </>
  );
};

export default DishDetailPanel;
