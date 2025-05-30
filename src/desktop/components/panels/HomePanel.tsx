'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import MenuButton from '@/components/buttons/MenuButton';
import { Dish } from '@/types/types';
import { ChevronsDown } from 'lucide-react';
import { denormalizeKey } from '@/lib/utils';

interface HomePanelProps {
  dishes: Dish[];
  isVisible: boolean;
  openMenu: () => void;
  onClose: () => void;
  onFilterApply: (filters: string[]) => void;
}

const HEADER_HEIGHT_PX = 72; // Height for the initial header
const FADE_DURATION_MS = 200; // Duration of the fade animation in milliseconds

const HomePanel: React.FC<HomePanelProps> = ({
  dishes,
  isVisible,
  openMenu,
  onClose,
  onFilterApply,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFading, setIsFading] = useState(false); // State for fade animation

  const activeDish = dishes[activeIndex] ?? dishes[0];

  // Scroll to top and reset on open
  useEffect(() => {
    if (isVisible && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
      setIsScrolledDown(false);
      setActiveIndex(0);
      setIsFading(false); // Reset fade state
    }
  }, [isVisible]);

  // Keep scroll position aligned when navigating dishes IF already scrolled down
  useEffect(() => {
    if (isScrolledDown && scrollContainerRef.current) {
      requestAnimationFrame(() => {
        scrollContainerRef.current?.scrollTo({
          top: window.innerHeight, // Scroll to the start of the dish section
          behavior: 'auto',
        });
      });
    }
  }, [activeIndex, isScrolledDown]);

  const handleScroll = () => {
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    // Determine if scrolled past the initial intro section
    setIsScrolledDown(scrollTop >= window.innerHeight - 1); // -1 to account for potential sub-pixel scrolling
  };

  const scrollToDishes = () => {
    scrollContainerRef.current?.scrollTo({
      top: window.innerHeight, // Scrolls to the start of the second section
      behavior: 'smooth',
    });
  };

  const handleApplyFilter = () => {
    if (activeDish?.name) onFilterApply([activeDish.name]);
    onClose();
  };

  const onNext = () => {
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % dishes.length);
      setIsFading(false);
    }, FADE_DURATION_MS);
  };

  const onPrev = () => {
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + dishes.length) % dishes.length);
      setIsFading(false);
    }, FADE_DURATION_MS);
  };

  // Only render if visible (the translate-y-full will handle the off-screen state)
  if (!activeDish && isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 w-full h-full bg-white z-40 rounded-t-sm shadow-lg
      transform transition-transform duration-300
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      {/* Header - Only visible in Intro Section */}
      <div
        className="absolute top-5 w-full px-6 py-4 flex items-center justify-between z-50"
        style={{ height: `${HEADER_HEIGHT_PX}px` }}
      >
        <h1
          className={`text-5xl font-bold font-['Faustina'] text-white transition-opacity duration-300
          ${isScrolledDown ? 'opacity-0' : 'opacity-100'}`}
        >
          foodprints
        </h1>
        <MenuButton onClick={openMenu} />
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-scroll overflow-x-hidden"
        style={{ scrollBehavior: 'smooth' }}
        onScroll={handleScroll}
      >
        {/* Intro Section (Full screen height) */}
        <section
          className="relative h-screen w-full flex flex-col items-center justify-between text-center pb-12"
          style={{ paddingTop: `${HEADER_HEIGHT_PX}px` }}
        >
          {/* Blurred Map Background */}
          <div className="absolute inset-0 -mx-10 -my-10">
            <Image
              src="/images/map/FoodMapsMobile.svg" // Mobile map image as per the original mobile design
              alt="Map of Iloilo City"
              fill
              className="object-cover blur-sm"
              priority
            />
            <div className="absolute inset-0 bg-black opacity-50" />
          </div>

          {/* Centered Title */}
          <div className="relative z-40 flex flex-col items-center px-8 mt-auto mb-auto">
            <h1 className="text-white text-7xl font-['Faustina'] mb-4 py-2 px-6 text-center">
              Trace the
              <br />
              <span className="mt-3 bg-gray-200 bg-opacity-80 py-2 px-6 rounded-md text-black inline-block">
                Flavors of Iloilo City
              </span>
            </h1>
          </div>

          {/* Intro Description */}
          <div className="relative z-40 flex">
            <p className="text-white text-lg sm:text-xl leading-relaxed max-w-lg">
              Discover where to find the best Ilonggo dishes, check out the map,
              and start your food adventure!
            </p>
          </div>

          {/* Scroll Button */}
          <div className="relative z-40 w-full flex justify-center mt-auto">
            <button
              onClick={scrollToDishes}
              className="p-2 rounded-full flex items-center justify-center
              shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Scroll down to explore dishes"
            >
              <ChevronsDown size={40} className="text-gray-400" />
            </button>
          </div>
        </section>

        {/* Dish Details Section (Full screen height, desktop layout) */}
        <section className="h-screen w-full bg-white relative flex">
          {/* Left content panel - Desktop design */}
          <div className="w-[40%] min-[1200px]:w-[35%] 2xl:w-[30%] h-full relative flex flex-col">
            <div className="h-full flex flex-col px-8 md:px-10 lg:px-12 2xl:px-16 pt-10 2xl:pt-16 pb-32 relative">
              <div className="mb-6 2xl:mb-24">
                <Image
                  src="/foodprints-home-logo.png" // Desktop logo
                  alt="FoodPrints Logo"
                  width={180}
                  height={50}
                  priority
                />
              </div>

              {/* Dish text content - Apply fade here */}
              <div
                className={`flex-1 overflow-y-auto pr-2 scrollbar-hide
                transition-opacity duration-${FADE_DURATION_MS} ${isFading ? 'opacity-0' : 'opacity-100'}`}
              >
                <h2 className="font-faustina italic text-gray-400 text-lg 2xl:text-xl font-light">
                  Ilonggo&apos;s Best Dishes
                </h2>

                <h1 className="font-faustina text-5xl min-[1400px]:text-6xl 2xl:text-7xl font-bold text-[#202020] mt-3 2xl:mt-6 leading-tight">
                  {denormalizeKey(activeDish.name)}
                </h1>

                <h3 className="font-faustina italic text-[#7c7c7c] text-lg md:text-xl 2xl:text-2xl mt-1 2xl:mt-2">
                  {activeDish.tagline}
                </h3>

                <p className="font-open-sans text-[#2a2a2a] mt-4 2xl:mt-6 text-base 2xl:text-lg leading-relaxed max-w-lg 2xl:max-w-xl">
                  {activeDish.description}
                </p>
              </div>

              {/* Bottom controls - Desktop design */}
              <div className="absolute bottom-0 left-0 right-0 px-8 md:px-10 lg:px-12 2xl:px-16 pb-10 2xl:pb-16 bg-white">
                {/* Apply Filter Button */}
                <div className="w-full mb-8 2xl:mb-16">
                  <button
                    className="w-full bg-[#F9D408] text-[#3b3b3b] font-bold py-3.5 2xl:py-4 rounded-sm inline-block text-center cursor-pointer text-base 2xl:text-lg"
                    onClick={handleApplyFilter}
                    aria-label={`Filter by ${activeDish.name}`}
                  >
                    Where to Eat
                  </button>
                </div>

                {/* Carousel Navigation - Desktop design with dots */}
                <div className="mb-2 2xl:mb-6 flex justify-center w-full">
                  <div className="flex items-center justify-between w-full max-w-xs md:max-w-sm 2xl:max-w-md">
                    <button
                      onClick={onPrev}
                      aria-label="Previous slide"
                      className="rounded-full w-14 h-14 2xl:w-16 2xl:h-16 flex items-center justify-center bg-yellow-300 hover:bg-[#E6C207] transition-colors"
                    >
                      <span className="text-xl 2xl:text-2xl">❮</span>
                    </button>

                    <div className="flex gap-3 md:gap-4 2xl:gap-5">
                      {dishes.map((_, index) => (
                        <span
                          key={index}
                          className={`h-2 w-2 2xl:h-3 2xl:w-3 rounded-full ${
                            activeIndex === index ? 'bg-gray-400' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={onNext}
                      aria-label="Next slide"
                      className="rounded-full w-14 h-14 2xl:w-16 2xl:h-16 flex items-center justify-center bg-yellow-300 hover:bg-[#E6C207] transition-colors"
                    >
                      <span className="text-xl 2xl:text-2xl">❯</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right image - Apply fade here */}
          <div
            className={`flex-1 relative h-full
            transition-opacity duration-${FADE_DURATION_MS} ${isFading ? 'opacity-0' : 'opacity-100'}`}
          >
            <Image
              src={activeDish.image}
              alt={activeDish.name}
              layout="fill"
              objectFit="cover"
              className="object-cover"
              priority
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePanel;