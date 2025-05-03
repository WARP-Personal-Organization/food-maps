'use client';

import React, { useState, useImperativeHandle, forwardRef } from 'react';
import MenuPanel from './panels/MenuPanel';
import FilterPanel from './panels/FilterPanel';
import AboutPanel from './panels/AboutPanel';
import { Dish } from '@/types/types';

interface PanelManagerProps {
  dishes?: Dish[];
  onFilterApply?: (selectedDishes: string[]) => void;
}

type PanelType = 'menu' | 'filter' | 'about' | null;

export interface PanelManagerRef {
  openMenu: () => void;
  openFilter: () => void;
  openAbout: () => void;
}

const PanelManager: React.ForwardRefRenderFunction<PanelManagerRef, PanelManagerProps> = (
  { dishes = [], onFilterApply  },
  ref
) => {
  const [currentPanel, setCurrentPanel] = useState<PanelType>(null);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);

  const toggleDishSelection = (dish: string) => {
    setSelectedDishes((prevSelected) =>
      prevSelected.includes(dish)
        ? prevSelected.filter((item) => item !== dish)
        : [...prevSelected, dish]
    );
  };

  // Expose methods to parent using the ref
  useImperativeHandle(ref, () => ({
    openMenu: () => setCurrentPanel('menu'),
    openFilter: () => setCurrentPanel('filter'),
    openAbout: () => setCurrentPanel('about'),
  }));

  const isModalVisible = currentPanel !== null;

  return (
    <>
      {/* Overlay Background */}
      {isModalVisible && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={() => setCurrentPanel(null)}/>
      )}

      <MenuPanel
        isVisible={currentPanel === 'menu'}
        onClose={() => setCurrentPanel(null)}
        onOpenAbout={() => setCurrentPanel('about')}
      />

      <FilterPanel
        isVisible={currentPanel === 'filter'}
        dishes={dishes}
        selectedDishes={selectedDishes}
        toggleDishSelection={toggleDishSelection}
        onClose={() => setCurrentPanel(null)}
        onFilterApply={(filters) => {
          setSelectedDishes(filters);
          if (onFilterApply) onFilterApply(filters);
        }}
      />

      <AboutPanel
        isVisible={currentPanel === 'about'}
        onClose={() => setCurrentPanel(null)}
      />
    </>
  );
};

export default forwardRef(PanelManager);
