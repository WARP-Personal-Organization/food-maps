import React from 'react';
import { GoArrowRight } from 'react-icons/go';
import { Dish } from '@/lib/dishData';
import DishImage from '../dishes/DishImage';
import FoodPrintsNavbar from '../FoooPrintsNavbar';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const handleWhereToEat = () => {
    if (activeDish.href === '/food-map') {
      router.push(
        `/food-map?dish=${encodeURIComponent(activeDish.name)}&view=map`
      );
    } else {
      router.push(activeDish.href);
    }
  };

  return (
    <div className="lg:hidden flex flex-col h-screen bg-white">
      <section className="fixed top-0 z-30 w-full">
        <FoodPrintsNavbar />
      </section>

      {/* Top Image */}
      <div className="relative h-[45vh] w-full">
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
      <div className="bg-white flex flex-col h-[55vh] p-6 overflow-y-auto">
        {/* Dish Name and Navigation */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeDish.name}
          </h1>

          {/* Chevron Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center focus:outline-none cursor-pointer hover:bg-gray-200 transition-colors"
              aria-label="Previous dish"
            >
              <span className="text-gray-500 text-sm">❮</span>
            </button>
            <button
              onClick={onNext}
              className="h-10 w-10 rounded-full bg-[#F9D408] flex items-center justify-center focus:outline-none cursor-pointer hover:bg-[#E6C207] transition-colors"
              aria-label="Next dish"
            >
              <span className="text-black text-sm">❯</span>
            </button>
          </div>
        </div>

        {/* Tagline */}
        <h3 className="italic text-gray-600 mb-4 text-lg">
          {activeDish.tagline}
        </h3>

        {/* Description */}
        <div className="text-gray-700 mb-6">
          <p className="leading-relaxed">{activeDish.description}</p>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Swipe Indicator */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <p className="flex items-center justify-center text-gray-600 text-sm">
            Swipe to see other Ilonggo top dishes{' '}
            <GoArrowRight className="ml-2" />
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handleWhereToEat}
          className="w-full bg-[#F9D408] text-black font-semibold py-4 rounded-lg text-center inline-block cursor-pointer hover:bg-[#E6C207] transition-colors shadow-sm"
        >
          Where to Eat
        </button>
      </div>
    </div>
  );
};

export default MobileLayout;
