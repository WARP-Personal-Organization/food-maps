'use client';

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import MenuButton from "@/components/buttons/MenuButton";
import { Dish } from '@/types/types';

interface HomePanelProps {
  dishes: Dish[];
  isVisible: boolean;
  openMenu: () => void;
  onClose: () => void;
}

const HomePanel: React.FC<HomePanelProps> = ({
  dishes,
  isVisible,
  openMenu,
  onClose,
}) => {
  // ✅ Always call hooks first
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  // ✅ Now you can safely guard rendering
  if (!isVisible || dishes.length === 0) return null;

  const activeDish = dishes[activeIndex] ?? dishes[0];

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
      className={`fixed bottom-0 w-full h-full bg-white z-30 rounded-t-sm shadow-lg
      transform transition-transform duration-300
      ${isVisible ? "translate-y-0" : "translate-y-full"}`}
    >
      <MenuButton onClick={openMenu} />

      {/* Top Image */}
      <div className="relative w-full h-[60vw] sm:h-[50vw] md:h-[40vw] lg:h-[300px]">
        <Image
          src={activeDish.image}
          alt={activeDish.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Scrollable Content */}
      <div className="flex flex-col overflow-y-auto h-[calc(100%-300px)] px-[24px] pt-[32px] pb-[100px] gap-[20px]">
        <div className="flex items-center justify-between h-10 gap-4">
          <h1 className="text-3xl font-bold font-faustina text-[#202020]">
            {activeDish.name}
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              className="h-10 w-10 p-2 rounded-full bg-[#ebebeb] flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Previous dish"
            >
              <span className="text-[#c2c2c2] text-sm">❮</span>
            </button>
            <button
              onClick={onNext}
              className="h-10 w-10 p-2 rounded-full bg-[#F9D408] flex items-center justify-center hover:bg-[#E6C207] transition-colors"
              aria-label="Next dish"
            >
              <span className="text-[#202020] text-sm">❯</span>
            </button>
          </div>
        </div>

        <h3 className="font-bold italic text-base text-[#7c7c7c]">
          {activeDish.tagline}
        </h3>

        <div className="mt-2 text-[#2a2a2a] text-base leading-relaxed">
          {activeDish.description}
        </div>
      </div>

      {/* Fixed Button */}
      <div className="absolute bottom-0 left-0 w-full px-[24px] pb-[24px] bg-white">
        <button
          onClick={handleWhereToEat}
          className="w-full bg-[#F9D408] text-[#3b3b3b] font-bold text-base
          py-2 rounded-[3px] text-center hover:bg-[#E6C207] transition-colors shadow-sm"
        >
          Where to Eat
        </button>
      </div>
    </div>
  );
};

export default HomePanel;
