"use client";

import React, { useState, useEffect } from "react";
import { StageHeader } from "../StageHeader";
import { useOrder } from "../../context/OrderContext";
import { Database, Zap, Clock } from "lucide-react";
import { DOMAIN_CONFIG } from "../../config/domainConfig";

export const OlapRaceStage = () => {
  const { orders, isEli5Mode, activeDomain } = useOrder();
  const config = DOMAIN_CONFIG[activeDomain];
  
  const [isRacing, setIsRacing] = useState(false);
  const [oltpTime, setOltpTime] = useState<number | null>(null);
  const [olapTime, setOlapTime] = useState<number | null>(null);
  const [oltpActiveHop, setOltpActiveHop] = useState<number>(0);
  
  const startRace = () => {
    setIsRacing(true);
    setOltpTime(null);
    setOlapTime(null);
    setOltpActiveHop(0);

    // OLAP finishes almost instantly (simulated 200ms)
    setTimeout(() => {
      setOlapTime(0.2);
    }, 200);

    // OLTP hops through 4 tables (simulated 3000ms total)
    let hop = 0;
    const oltpInterval = setInterval(() => {
      hop++;
      setOltpActiveHop(hop);
      if (hop === 4) {
        clearInterval(oltpInterval);
        setOltpTime(3.4);
        setIsRacing(false);
      }
    }, 850);
  };

  const oltpHops = [config.tables.oltpCustomers, config.tables.oltpOrders, config.tables.oltpProducts, config.tables.oltpPayments];

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StageHeader 
        title="Stage 3: OLTP vs OLAP Race" 
        problem="If OLTP is slow for reporting, why not keep a separate system pre-organized just for answers?"
      />

      <div className="bg-panel-bg p-6 rounded-2xl border border-panel-border shadow-xl">
        
        {/* EXPLANATORY BLOCK ADDED FOR CLARITY */}
        <div className="mb-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
          <h3 className="text-blue-400 font-semibold mb-2">
            {isEli5Mode ? "What is happening here? (ELI5)" : "What is happening here?"}
          </h3>
          <p className="text-sm text-text-main opacity-90 mb-2">
            {isEli5Mode 
              ? "Imagine you want to know how many Toy Cars you sold today. If you use the Cash Register (OLTP), you have to flip through hundreds of individual paper receipts one by one. It takes a long time!" 
              : <strong>OLTP (Online Transaction Processing)</strong>}
            {!isEli5Mode && " is designed to quickly write and save data. To do this efficiently, it splits data into multiple tables (Customers, Orders, Products). But when you want to ask a business question (e.g., \"Find total sales\"), it's slow because it has to \"hop\" between all these tables to gather the answer."}
          </p>
          <p className="text-sm text-text-main opacity-90">
            {isEli5Mode 
              ? "Now imagine someone already read all those receipts and wrote the total on a whiteboard for you. That's OLAP! It's super fast because the answer is already prepared."
              : <strong>OLAP (Online Analytical Processing)</strong>}
            {!isEli5Mode && " is designed for reading and analyzing. It pre-joins and organizes the data specifically to answer questions instantly. Hit the Start Race button to see why Data Engineers build OLAP Data Warehouses for reporting!"}
          </p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold text-text-main">The Query Race</h2>
            <p className="text-sm text-text-muted mt-1">
              Query: "Find total {config.label === 'Hospital' ? 'bill amount' : config.label === 'Manufacturing' ? 'defect cost' : 'sales'} for {orders[0]?.customer || config.mockNames[0]}"
            </p>
          </div>
          <button
            onClick={startRace}
            disabled={isRacing}
            className={`px-6 py-2.5 font-medium transition-all ${isEli5Mode ? 'rounded-2xl' : 'rounded-lg'} ${
              isRacing 
                ? "bg-emerald-600/50 text-white/50 cursor-not-allowed" 
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
            }`}
          >
            {isRacing ? "Racing..." : "Start Race"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* OLTP Competitor */}
          <div className={`bg-sub-bg border border-panel-border p-6 relative overflow-hidden ${isEli5Mode ? 'rounded-3xl' : 'rounded-xl'}`}>
            <div className="flex items-center justify-between mb-4 border-b border-panel-border pb-4">
              <div className="flex items-center gap-3">
                <Database className="text-blue-500" />
                <h3 className="font-semibold text-text-main">OLTP (Transaction DB)</h3>
              </div>
              <div className="flex items-center gap-2 text-text-muted font-mono text-xl">
                <Clock size={20} />
                {oltpTime ? `${oltpTime.toFixed(1)}s` : "---"}
              </div>
            </div>
            
            <div className="space-y-3 relative z-10">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Query Execution</p>
              {oltpHops.map((table, idx) => {
                const isActive = isRacing && oltpActiveHop === idx + 1;
                const isDone = oltpTime !== null || (isRacing && oltpActiveHop > idx + 1);
                
                return (
                  <div 
                    key={table}
                    className={`p-3 rounded-lg border transition-all duration-300 flex justify-between items-center ${
                      isActive 
                        ? "bg-blue-600/20 border-blue-500 text-blue-500 scale-105" 
                        : isDone 
                          ? "bg-panel-bg border-panel-border text-text-muted" 
                          : "bg-panel-bg/50 border-panel-border/50 text-text-muted opacity-60"
                    }`}
                  >
                    <span>{idx + 1}. Look up {table}</span>
                    {isActive && <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* OLAP Competitor */}
          <div className={`bg-sub-bg border border-panel-border p-6 relative overflow-hidden ${isEli5Mode ? 'rounded-3xl' : 'rounded-xl'}`}>
            <div className="flex items-center justify-between mb-4 border-b border-panel-border pb-4">
              <div className="flex items-center gap-3">
                <Zap className="text-amber-500 fill-amber-500/20" />
                <h3 className="font-semibold text-text-main">OLAP (Data Warehouse)</h3>
              </div>
              <div className="flex items-center gap-2 text-amber-500 font-mono text-xl">
                <Clock size={20} />
                {olapTime ? `${olapTime.toFixed(1)}s` : "---"}
              </div>
            </div>
            
            <div className="space-y-3 relative z-10">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Query Execution</p>
              <div 
                className={`p-3 rounded-lg border transition-all duration-300 flex justify-between items-center ${
                  isRacing && !olapTime 
                    ? "bg-amber-600/20 border-amber-500 text-amber-600 scale-105" 
                    : olapTime 
                      ? "bg-amber-100 border-amber-500/50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" 
                      : "bg-panel-bg/50 border-panel-border/50 text-text-muted opacity-60"
                }`}
              >
                <span>1. Single lookup in pre-joined view</span>
                {isRacing && !olapTime && <div className="w-4 h-4 rounded-full bg-amber-500 animate-pulse" />}
              </div>
            </div>
            
            {olapTime && (
              <div className="absolute inset-0 bg-amber-500/5 pointer-events-none animate-in fade-in duration-1000 flex items-center justify-center">
                <span className="text-6xl font-bold text-amber-500/10 rotate-[-15deg]">WINNER</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
