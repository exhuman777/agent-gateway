"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/explore", label: "explore" },
  { href: "/about", label: "about" },
  { href: "/vision", label: "vision" },
  { href: "/methodology", label: "methodology" },
  { href: "/docs", label: "docs" },
];

export function Nav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-white/5 backdrop-blur-md fixed top-0 w-full z-50 bg-[#050505]/80">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-mono font-bold text-white tracking-wider">
            APIPOOL
          </Link>
          {active && (
            <span className="text-[10px] font-mono text-white/30 border border-white/10 px-1.5 py-0.5 rounded">
              {active}
            </span>
          )}
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-white/40 hover:text-white transition-colors font-mono"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/explore">
            <span className="text-xs text-black bg-white hover:bg-white/80 px-3 py-1.5 rounded font-mono transition-colors">
              explore
            </span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/60 hover:text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {open ? (
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" />
            ) : (
              <>
                <path d="M3 5H17" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 10H17" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 15H17" stroke="currentColor" strokeWidth="1.5" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#050505]/95 backdrop-blur-md px-4 py-4 space-y-3">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm text-white/50 hover:text-white font-mono py-1"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/register"
            className="block text-sm text-white/50 hover:text-white font-mono py-1"
            onClick={() => setOpen(false)}
          >
            register your api
          </Link>
        </div>
      )}
    </nav>
  );
}
