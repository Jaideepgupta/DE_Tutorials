"use client";

import React, { useState } from "react";
import { StageHeader } from "../StageHeader";
import { useOrder } from "../../context/OrderContext";
import { Filter, Sigma, ArrowRightCircle } from "lucide-react";
import { DOMAIN_CONFIG } from "../../config/domainConfig";

export const GoldStage = () => {
  const { orders, activeDomain, isEli5Mode } = useOrder();
  const config = DOMAIN_CONFIG[activeDomain];
  
  // To make the Gold layer interesting, we should aggregate multiple rows.
  // If the user only made 1 order, we can inject a few mock clean rows for the visual.
  const baseOrders = orders.filter(o => o.cleanVersion !== null).map(o => o.cleanVersion!);
  
  const mockOrders = [
    { id: "M-1", customer: config.mockNames[1], product: config.mockProducts[1], price: 500, date: new Date().toLocaleDateString() },
    { id: "M-2", customer: config.mockNames[2], product: config.mockProducts[2], price: 300, date: new Date().toLocaleDateString() },
    { id: "M-3", customer: config.mockNames[3], product: config.mockProducts[1], price: 500, date: new Date().toLocaleDateString() },
  ];

  const allCleanData = baseOrders.length > 0 ? [...baseOrders, ...mockOrders] : mockOrders;

  const [activeMetric, setActiveMetric] = useState<"NONE" | "REVENUE" | "TOP_PRODUCT">("NONE");

  // Aggregation Logic
  const totalRevenue = allCleanData.reduce((sum, row) => sum + Number(row.price), 0);
  
  const productCounts = allCleanData.reduce((acc, row) => {
    acc[row.product] = (acc[row.product] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StageHeader 
        title={isEli5Mode ? "Stage 7: The Final Report (Gold)" : "Stage 7: Gold Layer (Data Marts)"} 
        problem={isEli5Mode 
          ? "The boss doesn't want to read a million receipts. They just want the total numbers. How do we summarize the clean data?"
          : "The business doesn't want to read thousands of rows. They want answers. How do we turn data into insight?"}
      />

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Metric Selectors */}
        <div className={`md:col-span-4 bg-panel-bg p-6 border border-panel-border shadow-xl ${isEli5Mode ? 'rounded-3xl' : 'rounded-2xl'}`}>
          <div className="flex items-center gap-3 mb-6 border-b border-panel-border pb-4">
            <Filter className="text-amber-500" />
            <h2 className="text-xl font-semibold text-text-main">Aggregations</h2>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => setActiveMetric("REVENUE")}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${
                activeMetric === "REVENUE" 
                  ? "bg-amber-100 border-amber-500 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" 
                  : "bg-sub-bg border-panel-border hover:border-text-muted text-text-main"
              }`}
            >
              <div className="font-semibold mb-1 flex items-center justify-between">
                Total Revenue
                <ArrowRightCircle size={18} className={`transition-opacity ${activeMetric === "REVENUE" ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
              </div>
              <div className="text-xs opacity-70">Collapse all rows into a sum of prices.</div>
            </button>

            <button
              onClick={() => setActiveMetric("TOP_PRODUCT")}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${
                activeMetric === "TOP_PRODUCT" 
                  ? "bg-amber-100 border-amber-500 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" 
                  : "bg-sub-bg border-panel-border hover:border-text-muted text-text-main"
              }`}
            >
              <div className="font-semibold mb-1 flex items-center justify-between">
                Top {config.fields.product.split(' ')[0]}
                <ArrowRightCircle size={18} className={`transition-opacity ${activeMetric === "TOP_PRODUCT" ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
              </div>
              <div className="text-xs opacity-70">Group by {config.fields.product.toLowerCase()} and count them.</div>
            </button>
            
            {activeMetric !== "NONE" && (
              <button 
                onClick={() => setActiveMetric("NONE")}
                className="w-full text-center text-sm text-text-muted hover:text-text-main mt-4"
              >
                Reset View
              </button>
            )}
          </div>
        </div>

        {/* Data View */}
        <div className={`md:col-span-8 bg-panel-bg p-6 border border-panel-border shadow-xl overflow-hidden relative min-h-[400px] flex flex-col ${isEli5Mode ? 'rounded-3xl' : 'rounded-2xl'}`}>
          
          {/* Detailed View (Fades out when aggregated) */}
          <div className={`transition-all duration-700 absolute inset-0 p-6 ${activeMetric !== "NONE" ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}>
            <h2 className="text-xl font-semibold text-text-main mb-6">Clean Detailed Data (Silver)</h2>
            <div className={`overflow-x-auto border border-panel-border bg-sub-bg ${isEli5Mode ? 'rounded-2xl' : 'rounded-xl'}`}>
              <table className="w-full text-sm text-left text-text-main">
                <thead className="text-xs text-text-muted uppercase bg-panel-bg border-b border-panel-border">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">{config.fields.customer}</th>
                    <th className="px-4 py-3">{config.fields.product}</th>
                    <th className="px-4 py-3">{config.fields.price}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-panel-border">
                  {allCleanData.map((row) => (
                    <tr key={row.id} className="hover:bg-panel-bg">
                      <td className="px-4 py-3 font-mono text-text-muted">{row.id}</td>
                      <td className="px-4 py-3">{row.customer}</td>
                      <td className="px-4 py-3">{row.product}</td>
                      <td className="px-4 py-3 font-medium text-emerald-500">₹{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center text-text-muted text-sm mt-4 italic">
              Too much detail for a CEO to read quickly...
            </div>
          </div>

          {/* Aggregated View (Fades in) */}
          <div className={`transition-all duration-700 absolute inset-0 p-6 flex flex-col items-center justify-center bg-panel-bg ${activeMetric === "NONE" ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"}`}>
            
            <Sigma size={48} className="text-amber-500 mb-6 opacity-20" />
            
            {activeMetric === "REVENUE" && (
              <div className="text-center animate-in zoom-in duration-500">
                <div className="text-text-muted font-semibold tracking-wider uppercase mb-2">Total Revenue</div>
                <div className="text-6xl font-bold text-amber-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                  ₹{totalRevenue}
                </div>
                <div className="text-sm text-text-muted mt-4 bg-sub-bg px-4 py-2 rounded-full border border-panel-border">
                  Rolled up {allCleanData.length} individual rows.
                </div>
              </div>
            )}

            {activeMetric === "TOP_PRODUCT" && (
              <div className="text-center animate-in zoom-in duration-500">
                <div className="text-text-muted font-semibold tracking-wider uppercase mb-2">Top {config.fields.product}</div>
                <div className="text-6xl font-bold text-amber-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                  {topProduct}
                </div>
                <div className="text-sm text-text-muted mt-4 bg-sub-bg px-4 py-2 rounded-full border border-panel-border">
                  Calculated from {allCleanData.length} individual rows.
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
