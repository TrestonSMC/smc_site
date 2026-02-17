import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatDock from "@/components/ChatDock";
import SiteHeader from "@/components/SiteHeader";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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

function NebulaGlobal() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-neutral-950" />

      {/* star specks */}
      <div className="absolute inset-0 opacity-[0.10] bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.35),transparent_22%),radial-gradient(circle_at_90%_40%,rgba(255,255,255,0.25),transparent_18%),radial-gradient(circle_at_50%_90%,rgba(255,255,255,0.20),transparent_20%)]" />

      {/* big multicolor blobs */}
      <div className="absolute -top-72 left-[6%] h-[980px] w-[980px] rounded-full bg-[radial-gradient(circle,rgba(179,106,255,0.20),transparent_64%)] blur-3xl" />
      <div className="absolute -top-64 right-[4%] h-[1020px] w-[1020px] rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.16),transparent_66%)] blur-3xl" />
      <div className="absolute -bottom-80 left-[28%] h-[1100px] w-[1100px] rounded-full bg-[radial-gradient(circle,rgba(255,196,92,0.12),transparent_68%)] blur-3xl" />

      {/* milky haze */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.06),transparent_45%),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.05),transparent_48%)]" />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.55)_72%,rgba(0,0,0,0.88)_100%)]" />
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white bg-neutral-950 relative overflow-x-hidden`}
      >
        {/* ✅ GA4 */}
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_ID ?? ""} />

        {/* ✅ Global nebula behind EVERYTHING */}
        <NebulaGlobal />

        {/* ✅ All app UI above the nebula */}
        <div className="relative z-10 min-h-screen">
          <SiteHeader />
          {children}
          <ChatDock />
        </div>
      </body>
    </html>
  );
}





