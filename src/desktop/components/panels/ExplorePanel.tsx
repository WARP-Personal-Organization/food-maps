import React from 'react';
import { Location } from '@/types/types';
import LocationCard from '@/desktop/components/panels/DishDetails/LocationCard';
import { LocationData } from '@/lib/LocationData';
import CloseButton from '@/components/buttons/CloseButton';

interface ExplorePanelProps {
  activeFilters: string[];
  onFilterChange?: (filters: string[]) => void;
  isVisible?: boolean;
  onClose?: () => void;
}

const ExplorePanel: React.FC<ExplorePanelProps> = ({
  activeFilters,
  onFilterChange,
  isVisible = false,
  onClose,
}) => {
  const removeFilter = (filterName: string) => {
    onFilterChange?.(activeFilters.filter((filter) => filter !== filterName));
  };

  const getFilteredLocations = () => {
    const allLocations: Location[] = [];
    activeFilters.forEach((filter) => {
      if (LocationData[filter]) {
        allLocations.push(...LocationData[filter]);
      }
    });

    return allLocations.filter(
      (location, index, self) =>
        index === self.findIndex((l) => l.name === location.name)
    );
  };

  const filteredLocations = getFilteredLocations();

  return (
    <div
      className={`fixed top-0 left-0 w-[300px] min-w-[300px] md:w-[320px] lg:w-[350px] xl:w-[400px] h-full bg-white shadow-lg z-50 transform transition-transform duration-300 
        ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Explore Header */}
      <div className="flex justify-between items-center px-4 py-4">
        <h2 className="text-3xl font-bold font-serif">Explore</h2>
        <CloseButton onClick={onClose} />
      </div>

      {/* Active Filters Section */}
      <div className="px-4 pt-2">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-base">Active Filters</h3>
          <span className="text-gray-500">({activeFilters.length})</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((filter) => (
            <div
              key={filter}
              className="bg-[#FFD800] rounded-full px-4 py-1.5 text-gray-900 font-medium flex items-center gap-1 text-sm"
            >
              <span>{filter}</span>
              <button
                onClick={() => removeFilter(filter)}
                className="ml-1 cursor-pointer"
                aria-label={`Remove ${filter} filter`}
              >
                �
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="px-4 pt-2 pb-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-base">Results</h3>
          <span className="text-gray-500">({filteredLocations.length})</span>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((location, index) => (
            <LocationCard
              key={`${location.name}-${index}`}
              name={location.name}
              image={location.iconUrl || '/images/filter-dish/siopao.png'}
              location={
                location.address
                  ? location.address.split(',')[0]
                  : 'Iloilo City Proper'
              }
              duration="8 min"
              rating={4.2}
              tags={activeFilters.filter((filter) =>
                LocationData[filter]?.some((loc) => loc.name === location.name)
              )}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No locations found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePanel;
