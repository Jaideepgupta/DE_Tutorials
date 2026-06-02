import React from "react";
import { Building2, ShoppingCart, Stethoscope, Factory } from "lucide-react";
import { DomainType } from "../types";

export const DOMAIN_CONFIG: Record<DomainType, any> = {
  ECOMMERCE: {
    icon: <ShoppingCart size={16} />,
    label: "E-Commerce",
    fields: { customer: "Customer Name", type: "Category", product: "Product", price: "Price (₹)" },
    mockNames: ["Rahul", "Priya", "Amit", "Sara", "Jai", "Kiran", "Arjun", "Neha"],
    mockTypes: ["Electronics", "Clothing", "Toys", "Home"],
    mockProducts: ["Toy Car", "Puzzle", "Bike", "Doll", "Board Game", "Lego Set"],
    eli5Title: "The Toy Store Cash Register",
    eli5Desc: "When someone buys a toy, we need to write down what they bought so we don't forget.",
    eli5TableTitle: "The Store's Filing Cabinet",
    eli5TableDesc: "Where we safely store every receipt.",
    tables: {
      oltpCustomers: "Customers Table",
      oltpProducts: "Products Table",
      oltpOrders: "Orders Table",
      oltpPayments: "Payments Table",
      lakeFolder: "raw/ecommerce_orders",
      bronzeSource: "E-Com Source Database",
      dashboardSales: "Total Sales Revenue",
      dashboardTop: "Top Selling Toys"
    }
  },
  HOSPITAL: {
    icon: <Stethoscope size={16} />,
    label: "Hospital",
    fields: { customer: "Patient Name", type: "Patient Type", product: "Treatment", price: "Bill Amount (₹)" },
    mockNames: ["John Doe", "Jane Smith", "Mary Johnson", "James Brown"],
    mockTypes: ["Outpatient", "Inpatient", "Emergency"],
    mockProducts: ["X-Ray", "Blood Test", "MRI Scan", "Consultation", "Surgery"],
    eli5Title: "The Receptionist Desk",
    eli5Desc: "When a patient comes in, the receptionist logs their treatment so doctors know.",
    eli5TableTitle: "The Medical Records Room",
    eli5TableDesc: "Where patient history is stored safely.",
    tables: {
      oltpCustomers: "Patients Table",
      oltpProducts: "Treatments Table",
      oltpOrders: "Records Table",
      oltpPayments: "Billing Table",
      lakeFolder: "raw/medical_records",
      bronzeSource: "Hospital EHR System",
      dashboardSales: "Total Billing Amount",
      dashboardTop: "Most Common Treatments"
    }
  },
  REAL_ESTATE: {
    icon: <Building2 size={16} />,
    label: "Real Estate",
    fields: { customer: "Buyer Name", type: "Zone", product: "Property Type", price: "Value (₹)" },
    mockNames: ["Alice", "Bob", "Charlie", "David"],
    mockTypes: ["Residential", "Commercial", "Industrial"],
    mockProducts: ["2BHK Flat", "Villa", "Commercial Plot", "Penthouse"],
    eli5Title: "The Real Estate Ledger",
    eli5Desc: "When someone buys a house, the agent records the sale to make it official.",
    eli5TableTitle: "The City Registry",
    eli5TableDesc: "Official record of who owns what property.",
    tables: {
      oltpCustomers: "Buyers Table",
      oltpProducts: "Properties Table",
      oltpOrders: "Transactions Table",
      oltpPayments: "Mortgages Table",
      lakeFolder: "raw/property_sales",
      bronzeSource: "Real Estate CRM",
      dashboardSales: "Total Transaction Volume",
      dashboardTop: "Popular Property Types"
    }
  },
  MANUFACTURING: {
    icon: <Factory size={16} />,
    label: "Manufacturing",
    fields: { customer: "Assembly Line", type: "Category", product: "Component", price: "Defect Cost (₹)" },
    mockNames: ["Line A", "Line B", "Line C", "Line D"],
    mockTypes: ["Electrical", "Mechanical", "Structural"],
    mockProducts: ["Engine Block", "Transmission", "Chassis", "Electronics"],
    eli5Title: "The Factory Logbook",
    eli5Desc: "When a part fails quality check, the inspector logs the defect so it can be fixed.",
    eli5TableTitle: "The QA Database",
    eli5TableDesc: "Historical record of all manufacturing defects.",
    tables: {
      oltpCustomers: "Lines Table",
      oltpProducts: "Components Table",
      oltpOrders: "Defects Table",
      oltpPayments: "Repair Costs Table",
      lakeFolder: "raw/factory_defects",
      bronzeSource: "Factory QA System",
      dashboardSales: "Total Cost of Defects",
      dashboardTop: "Highest Defect Components"
    }
  }
};
