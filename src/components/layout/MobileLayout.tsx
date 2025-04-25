import React from "react";
import { GoArrowRight } from "react-icons/go";
import { Dish } from "@/lib/dishData";
import DishImage from "../dishes/DishImage";
import FoodPrintsNavbar from "../FoooPrintsNavbar";
import { useRouter } from "next/navigation";

interface MobileLayoutProps {
  dishes: Dish[];
  activeIndex: number;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  dishes,
  activeIndex,
  handleTouchStart,
  handleTouchEnd,
  onNext,
  onPrev,
}) => {
  const activeDish = dishes[activeIndex];
  const router = useRouter();

  const handleWhereToEat = () => {
    if (activeDish.href === "/food-map") {
      router.push(
        `/food-map?dish=${encodeURIComponent(activeDish.name)}&view=map`
      );
    } else {
      router.push(activeDish.href);
    }
  };

  return (
    <div className="max-[899px]:flex hidden flex-col h-screen bg-gray-100">
      <section className="fixed top-0 z-30 w-full">
        <FoodPrintsNavbar />
      </section>

      {/* Top Image */}
      <div className="relative w-full aspect-square">
        <DishImage
          dish={activeDish}
          className="relative h-full w-full"
          imageClassName="z-10 object-cover"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          priority
        />
      </div>

      {/* Bottom Content */}
      <div className="bg-white flex flex-col rounded-t-lg w-full p-[24px] pt-[32px] gap-[20px] overflow-y-auto -mt-[10%] z-10 relative">
        {/* Dish Name and Navigation */}
        <div className="flex items-center justify-between h-10 gap-4 mb-2">
          <h1 className="text-3xl font-bold text-[#202020]">
            {activeDish.name}
          </h1>

          {/* Chevron Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              className="h-10 w-10 p-2 rounded-full bg-[#ebebeb] flex items-center justify-center focus:outline-none 
              cursor-pointer hover:bg-gray-200 transition-colors"
              aria-label="Previous dish"
            >
              <span className="text-[#c2c2c2] text-sm">❮</span>
            </button>
            <button
              onClick={onNext}
              className="h-10 w-10 p-2 rounded-full bg-[#F9D408] flex items-center justify-center focus:outline-none 
              cursor-pointer hover:bg-[#E6C207] transition-colors"
              aria-label="Next dish"
            >
              <span className="text-[#202020] text-sm">❯</span>
            </button>
          </div>
        </div>

        {/* Tagline */}
        <h3 className="italic font-semibold text-base text-[#7c7c7c]">
          {activeDish.tagline}
        </h3>

        {/* Description */}
        <div className="text-[#2a2a2a] mb-6">
          <p className="leading-relaxed">{activeDish.description}</p>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Swipe Indicator */}
        <div className="border-t border-text-[#c2c2c2] pt-4 mb-4">
          <p className="flex items-center justify-center text-[#7c7c7c] text-sm">
            Swipe to see other Ilonggo top dishes{" "}
            <GoArrowRight className="ml-2 text-[#7c7c7c]" />
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handleWhereToEat}
          className="w-full bg-[#F9D408] font-bold py-4 rounded-sm text-[#3b3b3b] text-base text-center inline-block 
          cursor-pointer hover:bg-[#E6C207] transition-colors shadow-sm"
        >
          Where to Eat
        </button>
      </div>
    </div>
  );
};

export default MobileLayout;
