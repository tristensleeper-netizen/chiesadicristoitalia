import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Chiesa di Cristo" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginRoute = location.pathname.startsWith("/admin/login");
  const [state, setState] = useState<"loading" | "unauth" | "no-role" | "ok">("loading");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (isLoginRoute) return;
    let active = true;

    const check = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        if (active) setState("unauth");
        return;
      }
      setEmail(session.user.email ?? "");
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      if (!active) return;
      if (roles && roles.some((r) => r.role === "admin")) {
        setState("ok");
      } else {
        setState("no-role");
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setState("unauth");
      else check();
    });

    check();

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [isLoginRoute]);

  useEffect(() => {
    if (isLoginRoute) return;
    if (state === "unauth") navigate({ to: "/admin/login" });
  }, [state, navigate, isLoginRoute]);

  if (isLoginRoute) {
    return <Outlet />;
  }

  if (state === "loading" || state === "unauth") {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Caricamento…
      </div>
    );
  }

  if (state === "no-role") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl">Account in attesa di approvazione</h1>
          <p className="mt-4 text-foreground/70">
            Sei autenticato come <strong>{email}</strong>, ma non hai ancora il ruolo di amministratore.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Chiedi a chi gestisce il sito di promuovere il tuo account.
          </p>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}
            className="mt-8 btn-outline"
          >
            Esci
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      {/* Sticky admin chrome */}
      <div className="sticky top-20 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container-prose py-5 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-semibold">
              ⚙
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
                Centro amministrazione
              </p>
              <h1 className="font-display text-xl leading-tight">Gestione contenuti</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-xs text-muted-foreground">Connesso come</span>
              <span className="text-sm font-medium">{email}</span>
            </div>
            <button
              onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}
              className="text-sm rounded-full border border-border px-4 py-2 hover:bg-muted transition"
            >
              Esci
            </button>
          </div>
        </div>
        <div className="container-prose flex gap-1 text-sm overflow-x-auto">
          <AdminTab to="/admin" exact label="Risorse" icon="📚" />
          <AdminTab to="/admin/devozionali" label="Devozionali" icon="✦" />
          <AdminTab to="/admin/eventi" label="Eventi" icon="📅" />
          <AdminTab to="/admin/messaggi" label="Messaggi" icon="✉" />
          <AdminTab to="/admin/hero" label="Hero città" icon="🏙" />
          <AdminTab to="/admin/media" label="Foto del sito" icon="🖼" />
          <AdminTab to="/admin/admins" label="Admin" icon="👤" />
        </div>
      </div>

      <Outlet />
    </div>
  );
}

function AdminTab({ to, label, icon, exact }: { to: string; label: string; icon: string; exact?: boolean }) {
  return (
    <Link
      to={to}
      activeOptions={exact ? { exact: true } : undefined}
      activeProps={{
        className: "border-primary text-primary",
      }}
      inactiveProps={{
        className: "border-transparent text-foreground/60 hover:text-foreground",
      }}
      className="flex items-center gap-2 px-4 py-3 border-b-2 -mb-px font-medium whitespace-nowrap transition"
    >
      <span aria-hidden>{icon}</span>
      {label}
    </Link>
  );
}
