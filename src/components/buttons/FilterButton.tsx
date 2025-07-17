import React from "react";
import Image from "next/image";

interface FilterButtonProps {
  onClick: () => void;
  className?: string;
  isDesktop?: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  className = "",
  isDesktop = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Filter Dishes"
      tabIndex={0}
      className={`focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-150 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-yellow-100 active:bg-yellow-200 text-black ${
        isDesktop
          ? "h-12 px-5 gap-2 text-base min-w-[48px]" // desktop: icon+label
          : "h-12 w-12 text-xl" // mobile: icon only
      } ${className}`}
    >
      <Image
        src="/filter-icon.png"
        alt="Filter"
        width={24}
        height={24}
        className="w-6 h-6"
        aria-hidden="true"
      />
      {isDesktop && <span className="font-semibold">Filter Dishes</span>}
    </button>
  );
};

export default FilterButton;
