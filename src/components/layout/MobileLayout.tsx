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
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  dishes,
  activeIndex,
  handleTouchStart,
  handleTouchEnd,
}) => {
  const activeDish = dishes[activeIndex];

  return (
    <div className="lg:hidden flex flex-col h-screen">
      <section className="fixed top-0 z-50 w-full">
        <FoodPrintsNavbar />
      </section>

      {/* Top Image (40% height) */}
      <DishImage
        dish={activeDish}
        className="relative h-[40vh] w-full"
        imageClassName="z-10"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        priority
      />

      {/* Bottom Content (60% height) */}
      <div className="bg-white flex flex-col justify-between p-6 h-[60vh]">
        {/* Dish Name */}
        <h1 className="text-2xl font-bold text-center">{activeDish.name}</h1>

        {/* Tagline */}
        <h3 className="italic text-gray-600 text-center">
          {activeDish.tagline}
        </h3>

        {/* Description */}
        <p className="text-gray-700">{activeDish.description}</p>

        {/* Swipe Indicator */}
        <div className="border-t pt-4">
          <p className="flex items-center justify-center text-gray-600">
            Swipe to see other Ilonggo top dishes{' '}
            <GoArrowRight className="ml-2" />
          </p>
        </div>

        {/* Button */}
        <Link
          href="/food-map"
          className="w-[100%] bg-yellow-300 text-black font-bold py-3 rounded mx-auto text-center inline-block cursor-pointer"
        >
          Where to Eat
        </Link>
      </div>
    </div>
  );
};

export default MobileLayout;
