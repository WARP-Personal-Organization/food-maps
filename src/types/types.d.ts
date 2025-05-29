
export type PanelType =
| "dishDetails"
| "menu"
| "filter"
| "about"
| "locationSummary"
| "locationDetail"
| "foodPrintSummary"
| "foodPrintDetail"
| "explore"
| "home"
| null;

// Used in home and filter panels
export type Dish = {
  name: string;
  image: string;
  description: string;
  tagline: string;
  locations: Location[];
};

// Map markers data types
export type Location = {
  name: string;
  address: string;
  x: number;
  y: number;
  openHours: string;
  priceRange: string;
  mapLink: string;
  photos: string[]; // Array of image URLs for the location
  iconUrl: string; // URL to the marker icon
};

export type FoodPrint = {
  name: string;
  location: string;
  x: number;
  y: number;
  description: string;
  extendedDescription: string[];
  iconUrl: string;
  dishType: DishType;
  heroImage: string;
  mapLink: string;
};