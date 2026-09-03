"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  ["Why Medivue", "/#why"],
  ["Platform", "/#platform"],
  ["Device", "/#device"],
  ["Partners", "/#partners"],
  ["About Us", "/about"],
] as const;

function HeaderArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
      <path d="M5 12h14m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Medivue home">
        <Image src="/brand_logo/logo-no-trademark-landscape.png" alt="Medivue" width={146} height={42} preload />
      </Link>
      <nav className={`site-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
        {NAV_ITEMS.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === "/about" && href === "/about" ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
      </nav>
      <a className="header-cta" href="mailto:contact@medivue.com">Start a conversation <HeaderArrow /></a>
      <button
        className="menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setMenuOpen((value) => !value)}
      >
        <span /><span />
      </button>
    </header>
  );
}
