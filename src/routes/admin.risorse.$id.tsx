import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  CITY_TAG_LABELS,
  RESOURCE_TYPE_LABELS,
  type CityTag,
  type ResourceType,
} from "@/lib/resource-helpers";

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
    thumbnail_caption: "",
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

  if (loading) return <div className="container-narrow py-20 text-muted-foreground">Caricamento…</div>;

  return (
    <div className="container-narrow py-8 md:py-12">
      <button
        onClick={() => navigate({ to: "/admin" })}
        className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center gap-1"
      >
        ← Torna alle risorse
      </button>
      <h2 className="font-display text-3xl mb-1">{isNew ? "Nuova risorsa" : "Modifica risorsa"}</h2>
      <p className="text-sm text-muted-foreground mb-8">
        Compila i campi qui sotto. I campi con * sono obbligatori.
      </p>

      <form onSubmit={save} className="space-y-6">
        {/* Section: Basic info */}
        <Section title="Informazioni principali">
          <Field label="Titolo" required>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-base" />
          </Field>
          <Field label="Slug (URL)" hint="Lascia vuoto per generarlo dal titolo">
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={slugify(form.title)} className="input-base" />
          </Field>
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Tipo" required>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ResourceType })} className="input-base">
                {TYPES.map((t) => <option key={t} value={t}>{RESOURCE_TYPE_LABELS[t]}</option>)}
              </select>
            </Field>
            <Field label="Città" required>
              <select value={form.city_tag} onChange={(e) => setForm({ ...form, city_tag: e.target.value as CityTag })} className="input-base">
                {CITIES.map((c) => <option key={c} value={c}>{CITY_TAG_LABELS[c]}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Descrizione breve" hint="Mostrata nelle anteprime e nei feed">
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-base" />
          </Field>
        </Section>

        {/* Section: Media */}
        <Section title="Media">
          <Field label="URL media" hint="YouTube, Vimeo, Spotify, link a PDF…">
            <input value={form.media_url} onChange={(e) => setForm({ ...form, media_url: e.target.value })} className="input-base" />
          </Field>
          <Field label="URL miniatura" hint="Immagine di anteprima (opzionale)">
            <input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} className="input-base" />
          </Field>
        </Section>

        {/* Section: Attribution */}
        <Section title="Attribuzione">
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Autore / Predicatore">
              <input value={form.speaker_or_author} onChange={(e) => setForm({ ...form, speaker_or_author: e.target.value })} className="input-base" />
            </Field>
            <Field label="Riferimento biblico">
              <input value={form.scripture_ref} onChange={(e) => setForm({ ...form, scripture_ref: e.target.value })} placeholder="es. Matteo 5:1-12" className="input-base" />
            </Field>
          </div>
        </Section>

        {/* Section: Content */}
        <Section title="Contenuto">
          <Field label="Testo lungo" hint="Trascrizione, articolo o note">
            <textarea rows={12} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="input-base font-mono text-sm" />
          </Field>
        </Section>

        {/* Section: Visibility */}
        <Section title="Visibilità">
          <div className="grid md:grid-cols-2 gap-3">
            <Toggle
              checked={form.published}
              onChange={(v) => setForm({ ...form, published: v })}
              label="Pubblicata"
              hint="Visibile sul sito pubblico"
            />
            <Toggle
              checked={form.featured}
              onChange={(v) => setForm({ ...form, featured: v })}
              label="In evidenza"
              hint="Mostrata in homepage e sezioni in primo piano"
            />
          </div>
        </Section>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Sticky save bar */}
        <div className="sticky bottom-0 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-background/95 backdrop-blur border-t border-border flex gap-3 justify-end">
          <button type="button" onClick={() => navigate({ to: "/admin" })} className="btn-outline">
            Annulla
          </button>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Salvataggio…" : isNew ? "Crea risorsa" : "Salva modifiche"}
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
