"use client";

import React, { useState, useEffect } from "react";

import { useOrder } from "../context/OrderContext";
import { PipelineMap } from "../components/PipelineMap";
import { GoldenThreadBadge } from "../components/GoldenThreadBadge";
import { CreateOrderStage } from "../components/stages/CreateOrderStage";
import { BronzeStage } from "../components/stages/BronzeStage";
import { SilverStage } from "../components/stages/SilverStage";
import { OltpStage } from "../components/stages/OltpStage";
import { OlapRaceStage } from "../components/stages/OlapRaceStage";
import { DataLakeStage } from "../components/stages/DataLakeStage";
import { GoldStage } from "../components/stages/GoldStage";
import { DashboardStage } from "../components/stages/DashboardStage";
import { TourGuideButton } from "../components/TourGuideButton";

export default function Home() {
  const { currentStage, isEli5Mode, setIsEli5Mode } = useOrder();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="h-screen bg-[#0f172a]" />; // Matches default dark theme background to prevent flash
  }

  return (
    <main className={`h-screen flex flex-col overflow-hidden transition-colors duration-700 bg-page-bg text-text-main ${isEli5Mode ? 'eli5-theme' : ''}`}>
      
      {/* Top Header & Controls */}
      <header className={`bg-panel-bg border-b border-panel-border px-6 py-2 flex items-center justify-between z-50 transition-colors duration-700 ${isEli5Mode ? 'shadow-[0_4px_20px_rgba(252,165,165,0.1)]' : ''}`}>
        <div className="flex items-center gap-3">
          {isEli5Mode && (
            <span className="text-3xl" role="img" aria-label="cloud">☁️</span>
          )}
          <h1 className={`text-text-main font-bold tracking-tight text-2xl ${
            isEli5Mode 
              ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text' 
              : 'text-text-main'
          }`}>
            Data Journey {isEli5Mode && <span className="text-xl inline-block ml-1 animate-pulse" role="img" aria-label="stars">✨🌸</span>}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <TourGuideButton />
          <div id="eli5-toggle" className="flex items-center gap-3 bg-sub-bg px-3 py-1.5 rounded-lg border border-panel-border">
            <span className={`text-xs transition-colors ${!isEli5Mode ? "text-purple-400 font-semibold" : "text-text-muted"}`}>
              Engineer Mode
            </span>
            <button 
              onClick={() => setIsEli5Mode(!isEli5Mode)}
              className="w-10 h-5 bg-slate-700 rounded-full p-1 relative transition-colors shadow-inner"
              style={{ backgroundColor: isEli5Mode ? '#a855f7' : '#334155' }}
            >
              <div 
                className="bg-white w-3 h-3 rounded-full shadow-md transition-transform duration-300"
                style={{ transform: isEli5Mode ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </button>
            <span className={`text-xs transition-colors ${isEli5Mode ? "text-purple-400 font-semibold" : "text-text-muted"}`}>
              ELI5 Mode
            </span>
          </div>
        </div>
      </header>

      {/* Top Navigation / Map */}
      <div className="z-40">
        <PipelineMap />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 lg:px-8">
        {currentStage === "CREATE" && <CreateOrderStage />}
        {currentStage === "OLTP" && <OltpStage />}
        {currentStage === "OLAP" && <OlapRaceStage />}
        {currentStage === "LAKE" && <DataLakeStage />}
        {currentStage === "BRONZE" && <BronzeStage />}
        {currentStage === "SILVER" && <SilverStage />}
        {currentStage === "GOLD" && <GoldStage />}
        {currentStage === "DASHBOARD" && <DashboardStage />}
      </div>

      <GoldenThreadBadge />
    </main>
  );
}
