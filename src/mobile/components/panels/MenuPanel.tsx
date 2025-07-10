"use client";

import React from "react";
import Image from "next/image";
import CloseButton from "@/components/buttons/CloseButton";

interface MenuPanelProps {
  onClose: () => void;
  onOpenHome: () => void;
  onOpenAbout: () => void;
  isVisible: boolean;
}

const MenuPanel: React.FC<MenuPanelProps> = ({
  onClose,
  onOpenHome,
  onOpenAbout,
  isVisible,
}) => {
  const handleHomeClick = () => {
    onOpenHome();
  };

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 h-full bg-white shadow-lg z-40 transition-transform duration-300 ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 h-full flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <Image
            src="/images/foodprints-logo-menu.png"
            alt="Logo"
            width={100}
            height={110}
          />
          <CloseButton
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-full transition-all duration-300 shadow-sm touch-manipulation"
          />
        </div>

        <ul className="space-y-4 flex-grow">
          <li
            className="text-black text-3xl font-bold hover:text-yellow-500 cursor-pointer flex justify-between items-center"
            onClick={handleHomeClick}
          >
            Home <p className="text-sm font-light text-amber-300">01</p>
          </li>
          <hr className="border-amber-300 my-8" />
          <li
            className="text-black text-3xl font-bold hover:text-yellow-500 cursor-pointer flex justify-between items-center"
            onClick={onOpenAbout}
          >
            About <p className="text-sm font-light text-amber-300">02</p>
          </li>
        </ul>

        <section className="text-sm font-medium">
          <div className="flex flex-col gap-y-3">
            <h2 className="text-amber-300 font-bold">WEBSITE</h2>
            <a
              href="https://dailyguardian.com.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:underline"
            >
              dailyguardian.com.ph
            </a>
          </div>
          <div className="flex flex-col my-8 gap-y-3">
            <h2 className="text-amber-300 font-bold">EXPLORE</h2>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/DailyGuardianPH/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:underline"
              >
                FACEBOOK
              </a>
              <span>/</span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:underline"
              >
                INSTAGRAM
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MenuPanel;
