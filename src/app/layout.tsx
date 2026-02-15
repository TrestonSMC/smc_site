import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatDock from "@/components/ChatDock";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Slater Media Company",
    template: "%s | Slater Media Company",
  },
  description:
    "Slater Media Company is a creative production and digital media studio specializing in branding, web development, and cinematic storytelling.",
  metadataBase: new URL("https://slatermediacompany.com"),
  openGraph: {
    title: "Slater Media Company",
    description:
      "Creative production, branding, and digital experiences by Slater Media Company.",
    url: "https://slatermediacompany.com",
    siteName: "Slater Media Company",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Slater Media Company",
    description:
      "Creative production, branding, and digital experiences by Slater Media Company.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}

        {/* 🔥 SMC AI Assist Floating Chat */}
        <ChatDock />
      </body>
    </html>
  );
}


