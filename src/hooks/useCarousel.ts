import { useState, useRef } from 'react';

interface UseCarouselProps {
  itemsCount: number;
}

export function useCarousel({ itemsCount }: UseCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % itemsCount);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + itemsCount) % itemsCount);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;

    if (touchStartX.current - touchEndX.current > 50) {
      next(); // Swipe left
    } else if (touchStartX.current - touchEndX.current < -50) {
      prev(); // Swipe right
    }
  };

  return {
    activeIndex,
    setActiveIndex,
    next,
    prev,
    handleTouchStart,
    handleTouchEnd,
  };
}

export default useCarousel;
