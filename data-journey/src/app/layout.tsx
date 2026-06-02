import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { OrderProvider } from "../context/OrderContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Data Journey - From Order to Dashboard",
  description: "Learn how data flows from an order to a dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-950 text-slate-200 min-h-screen`} suppressHydrationWarning>
        <OrderProvider>
          {children}
        </OrderProvider>
      </body>
    </html>
  );
}
