'use client';

import React, { useRef } from 'react';
import { GoArrowRight } from "react-icons/go";
import { Dish } from "@/lib/dishData";
import DishImage from "@/components/dishes/DishImage";
import { useRouter } from "next/navigation";
import PanelManager, { PanelManagerRef } from './components/PanelManager'
import MenuButton from './components/buttons/MenuButton';

interface MobileLayoutProps {
  dishes: Dish[];
  activeIndex: number;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  dishes,
  activeIndex,
  handleTouchStart,
  handleTouchEnd,
  onNext,
  onPrev,
}) => {
  const activeDish = dishes[activeIndex];
  const router = useRouter();
  const panelRef = useRef<PanelManagerRef | null>(null);

  const handleWhereToEat = () => {
    if (activeDish.href === "/food-map") {
      router.push(
        `/food-map?dish=${encodeURIComponent(activeDish.name)}&view=map`
      );
    } else {
      router.push(activeDish.href);
    }
  };

  return (
    <div className="max-[899px]:flex hidden flex-col h-screen ">
      <PanelManager ref={panelRef} />
      {/* Button to open the menu */}
      <MenuButton onClick={() => panelRef.current?.openMenu()} />

      {/* Top Image */}
      <div className="relative w-full aspect-square" >
        <DishImage
          dish={activeDish}
          className="relative h-full w-full"
          imageClassName="z-10 object-cover"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          priority
        />
      </div>

      {/* Bottom Content */}
      <div className="bg-white flex flex-col rounded-t-lg w-full p-[24px] pt-[32px] gap-[20px] overflow-y-auto flex-1 z-10 relative -mt-[10%]">
        {/* Dish Name and Navigation */}
        <div className="flex items-center justify-between h-10 gap-4">
          <h1 className="text-3xl font-bold font-faustina text-[#202020]">
            {activeDish.name}
          </h1>

          {/* Chevron Navigation */}
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
        {/* Tagline */}
        <h3 className="font-bold italic text-base text-[#7c7c7c]">
          {activeDish.tagline}
        </h3>

        {/* Description */}
        <div className="mt-2 mb-6 text-[#2a2a2a] text-base ">
          <p className="leading-relaxed">{activeDish.description}</p>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Button */}
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

export default MobileLayout;
