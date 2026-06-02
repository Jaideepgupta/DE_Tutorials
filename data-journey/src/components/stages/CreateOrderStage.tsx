"use client";

import React, { useState, useEffect, useRef } from "react";
import { useOrder } from "../../context/OrderContext";
import { StageHeader } from "../StageHeader";
import { Order, OrderRaw, DomainType } from "../../types";
import { Terminal, Database, Zap, RefreshCw, RotateCcw, Building2, ShoppingCart, Stethoscope, Factory, UserCircle } from "lucide-react";
import { DOMAIN_CONFIG } from "../../config/domainConfig";

export const CreateOrderStage = () => {
  const { addOrder, setOrders, orders, isEli5Mode, resetOrders, activeDomain, setActiveDomain } = useOrder();
  const config = DOMAIN_CONFIG[activeDomain];

  const [customer, setCustomer] = useState(config.mockNames[0]);
  const [type, setType] = useState(config.mockTypes[0]);
  const [product, setProduct] = useState(config.mockProducts[0]);
  const [price, setPrice] = useState("500");
  
  const [logs, setLogs] = useState<{time: string, msg: string}[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString([], { hour12: false }), msg }]);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Update default form values when domain changes
  useEffect(() => {
    setCustomer(DOMAIN_CONFIG[activeDomain].mockNames[0]);
    setType(DOMAIN_CONFIG[activeDomain].mockTypes[0]);
    setProduct(DOMAIN_CONFIG[activeDomain].mockProducts[0]);
  }, [activeDomain]);

  const generateSingleOrder = (cust: string, typ: string, prod: string, pr: number): Order => {
    const prefix = activeDomain === "HOSPITAL" ? "PAT-" : activeDomain === "REAL_ESTATE" ? "PROP-" : activeDomain === "MANUFACTURING" ? "DEF-" : "ORD-";
    const newId = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
    
    const rawVersion: OrderRaw = {
      id: newId,
      customer: Math.random() > 0.5 ? cust.toUpperCase() : cust.toLowerCase(),
      type: typ,
      product: prod,
      price: Math.random() > 0.8 ? null : pr,
      date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
    };

    return {
      id: newId,
      customer: cust,
      type: typ,
      product: prod,
      price: pr,
      date: new Date().toISOString(),
      stage: "CREATE",
      rawVersion,
      cleanVersion: null,
      issuesFixed: [],
    };
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = generateSingleOrder(customer, type, product, Number(price));
    addOrder(newOrder);
    
    addLog(`HTTP POST /api/data received payload from Client`);
    addLog(`BEGIN TRANSACTION`);
    addLog(`INSERT INTO ${activeDomain}_Records (id, f1, f2) VALUES ('${newOrder.id}', '${customer}', '${product}')`);
    addLog(`COMMIT - Row persisted to disk in 12ms`);
  };

  const handleBulkGenerate = (count: number) => {
    const newOrders: Order[] = [];
    for (let i = 0; i < count; i++) {
      const rName = config.mockNames[Math.floor(Math.random() * config.mockNames.length)];
      const rType = config.mockTypes[Math.floor(Math.random() * config.mockTypes.length)];
      const rProd = config.mockProducts[Math.floor(Math.random() * config.mockProducts.length)];
      const rPrice = Math.floor(Math.random() * 9000) + 100;
      newOrders.push(generateSingleOrder(rName, rType, rProd, rPrice));
    }
    
    setOrders(prev => [...prev, ...newOrders]);
    addLog(`Executing BULK INSERT of ${count} rows...`);
    addLog(`Bulk operation successful. 0 rows rejected.`);
  };

  return (
    <div className="max-w-6xl mx-auto py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StageHeader 
        title={isEli5Mode ? config.eli5Title : "Stage 1: Source System (OLTP)"} 
        problem={isEli5Mode 
          ? config.eli5Desc
          : "Every data journey starts with a real-world event. How do we capture it into a database?"}
      />

      {/* Domain Selector Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-sub-bg border border-panel-border rounded-xl overflow-x-auto relative">
        {orders.length > 0 && (
          <div className="absolute inset-0 bg-sub-bg/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-xl">
             <span className="text-xs bg-panel-border text-text-main px-3 py-1 rounded-full font-medium shadow-md">Reset data to switch domains</span>
          </div>
        )}
        {(Object.keys(DOMAIN_CONFIG) as DomainType[]).map((domain) => (
          <button
            key={domain}
            onClick={() => setActiveDomain(domain)}
            disabled={orders.length > 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeDomain === domain 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-text-muted hover:bg-panel-bg hover:text-text-main"
            }`}
          >
            {DOMAIN_CONFIG[domain].icon}
            {DOMAIN_CONFIG[domain].label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Manual Entry */}
          <div className={`p-6 border shadow-xl flex flex-col ${
            isEli5Mode 
              ? 'rounded-3xl bg-amber-50/70 border-amber-200 shadow-amber-100' 
              : 'rounded-2xl bg-panel-bg border-panel-border'
          }`}>
            <div className={`flex items-center gap-3 mb-6 border-b pb-4 ${
              isEli5Mode ? 'border-amber-200' : 'border-panel-border'
            }`}>
              {isEli5Mode ? (
                <span className="text-2xl" role="img" aria-label="pencil">✏️</span>
              ) : (
                <UserCircle className="text-blue-400" />
              )}
              <h2 className={`text-xl font-semibold ${isEli5Mode ? 'text-amber-500' : 'text-text-main'}`}>Manual Data Entry</h2>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${isEli5Mode ? 'text-amber-600' : 'text-text-muted'}`}>
                    {config.fields.customer} {isEli5Mode && "🐰"}
                  </label>
                  <input
                    type="text"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    className={`w-full bg-sub-bg border px-4 py-3 focus:outline-none transition-all duration-300 ${
                      isEli5Mode 
                        ? 'rounded-2xl border-amber-200 focus:border-amber-400 text-text-main' 
                        : 'rounded-lg border-panel-border focus:border-blue-500 text-text-main'
                    }`}
                    placeholder={`e.g. ${config.mockNames[0]}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${isEli5Mode ? 'text-amber-600' : 'text-text-muted'}`}>
                    {config.fields.type} {isEli5Mode && "🏷️"}
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={`w-full bg-sub-bg border px-4 py-3 focus:outline-none transition-all duration-300 ${
                      isEli5Mode 
                        ? 'rounded-2xl border-amber-200 focus:border-amber-400 text-text-main' 
                        : 'rounded-lg border-panel-border focus:border-blue-500 text-text-main'
                    }`}
                  >
                    {config.mockTypes.map((t: string) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${isEli5Mode ? 'text-amber-600' : 'text-text-muted'}`}>
                    {config.fields.product} {isEli5Mode && "⭐"}
                  </label>
                  <input
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className={`w-full bg-sub-bg border px-4 py-3 focus:outline-none transition-all duration-300 ${
                      isEli5Mode 
                        ? 'rounded-2xl border-amber-200 focus:border-amber-400 text-text-main' 
                        : 'rounded-lg border-panel-border focus:border-blue-500 text-text-main'
                    }`}
                    placeholder={`e.g. ${config.mockProducts[0]}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${isEli5Mode ? 'text-amber-600' : 'text-text-muted'}`}>
                    {config.fields.price}
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`w-full bg-sub-bg border px-4 py-3 focus:outline-none transition-all duration-300 ${
                      isEli5Mode 
                        ? 'rounded-2xl border-amber-200 focus:border-amber-400 text-text-main' 
                        : 'rounded-lg border-panel-border focus:border-blue-500 text-text-main'
                    }`}
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!customer || !product || !price}
                className={`w-full py-4 font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  (!customer || !product || !price)
                    ? 'bg-sub-bg text-text-muted border-2 border-dashed border-panel-border cursor-not-allowed'
                    : isEli5Mode
                      ? 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-500/20 transform hover:-translate-y-1'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transform hover:-translate-y-1'
                } ${isEli5Mode ? 'rounded-2xl' : 'rounded-xl'}`}
              >
                Insert Row
              </button>
            </form>
          </div>

          {/* Bulk Generation */}
          <div className="bg-panel-bg p-6 rounded-2xl border border-panel-border shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-amber-400" />
              <h2 className="text-lg font-semibold text-text-main">Bulk Generate Dataset</h2>
            </div>
            <p className="text-xs text-text-muted mb-4">
              Don't want to type? Simulate rapid traffic by injecting random records instantly.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 50].map(num => (
                <button
                  key={num}
                  onClick={() => handleBulkGenerate(num)}
                  className="bg-amber-600/20 hover:bg-amber-500 border border-amber-500/50 text-amber-300 hover:text-slate-900 font-bold py-2 rounded-lg transition-colors"
                >
                  +{num}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Event Log */}
          {!isEli5Mode && (
          <div className="bg-[#0c0c0c] p-4 rounded-2xl border border-slate-800 shadow-inner overflow-hidden flex flex-col h-40">
            <div className="flex items-center gap-2 mb-2 text-slate-500 border-b border-slate-800 pb-2">
              <Terminal size={14} />
              <span className="text-xs uppercase tracking-wider font-semibold">Database Server Logs</span>
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-emerald-400/80 pr-2 space-y-1">
              {logs.length === 0 ? (
                <div className="text-slate-600 italic">Waiting for incoming transactions...</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx}>
                    <span className="text-slate-500">[{log.time}]</span> {log.msg}
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
          )}


        </div>

        {/* Right Column: Database Table */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border shadow-xl flex flex-col min-h-[500px] ${
          isEli5Mode ? 'bg-blue-50/50 border-blue-200' : 'bg-panel-bg border-panel-border'
        }`}>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className={`text-xl font-semibold ${isEli5Mode ? 'text-blue-600' : 'text-text-main'}`}>
                {isEli5Mode ? config.eli5TableTitle : "OLTP Database Table"}
              </h2>
              <p className={`text-sm mt-1 ${isEli5Mode ? 'text-blue-500/80' : 'text-text-muted'}`}>
                {isEli5Mode ? config.eli5TableDesc : "Live view of the raw transaction data."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 ${
                isEli5Mode ? 'bg-blue-100 text-blue-600 rounded-full' : 'bg-sub-bg text-text-muted rounded-full'
              }`}>
                Total Rows: {orders.length}
              </span>
              <button
                onClick={resetOrders}
                className={`flex items-center gap-1 text-xs px-3 py-1 transition-colors ${
                  isEli5Mode ? 'bg-white border border-blue-200 text-blue-500 hover:bg-blue-50 rounded-full' : 'bg-sub-bg hover:bg-panel-bg text-text-muted hover:text-text-main border border-panel-border rounded-lg'
                }`}
              >
                <RotateCcw size={12} />
                Reset
              </button>
            </div>
          </div>
          
          {orders.length === 0 ? (
            <div className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 ${
              isEli5Mode ? 'border-blue-200 text-blue-400' : 'border-panel-border text-text-muted'
            }`}>
              <p>No records yet.</p>
              <p className="text-sm mt-1 opacity-80">Insert a row to see it persist here.</p>
            </div>
          ) : (
            <div className={`flex-1 border overflow-hidden flex flex-col ${
              isEli5Mode 
                ? 'rounded-2xl bg-white/60 border-blue-200' 
                : 'rounded-xl bg-sub-bg border-panel-border'
            }`}>
              <table className="w-full text-sm text-left">
                <thead className={`text-xs uppercase border-b ${
                  isEli5Mode 
                    ? 'bg-blue-100/50 text-blue-600 border-blue-200' 
                    : 'bg-panel-bg text-text-muted border-panel-border'
                }`}>
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">{config.fields.customer}</th>
                    <th className="px-4 py-3">{config.fields.product}</th>
                    <th className="px-4 py-3">{config.fields.price}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y overflow-y-auto ${
                  isEli5Mode ? 'divide-blue-100 text-blue-900' : 'divide-panel-border text-text-main'
                }`}>
                  {orders.map((order, idx) => (
                    <tr key={order.id} className={`transition-colors ${
                      isEli5Mode ? 'hover:bg-blue-50/50' : 'hover:bg-panel-bg'
                    }`}>
                      <td className={`px-4 py-3 font-mono ${isEli5Mode ? 'text-blue-500' : 'text-text-muted'}`}>{order.id}</td>
                      <td className="px-4 py-3">{order.customer} {isEli5Mode && idx % 2 === 0 && "🌟"}</td>
                      <td className="px-4 py-3">{order.product} {isEli5Mode && idx % 3 === 0 && "🧩"}</td>
                      <td className="px-4 py-3">₹{order.price} {isEli5Mode && idx % 4 === 0 && "✨"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

