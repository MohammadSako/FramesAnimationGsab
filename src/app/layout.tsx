import * as React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import NavbarNextUI from "@/components/layouts/navbarNextUI";
const inter = Inter({ subsets: ["latin"] });
import {Providers} from "./providers";

export const metadata: Metadata = {
  title: "Adaline Test Copy",
  description: "Mohammad Murad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* <NavbarNextUI /> */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
