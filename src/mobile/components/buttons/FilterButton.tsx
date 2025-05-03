import React from "react";
import Image from "next/image";

interface FilterButtonProps {
  onClick: () => void;
  className?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open Filter"
      className={`fixed top-10 left-5 z-20 bg-white rounded shadow-lg p-2 h-10 w-10 flex items-center justify-center ${className}`}
    >
      <Image src="/filter-icon.png" alt="Filter" width={20} height={20} />
    </button>
  );
};

export default FilterButton;
