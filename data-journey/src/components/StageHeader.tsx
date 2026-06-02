"use client";

import React from "react";
import { useOrder } from "../context/OrderContext";
import { HelpCircle } from "lucide-react";

interface StageHeaderProps {
  title: string;
  problem: string;
}

export const StageHeader = ({ title, problem }: StageHeaderProps) => {
  const { isEli5Mode } = useOrder();

  return (
    <div className={`mb-8 p-6 rounded-2xl border shadow-md relative overflow-hidden ${
      isEli5Mode 
        ? 'border-purple-200 bg-purple-50/50 shadow-purple-100' 
        : 'bg-panel-bg border-panel-border'
    }`}>
      {isEli5Mode && (
        <div className="absolute right-4 top-4 opacity-70">
          <span className="text-6xl" role="img" aria-label="rainbow">🌈☁️</span>
        </div>
      )}
      <h1 className={`text-3xl font-bold mb-2 ${isEli5Mode ? 'text-purple-600' : 'text-text-main'}`}>{title}</h1>
      <div className={`flex items-start gap-3 mt-4 ${isEli5Mode ? 'text-purple-500' : 'text-text-muted'}`}>
        {isEli5Mode ? (
          <span className="text-xl shrink-0 mt-0.5">⭐</span>
        ) : (
          <HelpCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        )}
        <div>
          <span className={`font-semibold ${isEli5Mode ? 'text-purple-600' : 'text-blue-400'}`}>
            {isEli5Mode ? "Why does this stage exist? " : "Why does this stage exist? "}
          </span>
          {problem}
        </div>
      </div>
    </div>
  );
};
