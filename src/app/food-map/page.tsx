import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { LuUtensils } from "react-icons/lu";
import { FiMenu, FiX } from "react-icons/fi";

export default function FoodMap() {
  return (
    <>
      <div className="h-screen w-full">
        
        {/* MOBILE VIEW */}
        <div className="lg:hidden flex flex-col h-screen">
          <section className="fixed top-0 z-50 w-full">
            <Navbar />
            MAP SAMPLE
          </section>
          </div>
      </div>
    </>
  )
}