"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DesktopMapLayout from "@/desktop/DesktopMapLayout";
import { DishData } from "@/lib/DishData";
import { LocationData } from "@/lib/LocationData";
import MobileMapLayout from "@/mobile/MobileMapLayout";
import { FoodPrintData } from "@/lib/FoodPrintData";

function MapLayout() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    // Memoized function to update the URL
    const updateUrl = useCallback(
        (filters: string[]) => {
            const currentDishParam = searchParams.get("dish");
            const currentFiltersString = currentDishParam || "";
            const newFiltersString = filters.join(",");

            if (currentFiltersString === newFiltersString) {
                return;
            }

            const viewParam = searchParams.get("view");
            const viewQueryString = viewParam ? `&view=${viewParam}` : "";

            const newUrl =
                filters.length > 0
                    ? `/food-map?dish=${filters.map(encodeURIComponent).join(",")}${viewQueryString}`
                    : viewParam
                        ? `/food-map?view=${viewParam}`
                        : "/food-map";

            router.push(newUrl, { scroll: false });
        },
        [searchParams, router]
    );

    // Initialize client-side state
    useEffect(() => {
        const dishParam = searchParams.get("dish");
        if (dishParam) {
            const dishNames = dishParam.split(",");
            const validDishes = dishNames.filter((dishName) =>
                DishData.some((dish) => dish.name === dishName)
            );

            if (validDishes.length > 0) {
                setActiveFilters(validDishes);
            }
        }

        const handleClearFilters = () => {
            setActiveFilters([]);
            updateUrl([]);
        };

        window.addEventListener("clearFilters", handleClearFilters);
        return () => {
            window.removeEventListener("clearFilters", handleClearFilters);
        };
    }, [searchParams, updateUrl]);

    const handleFilterChange = (newFilters: string[]) => {
        if (JSON.stringify(activeFilters) === JSON.stringify(newFilters)) {
            return;
        }

        setActiveFilters(newFilters);
        updateUrl(newFilters);
    };

    return (
        <div className="h-screen w-screen">
            <MobileMapLayout
                dishData={DishData}
                foodPrintData={FoodPrintData}
                locationsMap={LocationData}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
            />

            {/* Desktop layout: visible on screens >= 900px */}
            <div className="hidden min-[900px]:flex overflow-hidden">
                <DesktopMapLayout
                    dishData={DishData}
                    foodPrintData={FoodPrintData}
                    locationsMap={LocationData}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                />
            </div>
        </div>
    );
}

export default MapLayout;
