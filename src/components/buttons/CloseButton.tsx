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
      className={`text-2xl rounded p-2 text-black bg-[#ebebeb] ${className}rounded-full`}
      aria-label={ariaLabel}
    >
      <FiX />
    </button>
  );
};

export default CloseButton;
