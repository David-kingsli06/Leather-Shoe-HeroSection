import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cuir & Co. | Premium Cognac Tan Leather Sneaker",
  description:
    "Hand-finished low-top leather sneaker in cognac tan #8B5A2B. Built from the ground up, made to be worn for years.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-[var(--color-charcoal-depth)] text-[var(--color-offwhite)] font-sans antialiased selection:bg-[var(--color-cognac)] selection:text-[var(--color-offwhite)]">
        {children}
      </body>
    </html>
  );
}
