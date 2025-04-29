# Food Maps - Application Documentation

## Overview

Food Maps is an interactive web application that showcases local food dishes and their locations in the Western Visayas region of the Philippines, with a focus on Ilonggo cuisine. The application allows users to explore traditional dishes, find establishments that serve them, and learn about the cultural significance of each dish.

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Application Structure](#application-structure)
3. [Key Features](#key-features)
4. [Components](#components)
5. [Data Models](#data-models)
6. [Routing](#routing)
7. [User Interface](#user-interface)
8. [Responsive Design](#responsive-design)
9. [Code Structure](#code-structure)
10. [Food Print Markers](#food-print-markers)
11. [Left Side Panel Components](#left-side-panel-components)

## Technology Stack

The application is built with the following technologies:

- **Framework**: Next.js 15.2.4 with React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS 4.0
- **Mapping**: Mapbox GL
- **UI Components**: Custom components with class-variance-authority
- **Icons**: Lucide React and React Icons
- **Animation**: Swiper for carousels, tw-animate-css

## Application Structure

The application follows a modern Next.js application structure:

```
food-maps/
├── public/           # Static assets (images, icons)
├── src/              # Source code
│   ├── app/          # Next.js app router pages
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions and data
│   ├── styles/       # Global styles
│   └── types/        # TypeScript type definitions
├── package.json      # Dependencies and scripts
└── tailwind.config.ts # TailwindCSS configuration
```

## Key Features

1. **Interactive Food Map**: Visualize food locations on an interactive map
2. **Dish Filtering**: Filter establishments by specific dishes
3. **Establishment Details**: View detailed information about each food establishment
4. **Responsive Design**: Optimized for both mobile and desktop viewing
5. **URL-based Filtering**: Share specific dish views via URL parameters

## Components

### Core Layout Components

| Component         | File Location                                 | Description                                              |
| ----------------- | --------------------------------------------- | -------------------------------------------------------- |
| FoodMapLayout     | `src/components/layout/FoodMapLayout.tsx`     | Main layout component that handles the overall structure |
| LeftSidePanel     | `src/components/layout/LeftSidePanel.tsx`     | Panel displaying dish info and establishment details     |
| RightSideMapPanel | `src/components/layout/RightSideMapPanel.tsx` | Panel containing the interactive map for desktop view    |
| MobileMapPanel    | `src/components/layout/MobileMapPanel.tsx`    | Map panel optimized for mobile devices                   |

### Feature Components

| Component             | File Location                            | Description                             |
| --------------------- | ---------------------------------------- | --------------------------------------- |
| DishFilter            | `src/components/food-map/DishFilter.tsx` | Filter interface for selecting dishes   |
| FoodPrintsNavbar      | `src/components/FoooPrintsNavbar.tsx`    | Navigation bar for the application      |
| FoodPrintDetailsPanel | `FoodPrintDetailsPanel.tsx`              | Panel for displaying food print details |
| HomePage              | `src/components/Homepage.tsx`            | Main landing page component             |

### UI Components

| Component        | File Location                          | Description                                         |
| ---------------- | -------------------------------------- | --------------------------------------------------- |
| LoadingScreen    | `src/components/loading-screen.tsx`    | Loading screen shown during initial load            |
| DelayedComponent | `src/components/delayed-component.tsx` | Component that delays rendering for loading effects |

## Data Models

### Dish Model

```typescript
// File: src/lib/dishData.ts
export interface Dish {
  name: string; // Name of the dish
  image: string; // Primary image URL
  images?: string[]; // Additional image URLs
  description: string; // Detailed description of the dish
  tagline: string; // Short descriptor/tagline
  href: string; // Link to dish details page
}
```

### Location Model

```typescript
// File: src/lib/locationData.ts
export interface Location {
  name: string; // Name of the establishment
  x: number; // X coordinate for map
  y: number; // Y coordinate for map
  description: string; // Description of the establishment
  iconType?: 'default' | 'restaurant' | 'shop' | 'attraction' | 'siopao';
  iconUrl?: string; // Custom icon URL
  siopaoVariant?: 1 | 2 | 3; // Specific variant for Siopao dish
  address?: string; // Physical address
  openHours?: string; // Opening hours
  priceRange?: string; // Price range information
  photos?: string[]; // Photos of the establishment
}
```

## Routing

The application uses Next.js App Router for routing with the following main routes:

| Route                     | File                                      | Description                                    |
| ------------------------- | ----------------------------------------- | ---------------------------------------------- |
| `/`                       | `src/app/page.tsx`                        | Home page with loading screen and introduction |
| `/food-map`               | `src/app/food-map/page.tsx`               | Main food map interface                        |
| `/food-map/establishment` | `src/app/food-map/establishment/page.tsx` | Individual establishment details               |
| `/example-map`            | `src/app/example-map/page.tsx`            | Example map implementation                     |

### URL Parameters

The food map page supports the following URL parameters:

- `dish`: Filter by specific dish name(s), comma-separated for multiple dishes
- `view`: Set view mode, e.g., `view=map` for map-only view

Example: `/food-map?dish=Siopao,Inasal&view=map`

## User Interface

### Desktop View

The desktop interface is divided into two main sections:

1. **Left Panel**: Shows dish information, filtering options, and establishment details
2. **Right Panel**: Displays the interactive map with location markers

The panels can be collapsed/expanded for a more focused view.

### Mobile View

On mobile devices, the interface adapts to a stacked layout:

1. **Top**: Navigation bar
2. **Main View**: Either the map or panel information
3. **Collapsed Mode**: Panel can be collapsed to focus on the map

## Responsive Design

The application uses responsive breakpoints:

- Mobile: Up to 899px
- Desktop Small: 900px - 1023px
- Desktop Medium: 1024px - 1279px
- Desktop Large: 1280px and above

Panel widths adapt based on screen size:

```
min-[900px]:w-[260px] lg:w-[300px] xl:w-[360px] 2xl:w-[450px] 3xl:w-[520px]
```

## Code Structure

### Component Organization

The application follows a modular component structure:

1. **Layout Components**: Handle overall application structure and responsiveness
2. **Feature Components**: Implement specific application features
3. **UI Components**: Reusable UI elements

### State Management

The application uses React's built-in state management with:

- `useState` for component-level state
- URL parameters for shareable application state
- Custom events for cross-component communication

### Data Storage

Data is stored in static TypeScript files:

- `src/lib/dishData.ts`: Information about dishes
- `src/lib/locationData.ts`: Information about establishments
- `src/lib/foodprintData.ts`: Information about food prints

This structure allows for easy updates and maintenance while keeping the application lightweight.

## Food Print Markers

Food print markers are special markers on the map that represent user-generated content or highlighted dishes. The implementation can be found in the following files:

| Component             | File Location                            | Description                                                      |
| --------------------- | ---------------------------------------- | ---------------------------------------------------------------- |
| FoodPrintMarker       | `src/components/map/FoodPrintMarker.tsx` | Component for rendering food print markers on the map            |
| FoodPrintDetailsPanel | `FoodPrintDetailsPanel.tsx`              | Panel for displaying food print details when a marker is clicked |

Food print markers are added to the map in the `MapComponent` file:

```typescript
// File: src/components/map/MapComponent.tsx
// This is where food print markers are rendered on the map
{
  foodprints.map((foodprint) => (
    <FoodPrintMarker
      key={foodprint.id}
      foodprint={foodprint}
      onClick={() => onFoodprintClick(foodprint)}
    />
  ));
}
```

The food print data structure is defined in:

```typescript
// File: src/lib/foodprintData.ts
export interface FoodPrint {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  photoUrl: string;
  authorName: string;
  dateAdded: string;
  dishName: string;
}
```

## Left Side Panel Components

The Left Side Panel is a key UI element that displays different content based on the application state. The component structure is as follows:

### LeftSidePanel Main Component

**File Location**: `src/components/layout/LeftSidePanel.tsx`

This is the container component that manages which panel to display based on application state.

### Child Panel Components

| Component             | File Location                                     | Description                                          |
| --------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| AllDishesView         | `src/components/food-map/AllDishesView.tsx`       | Displays all available dishes for filtering          |
| FilteredDishPanel     | `src/components/food-map/FilteredDishPanel.tsx`   | Shows dishes that match the current filter           |
| LocationDetailPanel   | `src/components/food-map/LocationDetailPanel.tsx` | Displays details about a selected food establishment |
| FoodPrintDetailsPanel | `FoodPrintDetailsPanel.tsx`                       | Shows details about a selected food print            |

The LeftSidePanel decides which component to render based on the application state:

```typescript
// File: src/components/layout/LeftSidePanel.tsx
// Panel rendering logic
{
  isFilterDishesViewOpen ? (
    <AllDishesView
      dishes={allDishes}
      activeFilters={activeFilters}
      onFilterChange={onFilterChange}
      toggleFilterDishesView={toggleFilterDishesView}
    />
  ) : selectedLocation ? (
    <LocationDetailPanel
      location={selectedLocation}
      onClose={closeLocationDetail}
    />
  ) : selectedFoodprint ? (
    <FoodPrintDetailsPanel
      foodprint={selectedFoodprint}
      onClose={onCloseFoodprint}
    />
  ) : (
    <FilteredDishPanel
      activeFilters={activeFilters}
      onFilterChange={onFilterChange}
      allDishes={allDishes}
      locationsMap={locationsMap}
      onToggleFilterView={toggleFilterDishesView}
    />
  );
}
```

This panel system allows for a dynamic UI that responds to user interactions while maintaining a clean user experience. The mobile version uses the same components but with slightly different styling and positioning.
