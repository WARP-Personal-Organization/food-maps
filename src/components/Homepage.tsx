'use client';

import React from 'react';
import { DishData } from '@/lib/DishData';
import useCarousel from '@/hooks/useCarousel';
import MobileLayout from '@/mobile/MobileLayout';
import DesktopLayout from '../desktop/DesktopLayout';

export default function HomePage() {
  const { activeIndex, next, prev, handleTouchStart, handleTouchEnd } =
    useCarousel({
      itemsCount: DishData.length,
    });

  return (
    <div className="h-screen w-full">
      {/* Mobile layout */}
      <MobileLayout
        dishes={DishData}
        activeIndex={activeIndex}
        handleTouchStart={handleTouchStart}
        handleTouchEnd={handleTouchEnd}
        onNext={next}
        onPrev={prev}
      />

      {/* Desktop layout */}
      <DesktopLayout
        dishes={DishData}
        activeIndex={activeIndex}
        onNext={next}
        onPrev={prev}
      />
    </div>
  );
}
