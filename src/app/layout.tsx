import "./globals.css";
import * as React from "react";
import type { Metadata } from "next";
import {Providers} from "./providers";

export const metadata: Metadata = {
  title: "Animation GSAB",
  description: "Mohammad Talal Murad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
