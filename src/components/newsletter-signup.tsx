import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { CityTag } from "@/lib/resource-helpers";

export function NewsletterSignup({
  cityTag,
  source,
}: {
  cityTag?: CityTag;
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err" | "dup">("idle");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: email.trim().toLowerCase(),
      source: source ?? null,
      city_tag: cityTag ?? null,
    });
    if (error) {
      if (error.code === "23505") setStatus("dup");
      else setStatus("err");
      console.error(error);
      return;
    }
    setStatus("ok");
    setEmail("");
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="La tua email"
          className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary whitespace-nowrap disabled:opacity-60"
        >
          {status === "loading" ? "Invio…" : "Iscriviti"}
        </button>
      </div>
      {status === "ok" && (
        <p className="mt-3 text-sm text-primary">Grazie! Ti aggiungeremo presto.</p>
      )}
      {status === "dup" && (
        <p className="mt-3 text-sm text-muted-foreground">Sei già iscritto. Grazie!</p>
      )}
      {status === "err" && (
        <p className="mt-3 text-sm text-destructive">
          Qualcosa è andato storto. Riprova tra poco.
        </p>
      )}
    </form>
  );
}
