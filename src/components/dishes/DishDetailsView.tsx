'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Dish } from '@/lib/dishData';
import { dishLocations } from '@/lib/locationData';
import LocationCard from './LocationCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Custom styles for Swiper pagination
import './dish-details-swiper.css';

interface DishDetailsViewProps {
  dish: Dish;
  onPrevDish: () => void;
  onNextDish: () => void;
}

const DishDetailsView: React.FC<DishDetailsViewProps> = ({
  dish,
  onPrevDish,
  onNextDish,
}) => {
  // Reference to the Swiper instance
  const swiperRef = useRef<SwiperRef>(null);

  // Effect to reset the Swiper to the first slide when the dish changes
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      // Reset to the first slide
      swiperRef.current.swiper.slideTo(0, 0);
    }
  }, [dish.name]); // Dependency on dish.name to trigger when dish changes

  // Get actual locations for this dish from dishLocations
  const locations = dishLocations[dish.name] || [];

  // Convert location data to the format expected by LocationCard
  const locationCards = locations.map((location) => ({
    name: location.name,
    image: location.photos
      ? location.photos[0]
      : '/images/placeholder-location.jpg',
    location: location.address || '',
    duration: '10 min', // This would need to be calculated dynamically in a real app
    rating: 4.5, // This would come from a ratings system in a real app
    tags: [dish.name],
  }));

  // Create an array of images for the dish
  const dishImages =
    dish.images && dish.images.length > 0 ? dish.images : [dish.image]; // Fallback to single image if no images array

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* Header with image slider */}
      <div className="relative w-full aspect-[4/3] bg-amber-50 flex-shrink-0">
        <Swiper
          ref={swiperRef}
          modules={[Pagination, Autoplay]}
          pagination={{
            clickable: true,
          }}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={500}
          className="h-full w-full"
        >
          {dishImages.map((imgSrc, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={imgSrc}
                  alt={`${dish.name} - image ${index + 1}`}
                  fill
                  sizes="100vw"
                  quality={90}
                  priority={index === 0}
                  className="object-cover object-center"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Scrollable content container */}
      <div className="flex-grow overflow-y-auto scrollbar-hide">
        {/* Dish header with title and navigation - Part of scrollable content */}
        <div className="px-4 lg:px-5 xl:px-6 pt-4 lg:pt-5 pb-3 bg-white">
          <div className="flex items-center">
          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-gray-900 font-serif">
            {dish.name}
          </h1>
            <div className="flex ml-auto space-x-2 lg:space-x-3">
              <button
                onClick={onPrevDish}
                className="bg-gray-100 rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center"
                aria-label="Previous dish"
              >
                <ChevronLeft
                  className="text-gray-500 cursor-pointer"
                  size={18}
                />
              </button>
              <button
                onClick={onNextDish}
                className="bg-yellow-400 rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center"
                aria-label="Next dish"
              >
                <ChevronRight className="text-black cursor-pointer" size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Main content - Description and locations */}
        <div className="px-4 lg:px-5 xl:px-6 pt-3">
          {/* Description */}
          <div className="mt-1 lg:mt-2 space-y-2">
            <p className="text-gray-500 mt-1 text-sm lg:text-base italic font-medium">
              {dish.tagline}
            </p>
            <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
              {dish.description}
            </p>
          </div>

          {/* See Locations Button */}
          <div className="mt-4 lg:mt-6 border-b border-gray-200 pb-2 lg:pb-3">
            <div className="text-gray-700 font-medium flex items-center justify-between cursor-pointer">
              <span>See Locations</span>
              <span className="text-gray-400 text-sm">
                ({locations.length})
              </span>
            </div>
          </div>

          {/* Locations List */}
          <div className="py-2 lg:py-4 mb-6">
            {locationCards.length > 0 ? (
              <div className="space-y-3">
                {locationCards.map((location, index) => (
                  <LocationCard
                    key={index}
                    name={location.name}
                    image={location.image}
                    location={location.location}
                    duration={location.duration}
                    rating={location.rating}
                    tags={location.tags}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 lg:py-8 text-gray-500">
                No locations available for this dish
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishDetailsView;
