'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import MenuButton from '@/components/buttons/MenuButton';
import { Dish } from '@/types/types';
import { ChevronsUp } from 'lucide-react';
import { denormalizeKey } from '@/lib/utils';

interface HomePanelProps {
  dishes: Dish[];
  isVisible: boolean;
  openMenu: () => void;
  onClose: () => void;
  onFilterApply: (filters: string[]) => void;
}

const HEADER_HEIGHT_PX = 72;

const HomePanel: React.FC<HomePanelProps> = ({
  dishes,
  isVisible,
  openMenu,
  onClose,
  onFilterApply,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dishSectionRef = useRef<HTMLElement>(null);

  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTitleVisible, setIsTitleVisible] = useState(false);

  const activeDish = dishes[activeIndex] ?? dishes[0];

  useEffect(() => {
    if (isVisible) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
      }
      setIsScrolledDown(false);
      setActiveIndex(0);
      const timer = setTimeout(() => setIsTitleVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsTitleVisible(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isScrolledDown && scrollContainerRef.current && dishSectionRef.current) {
      // This auto-scroll is for when activeIndex changes and isScrolledDown is true,
      // not for the initial scroll trigger from the button.
      scrollContainerRef.current.scrollTo({
        top: dishSectionRef.current.offsetTop,
        behavior: 'auto',
      });
    }
  }, [activeIndex, isScrolledDown]);

  const handleScroll = () => {
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    setIsScrolledDown(scrollTop > 50);
  };

  // Custom scroll function for slower animation
  const scrollToDishes = () => {
    const container = scrollContainerRef.current;
    const targetElement = dishSectionRef.current;

    if (!container || !targetElement) {
      return;
    }

    const startPosition = container.scrollTop;
    const targetPosition = targetElement.offsetTop;
    const distance = targetPosition - startPosition;
    const duration = 150; // Adjust this value to control scroll speed (in milliseconds)
                          // 1000ms = 1 second, 2000ms = 2 seconds, etc.
    let startTime: number | null = null;

    const animateScroll = (currentTime: number) => {
      if (!startTime) {
        startTime = currentTime;
      }

      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Clamp progress between 0 and 1

      // Linear interpolation for simplicity. You could add easing functions here for more natural movement.
      const newScrollTop = startPosition + distance * progress;

      container.scrollTop = newScrollTop;

      if (elapsedTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handleApplyFilter = () => {
    if (activeDish?.name) {
      onFilterApply([activeDish.name]);
    }
    onClose();
  };

  const onNext = () => {
    setActiveIndex((prev) => (prev + 1) % dishes.length);
  };

  const onPrev = () => {
    setActiveIndex((prev) => (prev - 1 + dishes.length) % dishes.length);
  };

  return (
    <div
      className={`fixed bottom-0 w-full h-full bg-white z-30 rounded-t-sm shadow-lg transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      } flex flex-col`}
    >
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between z-50"
        style={{ height: `${HEADER_HEIGHT_PX}px` }}
      >
        <h1
          className={`text-5xl font-bold font-['Faustina'] text-white transition-opacity duration-500 ease-in ${
            isTitleVisible && !isScrolledDown ? 'opacity-100' : 'opacity-0'
          }`}
        >
          foodprints
        </h1>
        <MenuButton onClick={openMenu} />
      </div>

      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        className="flex-grow overflow-y-scroll overflow-x-hidden"
        onScroll={handleScroll}
      >
        {/* Hero Section */}
        <section
          className="relative min-h-screen w-full flex flex-col items-center justify-between text-center pb-12"
          style={{ paddingTop: `${HEADER_HEIGHT_PX}px` }}
        >
          {/* Background */}
          <div className="absolute inset-0 -mx-10 -my-10">
            <Image
              src="/images/map/FoodMapsMobile.svg"
              alt="Map of Iloilo City"
              fill
              className="object-cover blur-sm"
              priority
            />
            <div className="absolute inset-0 bg-black opacity-50" />
          </div>

          {/* Title */}
          <div className="relative z-40 flex flex-col items-center px-8 mt-auto mb-auto">
            <h1 className="text-white text-4xl sm:text-5xl font-['Faustina'] mb-4 py-2 px-6 text-center">
              Trace the
              <br />
              <span className="mt-3 bg-gray-200 bg-opacity-80 py-2 px-6 rounded-md text-black inline-block">
                Flavors of Iloilo City
              </span>
            </h1>
          </div>

          {/* Description */}
          <div className="relative z-40 flex py-2 px-10">
            <p className="text-white text-lg sm:text-xl leading-relaxed max-w-md">
              Discover where to find the best Ilonggo dishes, check out the map,
              and start your food adventure!
            </p>
          </div>

          {/* Scroll Trigger */}
          <div className="relative z-40 w-full flex justify-center mt-auto">
            <button
              onClick={scrollToDishes}
              className="p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Scroll down to explore dishes"
            >
              <ChevronsUp size={70} className="text-gray-400" />
            </button>
          </div>
        </section>

        {/* Dish Section */}
        <section ref={dishSectionRef} className="w-full bg-white pb-8 min-h-screen flex flex-col">
          {/* Dish Image */}
          <div className="relative w-full h-[60vw] sm:h-[50vw] md:h-[40vw] lg:h-[300px]">
            {activeDish?.image ? (
              <Image
                src={activeDish.image}
                alt={activeDish.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Image Available
              </div>
            )}
          </div>

          {/* Dish Info + Button */}
          <div className="flex flex-col gap-8 px-6 pt-4 flex-grow">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl sm:text-4xl md:text-8xl font-bold font-faustina text-[#202020]">
                {denormalizeKey(activeDish.name)}
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={onPrev}
                  className="h-10 w-10 p-2 rounded-full bg-yellow-300 flex items-center justify-center hover:bg-[#E6C207] transition-colors"
                  aria-label="Previous dish"
                >
                  ❮
                </button>
                <button
                  onClick={onNext}
                  className="h-10 w-10 p-2 rounded-full bg-yellow-300 flex items-center justify-center hover:bg-[#E6C207] transition-colors"
                  aria-label="Next dish"
                >
                  ❯
                </button>
              </div>
            </div>

            <h3 className="font-bold italic text-base sm:text-lg md:text-4xl text-[#7c7c7c]">
              {activeDish?.tagline || 'A delicious culinary experience.'}
            </h3>

            <p className="text-[#2a2a2a] text-base sm:text-lg md:text-4xl leading-relaxed">
              {activeDish?.description || 'Description of the dish goes here.'}
            </p>

            {/* "Where to Eat" Button - Back in its original position */}
            <div className="static pt-10 mt-auto z-50">
              <button
                onClick={handleApplyFilter}
                className="w-full bg-[#F9D408] text-[#3b3b3b] font-bold dont text-base py-2
                rounded-[8px] text-center hover:bg-[#E6C207] transition-colors shadow-sm md:text-4xl"
              >
                Where to Eat
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePanel;