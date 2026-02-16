"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useCallback, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

type NavItem = { label: string; href: string };

export default function SiteHeader({
  leftNav = [
    { label: "Services", href: "/services" },
    { label: "Showroom", href: "/showroom" },
  ],
  rightNav = [
    { label: "About", href: "/about" },
    { label: "Insider Access", href: "/insider-access" },
  ],
  cta = { label: "Start a Project", href: "/insider-access" },
}: {
  leftNav?: NavItem[];
  rightNav?: NavItem[];
  cta?: NavItem;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = useCallback(() => setMobileOpen(false), []);
  const toggleMenu = useCallback(() => setMobileOpen((v) => !v), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey, { passive: true } as any);
    return () => window.removeEventListener("keydown", onKey as any);
  }, [closeMenu]);

  // Prevent background scroll when menu is open (fixes iOS weirdness)
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const NavLink = ({
    href,
    label,
    active = false,
  }: NavItem & { active?: boolean }) => (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-white/10 text-white"
          : "text-white/80 hover:bg-white/5 hover:text-white"
      }`}
      onClick={closeMenu}
      prefetch
    >
      {label}
    </Link>
  );

  const isAboutActive = rightNav.some((i) => i.label === "About");

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* neon bottom line */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,rgba(179,106,255,0.95),rgba(0,180,255,0.95),rgba(255,196,92,0.95))] shadow-[0_0_24px_rgba(0,180,255,0.26)]" />

      <div className="border-b border-white/10 bg-neutral-950/55 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="Go home"
            onClick={closeMenu}
            prefetch
          >
            <Image
              src="/images/smc-logo.png"
              alt="Slater Media Company Logo"
              width={70}
              height={70}
              className="object-contain drop-shadow-[0_0_26px_rgba(255,214,120,0.14)]"
              priority
            />
            <div className="leading-tight hidden sm:block">
              <div className="text-sm font-semibold tracking-widest text-white/80">
                SLATER MEDIA COMPANY
              </div>
              <div className="text-xs text-white/50">The Creatives Express</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-1">
              {leftNav.map((l) => (
                <NavLink key={l.href} {...l} />
              ))}
            </div>

            <div className="mx-2 h-6 w-px bg-white/10" />

            <div className="flex items-center gap-1">
              {rightNav.map((l) => (
                <NavLink
                  key={l.href}
                  {...l}
                  active={l.label === "About" && isAboutActive}
                />
              ))}
            </div>

            {/* CTA (desktop only) */}
            <Link
              href={cta.href}
              onClick={closeMenu}
              className="ml-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
              prefetch
            >
              {cta.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>

          {/* Mobile: burger only (CONTACT button removed) */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/25 p-3 text-white/90 hover:bg-black/40 transition active:scale-[0.98]"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={`md:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        {/* Overlay */}
        <button
          aria-label="Close menu"
          className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />

        {/* Panel */}
        <div
          id="mobile-menu"
          className={`fixed top-0 right-0 z-50 h-[100dvh] w-[86vw] max-w-sm transform transition-transform duration-200 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full overflow-y-auto border-l border-white/10 bg-black/75 backdrop-blur-lg shadow-[0_18px_70px_rgba(0,0,0,0.65)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div className="text-sm font-semibold text-white/90">Menu</div>
              <button
                type="button"
                onClick={closeMenu}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/25 p-2 text-white/90 hover:bg-black/40 transition"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-2">
              {[...leftNav, ...rightNav].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={closeMenu}
                  prefetch
                  className="flex items-center justify-between rounded-2xl px-4 py-4 text-base font-semibold text-white/90 hover:bg-white/5 transition active:scale-[0.99]"
                >
                  <span>{l.label}</span>
                  <span className="text-white/40">→</span>
                </Link>
              ))}
            </div>

            <div className="border-t border-white/10 p-4">
              <Link
                href={cta.href}
                onClick={closeMenu}
                prefetch
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 hover:opacity-90 transition active:scale-[0.99]"
              >
                {cta.label} <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="mt-3 text-xs leading-relaxed text-white/55">
                Slater Media Company — The Creatives Express
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}



