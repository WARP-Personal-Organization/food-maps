'use client';

import { useState, useEffect } from 'react';
import { foodPrintsData, FoodPrint } from '@/lib/foodprintData';
import { FoodprintMarker } from './FoodprintMarker';
import FoodPrintDetailsPanel from './FoodprintDetailsPanel';

interface MapFoodprintMarkersProps {
  selectedDish: string | null;
}

export const MapFoodprintMarkers = ({
  selectedDish,
}: MapFoodprintMarkersProps) => {
  const [selectedFoodprint, setSelectedFoodprint] = useState<FoodPrint | null>(
    null
  );

  useEffect(() => {
    // Debug logging
    console.log('MapFoodprintMarkers - selectedDish:', selectedDish);
    console.log('Available dishes:', foodPrintsData.dishTypes);
    console.log('Total markers:', foodPrintsData.markers.length);

    if (selectedDish) {
      const dishMarkers = foodPrintsData.markers.filter(
        (marker) => marker.dishName === selectedDish
      );
      console.log(
        `Found ${dishMarkers.length} markers for dish "${selectedDish}":`,
        dishMarkers
      );
    }
  }, [selectedDish]);

  // Early return if no dish is selected
  if (!selectedDish) {
    console.log('No dish selected, not rendering any markers');
    return null;
  }

  // Get foodprint markers for the selected dish
  const markers = foodPrintsData.markers.filter(
    (marker) => marker.dishName === selectedDish
  );

  console.log('Rendering markers:', markers);

  const handleMarkerClick = (foodprint: FoodPrint) => {
    console.log('Marker clicked:', foodprint.name);
    setSelectedFoodprint(foodprint);
  };

  const handleClosePanel = () => {
    setSelectedFoodprint(null);
  };

  return (
    <>
      {markers.map((foodprint) => (
        <FoodprintMarker
          key={foodprint.name}
          foodprint={foodprint}
          onClick={handleMarkerClick}
        />
      ))}

      <FoodPrintDetailsPanel
        selectedFoodPrint={selectedFoodprint}
        onClose={handleClosePanel}
      />
    </>
  );
};
