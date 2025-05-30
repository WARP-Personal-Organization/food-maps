'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import MenuButton from '@/components/buttons/MenuButton';
import { Dish } from '@/types/types';
import { ChevronsUp } from 'lucide-react';

interface HomePanelProps {
  dishes: Dish[];
  isVisible: boolean;
  openMenu: () => void;
  onClose: () => void;
  onFilterApply: (filters: string[]) => void;
}

const HEADER_HEIGHT_PX = 72;
const IMAGE_HEIGHT_PX = 300;
const FOOTER_HEIGHT_PX = 70;

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

  const activeDish = dishes[activeIndex] ?? dishes[0];

  // Scroll to top and reset on open
  useEffect(() => {
    if (isVisible && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
      setIsScrolledDown(false);
      setActiveIndex(0);
    }
  }, [isVisible]);

  // Keep scroll position aligned when navigating dishes
  useEffect(() => {
    if (isScrolledDown && scrollContainerRef.current) {
      requestAnimationFrame(() => {
        scrollContainerRef.current?.scrollTo({
          top: window.innerHeight,
          behavior: 'auto',
        });
      });
    }
  }, [activeIndex, isScrolledDown]);

  const handleScroll = () => {
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    setIsScrolledDown(scrollTop > window.innerHeight * 0.1);
  };

  const scrollToDishes = () => {
    scrollContainerRef.current?.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  const handleApplyFilter = () => {
    if (activeDish?.name) onFilterApply([activeDish.name]);
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
      className={`fixed bottom-0 w-full h-full bg-white z-30 rounded-t-sm shadow-lg
      transform transition-transform duration-300
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      {/* Header */}
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
        {/* Intro Section */}
        <section
          className="relative h-screen w-full flex flex-col items-center justify-between text-center pb-12"
          style={{ paddingTop: `${HEADER_HEIGHT_PX}px` }}
        >
          {/* Blurred Map Background */}
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

          {/* Centered Title */}
          <div className="relative z-40 flex flex-col items-center px-8 mt-auto mb-auto">
            <h1 className="text-white text-4xl sm:text-5xl font-['Faustina'] mb-4 py-2 px-6 text-center">
              Trace the
              <br />
              <span className="mt-3 bg-gray-200 bg-opacity-80 py-2 px-6 rounded-md text-black inline-block">
                Flavors of Iloilo City
              </span>
            </h1>
          </div>

          {/* Intro Description */}
          <div className="relative z-40 flex py-2 px-10">
            <p className="text-white text-lg sm:text-xl leading-relaxed max-w-md">
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
              <ChevronsUp size={70} className="text-gray-400" />
            </button>
          </div>
        </section>

        {/* Dish Section */}
        <section className="h-screen w-full bg-white relative">
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

          {/* Dish Details */}
          <div
            className="flex flex-col overflow-y-auto px-6 pt-4 gap-5"
            style={{
              height: `calc(100% - ${IMAGE_HEIGHT_PX + FOOTER_HEIGHT_PX}px)`,
            }}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold font-faustina text-[#202020]">
                {activeDish?.name || 'Dish Name'}
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

            <h3 className="font-bold italic text-base text-[#7c7c7c]">
              {activeDish?.tagline || 'A delicious culinary experience.'}
            </h3>

            <p className="text-[#2a2a2a] text-base leading-relaxed">
              {activeDish?.description || 'Description of the dish goes here.'}
            </p>
          </div>

          {/* Action Button */}
          <div
            className="absolute bottom-0 left-0 w-full px-6 pb-6 bg-white z-40"
            style={{ height: `${FOOTER_HEIGHT_PX}px` }}
          >
            <button
              onClick={handleApplyFilter}
              className="w-full bg-[#F9D408] text-[#3b3b3b] font-bold text-base py-2
              rounded-[3px] text-center hover:bg-[#E6C207] transition-colors shadow-sm"
            >
              Where to Eat
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePanel;
