import React from 'react';
import { Dish } from '@/lib/dishData';
import DishContent from '../components/dishes/DishContent';
import DishImage from '../components/dishes/DishImage';
import CarouselControls from '../components/carousel/CarouselControls';

interface DesktopLayoutProps {
  dishes: Dish[];
  activeIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  dishes,
  activeIndex,
  onNext,
  onPrev,
}) => {
  const activeDish = dishes[activeIndex];

  return (
    <div className="hidden min-[900px]:flex h-screen w-full bg-white">
      {/* Left Side - Text Content (30% Width) */}
      <div className="w-[30%] flex flex-col justify-center items-center p-10">
        <h2 className="italic text-gray-600 text-lg">
          Ilonggo&apos;s Best Dishes
        </h2>

        <DishContent
          dish={activeDish}
          headingClassName="text-4xl font-bold mt-2"
          taglineClassName="italic text-gray-500 text-lg"
          descriptionClassName="text-gray-700 mt-4"
          buttonClassName="mt-6 w-[345px] bg-[#F9D408] text-black font-bold py-3 rounded inline-block text-center cursor-pointer"
        />

        {/* Navigation Slider */}
        <CarouselControls
          activeIndex={activeIndex}
          itemsCount={dishes.length}
          onNext={onNext}
          onPrev={onPrev}
          className="mt-6"
        />
      </div>

      {/* Right Side - Full Image (70% Width) */}
      <DishImage
        dish={activeDish}
        className="w-[70%] relative h-full"
        priority
      />
    </div>
  );
};

export default DesktopLayout;
