import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Alina Gnusina — Фотографія",
  description: "Портрети, весілля та editorial. Фотографую так, щоб ти впізнавав себе.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="scroll-smooth">
      <body
        className={`${inter.variable} ${crimsonPro.variable} antialiased cursor-none`}
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
