import React, { useRef, useState } from "react";
import Image from "next/image";
import { FoodPrint } from "@/types/types";
import CloseButton from "@/components/buttons/CloseButton";
import GetDirectionsButton from "@/components/buttons/GetDirectionsButton";
// import { MapPin } from "lucide-react";

interface FoodPrintSummaryPanelProps {
  selectedFoodPrint: FoodPrint | null;
  isVisible: boolean;
  onClose: () => void;
  // onReadArticle: () => void; // Remove unused prop
}

const FoodPrintSummaryPanel: React.FC<FoodPrintSummaryPanelProps> = ({
  selectedFoodPrint,
  onClose,
  isVisible,
  // onReadArticle,
}) => {
  // Move hooks above early return
  const panelRef = useRef<HTMLDivElement>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [lastDragTime, setLastDragTime] = useState<number | null>(null);
  const [lastDragY, setLastDragY] = useState<number | null>(null);
  const [justDragged, setJustDragged] = useState(false);
  const DRAG_CLOSE_THRESHOLD = 80;
  const VELOCITY_CLOSE_THRESHOLD = 0.7; // px/ms

  if (!selectedFoodPrint) return null;

  const imageUrl = selectedFoodPrint.heroImage;
  const mapLink = selectedFoodPrint.mapLink || "";

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
    <div
      ref={panelRef}
      className={`fixed bottom-0 left-0 right-0 w-full h-[65vh] bg-white z-50 rounded-t-3xl shadow-2xl overflow-hidden
        transform transition-all duration-500 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
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
        <CloseButton
          onClick={onClose}
          className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
        />
      </div>

      {/* Scrollable content container */}
      <div className="h-full overflow-y-auto scrollbar-hide">
        {/* Hero image with enhanced styling */}
        <div
          className="relative w-full flex-shrink-0"
          style={{ height: "45vh" }}
        >
          <Image
            src={imageUrl || "/images/robertos/r1.webp"}
            alt={`${selectedFoodPrint.name} Image`}
            layout="fill"
            objectFit="cover"
            className="z-10 transition-transform duration-700 hover:scale-105"
          />
          {/* Subtle gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-20" />
        </div>

        {/* Content section with beautiful curved overlay */}
        <div className="rounded-t-3xl bg-white w-full p-6 pt-8 gap-6 z-30 relative -mt-6 flex flex-col shadow-xl">
          {/* FOODPRINT badge - keeping original yellow */}
          <div className="pt-0 pb-2">
            <span className="inline-block bg-yellow-300 rounded-xl px-5 py-2.5 text-sm font-bold uppercase shadow-sm">
              FOODPRINT
            </span>
          </div>

          {/* Enhanced title with better typography */}
          <h1 className="text-3xl font-black text-gray-900 leading-tight -mt-2">
            {selectedFoodPrint.name ||
              "Roberto's Siopao: The Queen of All Siopaos in PH"}
          </h1>

          {/* Enhanced location section */}
          {/* <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="flex items-start">
              <div className="p-2.5 bg-yellow-300 rounded-xl shadow-sm">
                <MapPin className="h-5 w-5 text-gray-700" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-gray-600 text-base font-medium leading-relaxed">
                  {selectedFoodPrint.location || "Rizal Street, La Paz Public Market, La Paz, Iloilo City"}
                </p>
                <div className="flex items-center mt-2">
                  <span className="inline-flex items-center text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Open Now
                  </span>
                  <span className="ml-3 text-xs text-gray-500">6:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div> */}

          {/* Enhanced description with better spacing and typography */}
          <div className="space-y-5">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-black text-xs font-bold">📝</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    ABOUT
                  </p>
                  <p className="text-gray-800 text-base leading-relaxed">
                    {selectedFoodPrint.description ||
                      "beloved siopao spot in Iloilo known for its large size and flavorful fillings."}
                  </p>
                </div>
              </div>
            </div>

            {selectedFoodPrint.extendedDescription?.map((paragraph, idx) => (
              <div
                key={idx}
                className="p-5 bg-gray-50 rounded-xl border-l-4 border-yellow-300"
              >
                <p className="text-gray-800 text-base leading-relaxed">
                  {paragraph}
                </p>
              </div>
            ))}

            {!selectedFoodPrint.extendedDescription && (
              <div className="space-y-4">
                <div className="p-5 bg-gray-50 rounded-xl border-l-4 border-yellow-300">
                  <p className="text-gray-800 text-base leading-relaxed">
                    A must-visit spot for both locals and tourists,
                    Roberto&apos;s has built a strong reputation over the
                    decades for serving siopao that&apos;s packed with a rich
                    combination of ingredients — from savory pork and chicken to
                    Chinese sausage and hard-boiled egg.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border-l-4 border-yellow-300">
                  <p className="text-gray-800 text-base leading-relaxed">
                    Their famous &quot;Queen Siopao&quot; stands out as the
                    ultimate indulgence, stuffed with a hefty portion of meat,
                    sausage, and egg, making it a satisfying meal on its own
                    that&apos;s well worth the experience.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced buttons container - keeping original gray scheme */}
          <div className="sticky bottom-0 pt-6 pb-4 bg-gradient-to-t from-white via-white/95 to-transparent">
            <GetDirectionsButton
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
              onClick={() => window.open(mapLink, "_blank")}
            />

            {/* Bottom handle for better UX */}
            <div className="flex justify-center mt-4">
              <div className="w-16 h-1 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPrintSummaryPanel;
