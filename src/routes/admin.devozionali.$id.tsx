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

  if (loading) return <div className="container-prose py-20 text-muted-foreground">Caricamento…</div>;

  return (
    <div className="container-narrow py-12">
      <h2 className="font-display text-3xl mb-8">{isNew ? "Nuovo devozionale" : "Modifica devozionale"}</h2>
      <form onSubmit={save} className="space-y-5">
        <label className="block">
          <span className="eyebrow block mb-2">Titolo *</span>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-base" />
        </label>
        <label className="block">
          <span className="eyebrow block mb-2">Slug</span>
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={slugify(form.title)} className="input-base" />
        </label>
        <div className="grid md:grid-cols-2 gap-5">
          <label className="block">
            <span className="eyebrow block mb-2">Settimana del *</span>
            <input type="date" required value={form.week_of} onChange={(e) => setForm({ ...form, week_of: e.target.value })} className="input-base" />
          </label>
          <label className="block">
            <span className="eyebrow block mb-2">Riferimento biblico</span>
            <input value={form.scripture_ref} onChange={(e) => setForm({ ...form, scripture_ref: e.target.value })} placeholder="es. Matteo 6:33" className="input-base" />
          </label>
        </div>
        <label className="block">
          <span className="eyebrow block mb-2">Autore</span>
          <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="input-base" />
        </label>
        <label className="block">
          <span className="eyebrow block mb-2">Testo *</span>
          <textarea required rows={12} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="input-base font-mono text-sm" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          Pubblicato
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Salvataggio…" : "Salva"}
          </button>
          <button type="button" onClick={() => navigate({ to: "/admin/devozionali" })} className="btn-outline">
            Annulla
          </button>
        </div>
      </form>
    </div>
  );
}
