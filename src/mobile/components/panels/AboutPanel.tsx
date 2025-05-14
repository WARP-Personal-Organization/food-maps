'use client';

import React from 'react';
import Image from 'next/image';
import CloseButton from "@/components/buttons/CloseButton";

interface AboutPanelProps {
  onClose: () => void;
  isVisible: boolean;
}

const AboutPanel: React.FC<AboutPanelProps> = ({ onClose, isVisible }) => {
  if (!isVisible) return null; // Ensure the panel is only shown when isVisible is true

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-sm overflow-y-auto">
      <div className="pb-10">
        <div>
          <Image
            src="/images/DGLogo.png"
            alt="Daily Guardian Logo"
            width={1000}
            height={20}
            className="absolute top-5 left-2 w-auto h-auto"
          />
          <CloseButton
          onClick={onClose}
          className="absolute top-3 right-4 bg-yellow-300 w-auto h-auto"
          aria-label="Close About Panel"
        />
        </div>
        
        {/* Your exact design below */}
        <section className="m-0 pt-13">
          <div className="pb-8 pt-18">
            <Image
              src="/images/about-image.png"
              alt="About Us Cover Photo"
              width={1000}
              height={20}
              className="object-cover object-center w-full pb-5"
            />
          </div>
          <div className="pl-8 pr-7">
            <h1 className="bg-yellow-300 font-bold w-28 rounded h-8 flex items-center justify-center text-center mb-5">
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
          </div>
        </section>
        <section>
          <h1 className="flex items-center justify-center mb-6 font-bold">Partners</h1>
          <div className="grid grid-cols-4 gap-4 md:grid-cols-8 pl-8 pr-7"> 
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