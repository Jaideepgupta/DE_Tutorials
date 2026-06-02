"use client";

import React, { useState, useEffect } from "react";
import ReactFlow, { Background, MarkerType, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { StageHeader } from "../StageHeader";
import { useOrder } from "../../context/OrderContext";
import { DOMAIN_CONFIG } from "../../config/domainConfig";

export const OltpStage = () => {
  const { orders, activeDomain, isEli5Mode } = useOrder();
  const config = DOMAIN_CONFIG[activeDomain];
  const [isRunning, setIsRunning] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  
  const customerId = "C-123";
  const orderId = orders[0]?.id || "ORD-999";
  const productId = "P-456";
  const paymentId = "PAY-789";

  const initialNodes: Node[] = [
    {
      id: "customers",
      position: { x: 50, y: 50 },
      data: { 
        label: (
          <div className="text-sm">
            <strong className="block border-b pb-1 mb-1 border-slate-300">{config.tables.oltpCustomers}</strong>
            <div>ID: {customerId}</div>
            <div>Name: {orders[0]?.customer || config.mockNames[0]}</div>
          </div>
        ) 
      },
      className: `bg-panel-bg text-text-main border-2 border-panel-border ${isEli5Mode ? 'rounded-2xl shadow-xl' : 'rounded-lg shadow-lg'} w-48 text-left p-3 transition-all duration-300`,
    },
    {
      id: "orders",
      position: { x: 300, y: 50 },
      data: { 
        label: (
          <div className="text-sm">
            <strong className="block border-b pb-1 mb-1 border-slate-300">{config.tables.oltpOrders}</strong>
            <div>ID: {orderId}</div>
            <div>Cust_ID: {customerId}</div>
            <div>Prod_ID: {productId}</div>
          </div>
        ) 
      },
      className: `bg-panel-bg text-text-main border-2 border-panel-border ${isEli5Mode ? 'rounded-2xl shadow-xl' : 'rounded-lg shadow-lg'} w-48 text-left p-3 transition-all duration-300`,
    },
    {
      id: "products",
      position: { x: 550, y: -20 },
      data: { 
        label: (
          <div className="text-sm">
            <strong className="block border-b pb-1 mb-1 border-slate-300">{config.tables.oltpProducts}</strong>
            <div>ID: {productId}</div>
            <div>Name: {orders[0]?.product || config.mockProducts[0]}</div>
          </div>
        ) 
      },
      className: `bg-panel-bg text-text-main border-2 border-panel-border ${isEli5Mode ? 'rounded-2xl shadow-xl' : 'rounded-lg shadow-lg'} w-48 text-left p-3 transition-all duration-300`,
    },
    {
      id: "payments",
      position: { x: 550, y: 120 },
      data: { 
        label: (
          <div className="text-sm">
            <strong className="block border-b pb-1 mb-1 border-slate-300">Payments Table</strong>
            <div>ID: {paymentId}</div>
            <div>Order_ID: {orderId}</div>
            <div>Amt: ₹{orders[0]?.price || 500}</div>
          </div>
        ) 
      },
      className: `bg-panel-bg text-text-main border-2 border-panel-border ${isEli5Mode ? 'rounded-2xl shadow-xl' : 'rounded-lg shadow-lg'} w-48 text-left p-3 transition-all duration-300`,
    },
  ];

  const initialEdges: Edge[] = [
    { id: "e1", source: "customers", target: "orders", animated: false, style: { stroke: '#475569', strokeWidth: 2 } },
    { id: "e2", source: "orders", target: "products", animated: false, style: { stroke: '#475569', strokeWidth: 2 } },
    { id: "e3", source: "orders", target: "payments", animated: false, style: { stroke: '#475569', strokeWidth: 2 } },
  ];

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const runQuery = () => {
    setIsRunning(true);
    let step = 0;
    const sequence = ["customers", "orders", "payments"]; // path to find the payment amount
    
    const interval = setInterval(() => {
      if (step >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRunning(false);
          setActiveNode(null);
        }, 1500);
        return;
      }
      
      setActiveNode(sequence[step]);
      step++;
    }, 1000); // Slow 1 second hops
  };

  useEffect(() => {
    // Update node styling based on activeNode
    setNodes((nds) => 
      nds.map((node) => ({
        ...node,
        className: `bg-panel-bg text-text-main border-2 ${isEli5Mode ? 'rounded-2xl' : 'rounded-lg'} shadow-lg w-48 text-left p-3 transition-all duration-500 ${
          activeNode === node.id 
            ? "border-blue-500 shadow-blue-500/50 scale-105" 
            : "border-panel-border"
        }`,
      }))
    );

    // Animate edges pointing to the active node
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: edge.target === activeNode || edge.source === activeNode,
        style: {
          ...edge.style,
          stroke: edge.target === activeNode || edge.source === activeNode ? "#3b82f6" : "#475569",
        }
      }))
    );
  }, [activeNode, isEli5Mode]);

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StageHeader 
        title={isEli5Mode ? "Stage 2: The Store's filing system" : "Stage 2: OLTP System"} 
        problem={isEli5Mode 
          ? "We split data into different cabinets to save space, but finding all info about one customer requires checking many cabinets."
          : "Storing data quickly means splitting it into linked tables (Normalization). But answering business questions becomes slow."}
      />

      <div className={`bg-panel-bg p-6 border border-panel-border shadow-xl ${isEli5Mode ? 'rounded-3xl' : 'rounded-2xl'}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-main">Relational Database (OLTP)</h2>
            <p className="text-sm text-text-muted mt-1">
              Data is scattered to save space and write fast.
            </p>
          </div>
          <button
            onClick={runQuery}
            disabled={isRunning}
            className={`px-6 py-2.5 font-medium transition-all ${isEli5Mode ? 'rounded-2xl' : 'rounded-lg'} ${
              isRunning 
                ? "bg-blue-600/50 text-white/50 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
            }`}
          >
            {isRunning ? "Hopping tables..." : `Find ${orders[0]?.customer || config.mockNames[0]}'s Spend`}
          </button>
        </div>

        <div className={`h-[350px] border border-panel-border overflow-hidden bg-sub-bg ${isEli5Mode ? 'rounded-2xl' : 'rounded-xl'}`}>
          <ReactFlow 
            nodes={nodes} 
            edges={edges} 
            fitView 
            fitViewOptions={{ padding: 0.2 }}
            zoomOnScroll={false}
            panOnDrag={false}
          >
            <Background color="#334155" gap={16} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};
