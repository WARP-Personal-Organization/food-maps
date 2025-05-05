'use client';

import React from 'react';
import Image from 'next/image';

interface AboutPanelProps {
  onClose: () => void;
  isVisible: boolean;
}

const AboutPanel: React.FC<AboutPanelProps> = ({ onClose, isVisible }) => {
  if (!isVisible) return null; // Ensure the panel is only shown when isVisible is true

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto p-4">
      <div className="relative bg-white rounded-xl w-full max-w-4xl p-6 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-300 rounded-full text-gray-700 hover:bg-gray-400"
        >
          &times; {/* This will show a "×" symbol for closing */}
        </button>

        {/* Your exact design below */}
        <section className="m-0 pt-4">
          <div className="relative w-full pb-8">
            <Image
              src="/images/about-image.png"
              alt="DG Logo"
              width={1000}
              height={20}
              className="object-cover object-center w-full"
            />
          </div>
          <h1 className="bg-yellow-300 font-bold w-28 rounded h-8 flex items-center justify-center text-center mb-4">
            ABOUT US
          </h1>
          <p className="pb-4">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Ex sapien vitae pellentesque sem placerat in id. 
            Pretium tellus duis convallis tempus leo eu aenean. Urna tempor pulvinar vivamus fringilla lacus nec metus. 
            Iaculis massa nisl malesuada lacinia integer nunc posuere. 
            Purus est efficitur laoreet mauris pharetra vestibulum fusce.
          </p>
          <p className="mb-6">
            Semper vel class aptent taciti sociosqu ad litora. 
            Conubia nostra inceptos himenaeos orci varius natoque penatibus. Dis parturient montes nascetur ridiculus mus donec rhoncus.
            Nulla molestie mattis scelerisque maximus eget fermentum odio.
          </p>
        </section>

        <section>
          <h1 className="flex items-center justify-center mb-6 font-bold">Partners</h1>
          <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Image
                key={idx}
                src="/images/partner-mockup.jpg"
                alt="DG Logo"
                width={100}
                height={20}
                className="object-cover object-center rounded-full w-18"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPanel;
