# Food Maps - Component Flow and User Interactions

This document outlines the main component interactions and user flow in the Food Maps application. It serves as a reference for understanding how different parts of the application work together.

## Core Component Relationships

![Component Flow Diagram]

### Main Component Hierarchy

```
FoodMapPage
├── FoodMapContent
│   └── FoodMapLayout
│       ├── LeftSidePanel
│       │   ├── AllDishesView
│       │   ├── FilteredDishPanel
│       │   ├── LocationDetailPanel
│       │   └── FoodPrintDetailsPanel
│       └── RightSideMapPanel / MobileMapPanel
│           ├── MapComponent
│           ├── FilterUI (DishFilter)
│           ├── LocationMarkers
│           └── FoodprintMarkers
```

## User Interaction Flows

### 1. Initial Application Load

1. User navigates to the application
2. `LoadingScreen` is displayed via `Suspense` and `DelayedComponent`
3. After loading completes, the main application renders
4. URL parameters are checked for initial state (filtered dishes, view mode)
5. Based on URL parameters, the app initializes with the appropriate view

### 2. Dish Filtering Flow

1. User clicks on the filter button in the map interface
2. `toggleFilterDishesView()` is called, setting `isFilterDishesViewOpen` to true
3. A custom event `preventPanelCollapse` is dispatched to prevent panel collapse
4. `LeftSidePanel` switches to show the `AllDishesView` component
5. User selects dishes by clicking on dish cards
6. `handleFilterChange()` updates `activeFilters` state
7. `updateUrl()` updates the URL with selected dish parameters
8. The map updates to show only locations for selected dishes

```typescript
// Filter change handler
const handleFilterChange = (newFilters: string[]) => {
  setActiveFilters(newFilters);
  updateUrl(newFilters);
};
```

### 3. Location Selection Flow

1. User clicks on a location marker in the map
2. `handleLocationClick(location)` is called in `FoodMapLayout`
3. `selectedLocation` state is updated, `selectedFoodprint` is cleared
4. `isPanelCollapsed` is set to false to ensure panel is visible
5. `LeftSidePanel` renders the `LocationDetailPanel` with selected location data
6. User can see details about the establishment including photos, hours, etc.

```typescript
const handleLocationClick = (location: Location) => {
  setSelectedLocation(location);
  setSelectedFoodprint(null); // Clear any selected foodprint
  setIsPanelCollapsed(false); // Ensure panel is expanded
};
```

### 4. Panel Toggle Flow

1. User clicks the collapse/expand button
2. `togglePanelCollapse()` is called
3. `isPanelCollapsed` state is toggled
4. CSS classes are updated to show/hide the panel with animations
5. The map area expands/contracts accordingly

```typescript
// Panel collapse styles for desktop
<div
  className={`${
    isPanelCollapsed && !isFilterDishesViewOpen
      ? 'w-0 opacity-0'
      : 'min-[900px]:w-[260px] lg:w-[300px] xl:w-[360px] 2xl:w-[450px] opacity-100'
  } h-full overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0 border-r border-gray-200`}
>
```

### 5. URL Parameter Handling Flow

1. URL parameters are read when component mounts
2. Parameters like `dish` and `view` are parsed
3. Component state is synchronized with URL parameters
4. When state changes, URL is updated to remain in sync
5. This allows for shareable, bookmarkable application states

```typescript
// URL parameter handling on component mount
useEffect(() => {
  if (!window.location.search) return;

  const searchParams = new URLSearchParams(window.location.search);
  const dishParam = searchParams.get('dish');
  const viewParam = searchParams.get('view');

  // Set active filters based on URL
  if (dishParam && onFilterChange) {
    const newFilters = dishParam.split(',');
    if (JSON.stringify(activeFilters) !== JSON.stringify(newFilters)) {
      onFilterChange(newFilters);
    }
  }

  // Set view mode based on URL
  if (viewParam === 'map') {
    setIsPanelCollapsed(true);
  }
}, [onFilterChange, activeFilters]);
```

### 6. Food Print Selection Flow

1. User clicks on a food print marker in the map
2. `handleFoodprintClick(foodprint)` is called in `FoodMapLayout`
3. `selectedFoodprint` state is updated, `selectedLocation` is cleared
4. `isPanelCollapsed` is set to false to ensure panel is visible
5. `LeftSidePanel` renders the `FoodPrintDetailsPanel` with selected food print data
6. User can see details about the food print including photos, author info, etc.

```typescript
// Food print click handler
const handleFoodprintClick = (foodprint: FoodPrint) => {
  setSelectedFoodprint(foodprint);
  setSelectedLocation(null); // Clear any selected location
  setIsPanelCollapsed(false); // Ensure panel is expanded
};
```

The food print marker components and their interactions are defined in:

- `src/components/map/FoodPrintMarker.tsx`: The visual marker on the map
- `src/components/map/MapComponent.tsx`: Where markers are rendered
- `FoodPrintDetailsPanel.tsx`: The panel showing food print details
- `src/lib/foodprintData.ts`: Data structure and sample food prints

This flow allows users to explore community-generated content about specific dishes at various locations.

## Custom Events

The application uses custom DOM events for cross-component communication:

### 1. `preventPanelCollapse`

Fired when the filter view is toggled to prevent the panel from collapsing.

```typescript
const preventCollapseEvent = new CustomEvent('preventPanelCollapse', {
  bubbles: true,
  detail: { isOpeningFilter: !isFilterDishesViewOpen },
});
document.dispatchEvent(preventCollapseEvent);
```

### 2. `closeLocationDetail`

Fired when opening the filter dishes view to close any open location detail.

```typescript
const closeLocationEvent = new CustomEvent('closeLocationDetail', {
  bubbles: true,
});
document.dispatchEvent(closeLocationEvent);
```

### 3. `clearFilters`

Fired when the clear filters button is clicked.

```typescript
const handleClearFilters = () => {
  setActiveFilters([]);
  updateUrl([]);
};

window.addEventListener('clearFilters', handleClearFilters);
```

## Responsive Behavior Flow

### Desktop to Mobile Transition

The application uses media queries to switch between layouts:

1. Above 900px: Desktop layout with side-by-side panels

   ```html
   <div
     className="hidden min-[900px]:flex h-screen w-full bg-white overflow-hidden"
   >
     <!-- Desktop layout components -->
   </div>
   ```

2. Below 900px: Mobile layout with stacked panels
   ```html
   <div className="hidden max-[899px]:flex flex-col h-screen">
     <!-- Mobile layout components -->
   </div>
   ```

### Mobile-Specific Interactions

1. Mobile view uses absolute positioning for the panel

   ```html
   <div className="absolute inset-0 z-30 pt-16">
     <LeftSidePanel ... />
   </div>
   ```

2. The map is always rendered, but placed behind the panel when panel is visible

3. A back button is shown on the map when the panel is collapsed
   ```typescript
   showBackButton={isPanelCollapsed && !isFilterDishesViewOpen}
   ```

## Data Flow

### Dish Data → UI Components

1. Static dish data is defined in `src/lib/dishData.ts`
2. Components like `AllDishesView` receive this data as props
3. Filtering is applied to the data array based on user selections
4. Filtered data is passed to child components for rendering

### Location Data → Map Markers

1. Static location data is defined in `src/lib/locationData.ts`
2. Based on active filters, relevant locations are extracted
3. Locations are passed to the map component for marker rendering
4. When a marker is clicked, the location object is passed to the detail panel

```typescript
// Filtering locations based on active filters
const allLocations = useMemo(() => {
  const allLocs: Location[] = [];
  if (activeFilters.length > 0) {
    // Only include locations for active filters
    activeFilters.forEach((filter) => {
      if (locationsMap[filter]) {
        allLocs.push(...locationsMap[filter]);
      }
    });
  } else {
    // Include all locations when no filters are active
    Object.values(locationsMap).forEach((locations) => {
      allLocs.push(...locations);
    });
  }
  return allLocs;
}, [locationsMap, activeFilters]);
```

## State Management Approaches

### Props Drilling

The application primarily uses props drilling for state management:

```typescript
<FoodMapLayout
  dishes={filteredDishes}
  locationsMap={dishLocations}
  activeFilters={activeFilters}
  onFilterChange={handleFilterChange}
  isFilterDishesViewOpen={isFilterDishesViewOpen}
  toggleFilterDishesView={toggleFilterDishesView}
  initialPanelCollapsed={initialPanelCollapsed}
  filterUI={/* ... */}
/>
```

### Custom Events for Cross-Component Communication

Used for events that need to cross component boundaries without direct parent-child relationships.

### URL Parameters for Shareable State

URL parameters are used to maintain state that should be shareable or bookmarkable.

## Component Lifecycle Examples

### Component Mount Actions

```typescript
useEffect(() => {
  setMounted(true);

  // Initialize from URL parameters
  const viewParam = searchParams.get('view');
  if (viewParam === 'map') {
    setInitialPanelCollapsed(true);
  }

  // Setup event listeners
  window.addEventListener('clearFilters', handleClearFilters);

  // Cleanup event listeners on unmount
  return () => {
    window.removeEventListener('clearFilters', handleClearFilters);
  };
}, [searchParams]);
```

### Conditional Rendering for Mobile/Desktop

The application uses conditional rendering based on screen size:

```jsx
// Desktop view (900px and up)
<div className="hidden min-[900px]:flex h-screen w-full">
  {/* Desktop components */}
</div>

// Mobile view (below 900px)
<div className="hidden max-[899px]:flex flex-col h-screen">
  {/* Mobile components */}
</div>
```

## LeftSidePanel Component Details

The LeftSidePanel component is a central part of the application's UI that adapts its contents based on the current state. Located at `src/components/layout/LeftSidePanel.tsx`, it serves as a container for four different view components:

### Panel Content Flow Control

```typescript
// Function that determines which panel content to render
const renderAppropriatePanelContent = () => {
  if (isFilterDishesViewOpen) {
    return (
      <AllDishesView
        dishes={allDishes}
        activeFilters={activeFilters}
        onFilterChange={onFilterChange}
        toggleFilterDishesView={toggleFilterDishesView}
      />
    );
  } else if (selectedLocation) {
    return (
      <LocationDetailPanel
        location={selectedLocation}
        onClose={closeLocationDetail}
      />
    );
  } else if (selectedFoodprint) {
    return (
      <FoodPrintDetailsPanel
        foodprint={selectedFoodprint}
        onClose={onCloseFoodprint}
      />
    );
  } else {
    return (
      <FilteredDishPanel
        activeFilters={activeFilters}
        onFilterChange={onFilterChange}
        allDishes={allDishes}
        locationsMap={locationsMap}
        onToggleFilterView={toggleFilterDishesView}
      />
    );
  }
};
```

### 1. AllDishesView

**File Location**: `src/components/food-map/AllDishesView.tsx`

This component is displayed when the user clicks the filter button to select dishes. It shows all available dishes in a grid layout with the ability to select multiple dishes as filters.

**State Flow**:

1. Receives `dishes` array, `activeFilters` array, and `onFilterChange` callback
2. User clicks on dish cards to toggle their selected state
3. `onFilterChange` callback updates the parent state
4. Selected dishes are highlighted visually

### 2. LocationDetailPanel

**File Location**: `src/components/food-map/LocationDetailPanel.tsx`

This component is displayed when a location marker is clicked on the map. It shows detailed information about the selected establishment.

**State Flow**:

1. Receives `location` object and `onClose` callback
2. Displays location details, photos, hours, price range, etc.
3. User can click close button to dismiss the panel
4. `onClose` callback clears the selected location in the parent

### 3. FoodPrintDetailsPanel

**File Location**: `FoodPrintDetailsPanel.tsx`

This component is displayed when a food print marker is clicked on the map. It shows user-generated content about a specific dish at a specific location.

**State Flow**:

1. Receives `foodprint` object and `onClose` callback
2. Displays food print details, photo, author info, date, etc.
3. User can click close button to dismiss the panel
4. `onClose` callback clears the selected food print in the parent

### 4. FilteredDishPanel

**File Location**: `src/components/food-map/FilteredDishPanel.tsx`

This is the default panel shown when no specific item is selected. It displays dishes that match the current filter criteria.

**State Flow**:

1. Receives `activeFilters` array, `onFilterChange` callback, `allDishes` array
2. Displays dishes that match the active filters
3. Shows associated locations for each filtered dish
4. Provides option to clear filters or open the filter selection view
