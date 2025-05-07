'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import CarouselControls from '../../../components/carousel/CarouselControls';
import { Dish } from '@/types/types';
import { PanelManagerRef } from '../PanelManager';
import { useRouter } from 'next/navigation';

interface HomePanelProps {
  dishes: Dish[];
  isVisible: boolean;
  onClose: () => void;
}

const HomePanel: React.FC<HomePanelProps> = ({
  dishes,
  isVisible,
  onClose,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDish = dishes[activeIndex] ?? dishes[0];
  const router = useRouter();
  const panelRef = useRef<PanelManagerRef | null>(null);

  if (!isVisible || dishes.length === 0) return null;

  const onNext = () => {
    setActiveIndex((prev) => (prev + 1) % dishes.length);
  };

  const onPrev = () => {
    setActiveIndex((prev) => (prev - 1 + dishes.length) % dishes.length);
  };

  const handleWhereToEat = () => {
    if (activeDish.href === "/") {
      router.push(`/?dish=${encodeURIComponent(activeDish.name)}&view=map`);
    } else {
      router.push(activeDish.href);
    }
    onClose();
  };

  return (
    <div
      className={`fixed flex h-full w-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Left Side - Text */}
      <div className="w-[30%] flex flex-col justify-center items-center p-10 overflow-y-auto">
        <h2 className="italic text-gray-600 text-lg">Ilonggo&apos;s Best Dishes</h2>
        <h1 className="text-4xl font-bold mt-2">{activeDish?.name}</h1>
        <h3 className="italic text-gray-500 text-lg">{activeDish?.tagline}</h3>
        <p className="text-gray-700 mt-4">{activeDish?.description}</p>

        <button className="mt-6 w-[345px] bg-[#F9D408] text-black font-bold py-3 rounded text-center cursor-pointer hover:bg-[#e6c207] transition"
          onClick={handleWhereToEat}>
          Where to Eat
        </button>

        <CarouselControls
          activeIndex={activeIndex}
          itemsCount={dishes.length}
          onNext={onNext}
          onPrev={onPrev}
          className="mt-6"
        />
      </div>

      {/* Right Side - Dish Image */}
      <div className="w-[70%] relative h-full">
        <Image
          src={activeDish.image}
          alt={activeDish.name}
          layout="fill"
          objectFit="cover"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default HomePanel;
