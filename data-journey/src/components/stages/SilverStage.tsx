"use client";

import React, { useState, useEffect } from "react";
import { useOrder } from "../../context/OrderContext";
import { StageHeader } from "../StageHeader";
import { Play, CheckCircle2, Factory, ArrowRight, Undo2 } from "lucide-react";
import { Order, OrderClean } from "../../types";
import { DOMAIN_CONFIG } from "../../config/domainConfig";

export const SilverStage = () => {
  const { orders, updateOrder, setOrders, activeDomain, isEli5Mode } = useOrder();
  const config = DOMAIN_CONFIG[activeDomain];
  
  const [machinesRun, setMachinesRun] = useState<string[]>([]);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  
  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <StageHeader title="Stage 6: Silver Layer" problem="How do we clean data?" />
        <div className="text-center text-text-muted py-8 border-2 border-dashed border-panel-border rounded-xl">
          No orders found. Please go back to the Create stage to add an order.
        </div>
      </div>
    );
  }

  const isDeduplicated = machinesRun.includes("DEDUPE");
  const isStandardized = machinesRun.includes("STANDARDIZE");
  const isValidated = machinesRun.includes("VALIDATE");
  const isFormatted = machinesRun.includes("FORMAT");

  const isAllDone = isDeduplicated && isStandardized && isValidated && isFormatted;

  useEffect(() => {
    setOrders(prev => {
      let hasChanges = false;
      const newOrders = prev.map(order => {
        const raw = order.rawVersion;
        if (!raw) return order;
        
        const displayData = {
          id: raw.id,
          customer: isStandardized ? order.customer : raw.customer,
          type: raw.type,
          product: raw.product,
          price: isValidated && raw.price === null ? 500 : raw.price, 
          date: isFormatted ? new Date(order.date).toLocaleDateString('en-GB') : raw.date,
        };
        
        if (isAllDone && order.cleanVersion === null) {
          hasChanges = true;
          return { ...order, cleanVersion: { ...displayData, price: Number(displayData.price) }, issuesFixed: machinesRun };
        } else if (!isAllDone && order.cleanVersion !== null) {
          hasChanges = true;
          return { ...order, cleanVersion: null, issuesFixed: machinesRun };
        } else if (order.issuesFixed.join(',') !== machinesRun.join(',')) {
          hasChanges = true;
          return { ...order, issuesFixed: machinesRun };
        }
        return order;
      });
      return hasChanges ? newOrders : prev;
    });
  }, [isAllDone, machinesRun, setOrders, isStandardized, isValidated, isFormatted]);

  const toggleMachine = (id: string) => {
    if (machinesRun.includes(id)) {
      setMachinesRun(prev => prev.filter(m => m !== id));
    } else {
      setMachinesRun(prev => [...prev, id]);
    }
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault(); // Necessary to allow dropping
    if (!machinesRun.includes(id)) {
      setDraggedOver(id);
    }
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDraggedOver(null);
    if (!machinesRun.includes(id)) {
      toggleMachine(id);
    }
  };

  const machines = [
    {
      id: "DEDUPE",
      name: "Deduplicator",
      desc: "Removes repeated rows",
      isDone: isDeduplicated,
    },
    {
      id: "STANDARDIZE",
      name: "Standardizer",
      desc: "Fixes casing (e.g. rahul → Rahul)",
      isDone: isStandardized,
    },
    {
      id: "VALIDATE",
      name: "Validator",
      desc: "Fills or flags NULL values",
      isDone: isValidated,
    },
    {
      id: "FORMAT",
      name: "Formatter",
      desc: "Fixes date formats",
      isDone: isFormatted,
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StageHeader 
        title={isEli5Mode ? "Stage 6: The Cleaning Factory" : "Stage 6: Silver Layer (The Cleaning Factory)"} 
        problem={isEli5Mode 
          ? "Our data has mistakes. We need to run it through specific machines to fix typos, fill in blanks, and throw out duplicates."
          : "Data arrives messy. We need specific, repeatable steps to clean it without magic."}
      />

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* The Factory Controls */}
        <div className={`lg:col-span-5 bg-panel-bg p-6 border border-panel-border shadow-xl flex flex-col ${isEli5Mode ? 'rounded-3xl' : 'rounded-2xl'}`}>
          <div className="flex items-center gap-3 mb-6 border-b border-panel-border pb-4">
            <Factory className="text-emerald-500" />
            <div>
              <h2 className="text-xl font-semibold text-text-main">Cleaning Machines</h2>
              <p className="text-xs text-text-muted mt-1">Click play, OR drag dirty rows onto machines.</p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            {machines.map((m) => (
              <div 
                key={m.id} 
                onDragOver={(e) => handleDragOver(e, m.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, m.id)}
                className={`p-4 border transition-all duration-300 flex items-center justify-between ${isEli5Mode ? 'rounded-2xl' : 'rounded-xl'} ${
                  draggedOver === m.id 
                    ? "bg-blue-900/40 border-blue-500 scale-[1.02] shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                    : m.isDone 
                      ? "bg-emerald-100/50 border-emerald-500/30 dark:bg-emerald-900/20" 
                      : "bg-sub-bg border-panel-border hover:border-text-muted border-dashed"
                }`}
              >
                <div>
                  <h3 className={`font-semibold ${m.isDone ? 'text-emerald-500' : draggedOver === m.id ? 'text-blue-500' : 'text-text-main'}`}>
                    {m.name}
                  </h3>
                  <p className="text-xs text-text-muted mt-1">{m.desc}</p>
                </div>
                
                <button
                  onClick={() => toggleMachine(m.id)}
                  className={`p-2 rounded-lg transition-all flex items-center justify-center relative group ${
                    draggedOver === m.id 
                      ? "bg-blue-600 text-white animate-pulse"
                      : m.isDone 
                        ? "bg-emerald-500/20 text-emerald-500 hover:bg-red-100 hover:text-red-500 cursor-pointer" 
                        : "bg-panel-border hover:bg-text-muted/20 text-text-main"
                  }`}
                  title={m.isDone ? "Undo this step" : "Run this machine"}
                >
                  {draggedOver === m.id ? (
                    <span className="text-xs font-bold px-2">DROP HERE</span>
                  ) : m.isDone ? (
                    <>
                      <CheckCircle2 size={20} className="group-hover:opacity-0 transition-opacity absolute" />
                      <Undo2 size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  ) : (
                    <Play size={20} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* The Live Data View */}
        <div className={`lg:col-span-7 bg-panel-bg p-6 border border-panel-border shadow-xl overflow-hidden flex flex-col ${isEli5Mode ? 'rounded-3xl' : 'rounded-2xl'}`}>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-semibold text-text-main">Live Output</h2>
              <p className="text-xs text-amber-500 mt-1 animate-pulse">Try dragging a row!</p>
            </div>
          </div>
          
          <div className={`overflow-x-auto border border-panel-border bg-sub-bg flex-1 relative ${isEli5Mode ? 'rounded-2xl' : 'rounded-xl'}`}>
            <table className="w-full text-sm text-left text-text-main">
              <thead className="text-xs text-text-muted uppercase bg-panel-bg border-b border-panel-border">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">{config.fields.customer}</th>
                  <th className="px-4 py-3">{config.fields.type}</th>
                  <th className="px-4 py-3">{config.fields.price}</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel-border">
                
                {orders.map((order, idx) => {
                  const raw = order.rawVersion;
                  if (!raw) return null;

                  const displayData = {
                    id: raw.id,
                    customer: isStandardized ? order.customer : raw.customer,
                    type: raw.type,
                    product: raw.product,
                    price: isValidated && raw.price === null ? 500 : raw.price, 
                    date: isFormatted ? new Date(order.date).toLocaleDateString('en-GB') : raw.date,
                  };

                  return (
                    <React.Fragment key={order.id}>
                      {/* Main Row */}
                      <tr 
                        draggable={!isAllDone}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', 'dirty_row');
                        }}
                        className={`transition-colors duration-200 ${
                          !isAllDone ? "cursor-grab active:cursor-grabbing hover:bg-panel-bg" : "bg-emerald-50 dark:bg-emerald-900/10"
                        }`}
                      >
                        <td className="px-4 py-3 font-mono text-text-muted">
                          <div className="flex items-center gap-2">
                            {!isAllDone && <span className="text-[10px] bg-panel-border px-1 rounded text-text-muted cursor-grab">⋮⋮</span>}
                            {displayData.id}
                          </div>
                        </td>
                        
                        <td className={`px-4 py-3 transition-colors duration-500 ${
                          !isStandardized && raw.customer !== order.customer ? 'text-red-500 font-medium' : 
                          isStandardized && raw.customer !== order.customer ? 'text-emerald-500 font-medium' : ''
                        }`}>
                          {displayData.customer}
                        </td>
                        
                        <td className="px-4 py-3">{displayData.type}</td>
                        
                        <td className={`px-4 py-3 transition-colors duration-500 ${
                          !isValidated && raw.price === null ? 'text-red-500 font-medium italic' : 
                          isValidated && raw.price === null ? 'text-emerald-500 font-medium' : ''
                        }`}>
                          {displayData.price === null ? 'NULL' : `₹${displayData.price}`}
                        </td>
                        
                        <td className={`px-4 py-3 transition-colors duration-500 ${
                          !isFormatted && raw.date.includes("-") ? 'text-red-500 font-medium' : 
                          isFormatted && raw.date.includes("-") ? 'text-emerald-500 font-medium' : ''
                        }`}>
                          {displayData.date}
                        </td>
                      </tr>

                      {/* Duplicate Row - Disappears when deduplicator runs */}
                      <tr 
                        draggable={!isDeduplicated}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', 'dirty_row');
                        }}
                        className={`bg-red-50 dark:bg-red-950/10 transition-all duration-700 overflow-hidden ${
                          isDeduplicated ? 'opacity-0 scale-y-0 h-0 hidden' : 'border-l-2 border-red-500/50 hover:bg-panel-bg cursor-grab active:cursor-grabbing'
                        }`}
                      >
                        <td className="px-4 py-3 font-mono text-text-muted">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-red-100 dark:bg-red-900/50 px-1 rounded text-red-500 dark:text-red-400 cursor-grab">⋮⋮</span>
                            {displayData.id}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-red-500 font-medium">{displayData.customer}</td>
                        <td className="px-4 py-3">{displayData.type}</td>
                        <td className="px-4 py-3">{displayData.price === null ? 'NULL' : `₹${displayData.price}`}</td>
                        <td className="px-4 py-3 text-red-500 font-medium">{displayData.date}</td>
                      </tr>
                    </React.Fragment>
                  );
                })}
                
              </tbody>
            </table>
          </div>

          {isAllDone && (
            <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between animate-in fade-in zoom-in duration-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-600 dark:text-emerald-400">Data Cleaned Successfully</h4>
                  <p className="text-xs text-emerald-500/80">The cleanVersion is now saved in the Golden Thread.</p>
                </div>
              </div>
              <ArrowRight className="text-emerald-500/50" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
