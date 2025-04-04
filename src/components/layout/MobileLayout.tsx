import React from 'react';
import Link from 'next/link';
import { GoArrowRight } from 'react-icons/go';
import { Dish } from '@/lib/dishData';
import DishImage from '../dishes/DishImage';
import FoodPrintsNavbar from '../FoooPrintsNavbar';

interface MobileLayoutProps {
  dishes: Dish[];
  activeIndex: number;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  dishes,
  activeIndex,
  handleTouchStart,
  handleTouchEnd,
  onNext,
  onPrev,
}) => {
  const activeDish = dishes[activeIndex];

  return (
    <div className="lg:hidden flex flex-col h-screen">
      <section className="fixed top-0 z-50 w-full">
        <FoodPrintsNavbar />
      </section>

      {/* Top Image */}
      <div className="relative h-[40vh] w-full">
        <DishImage
          dish={activeDish}
          className="relative h-full w-full"
          imageClassName="z-10"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          priority
        />
      </div>

      {/* Bottom Content */}
      <div className="bg-white flex flex-col h-[60vh] p-6">
        {/* Dish Name and Navigation */}
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-4xl font-bold">{activeDish.name}</h1>

          {/* Chevron Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center focus:outline-none cursor-pointer"
              aria-label="Previous dish"
            >
              <span className="text-gray-500 text-sm">❮</span>
            </button>
            <button
              onClick={onNext}
              className="h-10 w-10 rounded-full bg-[#F9D408] flex items-center justify-center focus:outline-none cursor-pointer"
              aria-label="Next dish"
            >
              <span className="text-black text-sm">❯</span>
            </button>
          </div>
        </div>

        {/* Tagline */}
        <h3 className="italic text-gray-600 mb-6">{activeDish.tagline}</h3>

        {/* Description */}
        <div className="text-gray-700">
          <p>{activeDish.description}</p>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Swipe Indicator */}
        <div className="border-t pt-4 mb-4">
          <p className="flex items-center justify-center text-gray-600">
            Swipe to see other Ilonggo top dishes{' '}
            <GoArrowRight className="ml-2" />
          </p>
        </div>

        {/* Button */}
        <Link
          href={activeDish.href}
          className="w-full bg-[#F9D408] text-black font-semibold py-4 rounded text-center inline-block cursor-pointer"
        >
          Where to Eat
        </Link>
      </div>
    </div>
  );
};

export default MobileLayout;
