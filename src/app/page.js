"use client";
import React from "react";
import HeroSection from "@/components/Homepage/HeroSection";
import ActionCard from "@/components/Homepage/ActionCard";
import FaqSection from "@/components/Homepage/FaqSection";
import LogoSliderSection from "@/components/Homepage/LogoSliderSection";
import AboutCard from "@/components/Homepage/AboutCard";
export default function Home() {
  return (
    <>
      <HeroSection />
      <LogoSliderSection />
      <ActionCard />
      <AboutCard />
      <FaqSection />
    </>
  );
}
