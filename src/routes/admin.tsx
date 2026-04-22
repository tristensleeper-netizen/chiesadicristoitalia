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

  // Render login page without the admin gate/chrome.
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
            Chiedi a chi gestisce il sito di promuovere il tuo account in Lovable Cloud (tabella user_roles).
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
    <div className="min-h-screen pt-20">
      <div className="border-b border-border bg-card/50">
        <div className="container-prose py-6 flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="font-display text-2xl">Gestione contenuti</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">{email}</span>
            <button
              onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Esci
            </button>
          </div>
        </div>
        <div className="container-prose pb-4 flex gap-4 text-sm">
          <Link to="/admin" activeOptions={{ exact: true }} activeProps={{ className: "text-primary font-medium" }} className="text-foreground/70 hover:text-primary">
            Risorse
          </Link>
          <Link to="/admin/devozionali" activeProps={{ className: "text-primary font-medium" }} className="text-foreground/70 hover:text-primary">
            Devozionali
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
