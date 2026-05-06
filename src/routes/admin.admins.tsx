import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { listAdmins, addAdminByEmail, removeAdmin } from "@/server/admins.functions";

export const Route = createFileRoute("/admin/admins")({
  component: AdminsPage,
});

type Admin = { id: string; user_id: string; email: string | null; created_at: string };

function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listAdmins();
      setAdmins(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await addAdminByEmail({ data: { email } });
      setEmail("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (a: Admin) => {
    if (!confirm(`Rimuovere ${a.email ?? a.user_id} dagli amministratori?`)) return;
    setError(null);
    try {
      await removeAdmin({ data: { user_id: a.user_id } });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
    }
  };

  return (
    <div className="container-prose py-8 md:py-12">
      <div className="mb-6">
        <h2 className="font-display text-3xl">Amministratori</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Aggiungi o rimuovi gli account che possono gestire il sito. L'utente deve prima essersi registrato.
        </p>
      </div>

      <form onSubmit={add} className="bg-background border border-border rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[240px]">
          <label className="eyebrow block mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@esempio.com"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? "Aggiungo…" : "Aggiungi admin"}
        </button>
      </form>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-12 text-center text-muted-foreground">Caricamento…</p>
        ) : admins.length === 0 ? (
          <p className="p-12 text-center text-muted-foreground">Nessun admin.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Aggiunto</th>
                <th className="text-right px-4 py-3 font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {admins.map((a) => (
                <tr key={a.id} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3 font-medium">{a.email ?? <span className="text-muted-foreground">{a.user_id}</span>}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(a.created_at).toLocaleDateString("it-IT")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(a)} className="text-sm text-destructive hover:underline">
                      Rimuovi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
