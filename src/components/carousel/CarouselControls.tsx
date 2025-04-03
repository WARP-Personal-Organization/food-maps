import React from 'react';
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';

interface CarouselControlsProps {
  activeIndex: number;
  itemsCount: number;
  onNext: () => void;
  onPrev: () => void;
  className?: string;
}

const CarouselControls: React.FC<CarouselControlsProps> = ({
  activeIndex,
  itemsCount,
  onNext,
  onPrev,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <FaCircleChevronLeft
        className="text-3xl cursor-pointer text-[#F9D408]"
        onClick={onPrev}
      />
      <div className="flex gap-2">
        {Array.from({ length: itemsCount }).map((_, index) => (
          <span
            key={index}
            className={`h-3 w-3 rounded-full ${
              activeIndex === index ? 'bg-gray-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <FaCircleChevronRight
        className="text-3xl cursor-pointer text-[#F9D408]"
        onClick={onNext}
      />
    </div>
  );
};

export default CarouselControls;
