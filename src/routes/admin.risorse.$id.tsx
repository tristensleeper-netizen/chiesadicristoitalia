import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { CityTag, ResourceType } from "@/lib/resource-helpers";

export const Route = createFileRoute("/admin/risorse/$id")({
  component: ResourceEditor,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

const TYPES: ResourceType[] = ["sermon", "article", "video", "podcast", "pdf"];
const CITIES: CityTag[] = ["national", "milano", "bologna", "napoli", "sicilia"];

function ResourceEditor() {
  const { id } = useParams({ from: "/admin/risorse/$id" });
  const navigate = useNavigate();
  const isNew = id === "nuovo";

  const [form, setForm] = useState({
    title: "",
    slug: "",
    type: "sermon" as ResourceType,
    description: "",
    body: "",
    media_url: "",
    thumbnail_url: "",
    city_tag: "national" as CityTag,
    speaker_or_author: "",
    scripture_ref: "",
    featured: false,
    published: true,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase.from("resources").select("*").eq("id", id).maybeSingle();
      if (error) { setError(error.message); setLoading(false); return; }
      if (data) {
        setForm({
          title: data.title,
          slug: data.slug,
          type: data.type,
          description: data.description ?? "",
          body: data.body ?? "",
          media_url: data.media_url ?? "",
          thumbnail_url: data.thumbnail_url ?? "",
          city_tag: data.city_tag,
          speaker_or_author: data.speaker_or_author ?? "",
          scripture_ref: data.scripture_ref ?? "",
          featured: data.featured,
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
      description: form.description || null,
      body: form.body || null,
      media_url: form.media_url || null,
      thumbnail_url: form.thumbnail_url || null,
      speaker_or_author: form.speaker_or_author || null,
      scripture_ref: form.scripture_ref || null,
    };
    const { error } = isNew
      ? await supabase.from("resources").insert(payload)
      : await supabase.from("resources").update(payload).eq("id", id);
    setSaving(false);
    if (error) { setError(error.message); return; }
    navigate({ to: "/admin" });
  };

  if (loading) return <div className="container-prose py-20 text-muted-foreground">Caricamento…</div>;

  return (
    <div className="container-narrow py-12">
      <h2 className="font-display text-3xl mb-8">{isNew ? "Nuova risorsa" : "Modifica risorsa"}</h2>
      <form onSubmit={save} className="space-y-5">
        <Field label="Titolo *">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-base" />
        </Field>
        <Field label="Slug (URL)" hint="Lascia vuoto per generarlo dal titolo">
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={slugify(form.title)} className="input-base" />
        </Field>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Tipo *">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ResourceType })} className="input-base">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Città *">
            <select value={form.city_tag} onChange={(e) => setForm({ ...form, city_tag: e.target.value as CityTag })} className="input-base">
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Descrizione breve">
          <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-base" />
        </Field>
        <Field label="URL media (YouTube, Vimeo, Spotify, PDF…)">
          <input value={form.media_url} onChange={(e) => setForm({ ...form, media_url: e.target.value })} className="input-base" />
        </Field>
        <Field label="URL miniatura (opzionale)">
          <input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} className="input-base" />
        </Field>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Autore / Predicatore">
            <input value={form.speaker_or_author} onChange={(e) => setForm({ ...form, speaker_or_author: e.target.value })} className="input-base" />
          </Field>
          <Field label="Riferimento biblico">
            <input value={form.scripture_ref} onChange={(e) => setForm({ ...form, scripture_ref: e.target.value })} placeholder="es. Matteo 5:1-12" className="input-base" />
          </Field>
        </div>
        <Field label="Contenuto (testo lungo)">
          <textarea rows={10} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="input-base font-mono text-sm" />
        </Field>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            In evidenza
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Pubblicato
          </label>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Salvataggio…" : "Salva"}
          </button>
          <button type="button" onClick={() => navigate({ to: "/admin" })} className="btn-outline">
            Annulla
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-2">{label}</span>
      {children}
      {hint && <span className="block mt-1 text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
