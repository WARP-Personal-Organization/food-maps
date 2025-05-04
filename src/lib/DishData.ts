import { Dish } from "@/types/types";

import { LocationData } from "@/lib/LocationData";

export const DishData: Dish[] = [
  {
    name: "Siopao",
    image: "/images/filter-dish/siopao.png",
    images: [
      "/images/filter-dish/siopao.png",
      "/images/filter-dish/inasal.jpg",
      "/images/filter-dish/cansi.jpg",
      "/images/filter-dish/kbl.jpg",
      "/images/filter-dish/pancit_molo.jpg",
    ],
    description:
      "Bao Zi (包子), also known as mantou when unfilled, is a staple food among Chinese worldwide. Hence, there are Baozi versions in Singapore, HK, Vietnam, the Philippines, and other countries with strong Chinese influence. The exact origins of siopao in the Philippines are not well-documented, but Chinese vendors likely sold it along with noodles as early as the 1600s.",
    tagline: "Philippine Steamed Bun",
    href: "/food-map",
    locations: LocationData["Siopao"],
  },
  {
    name: "La Paz Batchoy",
    image: "/images/filter-dish/batchoy.webp",
    images: [
      "/images/filter-dish/batchoy.webp",
      "/images/filter-dish/kbl.jpg",
      "/images/filter-dish/pancit_molo.jpg",
    ],
    description:
      "A hearty noodle soup with pork, liver, and chicharrón, La Paz Batchoy is a famous Ilonggo delicacy originating from La Paz, Iloilo.",
    tagline: "Ilonggo Noodle Soup",
    href: "/food-map",
    locations: LocationData["La Paz Batchoy"],
  },
  {
    name: "Cansi",
    image: "/images/filter-dish/cansi.jpg",
    images: [
      "/images/filter-dish/cansi.jpg",
      "/images/filter-dish/siopao.png",
      "/images/filter-dish/inasal.jpg",
      "/images/filter-dish/batchoy.webp",
    ],
    description:
      "Cansi is a famous Ilonggo beef soup known for its rich, sour taste due to the batwan fruit, a local ingredient unique to Western Visayas.",
    tagline: "Beef Bone Marrow Soup",
    href: "/food-map",
    locations: LocationData["Cansi"],
  },
  {
    name: "Inasal",
    image: "/images/filter-dish/inasal.jpg",
    images: [
      "/images/filter-dish/inasal.jpg",
      "/images/filter-dish/cansi.jpg",
      "/images/filter-dish/siopao.png",
      "/images/filter-dish/pancit_molo.jpg",
    ],
    description:
      "Chicken Inasal is a famous Bacolod-style grilled chicken marinated in vinegar, calamansi, and spices, served with annatto oil and garlic rice.",
    tagline: "Bacolod Grilled Chicken",
    href: "/food-map",
    locations: LocationData["Inasal"],
  },
  {
    name: "KBL",
    image: "/images/filter-dish/kbl.jpg",
    images: [
      "/images/filter-dish/kbl.jpg",
      "/images/filter-dish/cansi.jpg",
      "/images/filter-dish/batchoy.webp",
    ],
    description:
      "KBL (Kadyos, Baboy, Langka) is a traditional Ilonggo stew made with pigeon peas, pork, and unripe jackfruit, flavored with batwan fruit.",
    tagline: "Pork & Jackfruit Stew",
    href: "/food-map",
    locations: LocationData["KBL"],
  },
  {
    name: "Pancit Molo",
    image: "/images/filter-dish/pancit_molo.jpg",
    images: [
      "/images/filter-dish/pancit_molo.jpg",
      "/images/filter-dish/inasal.jpg",
      "/images/filter-dish/siopao.png",
      "/images/filter-dish/kbl.jpg",
    ],
    description:
      "A dumpling soup originating from Molo, Iloilo, Pancit Molo consists of meat-filled wontons in a flavorful chicken broth.",
    tagline: "Ilonggo Wonton Soup",
    href: "/food-map",
    locations: LocationData["Pancit Molo"],
  },
];
