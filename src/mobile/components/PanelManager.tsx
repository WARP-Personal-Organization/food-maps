"use client";

import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import MenuPanel from "./panels/MenuPanel";
import FilterPanel from "./panels/FilterPanel";
import AboutPanel from "./panels/AboutPanel";
import { Dish, Location, FoodPrint } from "@/types/types";
import PanelOverlay from "./panels/PanelOverlay";
import LocationSummaryPanel from "./panels/LocationSummaryPanel";
import LocationDetailPanel from "./panels/LocationDetailPanel";
import FoodPrintSummaryPanel from "./panels/FoodPrintSummaryPanel";
import FoodPrintDetailPanel from "./panels/FoodPrintDetailPanel";

interface PanelManagerProps {
  dishData?: Dish[];
  selectedDishes?: string[];
  onFilterApply?: (selectedDishes: string[]) => void;
}

type PanelType =
  | "menu"
  | "filter"
  | "about"
  | "locationSummary"
  | "locationDetail"
  | "foodPrintSummary"
  | "foodPrintDetail"
  | null;

export interface PanelManagerRef {
  openMenu: () => void;
  openFilter: () => void;
  openAbout: () => void;
  openLocationSummary: (location: Location) => void;
  openLocationDetail: (location: Location) => void;
  openFoodPrintSummary: (selectedFoodPrint: FoodPrint) => void;
  openFoodPrintDetail: (selectedFoodPrint: FoodPrint) => void;
}

const PanelManager: React.ForwardRefRenderFunction<
  PanelManagerRef,
  PanelManagerProps
> = ({ dishData = [], selectedDishes: selectedDishesProp = [], onFilterApply, }, ref) => {
  const [currentPanel, setCurrentPanel] = useState<PanelType>(null);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedFoodPrint, setSelectedFoodPrint] = useState<FoodPrint | null>(
    null
  );

  useEffect(() => {
    setSelectedDishes(selectedDishesProp);
  }, [selectedDishesProp]);


  const toggleDishSelection = (dish: string) => {
    setSelectedDishes((prevSelected) =>
      prevSelected.includes(dish)
        ? prevSelected.filter((item) => item !== dish)
        : [...prevSelected, dish]
    );
  };

  // Expose methods to parent using the ref
  useImperativeHandle(ref, () => ({
    openMenu: () => setCurrentPanel("menu"),
    openFilter: () => setCurrentPanel("filter"),
    openAbout: () => setCurrentPanel("about"),
    openLocationSummary: (location: Location) => {
      setSelectedLocation(location);
      setCurrentPanel("locationSummary");
    },
    openLocationDetail: (location: Location) => {
      setSelectedLocation(location);
      setCurrentPanel("locationDetail");
    },
    openFoodPrintSummary: (selectedFoodPrint: FoodPrint) => {
      setSelectedFoodPrint(selectedFoodPrint);
      setCurrentPanel("foodPrintSummary");
    },
    openFoodPrintDetail: (selectedFoodPrint: FoodPrint) => {
      setSelectedFoodPrint(selectedFoodPrint);
      setCurrentPanel("foodPrintDetail");
    },
    closeAllPanels: () => {
      setCurrentPanel(null);
      setSelectedLocation(null);
      setSelectedFoodPrint(null);
    },
  }));

  const isModalVisible =
    currentPanel !== null && ["menu", "filter"].includes(currentPanel);

  return (
    <>
      <PanelOverlay
        isVisible={isModalVisible}
        onClose={() => setCurrentPanel(null)}
        withBlur={currentPanel === "menu" || currentPanel === "filter"}
      />

      <MenuPanel
        isVisible={currentPanel === "menu"}
        onClose={() => setCurrentPanel(null)}
        onOpenAbout={() => setCurrentPanel("about")}
      />

      <FilterPanel
        isVisible={currentPanel === "filter"}
        dishData={dishData}
        selectedDishes={selectedDishes}
        toggleDishSelection={toggleDishSelection}
        onClose={() => setCurrentPanel(null)}
        onFilterApply={(filters) => {
          setSelectedDishes(filters);
          if (onFilterApply) onFilterApply(filters);
        }}
      />

      <AboutPanel
        isVisible={currentPanel === "about"}
        onClose={() => setCurrentPanel(null)}
      />

      <LocationSummaryPanel
        location={selectedLocation}
        isVisible={currentPanel === "locationSummary"}
        onClose={() => {
          setSelectedLocation(null);
          setCurrentPanel(null);
        }}
        onViewDetails={() => {
          setCurrentPanel("locationDetail");
        }}
      />

      <LocationDetailPanel
        location={selectedLocation}
        isVisible={currentPanel === "locationDetail"}
        isMobile={true}
        onClose={() => setCurrentPanel(null)}
      />

      <FoodPrintSummaryPanel
        selectedFoodPrint={selectedFoodPrint}
        isVisible={currentPanel === "foodPrintSummary"}
        onClose={() => {
          setSelectedLocation(null);
          setCurrentPanel(null);
        }}
        onReadArticle={() => {
          setCurrentPanel("foodPrintDetail");
        }}
      />

      <FoodPrintDetailPanel
        selectedFoodPrint={selectedFoodPrint}
        isVisible={currentPanel === "foodPrintDetail"}
        isMobile={true}
        onClose={() => setCurrentPanel(null)}
      />
    </>
  );
};

export default forwardRef(PanelManager);
