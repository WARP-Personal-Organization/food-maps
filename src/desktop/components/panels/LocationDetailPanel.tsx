"use client";

import React, { useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import { Location } from "@/types/types";
import CloseButton from "@/components/buttons/CloseButton";
import GetDirectionsButton from "@/components/buttons/GetDirectionsButton";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Tag } from "lucide-react";

interface LocationDetailPanelProps {
  location: Location | null;
  isVisible: boolean;
  onClose: () => void;
  onViewDetails: () => void;
}

/**
 * EnlargedImageModal - renders the enlarged image in a portal to cover the whole screen
 */
type EnlargedImageModalProps = {
  imageUrl: string;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

const EnlargedImageModal: React.FC<EnlargedImageModalProps> = ({
  imageUrl,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}) => {
  if (typeof window === "undefined") return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowRight" && hasNext) onNext();
    if (e.key === "ArrowLeft" && hasPrevious) onPrevious();
  };

  return ReactDOM.createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] bg-black bg-opacity-80 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <motion.div
        className="relative w-full h-full p-4 flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imageUrl}
          alt="Enlarged View"
          layout="fill"
          objectFit="contain"
          className="rounded-2xl"
        />

        {/* Navigation Buttons */}
        {hasPrevious && (
          <motion.button
            onClick={onPrevious}
            className="absolute left-8 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white cursor-pointer z-50"
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

        {hasNext && (
          <motion.button
            onClick={onNext}
            className="absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white cursor-pointer z-50"
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
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white cursor-pointer z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Close enlarged image"
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onClose();
          }}
        >
          <CloseButton />
        </motion.div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

const LocationDetailPanel: React.FC<LocationDetailPanelProps> = ({
  location,
  isVisible,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("photos");
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  if (!location) return null;

  // Default data if not provided
  const address = location.address || "Molo District, Iloilo City";
  const openHours = location.openHours || "10:00 AM - 7:00 PM";
  const priceRange = location.priceRange || "₱100-200";
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
  return (
    <>
      {/* Enlarged Image Modal rendered at the top level using portal */}
      <AnimatePresence>
        {enlargedImage && photosToShow && (
          <EnlargedImageModal
            imageUrl={enlargedImage}
            onClose={handleCloseModal}
            onNext={handleNext}
            onPrevious={handlePrevious}
            hasNext={
              photosToShow ? currentImageIndex < photosToShow.length - 1 : false
            }
            hasPrevious={currentImageIndex > 0}
          />
        )}
      </AnimatePresence>
      <div
        className={`fixed top-0 left-0 w-[300px] min-w-[300px] md:w-[320px] lg:w-[350px] xl:w-[400px] h-full bg-white shadow-lg z-30 overflow-y-scroll transform transition-transform duration-300 
        ${isVisible ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Main image - Adjusted height */}
        <div className="relative h-[30vh] w-full">
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.div
                key="location-panel"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
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
                className="fixed"
              >
                {/* Elegant top handle */}

                {/* Floating action buttons */}
                <div className="absolute top-6 right-6 z-50 flex gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                  <CloseButton
              onClick={onClose}
              className="p-2 hover:bg-white/80 rounded-full transition-all duration-300 shadow-sm touch-manipulation"
            />
                  </motion.div>
                </div>

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
                          icon: <MapPin className="h-5 w-5 text-yellow-500" />,
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
                              className="text-yellow-500"
                            >
                              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                            </svg>
                          ),
                          text: openHours,
                          label: "Hours",
                        },
                        {
                          icon: <Tag className="h-5 w-5 text-yellow-500" />,
                          text: priceRange,
                          label: "Price Range",
                        },
                      ].map(({ icon, text, label }, index) => (
                        <motion.div
                          key={index}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            delay: 0.3 + index * 0.1,
                            duration: 0.4,
                          }}
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
                            onClick={() =>
                              setActiveTab(tab as "photos" | "menu")
                            }
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
                      className="grid grid-cols-2 gap-3 mt-4"
                    >
                      {photosToShow && photosToShow.length > 0 ? (
                        photosToShow.slice(0, 6).map((photo, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className={`relative rounded-2xl overflow-hidden bg-gray-100 shadow-sm ${
                              index === 0 ? "col-span-2" : ""
                            }`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <div
                              className={`relative w-full ${
                                index === 0 ? "aspect-[2/1]" : "aspect-square"
                              }`}
                            >
                              <Image
                                src={photo}
                                alt={`${location.name} ${activeTab} ${
                                  index + 1
                                }`}
                                layout="fill"
                                objectFit="cover"
                                className="cursor-pointer hover:opacity-90 transition-opacity duration-300"
                                onClick={() => handleImageClick(photo, index)}
                              />
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center text-gray-400 py-12 bg-gray-50 rounded-2xl">
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
                        className="w-full bg-yellow-300 pb-4 hover:bg-yellow-400 text-gray-900 font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                        onClick={() => window.open(location.mapLink, "_blank")}
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default LocationDetailPanel;
