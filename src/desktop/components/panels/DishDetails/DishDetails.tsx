'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import LocationCard from './LocationCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import './dish-details-swiper.css';

import { LocationData } from '@/lib/LocationData';
import { Dish } from '@/types/types';

interface DishDetailsProps {
  dish: Dish;
  onPrevDish: () => void;
  onNextDish: () => void;
}

const DishDetails: React.FC<DishDetailsProps> = ({
  dish,
  onPrevDish,
  onNextDish,
}) => {
  const swiperRef = useRef<SwiperRef>(null);

  // Reset swiper to first slide on dish change
  useEffect(() => {
    swiperRef.current?.swiper?.slideTo(0, 0);
  }, [dish.name]);

  const locations = LocationData[dish.name] || [];

  const locationCards = locations.map((location) => ({
    name: location.name,
    image: location.photos?.[0] || '/images/placeholder-location.jpg',
    location: location.address || '',
    duration: '10 min', // Placeholder
    rating: 4.5, // Placeholder
    tags: [dish.name],
  }));

  const dishImages = dish.images?.length ? dish.images : [dish.image];

  const isVisible = true; // Should be managed by parent

  return (
    <div
      className={`fixed top-0 left-0 h-full w-[300px] min-w-[300px] md:w-[320px] lg:w-[350px] xl:w-[400px] bg-white shadow-lg z-50 transform transition-transform duration-300 
      ${isVisible ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}
    >
      {/* Swiper Header */}
      <div className="relative">
        <Swiper
          ref={swiperRef}
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={1}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={500}
          className="h-full w-full"
        >
          {dishImages.map((imgSrc, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[30vh]">
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

      {/* Scrollable Content */}
      <div className="flex-grow min-h-0 overflow-y-auto px-4 lg:px-5 xl:px-6 pt-4 scrollbar-hide">
        {/* Title and Nav */}
        <div className="flex items-center mb-3">
          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-gray-900 font-serif">
            {dish.name}
          </h1>
          <div className="flex ml-auto space-x-2 lg:space-x-3">
            <button
              onClick={onPrevDish}
              className="bg-gray-100 rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center"
              aria-label="Previous dish"
            >
              <ChevronLeft className="text-gray-500" size={18} />
            </button>
            <button
              onClick={onNextDish}
              className="bg-yellow-400 rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center"
              aria-label="Next dish"
            >
              <ChevronRight className="text-black" size={18} />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-6">
          <p className="text-gray-500 text-sm lg:text-base italic font-medium">
            {dish.tagline}
          </p>
          <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
            {dish.description}
          </p>
        </div>

        {/* Locations Header */}
        <div className="border-b border-gray-200 pb-2 lg:pb-3 mb-4">
          <div className="text-gray-700 font-medium flex items-center justify-between">
            <span>See Locations</span>
            <span className="text-gray-400 text-sm">({locations.length})</span>
          </div>
        </div>

        {/* Locations List */}
        <div className="space-y-3 mb-6">
          {locationCards.length > 0 ? (
            locationCards.map((location, index) => (
              <LocationCard
                key={index}
                name={location.name}
                image={location.image}
                location={location.location}
                duration={location.duration}
                rating={location.rating}
                tags={location.tags}
              />
            ))
          ) : (
            <div className="text-center py-6 lg:py-8 text-gray-500">
              No locations available for this dish
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishDetails;
