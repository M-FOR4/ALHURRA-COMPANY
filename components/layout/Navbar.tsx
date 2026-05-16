"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/operations-log", label: "Operations Log" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Use IntersectionObserver to detect scroll — works reliably on iOS
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the sentinel (top of page) is NOT visible, we've scrolled down
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const isHeroPage = pathname === "/" || pathname === "/about" || pathname === "/services" || pathname === "/contact";
  const shouldShowGlass = isScrolled || !isHeroPage;

  return (
    <>
      {/* Sentinel div at the very top of the page for scroll detection */}
      <div ref={sentinelRef} className="absolute top-0 left-0 w-1 h-1 pointer-events-none" aria-hidden="true" />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${shouldShowGlass ? "bg-white shadow-sm py-2" : "bg-transparent py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center gap-3">
                <div className="relative w-20 h-20 md:w-28 md:h-28 -ml-2">
                  <Image
                    src={shouldShowGlass ? "/logo.png" : "/logo-white-v2.png"}
                    alt="Alhurra Logo"
                    fill
                    className="object-contain scale-125 transition-opacity duration-300"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActive
                      ? "bg-alhurra-orange text-white"
                      : shouldShowGlass
                        ? "text-slate-600 hover:text-alhurra-orange"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Hamburger */}
            <div className="flex md:hidden items-center">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className={`rounded-lg flex items-center justify-center transition-all duration-200 touch-manipulation select-none ${shouldShowGlass
                  ? "text-alhurra-blue bg-slate-100"
                  : "text-white bg-white/10"
                  }`}
                style={{ width: 44, height: 44, WebkitTapHighlightColor: "transparent" }}
                aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" style={{ pointerEvents: "none" }} />
                ) : (
                  <Menu className="h-6 w-6" style={{ pointerEvents: "none" }} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/30 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed top-[72px] left-0 right-0 z-50 md:hidden bg-white shadow-2xl border-t border-slate-200 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-4 rounded-xl text-base font-bold transition-all touch-manipulation ${pathname === link.href
                    ? "bg-alhurra-orange text-white shadow-md shadow-alhurra-orange/20"
                    : "text-slate-700 active:bg-slate-100 hover:bg-slate-50"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
