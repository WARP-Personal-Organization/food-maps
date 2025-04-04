import React from "react";
import Navbar from "@/components/Navbar";

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