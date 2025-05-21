import { Location } from "@/types/types";

export const LocationData: Record<string, Location[]> = {
    Siopao: [
      {
        name: "Roberto's Siopao",
        x: 500,
        y: 300,
        description: "Famous for their Siopao since 1978",
        iconType: "siopao",
        iconUrl: "/images/location-markers/batchoy-marker-2.png",
        siopaoVariant: 1,
        address: "Rizal Street, La Paz Public Market, La Paz, Iloilo City",
        openHours: "10:00 AM - 9:00 PM",
        priceRange: "₱200-400",
        photos: [
          "/images/location-photos/robertos-1.jpg",
          "/images/location-photos/robertos-2.jpg",
          "/images/location-photos/robertos-3.jpg",
          "/images/location-photos/robertos-4.jpg",
        ],
      },
      {
        name: "Deco's",
        x: 700,
        y: 400,
        description: "Home of the King-sized Siopao",
        iconType: "siopao",
        iconUrl: "/images/location-markers/batchoy-marker-2.png",
        siopaoVariant: 2,
        address: "Iznart Street, Iloilo City",
        openHours: "8:00 AM - 8:00 PM",
        priceRange: "₱150-300",
        photos: []
      },
      {
        name: "Kusina ni Mama",
        x: 500,
        y: 600,
        description: "Traditional homemade Siopao",
        iconType: "siopao",
        siopaoVariant: 3,
        address: "JM Basa Street, Iloilo City",
        openHours: "9:00 AM - 7:00 PM",
        priceRange: "₱100-200",
        iconUrl: "",
        photos: []
      },
    ],
    "La Paz Batchoy": [
      {
        name: "Ted's Oldtimer La Paz Batchoy",
        x: 450,
        y: 350,
        description: "Original La Paz Batchoy since 1945",
        iconType: "restaurant",
        iconUrl: "/images/location-markers/batchoy-marker-1.png",
        address: "La Paz Public Market, Iloilo City",
        openHours: "7:00 AM - 8:00 PM",
        priceRange: "₱100-200",
        siopaoVariant: 1,
        photos: []
      },
      {
        name: "Deco's La Paz Batchoy",
        x: 650,
        y: 450,
        description: "Famous for their special batchoy recipe",
        iconType: "restaurant",
        iconUrl: "/images/location-markers/batchoy-marker-2.png",
        address: "Rizal Street, La Paz, Iloilo City",
        openHours: "8:00 AM - 9:00 PM",
        priceRange: "₱120-220",
        siopaoVariant: 1,
        photos: []
      },
    ],
    Cansi: [
      {
        name: "Sharyn's Cansi House",
        x: 550,
        y: 500,
        description: "Authentic Ilonggo Cansi since 1990",
        iconType: "restaurant",
        iconUrl: "",
        address: "Molo, Iloilo City",
        openHours: "10:00 AM - 8:00 PM",
        priceRange: "₱250-450",
        siopaoVariant: 2,
        photos: []
      },
    ],
    Inasal: [
      {
        name: "Manokan Country",
        x: 480,
        y: 320,
        description: "Famous chicken inasal stalls",
        iconType: "restaurant",
        iconUrl: "",
        address: "Reclamation Area, Bacolod City",
        openHours: "10:00 AM - 10:00 PM",
        priceRange: "₱150-300",
        siopaoVariant: 3,
        photos: []
      },
      {
        name: "Aida's Chicken",
        x: 600,
        y: 380,
        description: "Authentic Bacolod-style Chicken Inasal",
        iconType: "restaurant",
        iconUrl: "",
        address: "Lacson Street, Bacolod City",
        openHours: "10:00 AM - 9:00 PM",
        priceRange: "₱180-350",
        siopaoVariant: 1,
        photos: []
      },
    ],
    KBL: [
      {
        name: "Tatoy's Manokan and Seafoods",
        x: 520,
        y: 420,
        description: "Famous for traditional Ilonggo dishes including KBL",
        iconType: "restaurant",
        iconUrl: "",
        address: "Villa Beach, Iloilo City",
        openHours: "10:00 AM - 9:00 PM",
        priceRange: "₱200-500",
        siopaoVariant: 1,
        photos: []
      },
    ],
    "Pancit Molo": [
      {
        name: "Mama's Kitchen",
        x: 580,
        y: 340,
        description: "Home of authentic Pancit Molo",
        iconType: "restaurant",
        iconUrl: "",
        address: "Molo Plaza, Iloilo City",
        openHours: "9:00 AM - 8:00 PM",
        priceRange: "₱120-250",
        siopaoVariant: 2,
        photos: []
      },
      {
        name: "Original Pancit Molo House",
        x: 490,
        y: 470,
        description: "Serving traditional Ilonggo Pancit Molo",
        iconType: "restaurant",
        iconUrl: "",
        address: "Molo District, Iloilo City",
        openHours: "10:00 AM - 7:00 PM",
        priceRange: "₱100-200",
        siopaoVariant: 3,
        photos: []
      },
    ],
  };