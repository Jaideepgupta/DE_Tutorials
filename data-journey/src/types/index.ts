export type Stage = 
  | "CREATE"
  | "OLTP"
  | "OLAP"
  | "LAKE"
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "DASHBOARD";

export type DomainType = 
  | "ECOMMERCE"
  | "HOSPITAL"
  | "REAL_ESTATE"
  | "MANUFACTURING";

export interface OrderRaw {
  id: string;
  customer: string;
  type: string;
  product: string;
  price: number | null | string; // Intentionally messy for Bronze
  date: string;
}

export interface OrderClean {
  id: string;
  customer: string;
  type: string;
  product: string;
  price: number;
  date: string;
}

export interface Order {
  id: string;
  customer: string;
  type: string;
  product: string;
  price: number;
  date: string;
  stage: Stage;
  rawVersion: OrderRaw | null;
  cleanVersion: OrderClean | null;
  issuesFixed: string[];
}
