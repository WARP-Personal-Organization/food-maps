// types.d.ts

export type Location = {
    name: string;
    x: number;
    y: number;
    description: string;
    iconType?: "default" | "restaurant" | "shop" | "attraction" | "siopao";
    iconUrl?: string;
    siopaoVariant?: 1 | 2 | 3;
    address?: string;
    openHours?: string;
    priceRange?: string;
    photos?: string[];
  };
  
  export type Dish = {
    name: string;
    image: string;
    images?: string[];
    description: string;
    tagline: string;
    href: string;
    locations: Location[];
  };
  