"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Location } from "@/types/types";
import { MapPin, Tag } from "lucide-react";
import GetDirectionsButton from "@/components/buttons/GetDirectionsButton";
import CloseButton from "@/components/buttons/CloseButton";
import { motion, AnimatePresence } from "framer-motion";

interface LocationSummaryPanelProps {
  location: Location | null;
  isVisible: boolean;
  onClose: () => void;
  onViewDetails: () => void;
}

const LocationSummaryPanel: React.FC<LocationSummaryPanelProps> = ({
  location,
  onClose,
  isVisible,
}) => {
  const [activeTab, setActiveTab] = useState<"photos" | "menu">("photos");
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Drag-to-close state and handlers (from FoodPrintSummaryPanel)
  const panelRef = useRef<HTMLDivElement>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [lastDragTime, setLastDragTime] = useState<number | null>(null);
  const [lastDragY, setLastDragY] = useState<number | null>(null);
  const [justDragged, setJustDragged] = useState(false);
  const DRAG_CLOSE_THRESHOLD = 80;
  const VELOCITY_CLOSE_THRESHOLD = 0.7; // px/ms

  if (!location) return null;

  const address = location.address;
  const openHours = location.openHours;
  const priceRange = location.priceRange;

  const photosToShow =
    activeTab === "menu" ? location.menuPhotos : location.photos;

  // Navigation handlers
  const handleImageClick = (photo: string, index: number) => {
    setEnlargedImage(photo);
    setCurrentImageIndex(index);
  };

  const handleNext = () => {
    if (photosToShow && currentImageIndex < photosToShow.length - 1) {
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);
      setEnlargedImage(photosToShow[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (photosToShow && currentImageIndex > 0) {
      const prevIndex = currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
      setEnlargedImage(photosToShow[prevIndex]);
    }
  };

  const handleCloseModal = () => {
    setEnlargedImage(null);
    setCurrentImageIndex(0);
  };

  // Touch/mouse event handlers
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStartY(clientY);
    setDragOffset(0);
    setLastDragTime(Date.now());
    setLastDragY(clientY);
    setJustDragged(false);
    document.body.style.overflow = "hidden";
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartY === null) return;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const offset = Math.max(0, clientY - dragStartY);
    setDragOffset(offset);
    setLastDragTime(Date.now());
    setLastDragY(clientY);
  };

  const handleDragEnd = () => {
    document.body.style.overflow = "";
    if (dragStartY !== null && lastDragY !== null && lastDragTime !== null) {
      const dragDistance = lastDragY - dragStartY;
      const dragDuration = Date.now() - lastDragTime;
      const velocity = dragDistance / (dragDuration || 1); // px/ms
      if (
        dragOffset > DRAG_CLOSE_THRESHOLD ||
        velocity > VELOCITY_CLOSE_THRESHOLD
      ) {
        setDragOffset(0);
        setDragStartY(null);
        setJustDragged(true);
        onClose();
        return;
      }
    }
    setDragOffset(0);
    setDragStartY(null);
    setJustDragged(true);
  };

  // Prevent accidental click after drag
  const handleHandleClick = () => {
    if (justDragged) {
      setJustDragged(false);
      return;
    }
    onClose();
  };

  // Keyboard accessibility for handle
  const handleHandleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay to block map interaction when panel is open */}
      {isVisible && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          style={{ pointerEvents: "auto" }}
          aria-hidden="true"
        />
      )}
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            ref={panelRef}
            key="location-panel"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: dragOffset, opacity: 1 }}
            exit={{
              y: "100%",
              opacity: 0,
              transition: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.5,
            }}
            className="fixed bottom-0 left-0 right-0 w-full h-[80vh] bg-white z-50 rounded-t-3xl shadow-2xl overflow-hidden"
            style={{
              transform: `translateY(${isVisible ? dragOffset : 0}px) ${
                isVisible ? "" : "translateY(100%)"
              }`,
              transition: dragStartY
                ? "none"
                : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s",
              opacity: isVisible ? 1 : 0,
              willChange: "transform",
            }}
            onTouchMove={dragStartY !== null ? handleDragMove : undefined}
            onTouchEnd={dragStartY !== null ? handleDragEnd : undefined}
            onMouseMove={dragStartY !== null ? handleDragMove : undefined}
            onMouseUp={dragStartY !== null ? handleDragEnd : undefined}
          >
            {/* Elegant top handle - now interactive */}
            <button
              className="absolute top-3 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full z-50 cursor-pointer focus:outline-none"
              aria-label="Close panel"
              tabIndex={0}
              onTouchStart={handleDragStart}
              onMouseDown={handleDragStart}
              onClick={handleHandleClick}
              onKeyDown={handleHandleKeyDown}
              style={{ WebkitTapHighlightColor: "transparent" }}
            />

            {/* Floating action buttons */}
            <div className="absolute top-6 right-6 z-50 flex gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <CloseButton
                  onClick={onClose}
                  className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300"
                />
              </motion.div>
            </div>

            {/* Enlarged Image Modal */}
            <AnimatePresence>
              {enlargedImage && photosToShow && (
                <motion.div
                  className="fixed inset-0 z-[60] bg-black bg-opacity-80 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleCloseModal}
                >
                  <motion.div
                    className="relative w-full h-full p-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Image
                      src={enlargedImage}
                      alt="Enlarged View"
                      layout="fill"
                      objectFit="contain"
                      className="rounded-2xl"
                    />

                    {/* Navigation Buttons */}
                    {currentImageIndex > 0 && (
                      <motion.button
                        onClick={handlePrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white cursor-pointer z-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Previous image"
                        tabIndex={0}
                        role="button"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-800"
                        >
                          <polyline points="15,18 9,12 15,6" />
                        </svg>
                      </motion.button>
                    )}

                    {photosToShow &&
                      currentImageIndex < photosToShow.length - 1 && (
                        <motion.button
                          onClick={handleNext}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white cursor-pointer z-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Next image"
                          tabIndex={0}
                          role="button"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-800"
                          >
                            <polyline points="9,18 15,12 9,6" />
                          </svg>
                        </motion.button>
                      )}

                    {/* Close Button */}
                    <motion.div
                      onClick={handleCloseModal}
                      className="absolute top-8 right-8 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white cursor-pointer z-50"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CloseButton />
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scrollable Content */}
            <div className="h-full overflow-y-auto scrollbar-hide">
              {/* Header Image */}
              <div
                className="relative w-full flex-shrink-0"
                style={{ height: "45vh" }}
              >
                <Image
                  src={location.photos?.[0]}
                  alt={`${location.name} Image`}
                  layout="fill"
                  objectFit="cover"
                  fill
                  className="z-10 transition-transform duration-700 hover:scale-105"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-20" />
              </div>

              {/* Info Section with enhanced styling */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="rounded-t-3xl bg-white w-full p-6 pt-8 gap-6 z-30 relative -mt-6 flex flex-col shadow-xl"
              >
                <h1 className="text-4xl font-black text-gray-900 leading-tight">
                  {location.name}
                </h1>

                {/* Enhanced info cards */}
                <div className="space-y-4">
                  {[
                    {
                      icon: <MapPin className="h-5 w-5 text-white" />,
                      text: address,
                      label: "Location",
                    },
                    {
                      icon: (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-white"
                        >
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                          <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                        </svg>
                      ),
                      text: openHours,
                      label: "Hours",
                    },
                    {
                      icon: <Tag className="h-5 w-5 text-white" />,
                      text: priceRange,
                      label: "Price Range",
                    },
                  ].map(({ icon, text, label }, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                      className="bg-gray-50 rounded-2xl p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-yellow-300 rounded-xl shadow-sm">
                          {icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            {label}
                          </p>
                          <p className="text-base text-gray-800 font-medium leading-relaxed">
                            {text}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced Tabs */}
                <div className="mt-6">
                  <div className="flex bg-gray-100 rounded-2xl p-1">
                    {["photos", "menu"].map((tab) => (
                      <motion.button
                        key={tab}
                        className={`flex-1 text-center py-3 px-4 text-base font-semibold rounded-xl transition-all duration-300 ${
                          activeTab === tab
                            ? "bg-yellow-300 text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab(tab as "photos" | "menu")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Enhanced Photo/Menu Grid */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4"
                >
                  {photosToShow && photosToShow.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1">
                      {photosToShow.slice(0, 10).map((photo, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className="relative flex-shrink-0 w-64 h-44 rounded-2xl overflow-hidden bg-gray-100 shadow-sm snap-center"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Image
                            src={photo}
                            alt={`${location.name} ${activeTab} ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="cursor-pointer hover:opacity-90 transition-opacity duration-300"
                            onClick={() => handleImageClick(photo, index)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-12 bg-gray-50 rounded-2xl">
                      <p className="text-lg font-medium">
                        No {activeTab === "menu" ? "menu items" : "photos"}{" "}
                        available.
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Enhanced Action Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="sticky bottom-0 z-10 bg-gradient-to-t from-white via-white/95 to-transparent pt-6 pb-4 mt-6"
                >
                  <GetDirectionsButton
                    className="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                    onClick={() => window.open(location.mapLink, "_blank")}
                  />

                  {/* Bottom handle */}
                  <div className="flex justify-center mt-4">
                    <div className="w-16 h-1 bg-gray-300 rounded-full" />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LocationSummaryPanel;
