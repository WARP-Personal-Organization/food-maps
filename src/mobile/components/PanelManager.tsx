'use client';

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiMenu, FiX } from 'react-icons/fi';
import { LuUtensils } from 'react-icons/lu';

import AboutModal from './modals/AboutModal';

const dishes = [
  { name: 'Siopao', locations: 5, image: '/images/filter-dish/siopao.jpg' },
  { name: 'La Paz Batchoy', locations: 3, image: '/images/filter-dish/batchoy.webp' },
  { name: 'Cansi', locations: 4, image: '/images/filter-dish/cansi.jpg' },
  { name: 'Inasal', locations: 6, image: '/images/filter-dish/inasal.jpg' },
  { name: 'KBL', locations: 2, image: '/images/filter-dish/kbl.jpg' },
  { name: 'Pancit Molo', locations: 3, image: '/images/filter-dish/pancit_molo.jpg' },
];

type PanelType = 'menu' | 'filter' | 'about';

export interface PanelManagerRef {
  openPanel: (panel: PanelType) => void;
  closePanel: () => void;
}

const PanelManager = forwardRef<PanelManagerRef>((_, ref) => {
  const [currentPanel, setCurrentPanel] = useState<PanelType | null>(null);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);

  const menuRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    openPanel: (panel) => setCurrentPanel(panel),
    closePanel: () => setCurrentPanel(null),
  }));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        (menuRef.current && !menuRef.current.contains(event.target as Node)) ||
        (filterRef.current && !filterRef.current.contains(event.target as Node))
      ) {
        setCurrentPanel(null);
      }
    }

    if (currentPanel === 'menu' || currentPanel === 'filter') {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [currentPanel]);

  const toggleDishSelection = (dish: string) => {
    setSelectedDishes((prev) =>
      prev.includes(dish) ? prev.filter((d) => d !== dish) : [...prev, dish]
    );
  };

  const handleHomeClick = () => {
    setCurrentPanel(null);
    router.push('/');
  };

  return (
    <div className="relative z-50">
      {/* Overlay */}
      {currentPanel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
          onClick={() => setCurrentPanel(null)}
        />
      )}

      {/* Menu Panel */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 w-5/6 md:w-1/3 h-full bg-white shadow-lg z-50 transition-transform duration-300 ${
          currentPanel === 'menu' ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <Image
              src="/images/foodprints-logo-menu.png"
              alt="Logo"
              width={100}
              height={110}
            />
            <button
              className="text-2xl bg-gray-200 rounded p-2 text-black"
              onClick={() => setCurrentPanel(null)}
            >
              <FiX />
            </button>
          </div>

          <ul className="space-y-4 flex-grow">
            <li
              className="text-black text-3xl font-bold hover:text-yellow-500 cursor-pointer flex justify-between items-center"
              onClick={handleHomeClick}
            >
              Home <p className="text-sm font-light text-amber-300">01</p>
            </li>
            <hr className="border-amber-300 my-8" />
            <li
              className="text-black text-3xl font-bold hover:text-yellow-500 cursor-pointer flex justify-between items-center"
              onClick={() => setCurrentPanel('about')}
            >
              About <p className="text-sm font-light text-amber-300">02</p>
            </li>
          </ul>

          <section className="text-sm font-medium">
            <div className="flex flex-col gap-y-3">
              <h2 className="text-amber-300 font-bold">WEBSITE</h2>
              <a
                href="https://dailyguardian.com.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:underline"
              >
                dailyguardian.com.ph
              </a>
            </div>
            <div className="flex flex-col my-8 gap-y-3">
              <h2 className="text-amber-300 font-bold">EXPLORE</h2>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/DailyGuardianPH/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline"
                >
                  FACEBOOK
                </a>
                <span>/</span>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline"
                >
                  INSTAGRAM
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Filter Panel */}
      <div
        ref={filterRef}
        className={`fixed top-0 left-0 w-5/6 md:w-1/3 h-full bg-white shadow-lg z-50 transition-transform duration-300 ${
          currentPanel === 'filter' ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-start mb-4">
            <LuUtensils className="text-black" />
            <h2 className="text-xl font-semibold text-black ml-2">Filter Dishes</h2>
            <button
              className="text-2xl text-black ml-auto"
              onClick={() => setCurrentPanel(null)}
            >
              <FiX />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 flex-grow overflow-y-auto">
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
                <div className="relative w-full h-[100px] aspect-[5/4]">
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
                  <span className="absolute top-1 right-1 bg-yellow-400 text-black px-1">\u2713</span>
                )}
              </div>
            ))}
          </div>

          <button
            className="bg-yellow-400 text-black font-bold mt-4 px-4 py-2 rounded w-full"
            onClick={() => setCurrentPanel(null)}
          >
            Add to Filter ({selectedDishes.length})
          </button>
        </div>
      </div>

      {/* About Modal */}
      {currentPanel === 'about' && <AboutModal onClose={() => setCurrentPanel(null)} />}
    </div>
  );
});

PanelManager.displayName = 'PanelManager';
export default PanelManager;
