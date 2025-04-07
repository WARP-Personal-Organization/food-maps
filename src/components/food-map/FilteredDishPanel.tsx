'use client';

import React, { useState, useEffect } from 'react';
import { Dish } from '@/lib/dishData';
import DishDetailsView from '../dishes/DishDetailsView';

interface FilteredDishPanelProps {
  dishes: Dish[];
  activeFilter: string | null;
  onClose?: () => void;
}

const FilteredDishPanel: React.FC<FilteredDishPanelProps> = ({
  dishes,
  activeFilter,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Find the index of the filtered dish
  useEffect(() => {
    if (activeFilter) {
      const index = dishes.findIndex((dish) => dish.name === activeFilter);
      if (index !== -1) {
        setActiveIndex(index);
      }
    }
  }, [activeFilter, dishes]);

  const handlePrevDish = () => {
    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : dishes.length - 1;
      return newIndex;
    });
  };

  const handleNextDish = () => {
    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex < dishes.length - 1 ? prevIndex + 1 : 0;
      return newIndex;
    });
  };

  if (!activeFilter) return null;

  const currentDish = dishes[activeIndex];

  return (
    <div className="h-full w-full">
      <DishDetailsView
        dish={currentDish}
        onPrevDish={handlePrevDish}
        onNextDish={handleNextDish}
      />
    </div>
  );
};

export default FilteredDishPanel;
