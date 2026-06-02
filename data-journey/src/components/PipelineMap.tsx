"use client";

import React, { useEffect, useState } from "react";
import { useOrder } from "../context/OrderContext";
import { Stage } from "../types";
import { CheckCircle2, Circle, Zap } from "lucide-react";
import { motion } from "framer-motion";

const STAGES: { id: Stage; label: string; color: string }[] = [
  { id: "CREATE", label: "Create", color: "purple" },
  { id: "OLTP", label: "OLTP", color: "pink" },
  { id: "OLAP", label: "OLAP", color: "orange" },
  { id: "LAKE", label: "Lake", color: "teal" },
  { id: "BRONZE", label: "Bronze", color: "blue" },
  { id: "SILVER", label: "Silver", color: "fuchsia" },
  { id: "GOLD", label: "Gold", color: "yellow" },
  { id: "DASHBOARD", label: "Dashboard", color: "emerald" },
];

const ELI5_COLORS: Record<string, { bg: string, text: string, border: string, line: string, glow: string }> = {
  purple: { bg: 'bg-purple-100', text: 'text-purple-500', border: 'border-purple-300', line: 'bg-purple-400', glow: 'bg-purple-400/40' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-500', border: 'border-pink-300', line: 'bg-pink-400', glow: 'bg-pink-400/40' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-500', border: 'border-orange-300', line: 'bg-orange-400', glow: 'bg-orange-400/40' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-500', border: 'border-teal-300', line: 'bg-teal-400', glow: 'bg-teal-400/40' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-500', border: 'border-blue-300', line: 'bg-blue-400', glow: 'bg-blue-400/40' },
  fuchsia: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-500', border: 'border-fuchsia-300', line: 'bg-fuchsia-400', glow: 'bg-fuchsia-400/40' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-500', border: 'border-yellow-300', line: 'bg-yellow-400', glow: 'bg-yellow-400/40' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-500', border: 'border-emerald-300', line: 'bg-emerald-400', glow: 'bg-emerald-400/40' },
};

export const PipelineMap = () => {
  const { currentStage, setCurrentStage, orders, isEli5Mode } = useOrder();
  const [pulse, setPulse] = useState(false);
  
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);

  // Trigger a visual pulse across the map when data is inserted
  useEffect(() => {
    if (orders.length > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [orders.length]);

  return (
    <div id="pipeline-map" className="w-full bg-sub-bg border-b border-panel-border p-4 relative overflow-hidden transition-colors duration-700">
      
      {/* Background data packet pulse effect */}
      {pulse && (
        <motion.div 
          initial={{ x: "-100%", opacity: 0.8 }}
          animate={{ x: "200%", opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent skew-x-12 z-0"
        />
      )}

      <div className="max-w-6xl mx-auto flex items-center justify-between relative z-10">
        {STAGES.map((stage, idx) => {
          const isActive = idx === currentIndex;
          const isPast = idx < currentIndex;
          
          return (
            <div
              key={stage.id}
              className="flex items-center flex-1 last:flex-none cursor-pointer"
              onClick={() => setCurrentStage(stage.id)}
            >
              <div className="flex flex-col items-center relative group">
                
                {/* Active Glow Ring */}
                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    className={`absolute inset-[-12px] rounded-full blur-md ${
                      isEli5Mode ? ELI5_COLORS[stage.color].glow : 'bg-blue-500/30'
                    }`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 relative z-20 ${isActive ? 'scale-125 shadow-xl' : 'scale-100'} ${
                    isEli5Mode
                      ? `${ELI5_COLORS[stage.color].bg} ${ELI5_COLORS[stage.color].text} border ${ELI5_COLORS[stage.color].border} ${isActive ? 'border-2 ring-4 ring-white/50' : ''}` 
                      : isActive 
                        ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.8)] border-2 border-white ring-4 ring-blue-500/30" 
                        : isPast 
                          ? "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                          : "bg-panel-bg text-text-muted border border-panel-border"
                  }`}
                >
                  {isPast ? <CheckCircle2 size={16} /> : isActive ? <Zap size={16} className={`animate-pulse ${isEli5Mode ? ELI5_COLORS[stage.color].text : 'text-amber-300'}`} /> : <Circle size={16} />}
                </div>
                
                <span 
                  className={`text-xs mt-3 transition-colors ${isActive ? 'font-black scale-110' : 'font-medium scale-100'} ${
                    isEli5Mode 
                      ? ELI5_COLORS[stage.color].text 
                      : isActive ? "text-blue-500" : isPast ? "text-emerald-500" : "text-text-muted"
                  } ${!isEli5Mode && 'group-hover:text-blue-400'}`}
                >
                  {stage.label}
                </span>
              </div>

              {idx < STAGES.length - 1 && (
                <div className={`h-1 flex-1 mx-2 relative overflow-hidden rounded-full ${
                  isEli5Mode ? ELI5_COLORS[stage.color].bg : 'bg-panel-border'
                }`}>
                  <motion.div 
                    className={`absolute top-0 left-0 h-full w-full ${
                      isEli5Mode 
                        ? ELI5_COLORS[stage.color].line
                        : isPast ? "bg-emerald-500" : "bg-transparent"
                    }`}
                    initial={{ scaleX: 0, transformOrigin: "left" }}
                    animate={{ scaleX: (isPast || isEli5Mode) ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Data Packet moving across active line */}
                  {isActive && pulse && (
                    <motion.div 
                      className={`absolute top-0 h-full w-12 bg-gradient-to-r from-transparent ${
                        isEli5Mode ? `via-${stage.color}-500` : 'via-blue-400'
                      } to-transparent`}
                      initial={{ left: "-100%" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
