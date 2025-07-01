import React from 'react';
import { Location } from '@/types/types';
import { LocationData } from '@/lib/LocationData';
import CloseButton from '@/components/buttons/CloseButton';
import { denormalizeKey } from '@/lib/utils';
import { MapPin, Search, X, Compass } from 'lucide-react';
import Image from 'next/image';
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
    <>

      {/* Explore Panel */}
      <div
        className={`fixed top-0 left-0 w-[300px] min-w-[300px] md:w-[320px] lg:w-[350px] xl:w-[400px] h-full bg-white shadow-2xl z-50 transform transition-all duration-500 ease-out border-r-4 border-yellow-300
          ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} flex flex-col`}
      >
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 sm:p-6 border-b-2 border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-300 rounded-xl shadow-sm">
                <Compass className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Explore</h2>
                <p className="text-sm text-gray-600">Discover local spots</p>
              </div>
            </div>
            <CloseButton 
              onClick={onClose}
              className="p-2.5 hover:bg-white/80 rounded-full transition-all duration-300 shadow-sm"
            />
          </div>
          
          {/* Stats indicator */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-yellow-200">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="text-base sm:text-lg font-bold text-gray-900">{activeFilters.length}</p>
                <p className="text-xs text-gray-600">Active Filters</p>
              </div>
              <div className="w-px h-6 sm:h-8 bg-yellow-200"></div>
              <div className="text-center flex-1">
                <p className="text-base sm:text-lg font-bold text-yellow-600">{filteredLocations.length}</p>
                <p className="text-xs text-gray-600">Locations Found</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Section */}
        {activeFilters.length > 0 && (
          <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-yellow-500" />
                Active Filters
              </h3>
              <button
                onClick={() => onFilterChange?.([])}
                className="text-yellow-600 hover:text-yellow-700 font-medium text-sm transition-colors duration-300"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <div
                  key={filter}
                  className="bg-yellow-300 hover:bg-yellow-400 rounded-full px-4 py-2 text-gray-900 font-semibold flex items-center gap-2 text-sm shadow-sm transition-all duration-300"
                >
                  <span>{denormalizeKey(filter)}</span>
                  <button
                    onClick={() => removeFilter(filter)}
                    className="w-4 h-4 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors duration-300"
                    aria-label={`Remove ${filter} filter`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="p-4 sm:p-6 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-yellow-500" />
              Locations Found
            </h3>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
              {filteredLocations.length} result{filteredLocations.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Enhanced Scrollable Results List */}
        <div className="flex-1 overflow-y-auto bg-gray-50 px-4 sm:px-6 pb-6">
          {filteredLocations.length > 0 ? (
            <div className="space-y-3 pt-4">
              {filteredLocations.map((location, index) => (
                <div key={`${location.name}-${index}`} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-yellow-300 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={location.iconUrl || '/images/filter-dish/siopao.png'}
                        alt={location.name}
                        className="w-full h-full object-cover"
                        fill
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                        {location.name}
                      </h4>
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-600 line-clamp-1">
                          {location.address ? location.address.split(',')[0] : 'Iloilo City Proper'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">8 min</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">⭐ 4.2</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {activeFilters.filter((filter) =>
                            LocationData[filter]?.some((loc) => loc.name === location.name)
                          ).slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium"
                            >
                              {denormalizeKey(tag)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-100 rounded-full w-6 h-6 flex items-center justify-center">
                      <span className="text-xs font-bold text-yellow-700">{index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              {activeFilters.length > 0 ? (
                <>
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">No locations found</h4>
                  <p className="text-gray-600 text-sm max-w-64 leading-relaxed mb-4">
                    No locations match your current filters. Try adjusting your selection.
                  </p>
                  <button
                    onClick={() => onFilterChange?.([])}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-xl transition-colors duration-300"
                  >
                    Clear all filters
                  </button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Compass className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Start exploring</h4>
                  <p className="text-gray-600 text-sm max-w-64 leading-relaxed">
                    Apply some filters to discover amazing local food spots in your area.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExplorePanel;