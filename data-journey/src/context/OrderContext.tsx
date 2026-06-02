"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Order, Stage, DomainType } from "../types";

interface OrderContextProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  currentStage: Stage;
  setCurrentStage: (stage: Stage) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updatedOrder: Partial<Order>) => void;
  resetOrders: () => void;
  isEli5Mode: boolean;
  setIsEli5Mode: React.Dispatch<React.SetStateAction<boolean>>;
  activeDomain: DomainType;
  setActiveDomain: React.Dispatch<React.SetStateAction<DomainType>>;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentStage, setCurrentStage] = useState<Stage>("CREATE");
  const [isEli5Mode, setIsEli5Mode] = useState<boolean>(false);
  const [activeDomain, setActiveDomain] = useState<DomainType>("ECOMMERCE");

  const addOrder = (order: Order) => {
    setOrders((prev) => [...prev, order]);
  };

  const updateOrder = (id: string, updatedFields: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updatedFields } : o))
    );
  };

  const resetOrders = () => {
    setOrders([]);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        setOrders,
        currentStage,
        setCurrentStage,
        addOrder,
        updateOrder,
        resetOrders,
        isEli5Mode,
        setIsEli5Mode,
        activeDomain,
        setActiveDomain,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
