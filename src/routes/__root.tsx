import React from "react";
import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="text-5xl font-display text-foreground">Pagina non trovata</h1>
        <p className="mt-4 text-muted-foreground">
          La pagina che cerchi è stata spostata o non esiste più.
        </p>
        <div className="mt-8">
          <Link to="/" className="btn-primary">Torna alla home</Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Chiesa di Cristo in Italia — Milano e Bologna" },
      {
        name: "description",
        content:
          "Una famiglia spirituale in Italia. Trovaci a Milano e Bologna. Funzioni domenicali e una comunità che ti aspetta.",
      },
      { name: "author", content: "Chiesa di Cristo in Italia" },
      { name: "google-site-verification", content: "mXa-ofm-K8zg9sreLtyes-M5YWdpQllGEc9i_6xBYCQ" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" },
      { property: "og:site_name", content: "Chiesa di Cristo in Italia" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Chiesa di Cristo in Italia" },
      { name: "twitter:title", content: "Chiesa di Cristo in Italia" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Geist:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

const SCHEMAS: Record<string, object> = {
  "/": {
    "@context": "https://schema.org",
    "@type": "Church",
    "name": "Chiesa di Cristo in Italia",
    "alternateName": "Church of Christ Italy",
    "url": "https://chiesadicristoitalia.it",
    "description": "Una chiesa cristiana basata sulla Bibbia, del movimento di restaurazione, con comunità a Milano e Bologna.",
    "sameAs": ["https://www.instagram.com/chiesadicristodimilano"],
  },
  "/milano": {
    "@context": "https://schema.org",
    "@type": "Church",
    "name": "Chiesa di Cristo di Milano",
    "alternateName": "Church of Christ Milan",
    "url": "https://chiesadicristoitalia.it/milano",
    "description": "Una chiesa cristiana basata sulla Bibbia a Milano. Ci ritroviamo in Corso di Porta Vigentina 15a alle 10:30 la domenica, salvo variazioni annunciate sul sito.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Corso di Porta Vigentina 15a",
      "addressLocality": "Milano",
      "postalCode": "20122",
      "addressRegion": "MI",
      "addressCountry": "IT",
    },
    "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "10:30", "closes": "12:30" }],
    "email": "info@chiesadicristoitalia.it",
    "sameAs": ["https://www.instagram.com/chiesadicristodimilano", "https://www.youtube.com/@ChiesadiCristoMilano"],
    "parentOrganization": { "@type": "Organization", "name": "Chiesa di Cristo in Italia", "url": "https://chiesadicristoitalia.it" },
  },
  "/bologna": {
    "@context": "https://schema.org",
    "@type": "Church",
    "name": "Chiesa di Cristo di Bologna",
    "alternateName": "Church of Christ Bologna",
    "url": "https://chiesadicristoitalia.it/bologna",
    "description": "La Chiesa di Cristo di Bologna si riunisce all'Hotel Europa – Sala Madrid, Via Cesare Boldrini 11. Inaugurazione domenica 4 ottobre 2026 alle 10:30.",
    "address": { "@type": "PostalAddress", "streetAddress": "Via Cesare Boldrini, 11", "addressLocality": "Bologna", "postalCode": "40121", "addressCountry": "IT" },
    "email": "info@chiesadicristoitalia.it",
    "areaServed": { "@type": "City", "name": "Bologna" },
    "sameAs": ["https://www.instagram.com/chiesadicristodibologna"],
    "parentOrganization": { "@type": "Organization", "name": "Chiesa di Cristo in Italia", "url": "https://chiesadicristoitalia.it" },
  },
};

function getJsonLd(pathname: string): object {
  const key = Object.keys(SCHEMAS)
    .filter((k) => pathname === k || pathname.startsWith(k + "/"))
    .sort((a, b) => b.length - a.length)[0] ?? "/";
  return SCHEMAS[key];
}

function JsonLdInjector() {
  const pathname = useLocation().pathname;
  React.useEffect(() => {
    const existing = document.querySelector('script[data-jsonld="route"]');
    if (existing) existing.remove();
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.setAttribute("data-jsonld", "route");
    el.textContent = JSON.stringify(getJsonLd(pathname));
    document.head.appendChild(el);
  }, [pathname]);
  return null;
}

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}


function RootComponent() {
  const location = useLocation();
  const path = location.pathname;
  const themeClass = path.startsWith("/milano")
    ? "theme-milano"
    : path.startsWith("/bologna")
      ? "theme-bologna"
      : "theme-italia";

  return (
    <div className={themeClass + " min-h-screen flex flex-col bg-background text-foreground"}>
      <JsonLdInjector />
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
