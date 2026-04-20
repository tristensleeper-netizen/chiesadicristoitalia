import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const cities = [
  { to: "/milano", label: "Milano" },
  { to: "/bologna", label: "Bologna" },
  { to: "/napoli", label: "Napoli" },
  { to: "/sicilia", label: "Sicilia" },
] as const;

export function SiteHeader() {
  const location = useLocation();
  const path = location.pathname;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isMilano = path.startsWith("/milano");
  const isBologna = path.startsWith("/bologna");
  const inCity = isMilano || isBologna;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  const isNapoli = path.startsWith("/napoli");
  const isSicilia = path.startsWith("/sicilia");
  const cityBase = isMilano ? "/milano" : isBologna ? "/bologna" : "";
  const cityLabel = isMilano ? "Milano" : isBologna ? "Bologna" : "";
  const logoTo = isMilano
    ? "/milano"
    : isBologna
      ? "/bologna"
      : isNapoli
        ? "/napoli"
        : isSicilia
          ? "/sicilia"
          : "/";
  const logoCityLabel = isMilano
    ? "Milano"
    : isBologna
      ? "Bologna"
      : isNapoli
        ? "Napoli"
        : isSicilia
          ? "Sicilia"
          : "";

  const cityNav = inCity
    ? [
        { to: `${cityBase}` as const, label: "Home" },
        { to: `${cityBase}/chi-siamo` as const, label: "Chi siamo" },
        { to: `${cityBase}/cosa-crediamo` as const, label: "Cosa crediamo" },
        { to: `${cityBase}/visita` as const, label: "Visita" },
        { to: `${cityBase}/sermoni` as const, label: "Sermoni" },
        { to: `${cityBase}/eventi` as const, label: "Eventi" },
        { to: `${cityBase}/contatti` as const, label: "Contatti" },
      ]
    : [];

  return (
    <header
      className={
        "sticky top-0 z-50 w-full transition-all duration-300 " +
        (scrolled
          ? "bg-background/85 backdrop-blur-lg border-b border-border"
          : "bg-transparent")
      }
    >
      <div className="container-prose flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-lg">
            ✝
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base md:text-lg text-foreground">
              Chiesa di Cristo
            </span>
            {inCity && (
              <span className="text-[10px] uppercase tracking-[0.25em] text-primary/80">
                {cityLabel}
              </span>
            )}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {inCity ? (
            <>
              {cityNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === cityBase }}
                  activeProps={{ className: "text-primary" }}
                  className="px-3 py-2 text-sm text-foreground/75 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/"
                className="ml-3 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Italia
              </Link>
            </>
          ) : (
            cities.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                activeProps={{ className: "text-primary" }}
                className="px-3 py-2 text-sm text-foreground/75 hover:text-primary transition-colors"
              >
                {c.label}
              </Link>
            ))
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label="Apri menu"
          aria-expanded={open}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-4">
            <span className={"absolute left-0 top-0 h-px w-full bg-current transition " + (open ? "translate-y-1.5 rotate-45" : "")} />
            <span className={"absolute left-0 top-1.5 h-px w-full bg-current transition " + (open ? "opacity-0" : "")} />
            <span className={"absolute left-0 top-3 h-px w-full bg-current transition " + (open ? "-translate-y-1.5 -rotate-45" : "")} />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container-prose flex flex-col py-4">
            {(inCity ? cityNav : cities).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={inCity && item.to === cityBase ? { exact: true } : undefined}
                activeProps={{ className: "text-primary" }}
                className="py-3 border-b border-border/60 text-base text-foreground hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            {inCity && (
              <Link
                to="/"
                className="py-3 text-xs uppercase tracking-[0.25em] text-muted-foreground"
              >
                ← Torna a Chiesa di Cristo Italia
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
