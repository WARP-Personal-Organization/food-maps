import { FoodPrint } from "@/types/types";

export const DishType = [
  "Siopao",
  "Batchoy",
  "Cansi",
  "Chicken Inasal",
  "KBL",
  "Pancit Molo",
  "Seafood",
] as const;

export type DishType = (typeof DishType)[number];

const foodPrintMarkersData: FoodPrint[] = [
  {
    name: "Siopao",
    x: 850, // Far right, upper
    y: 200,
    description:
      "A beloved siopao spot in Iloilo known for its large size and flavorful fillings.",
    iconUrl: "/images/foodprint-markers/siopao-foodprint-marker.png",
    dishType: "siopao",
    heroImage: "/images/fallback-images/siopao.png",
    location: "Rizal Street, La Paz Public Market, La Paz, Iloilo City",
    extendedDescription: [
      "A must-visit spot for both locals and tourists, Roberto's has built a strong reputation over the decades for serving siopao that's packed with a rich combination of ingredients — from savory pork and chicken to Chinese sausage and hard-boiled egg.",
      'Their famous "Queen Siopao" stands out as the ultimate indulgence, stuffed with a hefty portion of meat, sausage, and egg, making it a satisfying meal on its own that\'s well worth the experience.',
    ],
    mapLink: "https://maps.app.goo.gl/HpyHQaVQg4quy1j8A",
  },
  {
    name: "Batchoy",
    x: 300, // Far left, lower
    y: 500,
    description:
      "A flavorful and hearty bowl of batchoy near the public market.",
    iconUrl: "/images/foodprint-markers/batchoy-foodprint-marker.png",
    dishType: "batchoy",
    heroImage: "/images/fallback-images/batchoy.png",
    location: "La Paz Public Market, Iloilo City",
    extendedDescription: [
      "La Paz Batchoy is an iconic noodle soup that originated from the La Paz district of Iloilo City. This hearty dish features a rich, flavorful broth made with pork organs, beef, and sometimes chicken.",
      "What makes it special are the garnishes: crispy pork cracklings (chicharon), fried garlic, spring onions, and a raw egg that gets partially cooked when mixed with the hot broth.",
    ],
    mapLink: "https://goo.gl/maps/8Z1b7f8x9kz2",
  },
  {
    name: "Kansi",
    x: 800, // Far right, lower
    y: 800,
    description:
      "A local favorite kansi spot serving rich bone marrow beef soup.",
    iconUrl: "/images/foodprint-markers/cansi-foodprint-marker.png",
    dishType: "cansi",
    heroImage: "/images/fallback-images/cansi.png",
    location: "Molo District, Iloilo City",
    extendedDescription: [
      "Kansi is Iloilo's perfect hybrid between sinigang and bulalo - a sour soup with fall-off-the-bone beef shanks and rich bone marrow.",
      "Deco's has perfected their recipe over generations, using batwan fruit for sourness and slow-cooking the beef for hours until it becomes tender and flavorful.",
    ],
    mapLink: "https://goo.gl/maps/8Z1b7f8x9kz2",
  },
  {
    name: "Chicken Inasal",
    x: 300, // Far left, upper
    y: 200,
    description:
      "Authentic grilled chicken inasal experience in Bacolod's food district.",
    iconUrl: "/images/foodprint-markers/inasal-foodprint-marker.png",
    dishType: "chicken_inasal",
    heroImage: "/images/fallback-images/inasal.png",
    location: "Manokan Country, Bacolod City",
    extendedDescription: [
      "Chicken Inasal is Bacolod's iconic grilled chicken, marinated in a mixture of calamansi, pepper, coconut vinegar and annatto oil, giving it a distinctive flavor and color.",
      "The best way to enjoy inasal is to dip it in a mixture of soy sauce, calamansi, and chili, then eat it with your hands alongside garlic rice. Don't miss the chicken oil topping that adds an extra layer of richness to your rice.",
    ],
    mapLink: "https://goo.gl/maps/8Z1b7f8x9kz2",
  },
  {
    name: "KBL",
    x: 500, // Center
    y: 500,
    description:
      "A comforting bowl of traditional kadios, baboy, and langka soup.",
    iconUrl: "/images/foodprint-markers/kbl-foodprint-marker.png",
    dishType: "kbl",
    heroImage: "/images/fallback-images/kbl.png",
    location: "Central Market, Iloilo City",
    extendedDescription: [
      "KBL stands for Kadios (pigeon peas), Baboy (pork), and Langka (jackfruit), a unique combination that creates a sour-savory soup loved throughout the Western Visayas region.",
      "The dish balances the earthiness of kadios beans, the richness of pork belly, and the subtle sweetness of unripe jackfruit, all in a souring base of batwan fruit or sometimes tamarind.",
    ],
    mapLink: "https://goo.gl/maps/8Z1b7f8x9kz2",
  },
  {
    name: "Pancit Molo",
    x: 800, // Right center
    y: 500,
    description: "Traditional Ilonggo wonton soup served since the 1950s.",
    iconUrl: "/images/foodprint-markers/pancit-molo-foodprint-marker.png",
    dishType: "pancit_molo",
    heroImage: "/images/fallback-images/pancit_molo.png",
    location: "Molo District, Iloilo City",
    extendedDescription: [
      'Pancit Molo is a traditional Filipino soup originating from the district of Molo in Iloilo City. Unlike other "pancit" dishes, Pancit Molo is a soup with dumplings rather than noodles.',
      "The soup features delicate dumplings filled with ground pork, wrapped in thin wonton wrappers, and served in a clear, flavorful chicken broth garnished with spring onions and fried garlic.",
    ],
    mapLink: "https://goo.gl/maps/8Z1b7f8x9kz2",
  },
  {
    name: "Seafood",
    x: 500, // Bottom center
    y: 700,
    description: "Fresh and flavorful seafood dishes from Iloilo.",
    dishType: "seafood",
    iconUrl: "/images/foodprint-markers/seafood-foodprint-marker.png",
    heroImage: "/images/fallback-images/seafood.png",
    location: "Molo District, Iloilo City",
    extendedDescription: [
      'Pancit Molo is a traditional Filipino soup originating from the district of Molo in Iloilo City. Unlike other "pancit" dishes, Pancit Molo is a soup with dumplings rather than noodles.',
      "The soup features delicate dumplings filled with ground pork, wrapped in thin wonton wrappers, and served in a clear, flavorful chicken broth garnished with spring onions and fried garlic.",
    ],
    mapLink: "https://goo.gl/maps/8Z1b7f8x9kz2",
  },
];

// Export the data
export const FoodPrintData = {
  markers: foodPrintMarkersData,
  dishTypes: DishType,
} as const;

export type FoodPrintData = typeof FoodPrintData;
