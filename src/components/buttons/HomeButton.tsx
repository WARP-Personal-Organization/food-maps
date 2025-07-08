import React from "react";
import { Home } from "lucide-react";

interface FilterButtonProps {
  onClick: () => void;
  className?: string;
  isDesktop?: boolean;
}

const HomeButton: React.FC<FilterButtonProps> = ({
  onClick,
  className = "",
  isDesktop = false,
}) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open Home"
      className={`${className} top-10 left-5 bg-white rounded shadow-lg p-2 h-10 flex items-center justify-center gap-2 ${
        isDesktop ? "px-4" : "w-10"
      }`}
    >
      <Home/>
      {isDesktop && <span className="inline text-black">Home</span>}
    </button>
  );
};

export default HomeButton;
