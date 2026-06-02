"use client";

import React, { useState, useEffect } from "react";
import { StageHeader } from "../StageHeader";
import { FileSpreadsheet, FileJson, FileText, Database, Waves } from "lucide-react";
import { useOrder } from "../../context/OrderContext";
import { DOMAIN_CONFIG } from "../../config/domainConfig";

interface FileItem {
  id: string;
  name: string;
  type: string;
  color: string;
  icon: React.ReactNode;
}

export const DataLakeStage = () => {
  const { activeDomain, isEli5Mode } = useOrder();
  const config = DOMAIN_CONFIG[activeDomain];

  const getInitialFiles = (): FileItem[] => [
    { id: "f1", name: `${config.tables.oltpOrders.split(' ')[0].toLowerCase()}_export.csv`, type: "CSV", color: "border-emerald-500 text-emerald-400", icon: <FileSpreadsheet size={24} /> },
    { id: "f2", name: `Q3_${config.tables.oltpPayments.split(' ')[0].toLowerCase()}.xlsx`, type: "Excel", color: "border-green-500 text-green-400", icon: <FileSpreadsheet size={24} /> },
    { id: "f3", name: "app_events.json", type: "JSON", color: "border-amber-500 text-amber-400", icon: <FileJson size={24} /> },
    { id: "f4", name: "system_errors.log", type: "Log", color: "border-slate-400 text-slate-300", icon: <FileText size={24} /> }
  ];

  const [sourceFiles, setSourceFiles] = useState<FileItem[]>(getInitialFiles());
  const [lakeFiles, setLakeFiles] = useState<FileItem[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Reset files if domain changes
  useEffect(() => {
    setSourceFiles(getInitialFiles());
    setLakeFiles([]);
  }, [activeDomain]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("fileId", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const fileId = e.dataTransfer.getData("fileId");
    const fileToMove = sourceFiles.find(f => f.id === fileId);
    
    if (fileToMove) {
      setSourceFiles(prev => prev.filter(f => f.id !== fileId));
      setLakeFiles(prev => [...prev, fileToMove]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <style>{`
        @keyframes float-in-water {
          0% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(2deg); }
          66% { transform: translateY(4px) rotate(-1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float-water {
          animation: float-in-water 5s ease-in-out infinite;
        }
        @keyframes gentle-wave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-lake-water {
          background-size: 200% 200%;
          animation: gentle-wave 8s ease infinite;
        }
      `}</style>
      <StageHeader 
        title={isEli5Mode ? "Stage 4: The Giant Storage Unit" : "Stage 4: The Data Lake"} 
        problem={isEli5Mode 
          ? "We have all these different types of files (spreadsheets, logs, documents). Where do we dump them all before we have time to organize them?"
          : "Data comes from everywhere in different shapes (tables, JSONs, text files). Where do we dump it all before organizing it?"}
      />

      <div className="grid md:grid-cols-12 gap-8 h-[500px]">
        
        {/* Source Systems (Left) */}
        <div className={`md:col-span-4 bg-panel-bg p-6 border border-panel-border flex flex-col ${isEli5Mode ? 'rounded-3xl' : 'rounded-2xl'}`}>
          <div className="flex items-center gap-3 mb-6 border-b border-panel-border pb-4">
            <Database className="text-text-muted" />
            <h2 className="text-xl font-semibold text-text-main">Source Systems</h2>
          </div>
          
          <p className="text-sm text-text-muted mb-6">
            Drag these raw files into the lake.
          </p>

          <div className="flex-1 space-y-3 overflow-y-auto pr-2">
            {sourceFiles.map((f) => (
              <div 
                key={f.id}
                draggable
                onDragStart={(e) => handleDragStart(e, f.id)}
                className={`p-4 ${isEli5Mode ? 'rounded-2xl' : 'rounded-xl'} border-2 bg-sub-bg cursor-grab active:cursor-grabbing hover:bg-panel-bg transition-colors flex items-center gap-3 ${f.color}`}
              >
                {f.icon}
                <div>
                  <div className="font-mono text-sm">{f.name}</div>
                  <div className="text-xs opacity-70 uppercase tracking-wider">{f.type} Document</div>
                </div>
              </div>
            ))}
            {sourceFiles.length === 0 && (
              <div className="text-center text-text-muted italic mt-8">
                All files moved!
              </div>
            )}
          </div>
        </div>

        {/* The Lake (Right) */}
        <div 
          className={`md:col-span-8 p-6 ${isEli5Mode ? 'rounded-3xl border-[6px]' : 'rounded-2xl border-4'} transition-all duration-300 flex flex-col relative overflow-hidden ${
            isDraggingOver 
              ? "bg-blue-900/40 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.3)]" 
              : "bg-sub-bg border-panel-border border-dashed"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Water effect background */}
          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 animate-lake-water ${
              isDraggingOver ? 'opacity-40' : 'opacity-10'
            }`} 
            style={{ 
              backgroundImage: 'radial-gradient(circle at center, #3b82f6 0%, transparent 70%), radial-gradient(circle at bottom right, #0ea5e9 0%, transparent 60%)' 
            }} 
          />

          <div className="flex items-center justify-between mb-6 border-b border-panel-border pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <Waves className="text-blue-400" />
              <h2 className="text-xl font-semibold text-text-main">The Data Lake</h2>
            </div>
            <div className="text-sm text-text-muted bg-panel-bg border border-panel-border px-3 py-1 rounded-full">
              Accepts ANY format. No questions asked.
            </div>
          </div>

          <div className="flex-1 relative z-10 flex flex-wrap content-start gap-4 p-4">
            {lakeFiles.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                <Waves size={64} className="mb-4 opacity-20" />
                <p className="text-lg">Drop files here</p>
                <p className="text-sm mt-2 opacity-70">The lake accepts structured and unstructured data.</p>
              </div>
            ) : (
              lakeFiles.map((f, idx) => (
                <div 
                  key={f.id}
                  className={`p-4 ${isEli5Mode ? 'rounded-2xl' : 'rounded-xl'} border border-blue-200/20 bg-panel-bg/90 backdrop-blur-sm shadow-lg flex items-center gap-3 animate-float-water ${f.color.split(' ')[1]}`}
                  style={{ animationDelay: `${idx * 0.7}s` }}
                >
                  {f.icon}
                  <div>
                    <div className="font-mono text-sm text-text-main">{f.name}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
