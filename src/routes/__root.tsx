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
      { title: "Chiesa di Cristo in Italia — Milano, Bologna, Napoli, Palermo" },
      {
        name: "description",
        content:
          "Una famiglia spirituale in Italia. Trovaci a Milano, Bologna, Napoli e Palermo. Funzioni domenicali, studi biblici e una comunità che ti aspetta.",
      },
      { name: "author", content: "Chiesa di Cristo in Italia" },
      { name: "google-site-verification", content: "mXa-ofm-K8zg9sreLtyes-M5YWdpQllGEc9i_6xBYCQ" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Chiesa di Cristo in Italia — Milano, Bologna, Napoli, Palermo" },
      { name: "twitter:title", content: "Chiesa di Cristo in Italia — Milano, Bologna, Napoli, Palermo" },
      { name: "description", content: "Christ Italian Connect is a modern, welcoming church website designed to connect local communities with their respective congregations." },
      { property: "og:description", content: "Christ Italian Connect is a modern, welcoming church website designed to connect local communities with their respective congregations." },
      { name: "twitter:description", content: "Christ Italian Connect is a modern, welcoming church website designed to connect local communities with their respective congregations." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/450c659a-0cc2-4106-b5e2-6ac1734c5b60/id-preview-e589e7ae--91e62dbb-079b-4061-b270-1afff4048b17.lovable.app-1776867721056.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/450c659a-0cc2-4106-b5e2-6ac1734c5b60/id-preview-e589e7ae--91e62dbb-079b-4061-b270-1afff4048b17.lovable.app-1776867721056.png" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

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
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
