'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import MenuButton from '@/components/buttons/MenuButton';
import { Dish } from '@/types/types';
import { ChevronsDown, MapPin, Star } from 'lucide-react';
import { denormalizeKey } from '@/lib/utils';

interface HomePanelProps {
  dishes: Dish[];
  isVisible: boolean;
  openMenu: () => void;
  onClose: () => void;
  onFilterApply: (filters: string[]) => void;
}

const HEADER_HEIGHT_PX = 72;
const FADE_DURATION_MS = 200;

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
  const [isFading, setIsFading] = useState(false);

  const activeDish = dishes[activeIndex] ?? dishes[0];

  // Reset panel state when opened
  useEffect(() => {
    if (isVisible && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
      setIsScrolledDown(false);
      setActiveIndex(0);
      setIsFading(false);
    }
  }, [isVisible]);

  // Maintain scroll position when navigating dishes (mobile only)
  useEffect(() => {
    if (isScrolledDown && scrollContainerRef.current && window.innerWidth < 1024) {
      requestAnimationFrame(() => {
        scrollContainerRef.current?.scrollTo({
          top: window.innerHeight,
          behavior: 'auto',
        });
      });
    }
  }, [activeIndex, isScrolledDown]);

  const handleScroll = () => {
    if (window.innerWidth >= 1024) return; // No scroll behavior on desktop
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    setIsScrolledDown(scrollTop >= window.innerHeight - 1);
  };

  const scrollToDishes = () => {
    if (window.innerWidth >= 1024) return; // No scroll on desktop
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

  if (!activeDish && isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 w-full h-full bg-white z-40 shadow-2xl
      transform transition-transform duration-500 ease-out
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      lg:rounded-t-none lg:rounded-l-3xl`}
    >
      {/* Mobile Layout */}
      <div className="lg:hidden h-full">
        {/* Mobile Header */}
        <div
          className="absolute top-3 sm:top-5 w-full px-4 sm:px-6 py-4 flex items-center justify-between z-50"
          style={{ height: `${HEADER_HEIGHT_PX}px` }}
        >
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-bold font-['Faustina'] text-white transition-opacity duration-300
            ${isScrolledDown ? 'opacity-0' : 'opacity-100'}`}
          >
            foodprints
          </h1>
          <MenuButton onClick={openMenu} />
        </div>

        {/* Mobile Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="h-full overflow-y-scroll overflow-x-hidden"
          style={{ scrollBehavior: 'smooth' }}
          onScroll={handleScroll}
        >
          {/* Mobile Intro Section */}
          <section
            className="relative h-screen w-full flex flex-col items-center justify-between text-center pb-8 sm:pb-12"
            style={{ paddingTop: `${HEADER_HEIGHT_PX}px` }}
          >
            <div className="absolute inset-0 -mx-10 -my-10">
              <Image
                src="/images/map/FoodMapsMobile.svg"
                alt="Map of Iloilo City"
                fill
                className="object-cover blur-sm"
                priority
              />
              <div className="absolute inset-0 bg-black opacity-60" />
            </div>

            <div className="relative z-40 flex flex-col items-center px-4 sm:px-8 mt-auto mb-auto">
              <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-['Faustina'] mb-4 py-2 px-4 sm:px-6 text-center leading-tight">
                Trace the
                <br />
                <span className="mt-2 sm:mt-3 bg-yellow-300 bg-opacity-95 py-2 px-4 sm:px-6 rounded-xl text-gray-900 inline-block font-black shadow-lg">
                  Flavors of Iloilo City
                </span>
              </h1>
            </div>

            <div className="relative z-40 flex px-4 sm:px-0">
              <p className="text-white text-base sm:text-lg leading-relaxed max-w-sm sm:max-w-lg text-center">
                Discover where to find the best Ilonggo dishes, check out the map,
                and start your food adventure!
              </p>
            </div>

            <div className="relative z-40 w-full flex justify-center mt-auto">
              <button
                onClick={scrollToDishes}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center
                shadow-lg hover:bg-white/30 transition-all duration-300 cursor-pointer touch-manipulation"
                aria-label="Scroll down to explore dishes"
              >
                <ChevronsDown size={32} className="sm:hidden text-white" />
                <ChevronsDown size={40} className="hidden sm:block text-white" />
              </button>
            </div>
          </section>

          {/* Mobile Dish Section */}
          <section className="min-h-screen w-full bg-gradient-to-br from-white to-yellow-50 relative">
            <div className="px-4 sm:px-6 pt-8 pb-8">
              <div className="mb-6">
                <Image
                  src="/foodprints-home-logo.png"
                  alt="FoodPrints Logo"
                  width={150}
                  height={42}
                  className="sm:w-[180px] sm:h-[50px]"
                  priority
                />
              </div>

              <div
                className={`transition-opacity duration-${FADE_DURATION_MS} ${isFading ? 'opacity-0' : 'opacity-100'}`}
              >
                <div className="mb-6">
                  <div className="relative h-48 sm:h-64 w-full rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={activeDish.image}
                      alt={activeDish.name}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">
                      Ilonggo&apos;s Best Dishes
                    </span>
                  </div>

                  <h1 className="font-faustina text-3xl sm:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                    {denormalizeKey(activeDish.name)}
                  </h1>

                  <h3 className="font-faustina italic text-gray-600 text-lg mb-4">
                    {activeDish.tagline}
                  </h3>

                  <p className="text-gray-700 text-base leading-relaxed mb-6">
                    {activeDish.description}
                  </p>

                  <button
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-4 rounded-xl text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] touch-manipulation"
                    onClick={handleApplyFilter}
                  >
                    Where to Eat
                  </button>
                </div>

                <div className="mt-6 flex justify-center">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={onPrev}
                      className="w-12 h-12 bg-yellow-300 hover:bg-yellow-400 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 touch-manipulation"
                    >
                      <span className="text-lg">❮</span>
                    </button>

                    <div className="flex gap-2">
                      {dishes.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            activeIndex === index ? 'bg-yellow-500 w-4' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={onNext}
                      className="w-12 h-12 bg-yellow-300 hover:bg-yellow-400 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 touch-manipulation"
                    >
                      <span className="text-lg">❯</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Desktop Layout - Always Split View */}
      <div className="hidden lg:flex h-full">
        {/* Left Panel - Always Visible Carousel */}
        <div className="w-[400px] xl:w-[450px] 2xl:w-[500px] h-full bg-gradient-to-br from-white to-yellow-50 border-r-4 border-yellow-300 flex flex-col">
          {/* Desktop Header */}
          <div className="flex items-center justify-between p-6 xl:p-8 border-b border-yellow-200">
            <Image
              src="/foodprints-home-logo.png"
              alt="FoodPrints Logo"
              width={180}
              height={50}
              priority
            />
            <MenuButton onClick={openMenu} />
          </div>

          {/* Desktop Content */}
          <div className="flex-1 flex flex-col">
            <div
              className={`flex-1 p-6 xl:p-8 transition-opacity duration-${FADE_DURATION_MS} ${isFading ? 'opacity-0' : 'opacity-100'}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-sm font-bold text-yellow-600 uppercase tracking-wide">
                  Ilonggo&apos;s Best Dishes
                </span>
              </div>

              <h1 className="font-faustina text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-3 xl:mb-4 leading-tight">
                {denormalizeKey(activeDish.name)}
              </h1>

              <h3 className="font-faustina italic text-gray-600 text-xl xl:text-2xl mb-4 xl:mb-6">
                {activeDish.tagline}
              </h3>

              <p className="text-gray-700 text-base xl:text-lg leading-relaxed mb-6 xl:mb-8">
                {activeDish.description}
              </p>

              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">
                  {activeDish.locations?.length || 0} locations available
                </span>
              </div>

              <button
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-4 xl:py-5 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                onClick={handleApplyFilter}
              >
                Where to Eat
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="p-6 xl:p-8 bg-white border-t border-yellow-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={onPrev}
                  className="w-14 h-14 xl:w-16 xl:h-16 bg-yellow-300 hover:bg-yellow-400 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                  aria-label="Previous dish"
                >
                  <span className="text-xl xl:text-2xl">❮</span>
                </button>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex gap-2">
                    {dishes.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          activeIndex === index ? 'bg-yellow-500 w-6' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to dish ${index + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {activeIndex + 1} of {dishes.length}
                  </span>
                </div>

                <button
                  onClick={onNext}
                  className="w-14 h-14 xl:w-16 xl:h-16 bg-yellow-300 hover:bg-yellow-400 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                  aria-label="Next dish"
                >
                  <span className="text-xl xl:text-2xl">❯</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Image */}
        <div
          className={`flex-1 relative transition-opacity duration-${FADE_DURATION_MS} ${isFading ? 'opacity-0' : 'opacity-100'}`}
        >
          <Image
            src={activeDish.image}
            alt={activeDish.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
        </div>
      </div>
    </div>
  );
};

export default HomePanel;