'use client';
import React from 'react';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';
import About from '@/components/About';

const AboutModal = ({ onClose }: { onClose: () => void }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center h-screen w-screen"
    onClick={onClose}
  >
    <div
      className="bg-white p-6 w-full h-full max-w-none"
      onClick={(e) => e.stopPropagation()}
    >
      <section className="flex justify-between items-center">
        <Image src={'/images/DGLogo.png'} alt="DG Logo" width={400} height={20} className="w-1/3 h-1/3" />
        <button className="text-2xl text-black bg-yellow-300 p-2 rounded" onClick={onClose}>
          <FiX />
        </button>
      </section>
      <section>
        <About />
      </section>
    </div>
  </div>
);

export default AboutModal;
