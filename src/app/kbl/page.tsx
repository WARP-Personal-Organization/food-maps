'use client';

import React, { useState, useRef } from 'react';
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import { GoArrowRight } from 'react-icons/go';
import Image from 'next/image';
import Link from 'next/link'; // Import Link
import FoodPrintsNavbar from '@/components/FoooPrintsNavbar';

const dishes = [
  {
    name: 'KBL',
    image: '/images/filter-dish/kbl.jpg',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tagline: 'Kadios, Baboy, Langka',
  },
];

export default function KBLPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextDish = () => {
    setActiveIndex((prev) => (prev + 1) % dishes.length);
  };

  const prevDish = () => {
    setActiveIndex((prev) => (prev - 1 + dishes.length) % dishes.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;

    if (touchStartX.current - touchEndX.current > 50) {
      nextDish(); // Swipe left
    } else if (touchStartX.current - touchEndX.current < -50) {
      prevDish(); // Swipe right
    }
  };

  return (
    <div className="h-screen w-full">
      {/* MOBILE VIEW */}
      <div className="lg:hidden flex flex-col h-screen">
        <section className="fixed top-0 z-30 w-full">
          <FoodPrintsNavbar />
        </section>
        {/* Top Image (40% height) */}
        <div
          className="relative h-[40vh] w-full"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={dishes[activeIndex].image}
            alt={dishes[activeIndex].name}
            layout="fill"
            objectFit="cover"
            className="z-10"
          />
        </div>

        {/* Bottom Content (60% height) */}
        <div className="bg-white flex flex-col gap-8 p-6 h-[60vh]">
          {/* Dish Name */}
          <h1 className="text-3xl font-bold">{dishes[activeIndex].name}</h1>
          {/* Tagline */}
          <h3 className="italic text-gray-400">
            {dishes[activeIndex].tagline}
          </h3>

          {/* Description */}
          <p className="text-gray-800">{dishes[activeIndex].description}</p>
          {/* Swipe Indicator */}
          <div className="border-t pt-4"></div>

          {/* Button */}
          <Link href="/food-map">
            <button className="w-[100%] bg-yellow-300 text-black font-bold py-3 rounded mx-auto">
              Where to Eat
            </button>
          </Link>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden lg:flex h-screen w-full bg-white">
        {/* Left Side - Text Content (30% Width) */}
        <div className="w-[30%] flex flex-col justify-center items-center p-10">
          <h2 className="italic text-gray-600 text-lg">
            Ilonggo's Best Dishes
          </h2>
          <h1 className="text-4xl font-bold mt-2">
            {dishes[activeIndex].name}
          </h1>
          <h3 className="italic text-gray-500 text-lg">
            {dishes[activeIndex].tagline}
          </h3>

          {/* Description */}
          <p className="text-gray-700 mt-4">
            {dishes[activeIndex].description}
          </p>

          {/* Button */}
          <Link href="/food-map">
            <button className="mt-6 w-[80%] bg-yellow-500 text-black font-bold py-3 rounded">
              Where to Eat
            </button>
          </Link>

          {/* Navigation Slider */}
          <div className="mt-6 flex items-center gap-4">
            <FaCircleChevronLeft
              className="text-3xl cursor-pointer text-yellow-500"
              onClick={prevDish}
            />
            <div className="flex gap-2">
              {dishes.map((_, index) => (
                <span
                  key={index}
                  className={`h-3 w-3 rounded-full ${
                    activeIndex === index ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <FaCircleChevronRight
              className="text-3xl cursor-pointer text-yellow-500"
              onClick={nextDish}
            />
          </div>
        </div>

        {/* Right Side - Full Image (70% Width) */}
        <div className="w-[70%] relative h-full">
          <Image
            src={dishes[activeIndex].image}
            alt={dishes[activeIndex].name}
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  );
}
