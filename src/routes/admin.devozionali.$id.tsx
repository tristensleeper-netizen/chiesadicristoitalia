import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/devozionali/$id")({
  component: DevotionalEditor,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function DevotionalEditor() {
  const { id } = useParams({ from: "/admin/devozionali/$id" });
  const navigate = useNavigate();
  const isNew = id === "nuovo";

  const [form, setForm] = useState({
    title: "",
    slug: "",
    week_of: todayIso(),
    scripture_ref: "",
    body: "",
    author: "",
    published: true,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase.from("devotionals").select("*").eq("id", id).maybeSingle();
      if (error) { setError(error.message); setLoading(false); return; }
      if (data) {
        setForm({
          title: data.title,
          slug: data.slug,
          week_of: data.week_of,
          scripture_ref: data.scripture_ref ?? "",
          body: data.body,
          author: data.author ?? "",
          published: data.published,
        });
      }
      setLoading(false);
    })();
  }, [id, isNew]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      scripture_ref: form.scripture_ref || null,
      author: form.author || null,
    };
    const { error } = isNew
      ? await supabase.from("devotionals").insert(payload)
      : await supabase.from("devotionals").update(payload).eq("id", id);
    setSaving(false);
    if (error) { setError(error.message); return; }
    navigate({ to: "/admin/devozionali" });
  };

  if (loading) return <div className="container-narrow py-20 text-muted-foreground">Caricamento…</div>;

  return (
    <div className="container-narrow py-8 md:py-12">
      <button
        onClick={() => navigate({ to: "/admin/devozionali" })}
        className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center gap-1"
      >
        ← Torna ai devozionali
      </button>
      <h2 className="font-display text-3xl mb-1">{isNew ? "Nuovo devozionale" : "Modifica devozionale"}</h2>
      <p className="text-sm text-muted-foreground mb-8">
        Una riflessione settimanale sulla Parola.
      </p>

      <form onSubmit={save} className="space-y-6">
        <Section title="Informazioni">
          <Field label="Titolo" required>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-base" />
          </Field>
          <Field label="Slug (URL)" hint="Lascia vuoto per generarlo dal titolo">
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={slugify(form.title)} className="input-base" />
          </Field>
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Settimana del" required>
              <input type="date" required value={form.week_of} onChange={(e) => setForm({ ...form, week_of: e.target.value })} className="input-base" />
            </Field>
            <Field label="Riferimento biblico">
              <input value={form.scripture_ref} onChange={(e) => setForm({ ...form, scripture_ref: e.target.value })} placeholder="es. Matteo 6:33" className="input-base" />
            </Field>
          </div>
          <Field label="Autore">
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="input-base" />
          </Field>
        </Section>

        <Section title="Contenuto">
          <Field label="Testo" required hint="Il corpo della riflessione">
            <textarea required rows={14} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="input-base font-mono text-sm" />
          </Field>
        </Section>

        <Section title="Visibilità">
          <Toggle
            checked={form.published}
            onChange={(v) => setForm({ ...form, published: v })}
            label="Pubblicato"
            hint="Visibile sul sito pubblico"
          />
        </Section>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="sticky bottom-0 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-background/95 backdrop-blur border-t border-border flex gap-3 justify-end">
          <button type="button" onClick={() => navigate({ to: "/admin/devozionali" })} className="btn-outline">
            Annulla
          </button>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Salvataggio…" : isNew ? "Crea devozionale" : "Salva modifiche"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-background border border-border rounded-xl p-5 md:p-6 space-y-5">
      <h3 className="font-display text-lg border-b border-border pb-3">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
      {hint && <span className="block mt-1.5 text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${checked ? "border-primary/50 bg-primary/5" : "border-border hover:bg-muted/40"}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-primary"
      />
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
    </label>
  );
}
