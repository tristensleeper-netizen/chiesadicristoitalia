import { useState } from "react";

interface ContactFormProps {
  defaultSubject?: string;
  city: string;
}

export function ContactForm({ defaultSubject, city }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(defaultSubject ?? "Visitare la chiesa");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[${city}] ${interest} — ${name}`);
    const body = encodeURIComponent(
      `Nome: ${name}\nEmail: ${email}\nInteresse: ${interest}\n\n${message}`,
    );
    window.location.href = `mailto:info@chiesadicristoitalia.it?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-primary-soft p-10 text-center">
        <h3 className="font-display text-3xl text-primary">Grazie!</h3>
        <p className="mt-3 text-foreground/80">
          Abbiamo aperto il tuo client di posta. Non vediamo l'ora di sentirti.
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>
      <button type="submit" className="btn-primary w-full md:w-auto">
        Invia messaggio
      </button>
    </form>
  );
}
