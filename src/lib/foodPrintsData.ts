// Define the FoodPrint type for custom map markers
export interface FoodPrint {
  name: string;
  x: number;
  y: number;
  description: string;
  iconUrl: string;
  dishName: string; // Required for filtering
  dateVisited?: string;
  // New fields for the details panel
  heroImage?: string;
  location?: string;
  extendedDescription?: string[];
  title?: string;
}

// Available dish types for filtering
export const dishTypes = [
  'Siopao',
  'La Paz Batchoy',
  'Cansi',
  'Inasal',
  'KBL',
  'Pancit Molo',
];

// Sample food print markers
const foodPrintMarkersData: FoodPrint[] = [
  {
    name: "Roberto's Siopao: The Queen of All Siopaos in PH",
    x: 550,
    y: 350,
    description:
      "Roberto's Siopao is an iconic delicacy from Iloilo City, known for its generous size, flavorful fillings, and unique, homemade taste.",
    iconUrl: '/siopao-foodprint-marker.png',
    dishName: 'Siopao',
    dateVisited: '2024-07-15',
    heroImage: '/images/robertos/r3.jpg',
    location: 'Rizal Street, La Paz Public Market, La Paz, Iloilo City',
    extendedDescription: [
      "A must-visit spot for both locals and tourists, Roberto's has built a strong reputation over the decades for serving siopao that's packed with a rich combination of ingredients — from savory pork and chicken to Chinese sausage and hard-boiled egg.",
      'Their famous "Queen Siopao" stands out as the ultimate indulgence, stuffed with a hefty portion of meat, sausage, and egg, making it a satisfying meal on its own that\'s well worth the experience.',
    ],
  },
  {
    name: 'Batchoy Discovery',
    x: 480,
    y: 420,
    description: 'Found an amazing Batchoy place near the market.',
    iconUrl: '/batchoy-foodprint-marker.png',
    dishName: 'La Paz Batchoy',
    dateVisited: '2024-07-18',
    heroImage: '/images/batchoy/hero.jpg',
    location: 'La Paz Public Market, Iloilo City',
    extendedDescription: [
      'La Paz Batchoy is an iconic noodle soup that originated from the La Paz district of Iloilo City. This hearty dish features a rich, flavorful broth made with pork organs, beef, and sometimes chicken.',
      'What makes it special are the garnishes: crispy pork cracklings (chicharon), fried garlic, spring onions, and a raw egg that gets partially cooked when mixed with the hot broth.',
    ],
  },
  {
    name: "Deco's Original Cansi",
    x: 620,
    y: 280,
    description:
      'A Kansi place that locals swear by, offering the best bone marrow soup in town.',
    iconUrl: '/cansi-foodprint-marker.png',
    dishName: 'Cansi', // Changed from 'Kansi' to match dishData.ts
    dateVisited: '2024-07-20',
    heroImage: '/images/kansi/decos.jpg',
    location: 'Molo District, Iloilo City',
    extendedDescription: [
      "Kansi is Iloilo's perfect hybrid between sinigang and bulalo - a sour soup with fall-off-the-bone beef shanks and rich bone marrow.",
      "Deco's has perfected their recipe over generations, using batwan fruit for sourness and slow-cooking the beef for hours until it becomes tender and flavorful.",
    ],
  },
  {
    name: 'Manokan Country Chicken Inasal',
    x: 380,
    y: 320,
    description:
      'The authentic chicken inasal experience in the heart of Bacolod.',
    iconUrl: '/inasal-foodprint-marker.png',
    dishName: 'Inasal', // Changed from 'Chicken Inasal' to match dishData.ts
    dateVisited: '2024-07-22',
    heroImage: '/images/inasal/manokan.jpg',
    location: 'Manokan Country, Bacolod City',
    extendedDescription: [
      "Chicken Inasal is Bacolod's iconic grilled chicken, marinated in a mixture of calamansi, pepper, coconut vinegar and annatto oil, giving it a distinctive flavor and color.",
      "The best way to enjoy inasal is to dip it in a mixture of soy sauce, calamansi, and chili, then eat it with your hands alongside garlic rice. Don't miss the chicken oil topping that adds an extra layer of richness to your rice.",
    ],
  },
  {
    name: 'KBL: Kadios, Baboy, Langka',
    x: 510,
    y: 240,
    description:
      'A traditional Ilonggo soup combining three distinctive ingredients.',
    iconUrl: '/kbl-foodprint-marker.png',
    dishName: 'KBL',
    dateVisited: '2024-07-25',
    heroImage: '/images/kbl/classic.jpg',
    location: 'Central Market, Iloilo City',
    extendedDescription: [
      'KBL stands for Kadios (pigeon peas), Baboy (pork), and Langka (jackfruit), a unique combination that creates a sour-savory soup loved throughout the Western Visayas region.',
      'The dish balances the earthiness of kadios beans, the richness of pork belly, and the subtle sweetness of unripe jackfruit, all in a souring base of batwan fruit or sometimes tamarind.',
    ],
  },
  {
    name: 'Original Pancit Molo House',
    x: 490,
    y: 470,
    description: 'Serving traditional Ilonggo wonton soup since 1950.',
    iconUrl: '/pancit-molo-foodprint-marker.png',
    dishName: 'Pancit Molo',
    dateVisited: '2024-07-30',
    heroImage: '/images/pancit-molo/original.jpg',
    location: 'Molo District, Iloilo City',
    extendedDescription: [
      'Pancit Molo is a traditional Filipino soup originating from the district of Molo in Iloilo City. Unlike other "pancit" dishes, Pancit Molo is a soup with dumplings rather than noodles.',
      'The soup features delicate dumplings filled with ground pork, wrapped in thin wonton wrappers, and served in a clear, flavorful chicken broth garnished with spring onions and fried garlic.',
    ],
  },
];

// Export the data
export const foodPrintsData = {
  markers: foodPrintMarkersData,
  dishTypes: dishTypes, // Export available dish types for filtering
};

// Default export
export default foodPrintsData;
