'use client';

import React from 'react';
import { ilonggoDishes } from '@/lib/dishData';
import useCarousel from '@/hooks/useCarousel';
import MobileLayout from './layout/MobileLayout';
import DesktopLayout from './layout/DesktopLayout';

export default function HomePage() {
  const { activeIndex, next, prev, handleTouchStart, handleTouchEnd } =
    useCarousel({
      itemsCount: ilonggoDishes.length,
    });

  return (
    <div className="h-screen w-full">
      {/* Mobile layout */}
      <MobileLayout
        dishes={ilonggoDishes}
        activeIndex={activeIndex}
        handleTouchStart={handleTouchStart}
        handleTouchEnd={handleTouchEnd}
        onNext={next}
        onPrev={prev}
      />

      {/* Desktop layout */}
      <DesktopLayout
        dishes={ilonggoDishes}
        activeIndex={activeIndex}
        onNext={next}
        onPrev={prev}
      />
    </div>
  );
}
