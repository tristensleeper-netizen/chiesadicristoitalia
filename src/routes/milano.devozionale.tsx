import { createFileRoute } from "@tanstack/react-router";
import daysData from "@/lib/isaia-days.json";
import { CourseShell, type CourseDay } from "@/components/course-shell";


const SITE_URL = "https://chiesadicristoitalia.it";

export const Route = createFileRoute("/milano/devozionale")({
  head: () => {
    const canonical = `${SITE_URL}/milano/devozionale`;
    const title = "Devozionale Isaia — Chiesa di Cristo di Milano";
    const description =
      "Studiare Isaia insieme: 66 giorni, 66 capitoli. Contesto, domande sul testo, domande per noi e note per ogni capitolo.";
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      inLanguage: "it",
      url: canonical,
      datePublished: "2026-05-11",
      author: {
        "@type": "Organization",
        name: "Chiesa di Cristo di Milano",
      },
      publisher: {
        "@type": "Organization",
        name: "Chiesa di Cristo Italia",
        url: SITE_URL,
      },
    };
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: "Devozionale Isaia — Milano" },
        {
          property: "og:description",
          content:
            "66 giorni in Isaia con la Chiesa di Cristo di Milano: contesto, domande e note per ogni capitolo.",
        },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonical },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
      ],
    };
  },
  component: DevozionalePage,
});

type Day = {
  chapter: number;
  ref_label: string;
  title: string;
  contesto: string;
  domande_testo: string[];
  domande_noi: string[];
  note: string;
};

const DAYS = daysData as Day[];

const INTRO_SECTIONS: { title: string; body: string }[] = [
  {
    title: "Introduzione",
    body: `Immaginate per un momento di essere un nobile nato in una famiglia dell'alta società. Come parte della vostra routine quotidiana, avete libero accesso alla corte reale e frequenti udienze con il re. Il vostro scopo è quello di consigliare il re, e il vostro messaggio è un forte rimprovero con avvertimenti di imminente distruzione nazionale se i leader e l'élite della società non cambiano il loro modo di agire. E se vi fosse stata data una chiamata divina per essere questo portavoce, ma vi fosse stato detto in anticipo che il vostro messaggio sarebbe caduto nel vuoto? Infatti, dopo 60 anni di ministero incessante e dopo aver vissuto quattro reggenze, solo un re risponde e scongiura il disastro sia per sé stesso che per la nazione. Le ferite del peccato (ingiustizia sociale, idolatria e ribellione) sono profonde, ma il tuo pubblico non riesce a vederlo. Sebbene il giudizio per l'intera nazione sia inevitabile, la promessa di speranza futura e di liberazione di fronte all'attuale disastro economico e politico non li attrae. Al contrario, cercano la prosperità economica, la sicurezza, la protezione politica e militare, mantenute dallo sforzo umano. La decadenza morale e la depravazione spirituale della nazione non sono considerate importanti di fronte a una minaccia imminente al loro stile di vita.`,
  },
  {
    title: "Cosa sappiamo di Isaia come persona",
    body: `Isaia viveva a Gerusalemme o nei dintorni e probabilmente era nato in una famiglia dell'alta borghesia. Aveva certamente un accesso privilegiato alle corti reali, poiché incontrava regolarmente il re faccia a faccia (7:3; 38:1; 39:3). Era un padre che aveva due figli con nomi simbolici: Shear-Jashub ("un residuo tornerà") e Maher-shalal-hash-baz ("veloce al saccheggio"). I nomi di entrambi i figli simboleggiavano una visione profetica di giudizio e speranza. Anche il nome di Isaia ("il Signore è salvezza") era appropriato per mostrare a Giuda che c'era una speranza futura di salvezza, liberazione e redenzione sia politica che spirituale se avessero riposto la loro fiducia nel Signore (12:2; 26:4).

Il ministero di Isaia durò circa 60 anni (740-680 a.C.), servendo il periodo di quattro regni (1:1). Isaia condivise anche un ministero contemporaneo con i profeti Michea (735-710 a.C.) e Osea (755-722 a.C.), con cui condivideva un tema comune: il giudizio. Nell'anno in cui morì il re Uzzia (740 a.C.) apprendiamo una grande qualità del carattere di Isaia. Nella visione di Isaia, Dio con la sua assemblea celeste chiede chi consegnerà il suo messaggio alle nazioni. Sebbene Isaia avesse una grande umiltà nel riconoscere la sua peccaminosità come uguale a quella del resto dell'umanità, era zelante e desideroso di candidarsi per la missione. Sapeva persino in anticipo che il messaggio di Dio sarebbe stato trasmesso a un pubblico poco ricettivo (6:4-10). Se sapeste in anticipo che nessuno di quelli a cui vi rivolgete risponderebbe alla parola di Dio, smettereste di evangelizzare o di studiare la Bibbia con le persone?

Secondo la tradizione citata nel Talmud ebraico, Isaia tentò di fuggire e nascondersi dal malvagio re giudaico Manasse (697-642 a.C.), e il re fece di Isaia un martire ordinando che fosse segato in due mentre si nascondeva in un tronco cavo (Eb 11:37).`,
  },
  {
    title: "Giuda ai tempi di Isaia",
    body: `L'VIII secolo a.C. fu uno dei tanti punti di svolta nella storia di Giuda. Da quando il Regno Unito (cioè Israele, non la Gran Bretagna!) si separò nel 930 a.C. nel Regno del Nord (10 tribù israelite, chiamate Samaria, Efraim o Israele) e nel Regno del Sud (Giuda), Giuda continuò un regno dinastico di re che nella maggior parte dei casi rimasero almeno parzialmente fedeli al Signore. Il Regno del Nord apostatò e seguì l'eredità idolatra del loro re infedele Geroboamo (930-909 a.C.). Dopo 200 anni di continua infedeltà, tutta la Samaria fu saccheggiata e il suo popolo deportato dalla potente e spietata nazione assira (722 a.C.). Durante il primo regno del re giudaico Uzzia (792-740 a.C.), un'ex potenza dominante, la Siria, era stata indebolita militarmente (2 Re 13:24-25). Ciò diede al Regno del Sud l'opportunità di crescere commercialmente e militarmente. Il re Uzzia nella sua giovinezza fu istruito nelle vie del Signore e fece ciò che era giusto. Dio permise a Uzzia di prosperare economicamente e militarmente con un aumento del territorio e delle fortificazioni e un esercito in espansione (2 Cr 26:3-16). Nonostante i suoi sforzi, la nazione continuò a smarrirsi nel culto pagano. Quando Uzzia aumentò il suo potere, il suo cuore divenne orgoglioso e arrogante, portandolo alla rovina. Fu colpito dalla lebbra e negli ultimi dieci anni fino alla sua morte, suo figlio Jotham divenne co-reggente.

Da questo momento fino al re Acaz (735-715 a.C.), la condizione spirituale di Giuda continuò a declinare. Durante questo periodo, l'Assiria salì al potere sotto il nuovo sovrano Tiglat-Pileser (745-727 a.C.; 2 Re 15:29), con una campagna internazionale per conquistare territori da assoggettare. La Siria e Israele percepirono questa minaccia e formarono una coalizione anti-assira nella speranza di respingerla. La coalizione voleva che Giuda si unisse a loro, ma Giuda rifiutò. Questo rifiuto scatenò l'ira sia della Siria che di Israele, che attaccarono Giuda, deposero Acaz e insediarono un loro re fantoccio sul trono di Giuda (Is 7:1-6; 2 Re 16:5-9). Invece di ascoltare il consiglio divino dato tramite Isaia di confidare esclusivamente nel Signore, anche con il segno del bambino Emmanuele, Acaz, in preda al panico, cercò un'alleanza politica empia per risolvere la minaccia alla sicurezza nazionale. Isaia aveva già detto ad Acaz che sia Israele che la Siria sarebbero caduti molto presto, ma Acaz cercò solo l'aiuto straniero. Sì, ottenne il risultato che voleva quando la Siria e Israele furono saccheggiati e deportati nel 732 e nel 722 a.C., ma a quale costo? L'idolatria di Acaz aumentò, pagando un pesante tributo al nuovo protettore politico, l'Assiria, invece di affidarsi a Dio come protettore di Giuda.

Anche all'interno di Giuda si stava diffondendo la corruzione spirituale. In apparenza, le funzioni religiose, i rituali e i sacrifici continuavano, ma solo come tradizione, poiché la nazione era spiritualmente ferita dall'idolatria, dalla ribellione e dall'ingiustizia morale e sociale. La colpa era principalmente dei leader della nazione.`,
  },
  {
    title: "Il messaggio di Isaia",
    body: `Il rotolo o libro di Isaia non è totalmente cronologico, quindi nel primo capitolo vediamo che il messaggio non riguarda solo Giuda e la sua capitale Gerusalemme, ma che il giudizio sulla terra è già iniziato con molte città giudaiche già conquistate e bruciate; solo Gerusalemme (Sion) è rimasta assediata dagli invasori stranieri (1:7-8). Maggiori dettagli sull'invasione assira di Giuda sono riportati nei capitoli 36-37, così come in 2 Re 18:14-37. Anche il re Sennacherib (705-681 a.C.) si divertì a registrare la sua campagna contro Ezechia (lo si può trovare sul Prisma di Taylor al British Museum). Nel 701 a.C., Isaia era già al ventinovesimo anno del suo ministero. Il suo messaggio era che l'intero corpo di Giuda era malato e ferito dall'iniquità. Nel paese c'erano continue ribellioni e idolatria. Tuttavia, il pubblico principale di Isaia erano i capi del governo, i funzionari, i consiglieri del re e il re stesso. Egli mise in guardia in modo specifico contro l'ingiustizia morale e sociale. I leader corrotti capitalizzavano i loro guadagni a spese dei poveri, che quindi non avrebbero mai ricevuto un trattamento equo. Ricevevano ingenti tangenti dai ricchi per annullare qualsiasi accusa di colpevolezza e mantenere lo stile di vita dissoluto dei ricchi nei circoli sociali più alti (1:17,21-23; 10:1-3).

Il re in quel periodo era Ezechia (715-686 a.C.). Sebbene questo re giudaico fosse generalmente un re giusto che impegnò la nazione in una riforma religiosa e spirituale, era comunque un leader politico che inizialmente utilizzò mezzi politici per salvare il suo paese. Dopo aver inizialmente rifiutato di pagare il tributo all'Assiria per ottenere protezione, cambiò idea quando la sua città fu assediata da loro nel 701 a.C. (2 Re 18:7,14-15). Accettò persino il consiglio dei suoi consiglieri di governo di cercare un'alleanza politica con l'Egitto per assicurarsi la liberazione dall'Assiria (2 Re 18:21; Isaia 30-31). Dio, attraverso Isaia, condannò questa fiducia mal riposta in una nazione e nei suoi consigli, invece di confidare nei consigli di Dio e nella Sua liberazione.

Il messaggio di Isaia iniziò prima, con Acaz, padre di Ezechia (735-715 a.C.). Non erano solo i peccati politici di Acaz a influenzare tutta Giuda; certamente la sua mancanza di rettitudine personale era nota. Era responsabile dei sacrifici rituali dei propri figli ed era molto dedito al culto pagano e al sincretismo (2 Cr 28:2-4; 2 Re 16:3-4). Nel capitolo 7 (734 a.C.), la minaccia della coalizione anti-assira di Israele e Siria era reale e imminente. In 2 Cr 28, Israele riuscì a catturare prigionieri giudei. Sebbene i prigionieri fossero stati poi restituiti a Giuda grazie alla profezia di Oded, Acaz cercò l'aiuto di Tiglat-Pileser, re di Assiria. Questo potrebbe aver ottenuto il risultato iniziale desiderato di frenare gli aggressori di Acaz, ma egli fu afflitto dal costo del tributo all'Assiria per ottenere questa breve liberazione. Dio offrì ad Acaz un segno (7:14) che una giovane donna conosciuta avrebbe concepito e dato alla luce un figlio di nome Emmanuele (Dio con noi) e che prima che questi compisse dodici anni, sia la Siria che Israele sarebbero state conquistate (732 e 722 a.C.). Nel capitolo 8, il segno si avvera in parte con la nascita del secondo figlio di Isaia, Maher-shalal-hash-baz (rapido al saccheggio), poiché prima che suo figlio compisse due anni, la Siria e Israele sarebbero state saccheggiate (2 Re 15:29; 732 a.C.). Il segno di Emmanuele doveva mostrare che Dio sarebbe stato con il suo popolo Giuda sia nel giudizio che nella speranza. Questo è un tema duplice che si ripete in tutto il libro, anche per le nazioni circostanti. Il messaggio finale di speranza culminò nell'adempimento delle promesse dell'alleanza di Dio con una benedizione per il residuo di Israele e la venuta di un nuovo re davidico, attraverso il quale tutte le nazioni avrebbero avuto speranza di liberazione.`,
  },
  {
    title: "Paternità",
    body: `Per tradizione questo libro è attribuito a Isaia stesso. A prima vista si potrebbe pensare che questo sia chiaro e indiscutibile. Perché abbiamo bisogno di più di una frase per discuterne? C'è una scuola di pensiero, propagata principalmente da teologi e studiosi liberali, nonché da critici superiori della Bibbia, che insiste sul fatto che il profeta Isaia del 740-680 a.C. fosse responsabile solo dei capitoli da 1 a 39. Per i capitoli dal 40 al 66, essi propongono un secondo o addirittura un terzo "Isaia" come autore del loro tempo (che si dice sia il periodo dell'esilio babilonese o il periodo post-esilio persiano). Il motivo è che non capiscono come Isaia potesse nominare Ciro, re dei Persiani. Ciro liberò il residuo di Israele nel 539 a.C. (44:24-45:1), quasi 150 anni dopo la morte di Isaia. Questa teoria è stata concepita per eliminare il miracolo divino della profezia dalle Scritture.

Si può rispondere a questa teoria in due parti. In primo luogo, Isaia è citato direttamente nel Nuovo Testamento più di 65 volte, molto più di qualsiasi altro profeta canonico dell'Antico Testamento, con citazioni sia dal 1-39 che dal 40-66. Il nome di Isaia è menzionato più di 20 volte, senza distinzione. Gesù stesso ha citato da un unico rotolo di Isaia, compreso il capitolo 61 (Lc 4,18). Un esempio degno di nota in cui Isaia è nominato e viene citato da entrambe le sezioni del libro è 53,1 e 6,10 in Gv 12,38-40. Gesù e gli autori del Nuovo Testamento non hanno dato alcuna indicazione di autori multipli di Isaia.

Una seconda risposta risiede nelle prove interne del libro stesso. Nei primi 39 capitoli vediamo che il profeta Isaia ha il dono di predire profezie che si avverano entro 3-35 anni, durante la sua vita. Egli predisse persino eventi di giudizio di nazioni specifiche che si avverarono molti anni dopo la sua morte (Is 20, 22, 39). Se Isaia, durante la vita di Acaz ed Ezechia, ha scritto i capitoli da 1 a 39 con tali profezie, perché non avrebbe potuto scrivere anche quelli da 40 a 66, con alcune delle sue profezie direttamente messianiche o che condividono un doppio adempimento o prefigurano un adempimento oltre 700 anni dopo (9,6-7; 11,1-11; 52,13-53,12)? Nel testo troverete indizi che Dio voleva che Isaia sigillasse il rotolo come testimonianza da lasciare ai suoi discepoli e al futuro residuo fino a quando le profezie non si fossero avverate (8:2,16; 29:11).`,
  },
  {
    title: "Cristo nel libro di Isaia",
    body: `Il libro di Isaia è famoso per molte delle profezie messianiche che si sono adempiute in Gesù Cristo (Lc 4:18-21). Isaia e tutti gli altri profeti dell'Antico Testamento hanno reso testimonianza a Gesù in modo diretto o indiretto e Gesù lo ha confermato dopo la sua risurrezione dicendo che tutta la Legge, i Profeti e gli Scritti (Bibbia ebraica) si sono adempiuti in Gesù (Lc 24:44). Ciò include in particolare il libro di Isaia. Come per tutti i profeti dell'Antico Testamento ispirati da Dio, la predicazione e gli scritti di Isaia sarebbero stati guidati dallo Spirito Santo (noto anche come Spirito di Cristo), ma egli avrebbe avuto una comprensione limitata o nulla di molti dei suoi scritti e oracoli che avrebbero portato a un adempimento messianico secoli dopo la sua epoca. Sicuramente avrebbe studiato i propri scritti, ma solo i messaggi contemporanei avrebbero avuto senso per i suoi tempi (1 Pt 1,10-12; 2 Pt 1,20-21).

Avrebbe riflettuto su questo:
• Quale figlio nascerà in futuro sul trono di Davide e sarà dichiarato "Dio potente"?
• Chi è il servo sofferente di Dio?
• In che modo questo servo sofferente ci salverà?
• Perché questo servo sofferente si sarebbe preso cura di TUTTE le nazioni?
• Quando sarebbe venuto da noi questo futuro re?

Sebbene speriamo di approfondire i dettagli dei passaggi messianici man mano che ampliamo i capitoli di questa serie, ecco un elenco (anche se non esaustivo) dei passaggi rilevanti:
• Isaia 2:2-5
• Isaia 7:14 (citato in Mt 1:23)
• Isaia 9:6-7
• Isaia 11:1-12
• Isaia 35:5-6,8 (Mt 11:5; 15:30-31; Mc 7:34-35)
• Isaia 42:1-4 (citato in Mt 12:18-21)
• Isaia 44:3 (Gv 14:26; 15:26; At 2:17-33)
• Isaia 48:16
• Isaia 49:1-6 (Lc 2:32; At 13:47)
• Isaia 50:5-6
• Isaia 52:13-53:12 (citato in 1 Pt 2:21-25; Gv 12:38)
• Isaia 61:1-3 (letto da Gesù stesso, Lc 4:18-21)

Data l'enfasi posta da Isaia sul Messia, è sorprendente che la parola "Messia" ("Cristo") non sia quasi mai menzionata in Isaia. Se ricordiamo, il re persiano Ciro (558-530 a.C.), menzionato sia come "pastore" che come "unto" (in ebraico = messia) in 44:28-45:1, fu predetto durante la vita di Isaia come il liberatore che avrebbe redento il residuo della nazione di Israele e ricostruito il tempio. In senso figurato, si può anche considerare Ciro (proprio come Mosè, il re Davide, Giosuè, ecc.) come un tipo o una prefigurazione di Gesù. Il compimento definitivo è il vero liberatore Gesù, che redime il residuo spirituale di Israele (Rom 9:6). Allo stesso modo, i canti del servo sofferente dei capitoli da 40 a 53 si riferiscono in apparenza alla nazione di Israele, ma trovano il loro compimento definitivo in Gesù.`,
  },
  {
    title: "Il genere e lo stile letterario di Isaia",
    body: `Il profeta Isaia era un maestro del vocabolario e dello stile ebraico, e il suo libro contiene il vocabolario più ampio di tutti i libri dell'Antico Testamento. Le sue profezie e le poche narrazioni storiche sono state scritte sia in poesia ebraica che in prosa. L'uso della poesia ebraica da parte di Isaia combina sia la "proclamazione" che la "predizione" e include tre elementi di profezia nel suo libro:
• Avvertimento alla nazione sul suo peccato di fronte al giudizio divino; un invito al pentimento
• Previsioni di eventi imminenti
• Previsioni di eventi lontani

I temi principali di Isaia sono collegati alle due parti principali del libro. La prima sezione (1-39) si concentra sul giudizio di Giuda e sui futuri giudizi delle nazioni pagane. La seconda sezione (40-66) tratta del conforto e della speranza per il popolo di Dio, Israele. Ciò è espresso in particolare attraverso la profezia del servo sofferente con la restaurazione di un nuovo residuo del Suo popolo. Questa sezione della profezia sarebbe stata rivolta al pubblico di Israele durante la cattività babilonese, quasi 100 anni dopo la morte di Isaia.`,
  },
  {
    title: "Sommario di Isaia",
    body: `Come si può riassumere il messaggio di Isaia in una o due frasi? Isaia profetizzò originariamente al popolo di Giuda che stava affrontando l'invasione assira a causa della sua ribellione contro Dio, della sua idolatria e delle ingiustizie sociali. Con il persistere di tali peccati senza pentimento, Giuda avrebbe affrontato il giudizio della cattività babilonese. In seguito, Dio avrebbe offerto la speranza di una restaurazione attraverso il Suo Servo per il fedele residuo che sarebbe tornato dalla cattività e per un residuo più ampio proveniente dalle nazioni gentili.`,
  },
  {
    title: "Riferimenti e ulteriori letture",
    body: `Per approfondire lo studio del libro di Isaia, ti consigliamo di consultare buoni commentari biblici, atlanti storici e dizionari biblici, oltre alla lettura parallela dei libri di 2 Re, 2 Cronache, Michea e Osea, che illuminano lo stesso periodo storico.`,
  },
];

function Paragraphs({ text }: { text: string }) {
  if (!text) return null;
  const paras = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <>
      {paras.map((p, i) => (
        <p key={i} className="text-foreground/80 leading-relaxed mb-4 last:mb-0 whitespace-pre-line">
          {p}
        </p>
      ))}
    </>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-7 md:p-9">
      <h2 className="font-display text-2xl md:text-3xl text-primary mb-5">{title}</h2>
      <div className="text-foreground/80 leading-relaxed">{children}</div>
    </section>
  );
}

function IntroContent() {
  return (
    <div className="space-y-6">
      {INTRO_SECTIONS.map((s, i) => (
        <section
          key={i}
          className="rounded-2xl bg-[#f7ede2] border border-[rgba(107,76,53,0.15)] p-6 md:p-8"
        >
          <h2 className="font-display text-2xl md:text-3xl text-primary mb-4">{s.title}</h2>
          <Paragraphs text={s.body} />
        </section>
      ))}
    </div>
  );
}

function ChapterContent({ day }: { day: Day }) {
  return (
    <>
      {day.contesto && (
        <SectionCard title="Contesto">
          <Paragraphs text={day.contesto} />
        </SectionCard>
      )}
      {day.domande_testo.length > 0 && (
        <SectionCard title="Domande sul testo">
          <ul className="space-y-4">
            {day.domande_testo.map((q, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {i + 1}
                </span>
                <p className="text-foreground/80 leading-relaxed">{q}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
      {day.domande_noi.length > 0 && (
        <SectionCard title="Domande per noi">
          <ul className="space-y-4">
            {day.domande_noi.map((q, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-semibold">
                  {i + 1}
                </span>
                <p className="text-foreground/80 leading-relaxed">{q}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
      {day.note && (
        <SectionCard title="Ulteriori note">
          <Paragraphs text={day.note} />
        </SectionCard>
      )}
    </>
  );
}

function DevozionalePage() {
  const courseDays: CourseDay[] = [
    {
      dayNumber: 0,
      label: "Introduzione",
      title: "Introduzione a Isaia",
      refLabel: "Prima di iniziare",
      content: <IntroContent />,
    },
    ...DAYS.map((d) => ({
      dayNumber: d.chapter,
      label: `Isaia ${d.chapter}`,
      title: d.title,
      refLabel: d.ref_label,
      content: <ChapterContent day={d} />,
    })),
  ];

  return (
    <CourseShell
      courseId="isaia"
      courseTitle="Studiare Isaia insieme"
      courseSubtitle="Un percorso attraverso il libro del profeta Isaia: 67 giorni — un'introduzione e 66 capitoli, uno per giorno. Leggi, comprendi e applica la Parola alla tua vita."
      breadcrumb={[
        { label: "Milano", to: "/milano/" },
        { label: "Devozionale Isaia" },
      ]}
      readMinutes={5}
      days={courseDays}
    />
  );
}

