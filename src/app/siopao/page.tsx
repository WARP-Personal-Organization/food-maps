'use client';

import React, { useState, useEffect } from 'react';
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import FoodPrintsNavbar from '@/components/FoooPrintsNavbar';
import dynamic from 'next/dynamic';
import LocationDetailPanel from '@/components/LocationDetailPanel';

// Define the dish data
const dishes = [
  {
    name: 'Siopao',
    description:
      'Bao Zi (包子), also known as mantou when unfilled, is a staple food among Chinese worldwide. Hence, there are Baozi versions in Singapore, HK, Vietnam, the Philippines, and other countries with strong Chinese influence. The exact origins of siopao in the Philippines are not well-documented, but Chinese vendors likely sold it along with noodles as early as the 1600s.',
    tagline: 'Philippine Steamed Bun',
    locations: [
      {
        name: "Roberto's Siopao",
        x: 500,
        y: 300,
        description: 'Famous for their Siopao since 1978',
        iconType: 'restaurant' as const,
        iconUrl: '/siopao-1.png',
        address: 'Rizal Street, La Paz Public Market, La Paz, Iloilo City',
        openHours: '10:00 AM - 9:00 PM',
        priceRange: '₱200-400',
        photos: [
          '/location-photos/robertos-1.jpg',
          '/location-photos/robertos-2.jpg',
          '/location-photos/robertos-3.jpg',
          '/location-photos/robertos-4.jpg',
        ],
      },
      {
        name: "Deco's",
        x: 700, // Adjusted for the map image coordinates
        y: 400, // Adjusted for the map image coordinates
        description: 'Home of the King-sized Siopao',
        iconType: 'restaurant' as const,
        iconUrl: '/siopao-2.png',
      },
      {
        name: 'Kusina ni Mama',
        x: 500, // Adjusted for the map image coordinates
        y: 600, // Adjusted for the map image coordinates
        description: 'Traditional homemade Siopao',
        iconType: 'restaurant' as const,
        iconUrl: '/siopao-3.png',
      },
    ],
  },
];

// Dynamically import the Map component to avoid SSR issues with Leaflet
// No SSR rendering at all - completely client-side only
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <p>Loading map...</p>
    </div>
  ),
});

// Client Component wrapper for map
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <p>Loading map...</p>
      </div>
    );
  }

  return <>{children}</>;
};

// Define Location interface
interface Location {
  name: string;
  x: number;
  y: number;
  description: string;
  iconType?: 'default' | 'restaurant' | 'shop' | 'attraction';
  iconUrl?: string;
  address?: string;
  openHours?: string;
  priceRange?: string;
  photos?: string[];
}

export default function SiopaoPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const nextDish = () => {
    setActiveIndex((prev) => (prev + 1) % dishes.length);
  };

  const prevDish = () => {
    setActiveIndex((prev) => (prev - 1 + dishes.length) % dishes.length);
  };

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const closeLocationDetail = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="h-screen w-full">
      {/* MOBILE VIEW */}
      <div className="lg:hidden flex flex-col h-screen">
        <section className="fixed top-0 z-50 w-full">
          <FoodPrintsNavbar />
        </section>

        <div className="h-full w-full pt-16">
          {selectedLocation ? (
            <div className="absolute inset-0 z-10 pt-16 p-4">
              <LocationDetailPanel
                location={selectedLocation}
                onClose={closeLocationDetail}
              />
            </div>
          ) : null}
          <div className="relative h-full w-full">
            <ClientOnly>
              <MapComponent
                locations={dishes[activeIndex].locations}
                mapImageUrl="/Map.svg"
                mapBounds={[
                  [0, 0],
                  [1000, 1000],
                ]}
                defaultZoom={-0.5}
                onLocationClick={handleLocationClick}
              />
            </ClientOnly>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden lg:flex h-screen w-full bg-white">
        {/* Left Side - Text Content (30% Width) */}
        <div className="w-[30%] flex flex-col justify-center items-center p-10">
          {selectedLocation ? (
            <LocationDetailPanel
              location={selectedLocation}
              onClose={closeLocationDetail}
            />
          ) : (
            <>
              <h2 className="italic text-gray-600 text-lg">
                Ilonggo&apos;s Best Dishes
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
            </>
          )}
        </div>

        {/* Right Side - Map (70% Width) */}
        <div className="w-[70%] relative h-full">
          <div className="relative h-full w-full">
            <ClientOnly>
              <MapComponent
                locations={dishes[activeIndex].locations}
                mapImageUrl="/Map.svg"
                mapBounds={[
                  [0, 0],
                  [1000, 1000],
                ]}
                defaultZoom={-0.5}
                onLocationClick={handleLocationClick}
              />
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  );
}
