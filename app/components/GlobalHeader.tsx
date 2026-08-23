"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { SITE_SEARCH_ITEMS } from "../data/siteSearch";
import { ElectraCoreLogoMark } from "./Logo";

const NAV_LINKS = [
  { label: "Learn", href: "/learn" },
  { label: "Calculators", href: "/calculate" },
  { label: "Circuit Designer", href: "/design" },
  { label: "References", href: "/guides" },
];

export function GlobalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const searchInput = useRef<HTMLInputElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const results = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return SITE_SEARCH_ITEMS.slice(0, 8);
    return SITE_SEARCH_ITEMS.filter((item) => {
      const content = `${item.title} ${item.type} ${item.description} ${item.keywords ?? ""}`.toLowerCase();
      return terms.every((term) => content.includes(term));
    }).slice(0, 10);
  }, [query]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if ((event.key === "/" && !typing) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")) {
        event.preventDefault();
        setMenuOpen(false);
        setSearchOpen(true);
      }
      if (event.key === "Escape") { setSearchOpen(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    if (!menuOpen && !searchOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>(searchOpen ? ".search-dialog" : ".mobile-nav-panel");
    const focusable = dialog ? Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])')) : [];
    if (searchOpen) requestAnimationFrame(() => searchInput.current?.focus());
    else requestAnimationFrame(() => focusable[0]?.focus());
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    dialog?.addEventListener("keydown", trapFocus);
    return () => {
      document.body.style.overflow = "";
      dialog?.removeEventListener("keydown", trapFocus);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => { setActive(0); }, [query]);

  const navigate = (href: string) => { setSearchOpen(false); router.push(href); };

  return <>
    <header className="global-header">
      <nav className="nav" aria-label="Primary navigation">
        <Link href="/" className="nav-logo" aria-label="ElectraCore home"><ElectraCoreLogoMark size={32} /><span className="nav-logo-text">ElectraCore</span></Link>
        <div className="nav-links">{NAV_LINKS.map((link) => <Link key={link.href} href={link.href} className="nav-link" aria-current={pathname.startsWith(link.href) ? "page" : undefined}>{link.label}</Link>)}</div>
        <div className="nav-actions">
          <Link href="/calculate#saved-calculations" className="nav-saved">Saved</Link>
          <button className="nav-search" onClick={() => setSearchOpen(true)} aria-label="Search ElectraCore"><span>Search</span><kbd>/</kbd></button>
          <button ref={menuButton} className="nav-hamburger" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label="Open menu"><span /><span /><span /></button>
        </div>
      </nav>
    </header>

    {menuOpen ? <div className="nav-overlay" onMouseDown={(event) => { if (event.currentTarget === event.target) setMenuOpen(false); }}>
      <section id="mobile-navigation" className="mobile-nav-panel" role="dialog" aria-modal="true" aria-label="Site menu">
        <div className="mobile-nav-head"><span>Navigate</span><button onClick={() => { setMenuOpen(false); menuButton.current?.focus(); }} aria-label="Close menu">Close</button></div>
        <div className="mobile-nav-links">{NAV_LINKS.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}<Link href="/calculate#saved-calculations">Saved work</Link><button onClick={() => { setMenuOpen(false); setSearchOpen(true); }}>Search ElectraCore</button></div>
        <p className="mobile-nav-note">Saved work and learning progress stay on this device.</p>
      </section>
    </div> : null}

    {searchOpen ? <div className="search-overlay" onMouseDown={(event) => { if (event.currentTarget === event.target) setSearchOpen(false); }}>
      <section className="search-dialog" role="dialog" aria-modal="true" aria-label="Search ElectraCore">
        <div className="search-field"><input ref={searchInput} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses, calculators and guides" aria-controls="site-search-results" onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => Math.min(value + 1, results.length - 1)); } if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); } if (event.key === "Enter" && results[active]) { event.preventDefault(); navigate(results[active].href); } }} /><button onClick={() => setSearchOpen(false)} aria-label="Close search">Esc</button></div>
        <p className="search-status" role="status">{query ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Popular destinations"}</p>
        <div id="site-search-results" className="search-results" role="listbox" aria-label="Search results">{results.map((item, index) => <button key={`${item.type}-${item.href}`} className={index === active ? "active" : ""} onMouseEnter={() => setActive(index)} onClick={() => navigate(item.href)} role="option" aria-selected={index === active}><span className="search-result-copy"><strong>{item.title}</strong><small>{item.description}</small></span><span className="search-result-type">{item.type}</span></button>)}{results.length === 0 ? <div className="search-empty">No matching destination. Try ?voltage drop?, ?testing?, or ?wiring?.</div> : null}</div>
      </section>
    </div> : null}
  </>;
}
