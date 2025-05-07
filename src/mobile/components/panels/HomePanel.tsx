'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import PanelManager, { PanelManagerRef } from '../PanelManager';
import MenuButton from "@/components/buttons/MenuButton";
import { Dish } from '@/types/types';

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
  if (!isVisible || dishes.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const router = useRouter();
  const panelRef = useRef<PanelManagerRef | null>(null);

  const activeDish = dishes[activeIndex] ?? dishes[0];

  const onNext = () => {
    setActiveIndex((prev) => (prev + 1) % dishes.length);
  };

  const onPrev = () => {
    setActiveIndex((prev) => (prev - 1 + dishes.length) % dishes.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      onNext();
    } else if (diff < -50) {
      onPrev();
    }

    setTouchStartX(null);
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
      className={`fixed bottom-0 w-full h-full bg-white z-60 rounded-t-sm shadow-lg 
  overflow-y-auto overflow-x-hidden
  transform transition-transform duration-300
  ${isVisible ? "translate-y-0" : "translate-y-full"}`}
    >
      <PanelManager ref={panelRef} />
      <MenuButton onClick={() => panelRef.current?.openMenu()} />

      {/* Top Image */}
      <div className="relative w-full aspect-square">
        <div className="w-full relative h-full">
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

      {/* Bottom Content */}
      <div className="bg-white flex flex-col rounded-t-lg w-full p-[24px] pt-[32px] gap-[20px] overflow-y-auto flex-1 z-10 relative -mt-[10%]">
        <div className="flex items-center justify-between h-10 gap-4">
          <h1 className="text-3xl font-bold font-faustina text-[#202020]">
            {activeDish.name}
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              className="h-10 w-10 p-2 rounded-full bg-[#ebebeb] flex items-center justify-center focus:outline-none 
              cursor-pointer hover:bg-gray-200 transition-colors"
              aria-label="Previous dish"
            >
              <span className="text-[#c2c2c2] text-sm">❮</span>
            </button>
            <button
              onClick={onNext}
              className="h-10 w-10 p-2 rounded-full bg-[#F9D408] flex items-center justify-center focus:outline-none 
              cursor-pointer hover:bg-[#E6C207] transition-colors"
              aria-label="Next dish"
            >
              <span className="text-[#202020] text-sm">❯</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <h3 className="font-bold italic text-base text-[#7c7c7c]">
            {activeDish.tagline}
          </h3>

          <div className="mt-2 mb-6 text-[#2a2a2a] text-base ">
            <p className="leading-relaxed">{activeDish.description}</p>
          </div>

          <div className="flex-grow" />

          <button
            onClick={handleWhereToEat}
            className="w-full bg-[#F9D408] text-[#3b3b3b] font-bold text-base
            py-2 rounded-[3px] text-center inline-block cursor-pointer hover:bg-[#E6C207] transition-colors shadow-sm"
          >
            Where to Eat
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePanel;
