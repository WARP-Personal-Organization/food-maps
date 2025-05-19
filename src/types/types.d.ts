export type Location = {
  name: string;
  x: number;
  y: number;
  description: string;
  iconType: "default" | "restaurant" | "shop" | "attraction" | "siopao";
  iconUrl: string;
  siopaoVariant: 1 | 2 | 3;
  address: string;
  openHours: string;
  priceRange: string;
  photos: string[];
};

export type Dish = {
  name: string;
  image: string;
  images: string[];
  description: string;
  tagline: string;
  href: string;
  locations: Location[];
};

export type FoodPrint = {
  name: string;
  x: number;
  y: number;
  description: string;
  iconUrl: string;
  dishName: DishType;
  dateVisited: string;

  // Details panel fields
  heroImage: string;
  location: string;
  extendedDescription: string[];
  title: string;
};

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