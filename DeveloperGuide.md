# Food Maps - Developer Guide

This technical guide is intended for developers who want to understand, modify, or extend the Food Maps application.

## Development Environment Setup

1. **Prerequisites**:

   - Node.js 18+ and npm/yarn
   - Git for version control

2. **Clone and Install**:

   ```bash
   git clone <repository-url>
   cd food-maps
   yarn install
   ```

3. **Development Server**:

   ```bash
   yarn dev
   ```

   The application uses Turbopack for faster development builds.

4. **Building for Production**:
   ```bash
   yarn build
   yarn start
   ```

## Project Architecture

### Next.js App Router

The project uses Next.js App Router for routing. Key files include:

- `src/app/layout.tsx`: Root layout component
- `src/app/page.tsx`: Home page component
- `src/app/food-map/page.tsx`: Main food map page

### Component Structure

Components are organized by their function:

1. **Layout Components** (`src/components/layout/`):

   - Control the overall page structure
   - Handle responsive layouts between mobile and desktop
   - Manage panel states (collapsed/expanded)

2. **Feature Components** (`src/components/food-map/`, etc.):

   - Implement specific features like dish filtering
   - Handle user interactions with the map
   - Display dish and location details

3. **UI Components** (`src/components/*.tsx`):
   - Reusable UI elements
   - Loading screens and animations
   - Navigation elements

### State Management

The application uses several state management strategies:

1. **Component State**:

   ```typescript
   const [selectedLocation, setSelectedLocation] = useState<Location | null>(
     null
   );
   const [isPanelCollapsed, setIsPanelCollapsed] = useState(
     initialPanelCollapsed
   );
   ```

2. **URL Parameters**: For shareable state

   ```typescript
   const searchParams = useSearchParams();
   const dishParam = searchParams.get('dish');
   ```

3. **Custom Events**: For cross-component communication
   ```typescript
   document.dispatchEvent(
     new CustomEvent('closeLocationDetail', { bubbles: true })
   );
   ```

## Key Technical Features

### Interactive Map Integration

The map is implemented using Mapbox GL JS, with custom markers for locations:

```typescript
// Location markers are positioned based on x,y coordinates
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

### Responsive Layout System

The application uses a sophisticated responsive layout system with different breakpoints:

```typescript
// Desktop panel width responsiveness
<div
  className={`${
    isPanelCollapsed && !isFilterDishesViewOpen
      ? 'w-0 opacity-0'
      : 'min-[900px]:w-[260px] lg:w-[300px] xl:w-[360px] 2xl:w-[450px] 3xl:w-[520px] opacity-100'
  } h-full overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0 border-r border-gray-200`}
>
```

### URL-Based Filter System

The application uses URL parameters to create shareable filtered views:

```typescript
// Update the URL when filters change
const updateUrl = (filters: string[]) => {
  // Preserve view parameter if it exists
  const viewParam = searchParams.get('view');
  const viewQueryString = viewParam ? `&view=${viewParam}` : '';

  const newUrl =
    filters.length > 0
      ? `/food-map?dish=${filters
          .map((f) => encodeURIComponent(f))
          .join(',')}${viewQueryString}`
      : viewParam
      ? `/food-map?view=${viewParam}`
      : '/food-map';

  router.push(newUrl, { scroll: false });
};
```

### Food Print Marker System

The Food Maps application includes a system for displaying user-generated food prints on the map. These are implemented in several key files:

```typescript
// Import the FoodPrint interface
import { FoodPrint } from '@/lib/foodprintData';

// Handler for when a foodprint marker is clicked
const handleFoodprintClick = (foodprint: FoodPrint) => {
  setSelectedFoodprint(foodprint);
  setSelectedLocation(null); // Clear any selected location
  setIsPanelCollapsed(false); // Ensure panel is expanded
};
```

The food print marker components are located in:

- `src/components/map/FoodPrintMarker.tsx`: The marker component displayed on the map
- `FoodPrintDetailsPanel.tsx`: The panel component that shows food print details

To add new food print markers:

1. Add entries to the food print data file:

   ```typescript
   // src/lib/foodprintData.ts
   export const foodprints: FoodPrint[] = [
     {
       id: 'fp-1',
       x: 520,
       y: 380,
       title: "Amazing Siopao at Roberto's",
       description: "The best siopao I've ever tasted!",
       photoUrl: '/foodprints/siopao-fp-1.jpg',
       authorName: 'Maria Santos',
       dateAdded: '2023-06-15',
       dishName: 'Siopao',
     },
     // Add more food prints here
   ];
   ```

2. The map component automatically renders these markers:
   ```typescript
   // In src/components/map/MapComponent.tsx
   {
     foodprints.map((fp) => (
       <FoodPrintMarker
         key={fp.id}
         position={[fp.x, fp.y]}
         foodprint={fp}
         onClick={() => onFoodprintClick(fp)}
       />
     ));
   }
   ```

### LeftSidePanel Component Architecture

The LeftSidePanel is a complex component that manages multiple sub-views. Located at `src/components/layout/LeftSidePanel.tsx`, it serves as a container for various content panels:

```typescript
// LeftSidePanel structure
export const LeftSidePanel: React.FC<LeftSidePanelProps> = ({
  selectedLocation,
  closeLocationDetail,
  activeFilters,
  onFilterChange,
  locationsMap,
  isMobile = false,
  onToggleCollapse,
  isFilterDishesViewOpen = false,
  toggleFilterDishesView,
  selectedFoodprint,
  onCloseFoodprint,
}) => {
  // Component logic

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <PanelHeader onClose={onToggleCollapse} title={getPanelTitle()} />

      {/* Content */}
      <div className="flex-grow overflow-y-auto">
        {renderAppropriatePanelContent()}
      </div>
    </div>
  );
};
```

The panel renders different content based on application state:

1. `AllDishesView`: When the filter view is open
2. `LocationDetailPanel`: When a location is selected
3. `FoodPrintDetailsPanel`: When a food print is selected
4. `FilteredDishPanel`: Default view showing filtered dishes

Each of these components is located in the `src/components/food-map/` directory, except for `FoodPrintDetailsPanel.tsx` which is in the root directory.

To modify the LeftSidePanel behavior:

1. Update the rendering logic in `renderAppropriatePanelContent()` function
2. Modify the state variables that control which panel is shown
3. Update the individual panel components as needed

### Panel State Management

The panel state is controlled by several key variables passed from parent components:

```typescript
// In FoodMapLayout.tsx
const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
const [isPanelCollapsed, setIsPanelCollapsed] = useState(initialPanelCollapsed);
const [selectedFoodprint, setSelectedFoodprint] = useState<FoodPrint | null>(
  null
);
```

These state variables determine which panel is shown and control the panel visibility.

## Data Models & Static Data

### Dish Data Structure

Dishes are defined in `src/lib/dishData.ts`:

```typescript
export interface Dish {
  name: string; // Dish name
  image: string; // Main image path
  images?: string[]; // Additional image paths
  description: string; // Full description
  tagline: string; // Short description
  href: string; // Link to dish details
}
```

### Location Data Structure

Locations are defined in `src/lib/locationData.ts`:

```typescript
export interface Location {
  name: string; // Establishment name
  x: number; // X coordinate for map positioning
  y: number; // Y coordinate for map positioning
  description: string; // Brief description
  iconType?: 'default' | 'restaurant' | 'shop' | 'attraction' | 'siopao';
  iconUrl?: string; // Custom icon path
  siopaoVariant?: 1 | 2 | 3; // For siopao-specific variants
  address?: string; // Physical address
  openHours?: string; // Business hours
  priceRange?: string; // Price range indicator
  photos?: string[]; // Photo gallery paths
}
```

## Customization Guide

### Adding New Dishes

To add new dishes to the application:

1. Edit `src/lib/dishData.ts` to add a new dish entry:

   ```typescript
   {
     name: 'New Dish Name',
     image: '/images/filter-dish/new-dish.jpg',
     images: ['/images/filter-dish/new-dish.jpg', '/images/filter-dish/new-dish-2.jpg'],
     description: 'Detailed description of the new dish...',
     tagline: 'Short dish tagline',
     href: '/food-map',
   }
   ```

2. Add corresponding location entries in `src/lib/locationData.ts`:
   ```typescript
   'New Dish Name': [
     {
       name: 'Restaurant Name',
       x: 550,
       y: 400,
       description: 'Establishment description',
       iconType: 'restaurant',
       address: 'Physical address',
       openHours: '10:00 AM - 9:00 PM',
       priceRange: '₱200-400',
       photos: ['/location-photos/restaurant-1.jpg', '/location-photos/restaurant-2.jpg'],
     }
   ]
   ```

### Customizing Map Icons

To customize map icons:

1. Add new icon images to the `public/location-markers/` directory
2. Update the `iconUrl` property in location data:
   ```typescript
   iconUrl: '/location-markers/new-icon.png',
   ```

### Modifying the UI Layout

To adjust the responsive breakpoints:

1. Edit the classes in `src/components/layout/FoodMapLayout.tsx`
2. For major layout changes, modify both desktop and mobile views:

   ```typescript
   // Desktop view section
   <div className="hidden min-[900px]:flex h-screen w-full bg-white overflow-hidden">
     {/* Layout components */}
   </div>

   // Mobile view section
   <div className="hidden max-[899px]:flex flex-col h-screen">
     {/* Layout components */}
   </div>
   ```

## Performance Considerations

### Memoization

The application uses React's `useMemo` to optimize performance:

```typescript
const allLocations = useMemo(() => {
  // Expensive calculation for locations
}, [locationsMap, activeFilters]);
```

### Conditional Rendering

Components use conditional rendering to avoid unnecessary DOM elements:

```typescript
{
  (isFilterDishesViewOpen || !isPanelCollapsed) && (
    <div className="absolute inset-0 z-30 pt-16">
      <LeftSidePanel
      /* Props */
      />
    </div>
  );
}
```

### CSS Transition Performance

The application uses CSS transitions for smooth animations:

```typescript
className =
  'w-full h-full overflow-hidden transition-all duration-300 ease-in-out';
```

## Common Development Tasks

### Adding a New Feature

1. Identify which component should contain the feature
2. Add necessary state variables and handlers
3. Update the UI to include the new feature
4. Connect to existing data models or create new ones

### Debugging Tips

1. Use browser developer tools to inspect component state
2. Check URL parameters for correct routing behavior
3. Monitor console logs for custom events and state changes
4. Use React DevTools for component inspection

## Deployment

The application is designed to be deployed on Vercel, but can be deployed to any platform that supports Next.js applications.

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel
```

### Environment Variables

If adding API keys or other environment variables:

1. Create a `.env.local` file (not committed to Git)
2. Add variables in the format: `NEXT_PUBLIC_API_KEY=your_key_here`
3. Access in code via `process.env.NEXT_PUBLIC_API_KEY`
