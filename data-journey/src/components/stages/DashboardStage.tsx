"use client";

import React, { useState } from "react";
import { StageHeader } from "../StageHeader";
import { useOrder } from "../../context/OrderContext";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { Search, Database, Factory, Filter, LayoutDashboard } from "lucide-react";
import { DOMAIN_CONFIG } from "../../config/domainConfig";

export const DashboardStage = () => {
  const { orders, activeDomain, isEli5Mode } = useOrder();
  const config = DOMAIN_CONFIG[activeDomain];
  
  const [showLineage, setShowLineage] = useState(false);

  // Generate data for the chart
  const baseOrders = orders.filter(o => o.cleanVersion !== null).map(o => o.cleanVersion!);
  // Generate date strings for the last few days
  const today = new Date();
  const d1 = new Date(today); d1.setDate(d1.getDate() - 3);
  const d2 = new Date(today); d2.setDate(d2.getDate() - 2);
  const d3 = new Date(today); d3.setDate(d3.getDate() - 1);
  
  const mockOrders = [
    { id: "M-1", customer: config.mockNames[1], type: config.mockTypes[0], product: config.mockProducts[1], price: 500, date: d1.toLocaleDateString('en-GB') },
    { id: "M-2", customer: config.mockNames[2], type: config.mockTypes[1], product: config.mockProducts[2], price: 300, date: d2.toLocaleDateString('en-GB') },
    { id: "M-3", customer: config.mockNames[3], type: config.mockTypes[0], product: config.mockProducts[1], price: 500, date: d3.toLocaleDateString('en-GB') },
    { id: "M-4", customer: config.mockNames[0], type: config.mockTypes[2], product: config.mockProducts[0], price: 200, date: today.toLocaleDateString('en-GB') },
  ];
  const allCleanData = baseOrders.length > 0 ? [...baseOrders, ...mockOrders] : mockOrders;

  // Aggregate for Bar chart (Revenue by Product)
  const productTotals = allCleanData.reduce((acc, row) => {
    acc[row.product] = (acc[row.product] || 0) + Number(row.price);
    return acc;
  }, {} as Record<string, number>);

  const barChartData = Object.entries(productTotals).map(([name, total]) => ({
    name,
    total
  }));

  // Aggregate for Pie chart (Revenue by Type)
  const typeTotals = allCleanData.reduce((acc, row) => {
    acc[row.type] = (acc[row.type] || 0) + Number(row.price);
    return acc;
  }, {} as Record<string, number>);
  
  const pieChartData = Object.entries(typeTotals).map(([name, value]) => ({
    name,
    value
  }));

  // Aggregate for Line chart (Revenue by Date)
  const dateTotals = allCleanData.reduce((acc, row) => {
    // Basic date parsing fallback
    const d = row.date || new Date().toLocaleDateString();
    acc[d] = (acc[d] || 0) + Number(row.price);
    return acc;
  }, {} as Record<string, number>);
  
  const lineChartData = Object.entries(dateTotals)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => {
      // Parse DD/MM/YYYY to compare properly
      const parseDate = (dStr: string) => {
        const parts = dStr.split(/[/-]/); // Handle both / and -
        if (parts.length === 3) {
          // Assuming DD/MM/YYYY or DD-MM-YYYY
          return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])).getTime();
        }
        return 0;
      };
      return parseDate(a.date) - parseDate(b.date);
    });

  const totalRevenue = barChartData.reduce((sum, item) => sum + item.total, 0);
  const kawaiiColors = ['#a78bfa', '#f472b6', '#38bdf8', '#fbbf24', '#34d399', '#f87171'];

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StageHeader 
        title={isEli5Mode ? "Stage 8: The Show-and-Tell (Dashboard)" : "Stage 8: Dashboard & Lineage"} 
        problem={isEli5Mode
          ? "How do we show the final numbers to the boss in a way that is easy to understand and trust?"
          : "The CEO loves the chart, but asks: 'Where exactly did this revenue number come from?'"}
      />

      {isEli5Mode && (
        <div className="mb-6 p-4 bg-purple-50/70 border border-purple-200 rounded-3xl shadow-sm flex items-center gap-4 animate-in fade-in zoom-in duration-500">
          <div className="bg-white p-3 rounded-full shadow-sm">
            <span className="text-4xl" role="img" aria-label="bear">🐻</span>
          </div>
          <div>
            <h4 className="font-bold text-purple-600 text-lg">Beary Good Job!</h4>
            <p className="text-purple-500/80 text-sm">
              You cleaned <strong className="text-purple-600">{allCleanData.length}</strong> records and found <strong className="text-emerald-500">₹{totalRevenue}</strong> in value! The data is now sparkly clean. ✨
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Dashboard Canvas */}
        <div className={`transition-all duration-700 ${showLineage ? "md:col-span-8" : "md:col-span-12"} bg-panel-bg p-6 border border-panel-border shadow-xl flex flex-col ${isEli5Mode ? 'rounded-3xl' : 'rounded-2xl'}`}>
          <div className="flex items-center justify-between mb-8 border-b border-panel-border pb-4">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="text-purple-500" />
              <h2 className="text-xl font-semibold text-text-main">{isEli5Mode ? "The Big Boss Screen" : "Executive Dashboard"}</h2>
            </div>
            
            <button
              onClick={() => setShowLineage(!showLineage)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors border ${
                showLineage 
                  ? "bg-purple-100 border-purple-500 text-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.3)] dark:bg-purple-900/50 dark:text-purple-300" 
                  : "bg-sub-bg border-panel-border text-text-muted hover:bg-panel-bg"
              }`}
            >
              <Search size={16} />
              {showLineage ? "Hide Lineage" : "Trace Data Lineage"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className={`p-6 border shadow-sm relative overflow-hidden ${
              isEli5Mode 
                ? 'rounded-3xl bg-emerald-50/70 border-emerald-200' 
                : 'rounded-xl bg-sub-bg border-panel-border'
            }`}>
              {isEli5Mode && <span className="absolute -right-4 -bottom-4 text-6xl opacity-20">💰</span>}
              <div className={`text-sm mb-1 uppercase tracking-wider font-semibold ${isEli5Mode ? 'text-emerald-600' : 'text-text-muted'}`}>{config.tables.dashboardSales}</div>
              <div className="text-4xl font-bold text-emerald-500">₹{totalRevenue}</div>
            </div>
            
            <div className={`p-6 border shadow-sm relative overflow-hidden ${
              isEli5Mode 
                ? 'rounded-3xl bg-blue-50/70 border-blue-200' 
                : 'rounded-xl bg-sub-bg border-panel-border'
            }`}>
              {isEli5Mode && <span className="absolute -right-4 -bottom-4 text-6xl opacity-20">📋</span>}
              <div className={`text-sm mb-1 uppercase tracking-wider font-semibold ${isEli5Mode ? 'text-blue-600' : 'text-text-muted'}`}>Total Records</div>
              <div className={`text-4xl font-bold ${isEli5Mode ? 'text-blue-500' : 'text-blue-400'}`}>{allCleanData.length}</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Line Chart (Full Width) */}
            <div className={`col-span-1 md:col-span-2 bg-sub-bg p-6 border border-panel-border ${isEli5Mode ? 'rounded-3xl shadow-md' : 'rounded-xl'}`}>
              <h3 className={`mb-4 font-semibold ${isEli5Mode ? 'text-blue-500' : 'text-text-main'}`}>Revenue Timeline</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isEli5Mode ? "#e2e8f0" : "#334155"} vertical={false} />
                    <XAxis dataKey="date" stroke={isEli5Mode ? "#94a3b8" : "#94a3b8"} tick={{ fill: isEli5Mode ? '#64748b' : '#94a3b8' }} />
                    <YAxis stroke={isEli5Mode ? "#94a3b8" : "#94a3b8"} tick={{ fill: isEli5Mode ? '#64748b' : '#94a3b8' }} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isEli5Mode ? '#ffffff' : 'var(--theme-panel-bg)', 
                        borderColor: isEli5Mode ? '#bae6fd' : 'var(--theme-panel-border)', 
                        borderRadius: isEli5Mode ? '16px' : '8px',
                        color: isEli5Mode ? '#6b7280' : 'var(--theme-text-main)' 
                      }}
                      formatter={(value) => [`₹${value}`, "Revenue"]}
                    />
                    <Line type="monotone" dataKey="total" stroke={isEli5Mode ? "#38bdf8" : "#3b82f6"} strokeWidth={4} dot={{ r: 6, fill: isEli5Mode ? "#bae6fd" : "#1e40af" }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart (Half Width) */}
            <div className={`bg-sub-bg p-6 border border-panel-border flex flex-col ${isEli5Mode ? 'rounded-3xl shadow-md' : 'rounded-xl'}`}>
              <h3 className={`mb-4 font-semibold ${isEli5Mode ? 'text-purple-500' : 'text-text-main'}`}>{config.tables.dashboardTop}</h3>
              <div className="flex-1 min-h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isEli5Mode ? "#e2e8f0" : "#334155"} vertical={false} />
                    <XAxis dataKey="name" stroke={isEli5Mode ? "#94a3b8" : "#94a3b8"} tick={{ fill: isEli5Mode ? '#64748b' : '#94a3b8' }} />
                    <YAxis stroke={isEli5Mode ? "#94a3b8" : "#94a3b8"} tick={{ fill: isEli5Mode ? '#64748b' : '#94a3b8' }} tickFormatter={(value) => `₹${value}`} width={50} />
                    <Tooltip 
                      cursor={{ fill: isEli5Mode ? 'rgba(233, 213, 255, 0.3)' : 'var(--theme-panel-border)' }}
                      contentStyle={{ 
                        backgroundColor: isEli5Mode ? '#ffffff' : 'var(--theme-panel-bg)', 
                        borderColor: isEli5Mode ? '#fbcfe8' : 'var(--theme-panel-border)', 
                        borderRadius: isEli5Mode ? '16px' : '8px',
                        color: isEli5Mode ? '#6b7280' : 'var(--theme-text-main)' 
                      }}
                      formatter={(value) => [`₹${value}`, "Revenue"]}
                    />
                    <Bar dataKey="total" radius={isEli5Mode ? [8, 8, 8, 8] : [4, 4, 0, 0]}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={isEli5Mode ? kawaiiColors[index % kawaiiColors.length] : '#a855f7'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart (Half Width) */}
            <div className={`bg-sub-bg p-6 border border-panel-border flex flex-col ${isEli5Mode ? 'rounded-3xl shadow-md' : 'rounded-xl'}`}>
              <h3 className={`mb-4 font-semibold ${isEli5Mode ? 'text-pink-500' : 'text-text-main'}`}>Revenue by {config.fields.type}</h3>
              <div className="flex-1 min-h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={isEli5Mode ? 60 : 40}
                      outerRadius={isEli5Mode ? 90 : 80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke={isEli5Mode ? "#fff" : "#1e293b"}
                      strokeWidth={2}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={isEli5Mode ? kawaiiColors[(index + 3) % kawaiiColors.length] : ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isEli5Mode ? '#ffffff' : 'var(--theme-panel-bg)', 
                        borderColor: isEli5Mode ? '#fbcfe8' : 'var(--theme-panel-border)', 
                        borderRadius: isEli5Mode ? '16px' : '8px',
                        color: isEli5Mode ? '#6b7280' : 'var(--theme-text-main)' 
                      }}
                      formatter={(value) => [`₹${value}`, "Revenue"]}
                    />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

        {/* Data Lineage Panel */}
        {showLineage && (
          <div className={`md:col-span-4 bg-sub-bg p-6 border-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.15)] animate-in slide-in-from-right-8 duration-500 relative overflow-hidden ${isEli5Mode ? 'rounded-3xl' : 'rounded-2xl'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Search size={100} className="text-purple-500" />
            </div>
            
            <h2 className="text-lg font-semibold text-purple-500 mb-6 relative z-10">Reverse Data Lineage</h2>
            <p className="text-sm text-text-muted mb-8 relative z-10">
              Proving where the number "₹{totalRevenue}" came from.
            </p>

            <div className="relative z-10 ml-4 border-l-2 border-panel-border pb-4">
              
              <div className="relative pl-6 pb-8">
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]" />
                <h4 className="font-semibold text-text-main flex items-center gap-2">
                  <LayoutDashboard size={16} className="text-purple-500" />
                  Dashboard
                </h4>
                <p className="text-xs text-text-muted mt-1">BI Tool queries the Gold layer.</p>
              </div>

              <div className="relative pl-6 pb-8">
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-amber-500" />
                <h4 className="font-semibold text-text-main flex items-center gap-2">
                  <Filter size={16} className="text-amber-500" />
                  Gold Layer
                </h4>
                <p className="text-xs text-text-muted mt-1">Aggregates product prices into totals.</p>
              </div>

              <div className="relative pl-6 pb-8">
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-slate-400" />
                <h4 className="font-semibold text-text-main flex items-center gap-2">
                  <Factory size={16} className="text-slate-500" />
                  Silver Layer
                </h4>
                <p className="text-xs text-text-muted mt-1">Cleaned NULL prices, fixed names & dates.</p>
              </div>

              <div className="relative pl-6 pb-8">
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-orange-500" />
                <h4 className="font-semibold text-text-main flex items-center gap-2">
                  <Database size={16} className="text-orange-500" />
                  Bronze Layer
                </h4>
                <p className="text-xs text-text-muted mt-1">Exact copy of raw, dirty JSON/CSV files.</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-blue-500" />
                <h4 className="font-semibold text-text-main flex items-center gap-2">
                  <Database size={16} className="text-blue-500" />
                  Source App
                </h4>
                <p className="text-xs text-text-muted mt-1">Original Order ID: {orders[0]?.id || "Unknown"} created by user.</p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
