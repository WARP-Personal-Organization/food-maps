"use client";

import React from "react";
import { FiX } from "react-icons/fi";

interface CloseButtonProps {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick, className = "", ariaLabel = "Close" }) => {
  return (
    <button
      onClick={onClick}
      className={`${className} text-2xl bg-gray-200 rounded p-2 text-black`}
      aria-label={ariaLabel}
    >
      <FiX />
    </button>
  );
};

export default CloseButton;
