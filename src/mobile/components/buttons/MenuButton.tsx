import React from "react";
import { FiMenu } from "react-icons/fi";

interface MenuButtonProps {
  onClick: () => void;
  className?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open Menu"
      className={`fixed top-10 right-5 z-20 text-2xl text-black bg-white rounded p-2 shadow-lg h-10 w-10 flex items-center justify-center ${className}`}
    >
      <FiMenu />
    </button>
  );
};

export default MenuButton;
