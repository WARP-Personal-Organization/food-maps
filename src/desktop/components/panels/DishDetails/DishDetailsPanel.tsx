'use client';

import React, { useEffect, useState } from 'react';
import CloseButton from '@/components/buttons/CloseButton';
import { Dish } from '@/types/types';
import DishDetails from '@/desktop/components/panels/DishDetails/DishDetails';

interface DishDetailsPanelProps {
  dishes: Dish[];
  activeFilters?: string[] | null;
  initialIndex?: number;
  isVisible: boolean;
  onClose: () => void;
}

const DishDetailsPanel: React.FC<DishDetailsPanelProps> = ({
  dishes,
  activeFilters = null,
  initialIndex = 0,
  isVisible,
  onClose,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (activeFilters) {
      const index = dishes.findIndex((dish) => dish.name === activeFilters[0]);
      if (index !== -1) setActiveIndex(index);
    }
  }, [activeFilters, dishes]);

  const handlePrevDish = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : dishes.length - 1));
  };

  const handleNextDish = () => {
    setActiveIndex((prev) => (prev < dishes.length - 1 ? prev + 1 : 0));
  };

  if (!isVisible || dishes.length === 0) return null;

  const currentDish = dishes[activeIndex];

  return (
    <div
      className={`fixed top-0 left-0 w-[300px] min-w-[300px] md:w-[320px] lg:w-[350px] xl:w-[400px] h-full bg-white shadow-lg z-10 transform transition-transform duration-300 
        ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="absolute items-center justify-between p-4">
        <CloseButton onClick={onClose} />
      </div>
      <CloseButton onClick={onClose} className="absolute top-5 right-5 z-40" />
      <DishDetails
        dish={currentDish}
        onPrevDish={handlePrevDish}
        onNextDish={handleNextDish}
      />
    </div>
  );
};

export default DishDetailsPanel;
