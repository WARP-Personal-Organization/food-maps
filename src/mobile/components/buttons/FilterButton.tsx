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
      onClick={onClick}
      aria-label="Open Filter"
      className={`${className} fixed top-10 left-5 bg-white rounded shadow-lg p-2 h-10 flex items-center justify-center gap-2 ${
        isDesktop ? "px-4" : "w-10"
      }`}
    >
      <Image src="/filter-icon.png" alt="Filter" width={20} height={20} />
      {isDesktop && <span className="inline text-black">Filter Dishes</span>}
    </button>
  );
};

export default FilterButton;
