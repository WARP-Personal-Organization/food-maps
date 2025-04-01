"use client";

import React, { useState, useRef } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { GoArrowRight } from "react-icons/go";
import Image from "next/image";
import Link from "next/link"; // Import Link
import Navbar from "./Navbar";

const dishes = [
  {
    name: "Siopao",
    image: "/images/filter-dish/siopao.jpg",
    description:
      "Bao Zi (包子), also known as mantou when unfilled, is a staple food among Chinese worldwide. Hence, there are Baozi versions in Singapore, HK, Vietnam, the Philippines, and other countries with strong Chinese influence. The exact origins of siopao in the Philippines are not well-documented, but Chinese vendors likely sold it along with noodles as early as the 1600s.",
    tagline: "Philippine Steamed Bun",
  },
  {
    name: "La Paz Batchoy",
    image: "/images/filter-dish/batchoy.webp",
    description:
      "A hearty noodle soup with pork, liver, and chicharrón, La Paz Batchoy is a famous Ilonggo delicacy originating from La Paz, Iloilo.",
    tagline: "Ilonggo Noodle Soup",
  },
  {
    name: "Cansi",
    image: "/images/filter-dish/cansi.jpg",
    description:
      "Cansi is a famous Ilonggo beef soup known for its rich, sour taste due to the batwan fruit, a local ingredient unique to Western Visayas.",
    tagline: "Beef Bone Marrow Soup",
  },
  {
    name: "Inasal",
    image: "/images/filter-dish/inasal.jpg",
    description:
      "Chicken Inasal is a famous Bacolod-style grilled chicken marinated in vinegar, calamansi, and spices, served with annatto oil and garlic rice.",
    tagline: "Bacolod Grilled Chicken",
  },
  {
    name: "KBL",
    image: "/images/filter-dish/kbl.jpg",
    description:
      "KBL (Kadyos, Baboy, Langka) is a traditional Ilonggo stew made with pigeon peas, pork, and unripe jackfruit, flavored with batwan fruit.",
    tagline: "Pork & Jackfruit Stew",
  },
  {
    name: "Pancit Molo",
    image: "/images/filter-dish/pancit_molo.jpg",
    description:
      "A dumpling soup originating from Molo, Iloilo, Pancit Molo consists of meat-filled wontons in a flavorful chicken broth.",
    tagline: "Ilonggo Wonton Soup",
  },
];

export default function HomePage() {
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
        <section className="fixed top-0 z-50 w-full">
          <Navbar />
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
        <div className="bg-white flex flex-col justify-between p-6 h-[60vh]">
          {/* Dish Name */}
          <h1 className="text-2xl font-bold text-center">{dishes[activeIndex].name}</h1>

          {/* Tagline */}
          <h3 className="italic text-gray-600 text-center">{dishes[activeIndex].tagline}</h3>

          {/* Description */}
          <p className="text-gray-700">{dishes[activeIndex].description}</p>
          {/* Swipe Indicator */}
          <div className="border-t pt-4">
            <p className="flex items-center justify-center text-gray-600">
              Swipe to see other Ilonggo top dishes <GoArrowRight className="ml-2" />
            </p>
          </div>

          {/* Button */}
          <Link href="/food-map">
            <button className="w-[90%] bg-yellow-500 text-black font-bold py-3 rounded mx-auto">
              Where to Eat
            </button>
          </Link>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden lg:flex h-screen w-full bg-white">
        {/* Left Side - Text Content (30% Width) */}
        <div className="w-[30%] flex flex-col justify-center items-center p-10">
          <h2 className="italic text-gray-600 text-lg">Ilonggo's Best Dishes</h2>
          <h1 className="text-4xl font-bold mt-2">{dishes[activeIndex].name}</h1>
          <h3 className="italic text-gray-500 text-lg">{dishes[activeIndex].tagline}</h3>

          {/* Description */}
          <p className="text-gray-700 mt-4">{dishes[activeIndex].description}</p>

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
                    activeIndex === index ? "bg-yellow-500" : "bg-gray-300"
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
