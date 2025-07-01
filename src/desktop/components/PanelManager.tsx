"use client";

import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import MenuPanel from "./panels/MenuPanel";
import FilterPanel from "./panels/FilterPanel";
import AboutPanel from "./panels/AboutPanel";
import { Dish, Location, FoodPrint, PanelType } from "@/types/types";
import PanelOverlay from "./panels/PanelOverlay";
import DishDetailsPanel from "./panels/DishDetails/DishDetailsPanel";
import LocationDetailPanel from "./panels/LocationDetailPanel";
import FoodPrintDetailPanel from "./panels/FoodPrintDetailPanel";
import ExplorePanel from "./panels/ExplorePanel";
import HomePanel from "./panels/HomePanel";
// import HomePanel from "./panels/HomePanel";

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
  closeMenu: () => void;
  closeAllPanels: () => void;
  openHome: () => void;
  getCurrentPanel: () => PanelType;
}

const PanelManager: React.ForwardRefRenderFunction<
  PanelManagerRef,
  PanelManagerProps
> = (
  { dishData = [], selectedDishes = [], onFilterApply, onClose, onPanelChange },
  ref
) => {
  const [currentPanel, setCurrentPanel] = useState<PanelType>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
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
      onPanelChange?.("dishDetails");
    },
    openMenu: () => setIsMenuVisible(true),
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
    closeMenu: () => {
      setIsMenuVisible(false);
    },
    closeAllPanels: () => {
      handleClosePanel();
    },
    getCurrentPanel: () => currentPanel,
  }));
  const handleClosePanel = (options?: { preserveFilters?: boolean }) => {
    if (
      !options?.preserveFilters &&
      currentPanel === "explore" &&
      onFilterApply
    ) {
    }

    if (onClose) onClose();
    setCurrentPanel(null);
    onPanelChange?.(null);
    setSelectedLocation(null);
    setSelectedFoodPrint(null);
  };
  useEffect(() => {
    setCurrentPanel("dishDetails");
    onPanelChange?.("dishDetails");
  }, [onPanelChange]);

  return (
    <>
      <PanelOverlay
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        withBlur={isMenuVisible || currentPanel === "filter"}
      />

      <MenuPanel
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onOpenHome={() => {
          setCurrentPanel("home");
          setIsMenuVisible(false);
        }}
        onOpenAbout={() => {
          setCurrentPanel("about");
          setIsMenuVisible(false);
        }}
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
        openMenu={() => setIsMenuVisible(true)}
        onClose={() => {
          setIsMenuVisible(false);
          setCurrentPanel(null);
        }}
        onFilterApply={(filters) => {
          if (onFilterApply) {
            onFilterApply(filters);
          }
        }}
      />

      <FilterPanel
        isVisible={currentPanel === "filter"}
        dishData={dishData}
        initialSelectedDishes={selectedDishes}
        onClose={handleClosePanel}
        onFilterApply={(filters) => {
          if (onFilterApply) {
            onFilterApply(filters);
            setTimeout(() => {
              if (filters.length > 0) {
                setCurrentPanel("explore");
                onPanelChange?.("explore");
              } else {
                handleClosePanel();
              }
            }, 0);
          }
        }}
      />

      <AboutPanel
        isVisible={currentPanel === "about"}
        onClose={handleClosePanel}
      />

      <LocationDetailPanel
        location={selectedLocation}
        isVisible={currentPanel === "locationDetail"}
        onClose={handleClosePanel}
        onViewDetails={() => {
          setCurrentPanel("locationDetail");
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
