"use client";

import React from "react";
import { useOrder } from "../context/OrderContext";

export const GoldenThreadBadge = () => {
  const { orders } = useOrder();
  const [isMinimized, setIsMinimized] = React.useState(true);
  
  if (orders.length === 0) return null;

  // Track the first order as the "Golden Thread"
  const order = orders[0];
  const isDirty = order.rawVersion !== null;
  const isClean = order.cleanVersion !== null;

  let displayData = {
    id: order.id,
    customer: order.customer,
    product: order.product,
    price: order.price,
    date: order.date
  };

  if (isClean && order.stage !== "BRONZE") {
    displayData = { ...order.cleanVersion } as any;
  } else if (isDirty && (order.stage === "BRONZE" || order.stage === "SILVER")) {
    displayData = { ...order.rawVersion } as any;
  }

  return (
    <div id="golden-thread-badge" className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      {!isMinimized && (
        <div className="bg-sub-bg border border-blue-500/30 shadow-2xl shadow-blue-900/20 rounded-xl p-4 w-72 backdrop-blur-md animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-3 border-b border-panel-border pb-2">
            <h3 className="text-sm font-semibold text-blue-500">The Golden Thread</h3>
            <span className="text-[10px] bg-panel-bg text-text-muted px-2 py-1 rounded-md border border-panel-border">
              (Follows your data)
            </span>
          </div>
          <p className="text-xs text-text-muted mb-3 leading-tight">
            This box tracks your first order throughout the entire journey so you can see exactly how it changes state in each layer.
          </p>
          <div className="space-y-1">
            {Object.entries(displayData).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-text-muted capitalize">{key}:</span>
                <span className="font-mono text-text-main">
                  {value === null ? "NULL" : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsMinimized(!isMinimized)}
        className="bg-panel-bg hover:bg-sub-bg text-text-main border border-panel-border rounded-full px-4 py-2 text-xs font-medium shadow-lg transition-colors flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        {isMinimized ? "Show Golden Thread" : "Hide Thread"}
      </button>
    </div>
  );
};
