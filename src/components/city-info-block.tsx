interface CityInfoProps {
  city: "Milano" | "Bologna";
  address: string;
  cap: string;
  serviceTime: string;
  email?: string;
  mapsUrl: string;
}

export function CityInfoBlock({ city, address, cap, serviceTime, email, mapsUrl }: CityInfoProps) {
  return (
    <section className="container-prose py-20 md:py-28">
      <div className="grid gap-10 md:grid-cols-3">
        <InfoCard
          label="Funzione domenicale"
          title={serviceTime}
          body="Adorazione, comunione e un messaggio dalla Bibbia. Tutti sono benvenuti."
        />
        <InfoCard
          label="Dove ci troviamo"
          title={address}
          body={`${cap} ${city}`}
          link={{ href: mapsUrl, label: "Apri in Maps →" }}
        />
        <InfoCard
          label="Scrivici"
          title={email ?? "info@chiesadicristoitalia.it"}
          body="Rispondiamo in 24 ore. Saremo felici di accoglierti."
        />
      </div>
    </section>
  );
}

function InfoCard({
  label,
  title,
  body,
  link,
}: {
  label: string;
  title: string;
  body: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
      <p className="eyebrow mb-4">{label}</p>
      <h3 className="font-display text-2xl text-foreground leading-tight">{title}</h3>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{body}</p>
      {link && (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block text-sm font-medium text-primary hover:underline"
        >
          {link.label}
        </a>
      )}
    </div>
  );
}
