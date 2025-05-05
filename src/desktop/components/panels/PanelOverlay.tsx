'use client';

import React from 'react';

interface PanelOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  withBlur?: boolean;
}

const PanelOverlay: React.FC<PanelOverlayProps> = ({ isVisible, onClose, withBlur = false }) => {
  if (!isVisible) return null;

  return (
    <div
      className={`absolute inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
        withBlur ? 'backdrop-blur-sm' : ''
      }`}
      onClick={onClose}
    />
  );
};

export default PanelOverlay;
