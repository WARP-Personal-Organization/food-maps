// Define Location interface
export interface Location {
  name: string;
  x: number;
  y: number;
  description: string;
  iconType?: 'default' | 'restaurant' | 'shop' | 'attraction';
  iconUrl?: string;
  address?: string;
  openHours?: string;
  priceRange?: string;
  photos?: string[];
}

// Map of dish names to their locations
export const dishLocations: Record<string, Location[]> = {
  Siopao: [
    {
      name: "Roberto's Siopao",
      x: 500,
      y: 300,
      description: 'Famous for their Siopao since 1978',
      iconType: 'restaurant',
      address: 'Rizal Street, La Paz Public Market, La Paz, Iloilo City',
      openHours: '10:00 AM - 9:00 PM',
      priceRange: '₱200-400',
      photos: [
        '/location-photos/robertos-1.jpg',
        '/location-photos/robertos-2.jpg',
        '/location-photos/robertos-3.jpg',
        '/location-photos/robertos-4.jpg',
      ],
    },
    {
      name: "Deco's",
      x: 700,
      y: 400,
      description: 'Home of the King-sized Siopao',
      iconUrl: '/siopao-1.png',
      iconType: 'restaurant',
      address: 'Iznart Street, Iloilo City',
      openHours: '8:00 AM - 8:00 PM',
      priceRange: '₱150-300',
    },
    {
      name: 'Kusina ni Mama',
      x: 500,
      y: 600,
      description: 'Traditional homemade Siopao',
      iconType: 'restaurant',
      address: 'JM Basa Street, Iloilo City',
      openHours: '9:00 AM - 7:00 PM',
      priceRange: '₱100-200',
    },
  ],
  'La Paz Batchoy': [
    {
      name: "Ted's Oldtimer La Paz Batchoy",
      x: 450,
      y: 350,
      description: 'Original La Paz Batchoy since 1945',
      iconType: 'restaurant',
      iconUrl: '/siopao-1.png',
      address: 'La Paz Public Market, Iloilo City',
      openHours: '7:00 AM - 8:00 PM',
      priceRange: '₱100-200',
    },
    {
      name: "Deco's La Paz Batchoy",
      x: 650,
      y: 450,
      description: 'Famous for their special batchoy recipe',
      iconType: 'restaurant',
      iconUrl: '/siopao-1.png',
      address: 'Rizal Street, La Paz, Iloilo City',
      openHours: '8:00 AM - 9:00 PM',
      priceRange: '₱120-220',
    },
  ],
  Cansi: [
    {
      name: "Sharyn's Cansi House",
      x: 550,
      y: 500,
      description: 'Authentic Ilonggo Cansi since 1990',
      iconType: 'restaurant',
      iconUrl: '/siopao-1.png',
      address: 'Molo, Iloilo City',
      openHours: '10:00 AM - 8:00 PM',
      priceRange: '₱250-450',
    },
  ],
  Inasal: [
    {
      name: 'Manokan Country',
      x: 480,
      y: 320,
      description: 'Famous chicken inasal stalls',
      iconType: 'restaurant',
      iconUrl: '/siopao-1.png',
      address: 'Reclamation Area, Bacolod City',
      openHours: '10:00 AM - 10:00 PM',
      priceRange: '₱150-300',
    },
    {
      name: "Aida's Chicken",
      x: 600,
      y: 380,
      description: 'Authentic Bacolod-style Chicken Inasal',
      iconType: 'restaurant',
      iconUrl: '/siopao-1.png',
      address: 'Lacson Street, Bacolod City',
      openHours: '10:00 AM - 9:00 PM',
      priceRange: '₱180-350',
    },
  ],
  KBL: [
    {
      name: "Tatoy's Manokan and Seafoods",
      x: 520,
      y: 420,
      description: 'Famous for traditional Ilonggo dishes including KBL',
      iconType: 'restaurant',
      iconUrl: '/siopao-1.png',
      address: 'Villa Beach, Iloilo City',
      openHours: '10:00 AM - 9:00 PM',
      priceRange: '₱200-500',
    },
  ],
  'Pancit Molo': [
    {
      name: "Mama's Kitchen",
      x: 580,
      y: 340,
      description: 'Home of authentic Pancit Molo',
      iconType: 'restaurant',
      iconUrl: '/siopao-1.png',
      address: 'Molo Plaza, Iloilo City',
      openHours: '9:00 AM - 8:00 PM',
      priceRange: '₱120-250',
    },
    {
      name: 'Original Pancit Molo House',
      x: 490,
      y: 470,
      description: 'Serving traditional Ilonggo Pancit Molo',
      iconType: 'restaurant',
      iconUrl: '/siopao-1.png',
      address: 'Molo District, Iloilo City',
      openHours: '10:00 AM - 7:00 PM',
      priceRange: '₱100-200',
    },
  ],
};
