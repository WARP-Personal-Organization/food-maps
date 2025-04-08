'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import Next.js Router
import { LuUtensils } from 'react-icons/lu';
import { FiMenu, FiX } from 'react-icons/fi';
import Image from 'next/image';
import About from './About'; // Import the About component

const dishes = [
  { name: 'Siopao', locations: 5, image: '/images/filter-dish/siopao.jpg' },
  {
    name: 'La Paz Batchoy',
    locations: 3,
    image: '/images/filter-dish/batchoy.webp',
  },
  { name: 'Cansi', locations: 4, image: '/images/filter-dish/cansi.jpg' },
  { name: 'Inasal', locations: 6, image: '/images/filter-dish/inasal.jpg' },
  { name: 'KBL', locations: 2, image: '/images/filter-dish/kbl.jpg' },
  {
    name: 'Pancit Molo',
    locations: 3,
    image: '/images/filter-dish/pancit_molo.jpg',
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false); // About Modal state

  const menuRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Next.js router for navigation

  // Close modals when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }

    if (isMenuOpen || isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isFilterOpen]);

  const toggleDishSelection = (dish: string) => {
    setSelectedDishes((prev) =>
      prev.includes(dish) ? prev.filter((d) => d !== dish) : [...prev, dish]
    );
  };

  const handleHomeClick = () => {
    setIsMenuOpen(false); // Close menu after navigating
    router.push('/'); // Navigate to the homepage
  };

  const handleAboutClick = () => {
    setIsMenuOpen(false); // Close menu before opening About modal
    setIsAboutModalOpen(true); // Open About modal
  };

  const closeAboutModal = () => {
    setIsAboutModalOpen(false); // Close About modal
  };

  return (
    <div className="relative">
      {/* Overlay Background (30% Black with Blur) */}
      {(isMenuOpen || isFilterOpen || isAboutModalOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => {
            setIsMenuOpen(false);
            setIsFilterOpen(false);
            setIsAboutModalOpen(false); // Close About modal if background is clicked
          }}
        />
      )}

      <div className="flex justify-between items-center bg-none text-white py-4 px-6 relative z-50">
        {/* Left - Filter Button */}
        <button
          className={`text-2xl flex items-center gap-2 text-black bg-white rounded p-2 shadow-lg transition-all ${
            isMenuOpen || isFilterOpen ? 'blur-sm' : 'blur-0'
          }`}
          onClick={() => setIsFilterOpen(true)}
          aria-label="Filter Dishes"
        >
          <LuUtensils />
        </button>

        {/* Right - Menu Button */}
        <button
          className={`text-2xl text-black bg-white rounded p-2 shadow-lg transition-all ${
            isMenuOpen || isFilterOpen ? 'blur-sm' : 'blur-0'
          }`}
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open Menu"
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Dish Filter Slide-in Menu (Left to Right) */}
      <div
        ref={filterRef}
        className={`fixed top-0 left-0 w-5/6 lg:w-1/3 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isFilterOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-start mb-4">
            <span className="text-black">
              <LuUtensils />
            </span>
            <h2 className="text-xl font-semibold text-black">Filter Dishes</h2>
            <button
              className="text-2xl text-black ml-auto"
              onClick={() => setIsFilterOpen(false)}
            >
              <FiX />
            </button>
          </div>

          {/* Dynamic Image Ratio */}
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 flex-grow overflow-y-auto">
            {dishes.map((dish) => (
              <div
                key={dish.name}
                className={`relative border rounded-sm cursor-pointer ${
                  selectedDishes.includes(dish.name)
                    ? 'border-yellow-400'
                    : 'border-gray-300'
                }`}
                onClick={() => toggleDishSelection(dish.name)}
              >
                <div className="relative w-full h-[80px] lg:h-[100px] aspect-[4/5] lg:aspect-[5/4]">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                  />
                </div>
                <p className="font-bold text-black">{dish.name}</p>
                <p className="text-gray-600">{dish.locations} Locations</p>
                {selectedDishes.includes(dish.name) && (
                  <span className="absolute top-1 right-1 bg-yellow-400 text-black px-1">
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            className="bg-yellow-400 text-black font-bold mt-4 px-4 py-2 rounded w-full"
            onClick={() => setIsFilterOpen(false)}
          >
            Add to Filter ({selectedDishes.length})
          </button>
        </div>
      </div>

      {/* Menu Slide-in (Right to Left) */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 w-5/6 lg:w-1/3 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isMenuOpen
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Image
                src={'/images/foodprints-logo-menu.png'}
                alt="Logo"
                width={100}
                height={110}
              />
            </div>
            <button
              className="text-2xl text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiX />
            </button>
          </div>
          <ul className="space-y-4 flex-grow">
            <li
              className="text-black hover:text-yellow-500 cursor-pointer"
              onClick={handleHomeClick} // Navigate to homepage
            >
              Home
            </li>
            <li
              className="text-black hover:text-yellow-500 cursor-pointer"
              onClick={handleAboutClick} // Open About modal
            >
              About
            </li>
          </ul>
        </div>
      </div>

      {/* About Modal */}
      {/* About Modal */}
      {isAboutModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center h-screen w-screen"
          onClick={closeAboutModal}
        >
          <div
            className="bg-white p-6 w-full h-full max-w-none"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <section className="flex justify-between items-center">
              <Image
                src={'/images/DGLogo.png'}
                alt="DG Logo"
                width={400}
                height={20}
                className="w-1/3 h-1/3"
              />
              <button
                className="text-2xl text-black bg-yellow-300 p-2 rounded"
                onClick={closeAboutModal}
              >
                <FiX />
              </button>
            </section>
            <section>
              <About />
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
