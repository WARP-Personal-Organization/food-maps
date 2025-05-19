'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Dish } from '@/types/types';
import { useRouter } from 'next/navigation';
import MenuButton from '@/components/buttons/MenuButton';

interface HomePanelProps {
  dishes: Dish[];
  isVisible: boolean;
  openMenu: () => void;
  onClose: () => void;
}

const HomePanel: React.FC<HomePanelProps> = ({
  dishes,
  isVisible,
  openMenu,
  onClose,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDish = dishes[activeIndex] ?? dishes[0];
  const router = useRouter();

  if (!isVisible || dishes.length === 0) return null;

  const onNext = () => {
    setActiveIndex((prev) => (prev + 1) % dishes.length);
  };

  const onPrev = () => {
    setActiveIndex((prev) => (prev - 1 + dishes.length) % dishes.length);
  };

  const handleWhereToEat = () => {
    if (activeDish.href === '/') {
      router.push(`/?dish=${encodeURIComponent(activeDish.name)}&view=map`);
    } else {
      router.push(activeDish.href);
    }
    onClose();
  };

  return (
    <div
      className={`fixed flex h-full w-full bg-white shadow-lg z-45 transform transition-transform duration-300 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <MenuButton onClick={openMenu} />

      <div className="w-[40%] min-[1200px]:w-[35%] 2xl:w-[30%] h-full relative flex flex-col">
        {/* Main content container with overflow handling */}
        <div className="h-full flex flex-col px-8 md:px-10 lg:px-12 2xl:px-16 pt-10 2xl:pt-16 pb-32 relative">
          {/* Logo */}
          <div className="mb-6 2xl:mb-24">
            <Image
              src="/foodprints-home-logo.png"
              alt="FoodPrints Logo"
              width={180}
              height={50}
              priority
            />
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
            <h2 className="font-faustina italic text-gray-400 text-lg 2xl:text-xl font-light">
              Ilonggo&apos;s Best Dishes
            </h2>

            <h1 className="font-faustina text-5xl min-[1400px]:text-6xl 2xl:text-7xl font-bold text-[#202020] mt-3 2xl:mt-6 leading-tight">
              {activeDish.name}
            </h1>

            <h3 className="font-faustina italic text-[#7c7c7c] text-lg md:text-xl 2xl:text-2xl mt-1 2xl:mt-2">
              {activeDish.tagline}
            </h3>

            <p className="font-open-sans text-[#2a2a2a] mt-4 2xl:mt-6 text-base 2xl:text-lg leading-relaxed max-w-lg 2xl:max-w-xl">
              {activeDish.description}
            </p>
          </div>

          {/* Bottom controls fixed to bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-8 md:px-10 lg:px-12 2xl:px-16 pb-10 2xl:pb-16 bg-white">
            {/* Where to Eat Button */}
            <div className="w-full mb-8 2xl:mb-16">
              <button
                className="w-full bg-[#F9D408] text-[#3b3b3b] font-bold py-3.5 2xl:py-4 rounded-sm inline-block text-center cursor-pointer text-base 2xl:text-lg"
                onClick={handleWhereToEat}
              >
                Where to Eat
              </button>
            </div>

            {/* Navigation Slider */}
            <div className="mb-2 2xl:mb-6 flex justify-center w-full">
              <div className="flex items-center justify-between w-full max-w-xs md:max-w-sm 2xl:max-w-md">
                {/* Left arrow button */}
                <button
                  onClick={onPrev}
                  aria-label="Previous slide"
                  tabIndex={0}
                  className="rounded-full w-14 h-14 2xl:w-16 2xl:h-16 flex items-center justify-center bg-yellow-300 cursor-pointer"
                >
                  <span className="text-xl 2xl:text-2xl">❮</span>
                </button>

                {/* Dot indicators */}
                <div className="flex gap-3 md:gap-4 2xl:gap-5">
                  {Array.from({ length: dishes.length }).map((_, index) => (
                    <span
                      key={index}
                      className={`h-2 w-2 2xl:h-3 2xl:w-3 rounded-full ${
                        activeIndex === index ? 'bg-gray-400' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Right arrow button */}
                <button
                  onClick={onNext}
                  aria-label="Next slide"
                  tabIndex={0}
                  className="rounded-full w-14 h-14 2xl:w-16 2xl:h-16 flex items-center justify-center bg-yellow-300 cursor-pointer"
                >
                  <span className="text-black text-xl 2xl:text-2xl">❯</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Dish Image */}
      <div className="flex-1 relative h-full">
        <Image
          src={activeDish.image}
          alt={activeDish.name}
          layout="fill"
          objectFit="cover"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default HomePanel;
