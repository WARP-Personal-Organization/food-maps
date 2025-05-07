"use client";

import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import MenuPanel from "./panels/MenuPanel";
import FilterPanel from "./panels/FilterPanel";
import AboutPanel from "./panels/AboutPanel";
import { Dish, Location, FoodPrint, PanelType } from "@/types/types";
import PanelOverlay from "./panels/PanelOverlay";
import DishDetailsPanel from "./panels/DishDetails/DishDetailsPanel";
import LocationSummaryPanel from "./panels/LocationSummaryPanel";
import LocationDetailPanel from "./panels/LocationDetailPanel";
import FoodPrintSummaryPanel from "./panels/FoodPrintSummaryPanel";
import FoodPrintDetailPanel from "./panels/FoodPrintDetailPanel";
import ExplorePanel from "./panels/ExplorePanel";
import HomePanel from "./panels/HomePanel";

interface PanelManagerProps {
  dishData?: Dish[];
  selectedDishes?: string[];
  onFilterApply?: (selectedDishes: string[]) => void;
  onClose?: () => void;
  onPanelChange?: (panel: PanelType) => void;
}

export interface PanelManagerRef {
  openDishDetails: () => void;
  openMenu: () => void;
  openFilter: () => void;
  openAbout: () => void;
  openLocationSummary: (location: Location) => void;
  openLocationDetail: (location: Location) => void;
  openFoodPrintSummary: (selectedFoodPrint: FoodPrint) => void;
  openFoodPrintDetail: (selectedFoodPrint: FoodPrint) => void;
  openExplore: () => void;
  closeAllPanels: () => void;
  openHome: () => void;
  getCurrentPanel: () => PanelType;
}

const PanelManager: React.ForwardRefRenderFunction<
  PanelManagerRef,
  PanelManagerProps
> = ({ dishData = [], selectedDishes = [], onFilterApply, onClose, onPanelChange }, ref) => {
  const [currentPanel, setCurrentPanel] = useState<PanelType>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedFoodPrint, setSelectedFoodPrint] = useState<FoodPrint | null>(null);

  // Expose methods to parent using the ref
  useImperativeHandle(ref, () => ({
    openDishDetails: () => {
      handleClosePanel();
      setCurrentPanel("dishDetails");
      onPanelChange?.("dishDetails");
    },
    openMenu: () => {
      handleClosePanel();
      setCurrentPanel("menu");
      onPanelChange?.("menu");
    },
    openFilter: () => {
      handleClosePanel();
      setCurrentPanel("filter");
      onPanelChange?.("filter");
    },
    openAbout: () => {
      handleClosePanel();
      setCurrentPanel("about");
      onPanelChange?.("about");
    },
    openLocationSummary: (location: Location) => {
      handleClosePanel();
      setSelectedLocation(location);
      setCurrentPanel("locationSummary");
      onPanelChange?.("locationSummary");
    },
    openLocationDetail: (location: Location) => {
      handleClosePanel();
      setSelectedLocation(location);
      setCurrentPanel("locationDetail");
      onPanelChange?.("locationDetail");
    },
    openFoodPrintSummary: (selectedFoodPrint: FoodPrint) => {
      handleClosePanel();
      setSelectedFoodPrint(selectedFoodPrint);
      setCurrentPanel("foodPrintSummary");
      onPanelChange?.("foodPrintSummary");
    },
    openFoodPrintDetail: (selectedFoodPrint: FoodPrint) => {
      handleClosePanel();
      setSelectedFoodPrint(selectedFoodPrint);
      setCurrentPanel("foodPrintDetail");
      onPanelChange?.("foodPrintDetail");
    },
    openExplore: () => {
      handleClosePanel();
      setCurrentPanel("explore");
      onPanelChange?.("explore");
    },
    openHome: () => {
      handleClosePanel();
      setCurrentPanel("home");
      onPanelChange?.("home");
    },
    closeAllPanels: () => {
      handleClosePanel();
    },
    getCurrentPanel: () => currentPanel,
  }));

  useEffect(() => {
    setCurrentPanel("home");
    onPanelChange?.("home");
  }, [onPanelChange]);

  const handleClosePanel = () => {
    if (onClose) onClose();
    setCurrentPanel(null);
    onPanelChange?.(null);
    setSelectedLocation(null);
    setSelectedFoodPrint(null);
  };

  const handleOpenExplore = () => {
    if (onClose) onClose();
    setSelectedLocation(null);
    setSelectedFoodPrint(null);
    setCurrentPanel("explore");
    onPanelChange?.("explore");
  };

  const isModalVisible =
    currentPanel !== null && ["menu"].includes(currentPanel);

  return (
    <>
      <PanelOverlay
        isVisible={isModalVisible}
        onClose={handleClosePanel}
        withBlur={currentPanel === "menu"}
      />

      <DishDetailsPanel
        isVisible={currentPanel === "dishDetails"}
        dishes={dishData}
        activeFilters={selectedDishes}
        onClose={handleClosePanel}
      />

      <HomePanel
        isVisible={currentPanel === "home"}
        dishes={dishData}
        openMenu={() => setCurrentPanel("menu")}
        onClose={() => setCurrentPanel(null)}
      />

      <MenuPanel
        isVisible={currentPanel === "menu"}
        onClose={() => setCurrentPanel(null)}
        onOpenHome={() => setCurrentPanel("home")}
        onOpenAbout={() => setCurrentPanel("about")}
      />

      <FilterPanel
        isVisible={currentPanel === "filter"}
        dishData={dishData}
        initialSelectedDishes={selectedDishes}
        onClose={handleOpenExplore}
        onFilterApply={(filters) => {
          if (onFilterApply) onFilterApply(filters);
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
          onPanelChange?.("locationDetail");
        }}
      />

      <LocationDetailPanel
        location={selectedLocation}
        isVisible={currentPanel === "locationDetail"}
        onClose={handleClosePanel}
      />

      <FoodPrintSummaryPanel
        selectedFoodPrint={selectedFoodPrint}
        isVisible={currentPanel === "foodPrintSummary"}
        onClose={handleClosePanel}
        onReadArticle={() => {
          setCurrentPanel("foodPrintDetail");
          onPanelChange?.("foodPrintDetail");
        }}
      />

      <FoodPrintDetailPanel
        selectedFoodPrint={selectedFoodPrint}
        isVisible={currentPanel === "foodPrintDetail"}
        onClose={handleClosePanel}
      />

      <ExplorePanel
        activeFilters={selectedDishes}
        onFilterChange={onFilterApply}
        isVisible={currentPanel === "explore"}
        onClose={handleClosePanel}
      />
    </>
  );
};

export default forwardRef(PanelManager);
