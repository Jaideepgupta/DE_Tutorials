"use client";

import React from "react";
import { useOrder } from "../../context/OrderContext";
import { StageHeader } from "../StageHeader";
import { Lock } from "lucide-react";
import { DOMAIN_CONFIG } from "../../config/domainConfig";

export const BronzeStage = () => {
  const { orders, activeDomain, isEli5Mode } = useOrder();
  const config = DOMAIN_CONFIG[activeDomain];

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StageHeader 
        title={isEli5Mode ? "Stage 5: The Carbon Copy (Bronze)" : "Stage 5: Bronze Layer"} 
        problem={isEli5Mode 
          ? "We have the raw files, but they're full of mistakes (like spelling errors or missing prices). Shouldn't we fix them before storing them?"
          : "We have the raw data, but it's full of mistakes, duplicates, and bad formats. Shouldn't we fix it before storing it?"}
      />

      <div className={`bg-panel-bg p-6 border border-panel-border shadow-xl mb-8 ${isEli5Mode ? 'rounded-3xl' : 'rounded-2xl'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-main">Raw {config.tables.bronzeSource} Table</h2>
          <div className="group relative">
            <button 
              disabled 
              className="flex items-center gap-2 bg-sub-bg border border-panel-border text-text-muted px-4 py-2 rounded-lg cursor-not-allowed opacity-80"
            >
              <Lock size={16} />
              Clean Data
            </button>
            <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-panel-bg border border-panel-border rounded-lg text-sm text-text-muted opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-2xl">
              <span className="font-semibold text-blue-500 block mb-1">Not yet!</span>
              The Bronze layer keeps data exactly as it arrived. If we alter it here, we lose the original source truth forever.
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center text-text-muted py-8 border-2 border-dashed border-panel-border rounded-xl">
            No records found. Please go back to the Create stage to add an order.
          </div>
        ) : (
          <div className={`overflow-x-auto border border-red-900/30 bg-sub-bg ${isEli5Mode ? 'rounded-2xl' : 'rounded-xl'}`}>
            <table className="w-full text-sm text-left text-text-main">
              <thead className="text-xs text-text-muted uppercase bg-panel-bg border-b border-panel-border">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">{config.fields.customer}</th>
                  <th className="px-4 py-3">{config.fields.type}</th>
                  <th className="px-4 py-3">{config.fields.product}</th>
                  <th className="px-4 py-3">{config.fields.price}</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel-border">
                {orders.map((order) => {
                  const raw = order.rawVersion;
                  if (!raw) return null;
                  
                  // Highlight issues in red for educational purposes
                  const isNullPrice = raw.price === null;
                  const isBadCase = raw.customer !== order.customer;
                  const isBadDate = raw.date.includes("-");

                  return (
                    <React.Fragment key={order.id}>
                      {/* The actual record */}
                      <tr className="hover:bg-panel-bg transition-colors">
                        <td className="px-4 py-3 font-mono text-text-muted">{raw.id}</td>
                        <td className={`px-4 py-3 ${isBadCase ? 'text-red-400 font-medium' : ''}`}>{raw.customer}</td>
                        <td className="px-4 py-3">{raw.type}</td>
                        <td className="px-4 py-3">{raw.product}</td>
                        <td className={`px-4 py-3 ${isNullPrice ? 'text-red-400 font-medium italic' : ''}`}>
                          {isNullPrice ? 'NULL' : `₹${raw.price}`}
                        </td>
                        <td className={`px-4 py-3 ${isBadDate ? 'text-red-400 font-medium' : ''}`}>{raw.date}</td>
                      </tr>
                      {/* Duplicate Record (Simulated) */}
                      <tr className="bg-red-50 hover:bg-panel-bg transition-colors border-l-2 border-red-500/50 dark:bg-red-950/10">
                        <td className="px-4 py-3 font-mono text-text-muted">{raw.id}</td>
                        <td className="px-4 py-3 text-red-400 font-medium">{raw.customer}</td>
                        <td className="px-4 py-3">{raw.type}</td>
                        <td className="px-4 py-3">{raw.product}</td>
                        <td className="px-4 py-3">{isNullPrice ? 'NULL' : `₹${raw.price}`}</td>
                        <td className="px-4 py-3 text-red-400 font-medium">{raw.date}</td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
