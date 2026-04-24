import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormProps {
  defaultSubject?: string;
  city: string;
}

export function ContactForm({ defaultSubject, city }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(defaultSubject ?? "Visitare la chiesa");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error: insertError } = await supabase
        .from("contact_submissions")
        .insert({
          city,
          name: name.trim(),
          email: email.trim(),
          interest,
          message: message.trim(),
        });
      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      console.error("Contact submission failed", err);
      setError("Non siamo riusciti a inviare il messaggio. Riprova tra poco.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-primary-soft p-10 text-center">
        <h3 className="font-display text-3xl text-primary">Grazie!</h3>
        <p className="mt-3 text-foreground/80">
          Abbiamo ricevuto il tuo messaggio. Ti risponderemo al più presto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="eyebrow block mb-2">Nome completo*</label>
        <input
          id="name"
          required
          maxLength={200}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label htmlFor="email" className="eyebrow block mb-2">Email*</label>
        <input
          id="email"
          type="email"
          required
          maxLength={255}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label htmlFor="interest" className="eyebrow block mb-2">Sono interessato a…</label>
        <select
          id="interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option>Visitare la chiesa</option>
          <option>Studiare la Bibbia</option>
          <option>Unirmi a un gruppo</option>
          <option>Altro</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="eyebrow block mb-2">Messaggio*</label>
        <textarea
          id="message"
          required
          rows={5}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <button type="submit" disabled={submitting} className="btn-primary w-full md:w-auto disabled:opacity-60">
        {submitting ? "Invio in corso…" : "Invia messaggio"}
      </button>
    </form>
  );
}
