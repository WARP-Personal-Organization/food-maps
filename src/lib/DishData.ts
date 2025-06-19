import { Dish } from "@/types/types";
import { LocationData } from "./LocationData";

export const DishData: Dish[] = [
  {
    name: "Siopao",
    image: "/images/filter-dish/siopao.png",
    description:
      "Bao Zi (包子), also known as mantou when unfilled, is a staple food among Chinese worldwide. Hence, there are Baozi versions in Singapore, HK, Vietnam, the Philippines, and other countries with strong Chinese influence.",
    tagline: "Philippine Steamed Bun",
    locations: LocationData["Siopao"],
  },
  {
    name: "Batchoy",
    image: "/images/filter-dish/batchoy.jpg",
    description:
      "A hearty noodle soup with pork, liver, and chicharrón, La Paz Batchoy is a famous Ilonggo delicacy originating from La Paz, Iloilo.",
    tagline: "Ilonggo Noodle Soup",
    locations: LocationData["Batchoy"],
  },
  {
    name: "Cansi",
    image: "/images/filter-dish/cansi.jpg",
    description:
      "Cansi is a famous Ilonggo beef soup known for its rich, sour taste due to the batwan fruit, a local ingredient unique to Western Visayas.",
    tagline: "Beef Bone Marrow Soup",
    locations: LocationData["Cansi"],
  },
  {
    name: "ChickenInasal",
    image: "/images/filter-dish/inasal.jpg",
    description:
      "Chicken Inasal is a famous Bacolod-style grilled chicken marinated in vinegar, calamansi, and spices, served with annatto oil and garlic rice.",
    tagline: "Bacolod Grilled Chicken",
    locations: LocationData["ChickenInasal"],
  },
  {
    name: "KBL",
    image: "/images/filter-dish/kbl.jpg",
    description:
      "KBL (Kadyos, Baboy, Langka) is a traditional Ilonggo stew made with pigeon peas, pork, and unripe jackfruit, flavored with batwan fruit.",
    tagline: "Pork & Jackfruit Stew",
    locations: LocationData["KBL"],
  },
  {
    name: "PancitMolo",
    image: "/images/filter-dish/pancit_molo.jpg",
    description:
      "A dumpling soup originating from Molo, Iloilo, Pancit Molo consists of meat-filled wontons in a flavorful chicken broth.",
    tagline: "Ilonggo Wonton Soup",
    locations: LocationData["PancitMolo"],
  },
  {
    name: "Seafood",
    image: "/images/filter-dish/pancit_molo.jpg",
    description:
      "A dumpling soup originating from Molo, Iloilo, Pancit Molo consists of meat-filled wontons in a flavorful chicken broth.",
    tagline: "Ilonggo Wonton Soup",
    locations: LocationData["Seafood"],
  },
];
