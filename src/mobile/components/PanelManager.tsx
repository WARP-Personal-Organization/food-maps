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
import LocationSummaryPanel from "./panels/LocationSummaryPanel";
import LocationDetailPanel from "./panels/LocationDetailPanel";
import FoodPrintSummaryPanel from "./panels/FoodPrintSummaryPanel";
import FoodPrintDetailPanel from "./panels/FoodPrintDetailPanel";
import HomePanel from "./panels/HomePanel";

interface PanelManagerProps {
  dishData?: Dish[];
  selectedDishes?: string[];
  onFilterApply?: (selectedDishes: string[]) => void;
}

export interface PanelManagerRef {
  openMenu: () => void;
  openFilter: () => void;
  openAbout: () => void;
  openLocationSummary: (location: Location) => void;
  openLocationDetail: (location: Location) => void;
  openFoodPrintSummary: (selectedFoodPrint: FoodPrint) => void;
  openFoodPrintDetail: (selectedFoodPrint: FoodPrint) => void;
  openHome: () => void;
  closeAllPanels: () => void;
}

const PanelManager: React.ForwardRefRenderFunction<
  PanelManagerRef,
  PanelManagerProps
> = (
  { dishData = [], selectedDishes = [], onFilterApply },
  ref
) => {
    const [currentPanel, setCurrentPanel] = useState<PanelType>(null);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(
      null
    );
    const [selectedFoodPrint, setSelectedFoodPrint] = useState<FoodPrint | null>(
      null
    );

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
      openHome: () => {
        setCurrentPanel("home");
      },
      closeAllPanels: () => {
        setCurrentPanel(null);
        setSelectedLocation(null);
        setSelectedFoodPrint(null);
      },
    }));

      useEffect(() => {
        setCurrentPanel("home");
      }, []);

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
          onOpenHome={() => setCurrentPanel("home")}
          onOpenAbout={() => setCurrentPanel("about")}
        />

        <HomePanel
          isVisible={currentPanel === "home"}
          dishes={dishData}
          openMenu={() => setCurrentPanel("menu")}
          onClose={() => setCurrentPanel(null)}
        />

        <FilterPanel
          isVisible={currentPanel === "filter"}
          dishData={dishData}
          initialSelectedDishes={selectedDishes}
          onClose={() => setCurrentPanel(null)}
          onFilterApply={(filters) => {
            if (onFilterApply) onFilterApply(filters);
            setCurrentPanel(null);
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
          onClose={() => {
            setSelectedLocation(null);
            setCurrentPanel(null);
          }}
        />

        <FoodPrintSummaryPanel
          selectedFoodPrint={selectedFoodPrint}
          isVisible={currentPanel === "foodPrintSummary"}
          onClose={() => {
            setSelectedFoodPrint(null);
            setCurrentPanel(null);
          }}
          onReadArticle={() => {
            setCurrentPanel("foodPrintDetail");
          }}
        />

        <FoodPrintDetailPanel
          selectedFoodPrint={selectedFoodPrint}
          isVisible={currentPanel === "foodPrintDetail"}
          onClose={() => {
            setSelectedFoodPrint(null);
            setCurrentPanel(null);
          }}
        />
      </>
    );
  };

export default forwardRef(PanelManager);