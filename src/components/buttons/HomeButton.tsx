import React from "react";
import { Home } from "lucide-react";

interface HomeButtonProps {
  onClick: () => void;
  className?: string;
  isDesktop?: boolean;
}

const HomeButton: React.FC<HomeButtonProps> = ({
  onClick,
  className = "",
  isDesktop = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go to Home"
      tabIndex={0}
      className={`focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-150 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-yellow-100 active:bg-yellow-200 text-black ${
        isDesktop
          ? "h-12 px-5 gap-2 text-base min-w-[48px]" // desktop: icon+label
          : "h-12 w-12 text-xl" // mobile: icon only
      } ${className}`}
    >
      <Home className="w-6 h-6" aria-hidden="true" />
      {isDesktop && <span className="font-semibold">Home</span>}
    </button>
  );
};

export default HomeButton;
