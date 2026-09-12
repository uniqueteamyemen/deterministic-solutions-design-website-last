import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import ReferenceMark from "./ReferenceMark";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const isHome = location === "/";
  const closeMenu = () => setMenuOpen(false);
  const isCurrent = (path: string) => location === path;

  return (
    <div className="site-shell reference-route-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className={`topbar reference-topbar ${scrolled || !isHome ? "topbar-scrolled" : ""}`}>
        <Link href="/" className="reference-brand" aria-label="Deterministic Solutions and Design home">
          <ReferenceMark compact />
          <span>Deterministic Solutions &amp; Design<small>Systems design / research office</small></span>
        </Link>
        <nav className="desktop-nav reference-nav" aria-label="Primary navigation">
          <Link href="/#method">Method</Link>
          <Link className={isCurrent("/catalog") ? "nav-link-active" : undefined} aria-current={isCurrent("/catalog") ? "page" : undefined} href="/catalog">Catalog</Link>
          <Link href="/#work">Work</Link>
          <Link className={isCurrent("/evidence") ? "nav-link-active" : undefined} aria-current={isCurrent("/evidence") ? "page" : undefined} href="/evidence">Evidence</Link>
          <Link className={isCurrent("/technical-library") || isCurrent("/library") ? "nav-link-active" : undefined} aria-current={isCurrent("/technical-library") || isCurrent("/library") ? "page" : undefined} href="/technical-library">Library</Link>
          <Link className={isCurrent("/about") ? "nav-link-active" : undefined} aria-current={isCurrent("/about") ? "page" : undefined} href="/about">About</Link>
          <Link className="nav-paylock" aria-current={isCurrent("/paylock") || isCurrent("/paylock/catalog") ? "page" : undefined} href="/paylock">PayLock</Link>
        </nav>
        <Link className="reference-route-contact" href="/contact">Contact <ArrowUpRight size={14} /></Link>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-primary-navigation">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        {menuOpen && <nav className="mobile-menu reference-mobile-menu" id="mobile-primary-navigation" aria-label="Primary navigation"><Link href="/#method" onClick={closeMenu}>Method</Link><Link aria-current={isCurrent("/catalog") ? "page" : undefined} href="/catalog" onClick={closeMenu}>Catalog</Link><Link href="/#work" onClick={closeMenu}>Work</Link><Link aria-current={isCurrent("/evidence") ? "page" : undefined} href="/evidence" onClick={closeMenu}>Evidence</Link><Link aria-current={isCurrent("/technical-library") || isCurrent("/library") ? "page" : undefined} href="/technical-library" onClick={closeMenu}>Technical library</Link><Link aria-current={isCurrent("/about") ? "page" : undefined} href="/about" onClick={closeMenu}>About DS&amp;D</Link><Link className="nav-paylock" aria-current={isCurrent("/paylock") || isCurrent("/paylock/catalog") ? "page" : undefined} href="/paylock" onClick={closeMenu}>Explore PayLock</Link><Link href="/contact" onClick={closeMenu}>Contact <ArrowUpRight size={14} /></Link></nav>}
      </header>
      <div id="main-content" tabIndex={-1}>{children}</div>
      <footer className="reference-footer container">
        <div className="reference-footer-brand"><ReferenceMark compact /><span>Deterministic Solutions &amp; Design LLC · New Mexico, USA</span></div>
        {!isHome && <Link href="/">Return to DS&amp;D <ArrowUpRight size={12} /></Link>}
        {isHome && <div>deterministicsolutionsdesign.com</div>}
        <div>Detail / Reference / Action · © 2026 DS&amp;D</div>
      </footer>
    </div>
  );
}
