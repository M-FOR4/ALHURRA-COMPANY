import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Alhurra Logistics | Misrata Free Zone",
  description: "Premier shipping, unloading, and storage services in Misrata Free Zone, Libya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
