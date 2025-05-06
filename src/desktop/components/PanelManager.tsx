"use client";

import React, { useState, useImperativeHandle, forwardRef } from "react";
import MenuPanel from "./panels/MenuPanel";
import FilterPanel from "./panels/FilterPanel";
import AboutPanel from "./panels/AboutPanel";
import { Dish, Location, FoodPrint } from "@/types/types";
// import PanelOverlay from "./panels/PanelOverlay";
import LocationSummaryPanel from "./panels/LocationSummaryPanel";
import LocationDetailPanel from "./panels/LocationDetailPanel";
import FoodPrintSummaryPanel from "./panels/FoodPrintSummaryPanel";
import FoodPrintDetailPanel from "./panels/FoodPrintDetailPanel";
import DishDetailsPanel from "./panels/DishDetails/DishDetailsPanel";

interface PanelManagerProps {
  dishData?: Dish[];
  selectedDishes?: string[];
  onFilterApply?: (selectedDishes: string[]) => void;
  onClose?: () => void;
}

type PanelType =
  | "dishDetails"
  | "menu"
  | "filter"
  | "about"
  | "locationSummary"
  | "locationDetail"
  | "foodPrintSummary"
  | "foodPrintDetail"
  | null;

export interface PanelManagerRef {
  openDishDetails: () => void;
  openMenu: () => void;
  openFilter: () => void;
  openAbout: () => void;
  openLocationSummary: (location: Location) => void;
  openLocationDetail: (location: Location) => void;
  openFoodPrintSummary: (selectedFoodPrint: FoodPrint) => void;
  openFoodPrintDetail: (selectedFoodPrint: FoodPrint) => void;
  closeAllPanels: () => void;
}

const PanelManager: React.ForwardRefRenderFunction<
  PanelManagerRef,
  PanelManagerProps
> = ({ dishData = [], selectedDishes = [], onFilterApply, onClose }, ref) => {
  const [currentPanel, setCurrentPanel] = useState<PanelType>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedFoodPrint, setSelectedFoodPrint] = useState<FoodPrint | null>(
    null
  );

  // Expose methods to parent using the ref
  useImperativeHandle(ref, () => ({
    openDishDetails: () => {
      handleClosePanel();
      setCurrentPanel("dishDetails");
    },
    openMenu: () => {
      handleClosePanel();
      setCurrentPanel("menu");
    },
    openFilter: () => {
      handleClosePanel();
      setCurrentPanel("filter");
    },
    openAbout: () => {
      handleClosePanel();
      setCurrentPanel("about");
    },
    openLocationSummary: (location: Location) => {
      handleClosePanel();
      setSelectedLocation(location);
      setCurrentPanel("locationSummary");
    },
    openLocationDetail: (location: Location) => {
      handleClosePanel();
      setSelectedLocation(location);
      setCurrentPanel("locationDetail");
    },
    openFoodPrintSummary: (selectedFoodPrint: FoodPrint) => {
      handleClosePanel();
      setSelectedFoodPrint(selectedFoodPrint);
      setCurrentPanel("foodPrintSummary");
    },
    openFoodPrintDetail: (selectedFoodPrint: FoodPrint) => {
      handleClosePanel();
      setSelectedFoodPrint(selectedFoodPrint);
      setCurrentPanel("foodPrintDetail");
    },
    closeAllPanels: () => {
      handleClosePanel();
    },
  }));

  const handleClosePanel = () => {
    if (onClose) onClose();
    setCurrentPanel(null);
    setSelectedLocation(null);
    setSelectedFoodPrint(null);
  };

  // const isModalVisible =
  //   currentPanel !== null && ["menu", "filter"].includes(currentPanel);

  return (
    <>
      {/* <PanelOverlay
        isVisible={isModalVisible}
        onClose={handleClosePanel}
        withBlur={currentPanel === "menu" || currentPanel === "filter"}
      /> */}

      <DishDetailsPanel
        isVisible={currentPanel === "dishDetails"}
        dishes={dishData}
        activeFilters={selectedDishes}
        onClose={handleClosePanel}
      />

      <MenuPanel
        isVisible={currentPanel === "menu"}
        onClose={handleClosePanel}
        onOpenAbout={() => setCurrentPanel("about")}
      />

      <FilterPanel
        isVisible={currentPanel === "filter"}
        dishData={dishData}
        initialSelectedDishes={selectedDishes}
        onClose={handleClosePanel}
        onFilterApply={(filters) => {
          if (onFilterApply) onFilterApply(filters);
          setCurrentPanel(null);
        }}
      />

      <AboutPanel
        isVisible={currentPanel === "about"}
        onClose={handleClosePanel}
      />

      <LocationSummaryPanel
        location={selectedLocation}
        isVisible={currentPanel === "locationSummary"}
        onClose={handleClosePanel}
        onViewDetails={() => {
          setCurrentPanel("locationDetail");
        }}
      />

      <LocationDetailPanel
        location={selectedLocation}
        isVisible={currentPanel === "locationDetail"}
        isMobile={true}
        onClose={handleClosePanel}
      />

      <FoodPrintSummaryPanel
        selectedFoodPrint={selectedFoodPrint}
        isVisible={currentPanel === "foodPrintSummary"}
        onClose={handleClosePanel}
        onReadArticle={() => {
          setCurrentPanel("foodPrintDetail");
        }}
      />

      <FoodPrintDetailPanel
        selectedFoodPrint={selectedFoodPrint}
        isVisible={currentPanel === "foodPrintDetail"}
        isMobile={true}
        onClose={handleClosePanel}
      />
    </>
  );
};

export default forwardRef(PanelManager);
