import React from "react";

interface ReadArticleButtonProps {
  onClick: () => void;
  className?: string;
}

const ReadArticleButton: React.FC<ReadArticleButtonProps> = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open Read Article"
      className={`font-bold rounded-sm bg-yellow-300 h-12 flex items-center justify-center ${className}`}
    >
      <span>Read Article</span>
    </button>
  );
};

export default ReadArticleButton;

