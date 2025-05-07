import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
      {/* Left arrow button with accessible features */}
      <button
        onClick={onPrev}
        aria-label="Previous slide"
        tabIndex={0}
        className="focus:outline-none rounded-full w-10 h-10 flex items-center justify-center bg-[#F9D408]"
        onKeyDown={(e) => e.key === 'Enter' && onPrev()}
      >
        <FaChevronLeft className="text-sm cursor-pointer text-black" />
      </button>

      {/* Dot indicators */}
      <div className="flex gap-2 mx-1">
        {Array.from({ length: itemsCount }).map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full ${
              activeIndex === index ? 'bg-gray-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Right arrow button with accessible features */}
      <button
        onClick={onNext}
        aria-label="Next slide"
        tabIndex={0}
        className="focus:outline-none rounded-full w-10 h-10 flex items-center justify-center bg-[#F9D408]"
        onKeyDown={(e) => e.key === 'Enter' && onNext()}
      >
        <FaChevronRight className="text-sm cursor-pointer text-black" />
      </button>
    </div>
  );
};

export default CarouselControls;
