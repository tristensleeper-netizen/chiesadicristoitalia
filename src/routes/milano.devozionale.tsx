import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/milano/devozionale")({
  head: () => ({
    meta: [
      { title: "Lettura Devozionale — Isaia | Chiesa di Cristo di Milano" },
      {
        name: "description",
        content:
          "Piano devozionale quotidiano sul libro di Isaia. Ogni giorno una scrittura, riflessioni e una preghiera. Chiesa di Cristo di Milano.",
      },
    ],
  }),
  component: DevozionalePage,
});

const WEEK_START = new Date("2026-05-11"); // Monday 11 May 2026

const DAYS: {
  label: string;
  date: string;
  scripture: string;
  ref: string;
  title: string;
  intro: string;
  summary: string;
  questions: string[];
  practice: string[];
  prayer: string;
}[] = [
  {
    label: "Lun",
    date: "11 Mag",
    scripture: "«Il Signore degli eserciti ha giurato: Sì, come ho pensato, così avverrà; come ho deciso, così sarà.»",
    ref: "Isaia 14:24",
    title: "Dio governa la storia",
    intro: "Isaia ci introduce a un Dio che non è spettatore passivo della storia umana, ma il suo sovrano assoluto. Questo primo giorno ci invita a riposarci nella certezza che nulla sfugge alla mano di Dio.",
    summary: "Nel libro di Isaia, Dio si presenta come il Signore della storia. Egli usò persino nazioni pagane come l'Assiria come strumenti del Suo giudizio, eppure rimase sempre in controllo. Isaia profetizzò durante il regno di quattro re di Giuda (740–680 a.C.) in un periodo di grande instabilità politica. Eppure il suo messaggio era costante: confidate nel Signore, non nelle alleanze umane. La grandezza di Dio si manifesta nel fatto che Egli conosce la fine dall'inizio e che i Suoi piani non possono essere frustrati da nessuna potenza umana o spirituale.",
    questions: [
      "In quale area della tua vita fai più fatica a confidare che Dio è in controllo?",
      "Come cambierebbe il tuo atteggiamento se credessi davvero che Dio governa anche le situazioni difficili che stai affrontando?",
      "Quali eventi della tua vita, guardando indietro, vedi ora come guidati dalla mano di Dio?",
    ],
    practice: [
      "Scrivi su un foglio una situazione nella tua vita che ti spaventa o preoccupa. Poi scrivici sopra: 'Dio è in controllo di questo.'",
      "Oggi, quando senti ansia per il futuro, ripeti a voce alta: 'Il Signore degli eserciti ha deciso — così sarà.'",
    ],
    prayer: "Padre, ti ringrazio perché non sei un Dio lontano ma il Signore della storia — anche della mia storia. Aiutami oggi ad affidarti le mie paure, le mie incertezze e i miei piani. Che la mia fiducia sia in Te soltanto. Amen.",
  },
  {
    label: "Mar",
    date: "12 Mag",
    scripture: "«Eccomi, manda me!»",
    ref: "Isaia 6:8",
    title: "La chiamata di Isaia — e la nostra",
    intro: "La visione di Isaia nel tempio è uno dei momenti più potenti dell'intera Bibbia. Davanti alla santità di Dio, Isaia riconosce la sua indegnità — e poi, purificato, risponde con disponibilità totale. Oggi riflettiamo sulla nostra chiamata.",
    summary: "Nel capitolo 6, Isaia ha una visione di Dio sul trono circondato dai serafini che cantano: 'Santo, santo, santo'. Di fronte a questa gloria, Isaia esclama: 'Sono perduto! Sono un uomo dalle labbra impure.' Ma Dio non lo allontana — lo purifica. Un serafino tocca le sue labbra con un carbone ardente dell'altare e dichiara il suo peccato espiato. Solo dopo questa purificazione Dio chiede: 'Chi manderò?' E Isaia, ora libero dalla colpa, risponde con slancio: 'Eccomi, manda me!' Questo è il modello della vera vocazione cristiana: prima l'incontro con la santità di Dio, poi la purificazione per grazia, infine la disponibilità al servizio.",
    questions: [
      "Come ti sentiresti tu di fronte alla piena santità di Dio?",
      "C'è qualcosa che ti impedisce di dire 'Eccomi' a Dio nella tua vita quotidiana?",
      "In quale area specifica senti che Dio potrebbe starti chiamando a fare un passo avanti?",
    ],
    practice: [
      "Prenditi 5 minuti di silenzio oggi. Immagina di essere davanti a Dio. Cosa provi? Poi di' semplicemente: 'Eccomi, manda me.'",
      "Identifica un'opportunità concreta questa settimana per servire qualcuno — un collega, un vicino, un familiare.",
    ],
    prayer: "Signore santo, quando mi avvicino a Te riconosco la mia imperfezione. Grazie perché attraverso Gesù sono purificato e posso stare davanti a Te. Rendimi disponibile: 'Eccomi'. Usami oggi per il Tuo scopo. Amen.",
  },
  {
    label: "Mer",
    date: "13 Mag",
    scripture: "«Se non rimanete saldi nella fede, non resisterete affatto.»",
    ref: "Isaia 7:9",
    title: "Mantieni la calma e confida in Dio",
    intro: "Il re Acaz era terrorizzato da due eserciti nemici. Dio, attraverso Isaia, gli offrì una sola via d'uscita: la fede. Ma Acaz preferì l'alleanza con l'Assiria. Oggi vediamo cosa accade quando cerchiamo soluzioni umane ai problemi spirituali.",
    summary: "Nel 734 a.C., la Siria e il regno settentrionale di Israele avevano unito le forze per attaccare Gerusalemme. Il popolo tremava 'come gli alberi della foresta agitati dal vento'. Isaia si avvicinò al re Acaz con un messaggio chiaro: 'Mantieni la calma, non temere.' Dio prometteva che i nemici sarebbero caduti. Ma Acaz, invece di credere, fingette umiltà spirituale rifiutando di chiedere un segno — mentre in segreto stava già negoziando un'alleanza con l'Assiria. Isaia smontò l'ipocrisia e annunciò il segno di Emmanuele: 'Dio è con noi.' Questa profezia ha un doppio adempimento: nel figlio di Isaia e in Gesù Cristo.",
    questions: [
      "Quali sono le 'Assiria' della tua vita — cioè le soluzioni mondane a cui ti rivolgi invece di affidarti a Dio?",
      "In che modo la paura condiziona le tue decisioni quotidiane?",
      "Il fatto che 'Dio è con noi' (Emmanuele) — quanto è reale per te oggi, concretamente?",
    ],
    practice: [
      "Identifica una decisione che stai rimandando per paura. Portala a Dio in preghiera questa settimana prima di agire.",
      "Scrivi 'Emmanuele — Dio con me' in un posto dove lo vedrai spesso oggi.",
    ],
    prayer: "Dio mio, quanto spesso cerco soluzioni umane invece di fidarmi di Te. Perdonami per le volte in cui ho preferito le mie alleanze alla Tua guida. Oggi voglio credere davvero che Tu sei con me. Dammi coraggio e fede. Amen.",
  },
  {
    label: "Gio",
    date: "14 Mag",
    scripture: "«Il popolo che camminava nelle tenebre ha visto una grande luce.»",
    ref: "Isaia 9:2",
    title: "Una grande luce nelle tenebre",
    intro: "Uno dei passi più belli e più citati di tutto Isaia. In mezzo al giudizio e all'oscurità, Dio annuncia la venuta di una luce straordinaria — un bambino, un figlio, il cui nome sarà 'Dio potente, Padre eterno, Principe della pace.'",
    summary: "Il capitolo 8 si concludeva con 'morte, tenebre e angoscia'. Ma il capitolo 9 apre con alba e gioia. Isaia profetizza che le regioni di Zabulon e Neftali — tra le prime a essere invase dagli Assiri — vedranno una grande luce. Matteo cita questo passo per descrivere l'inizio del ministero di Gesù in Galilea (Mt 4:13-16). Il bambino profetizzato porterà una pace senza fine sul trono di Davide. I suoi titoli — Consigliere ammirabile, Dio potente, Padre eterno, Principe della pace — indicano chiaramente la sua natura divina. Questa profezia, pronunciata in un momento di crisi politica, punta verso il Messia che sarebbe venuto secoli dopo: Gesù Cristo.",
    questions: [
      "In quale area della tua vita hai bisogno di sentire oggi la 'grande luce' di Dio?",
      "Come vivi tu la pace che Gesù — il Principe della pace — promette?",
      "Quali 'tenebre' intorno a te potresti illuminare con la luce del Vangelo?",
    ],
    practice: [
      "Oggi raggiungi qualcuno che sai che sta attraversando un momento difficile — con un messaggio, una chiamata, o un gesto concreto.",
      "Leggi Matteo 4:13-16 e medita su come Gesù ha adempiuto questa profezia.",
    ],
    prayer: "Signore Gesù, Tu sei la luce che è venuta nel mondo. Illumina le mie tenebre oggi — le paure, i dubbi, le tristezze. E fa' che io sia un riflesso della Tua luce per chi mi sta intorno. Amen.",
  },
  {
    label: "Ven",
    date: "15 Mag",
    scripture: "«Un germoglio spunterà dal ceppo di Jesse, un ramo crescerà dalle sue radici.»",
    ref: "Isaia 11:1",
    title: "Il ramo di Jesse — il re che verrà",
    intro: "Dopo i giudizi dei capitoli precedenti, Isaia dipinge un quadro straordinario del futuro re che nascerà dalla stirpe di Davide. Uno spirito di saggezza, intelligenza e timore del Signore riposerà su di lui. È la profezia più dettagliata del Messia in tutta la prima parte di Isaia.",
    summary: "Il capitolo 10 descriveva l'abbattimento degli alberi maestosi — un'immagine del giudizio. Ma dall'11 emerge una speranza nuova: dal ceppo abbattuto di Jesse (il padre del re Davide) spunterà un germoglio. Su questo futuro re riposerà lo Spirito del Signore con pienezza: spirito di saggezza, intelligenza, consiglio, forza, conoscenza e timore del Signore. Questo re non giudicherà secondo le apparenze, ma con giustizia per i poveri e i miti. La sua venuta porterà una pace cosmica: il lupo abiterà con l'agnello. Questo è Gesù — il Figlio di Davide, il Messia atteso. Il capitolo 12 risponde con un canto di lode: 'Io ti ringrazio, o Signore, perché eri adontato con me, ma la Tua collera si è placata ed Egli mi ha consolato.'",
    questions: [
      "Quali doni dello Spirito descritti in questo passo desideri di più nella tua vita (saggezza, intelligenza, forza, timore di Dio)?",
      "Come vivi tu il 'timore del Signore' — non come paura paralizzante, ma come profondo rispetto e meraviglia?",
      "In che modo Gesù, il 'ramo di Jesse', ha cambiato concretamente la tua vita?",
    ],
    practice: [
      "Leggi il capitolo 12 di Isaia come un canto di lode personale. Sostituisci 'Israele' con il tuo nome.",
      "Scrivi tre modi in cui Gesù ha portato pace nella tua vita quest'anno.",
    ],
    prayer: "Padre, grazie per Gesù — il germoglio di Jesse, il mio Re. Fa' che lo Spirito di saggezza e di timore del Signore riposi anche su di me. Che io possa giudicare con giustizia, trattare i poveri con dignità e vivere in pace con chi mi circonda. Amen.",
  },
];

function getTodayIndex(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(WEEK_START);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0 || diff > 4) return 0;
  return diff;
}

function DevozionalePage() {
  const todayIdx = getTodayIndex();
  const [selected, setSelected] = useState(todayIdx);
  const day = DAYS[selected];

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-background">
        <div className="container-prose py-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/milano/" className="hover:text-primary transition">Milano</Link>
          <span>/</span>
          <span className="text-foreground">Lettura Devozionale</span>
        </div>
      </div>

      <div className="container-prose py-12 md:py-20">

        {/* ── HEADER: fixed intro block ── */}
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">Serie devozionale</p>
          <h1 className="font-display text-5xl md:text-6xl leading-tight">Studiare Isaia insieme.</h1>
          <p className="mt-5 text-foreground/70 leading-relaxed text-lg">
            Un percorso di meditazione quotidiana attraverso il libro del profeta Isaia — dal lunedì al venerdì. Ogni giorno una scrittura, una riflessione, domande per la vita e una preghiera.
          </p>
          <div className="mt-6 rounded-2xl bg-[#f7ede2] border border-[rgba(107,76,53,0.15)] p-6">
            <p className="text-sm font-medium text-primary mb-1">Obiettivo di questa serie</p>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Isaia è uno dei libri più ricchi e complessi della Bibbia. Attraverso questa serie vogliamo aiutarti a leggere, comprendere e applicare la Parola di Dio alla tua vita concreta — scoprendo il carattere di Dio, il messaggio del Messia e come vivere una fede che trasforma davvero.
            </p>
          </div>
        </div>

        {/* ── WEEKLY CALENDAR ── */}
        <div className="mb-12">
          <p className="eyebrow mb-4">Settimana dell'11 Maggio 2026</p>
          <div className="grid grid-cols-5 gap-2 md:gap-3">
            {DAYS.map((d, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={[
                  "rounded-2xl border p-3 md:p-4 text-left transition-all duration-200",
                  selected === i
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-border bg-card hover:border-primary/40 hover:bg-[#f7ede2]",
                ].join(" ")}
              >
                <p className={["text-xs font-medium uppercase tracking-wider mb-1", selected === i ? "text-white/70" : "text-muted-foreground"].join(" ")}>{d.label}</p>
                <p className={["text-sm font-semibold", selected === i ? "text-white" : "text-foreground"].join(" ")}>{d.date}</p>
                <p className={["text-[10px] mt-1.5 leading-tight line-clamp-2", selected === i ? "text-white/80" : "text-muted-foreground"].join(" ")}>{d.ref}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── DAILY CONTENT ── */}
        <div className="space-y-10">

          {/* 1. Scrittura del giorno */}
          <div className="rounded-3xl bg-primary p-8 md:p-10 text-white">
            <p className="text-xs uppercase tracking-widest text-white/60 mb-4">Scrittura del giorno · {day.date}</p>
            <blockquote className="font-display text-2xl md:text-3xl leading-snug mb-4">
              {day.scripture}
            </blockquote>
            <cite className="text-sm text-white/70 not-italic font-medium">{day.ref}</cite>
          </div>

          {/* 2. Riassunto */}
          <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#f0e4d6] border border-[rgba(107,76,53,0.18)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a0623a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>
                  <line x1="12" y1="7" x2="12" y2="14"/><line x1="9" y1="10" x2="15" y2="10"/>
                </svg>
              </div>
              <h2 className="font-display text-2xl text-primary">{day.title}</h2>
            </div>
            <p className="text-foreground/65 text-sm leading-relaxed mb-4 italic">{day.intro}</p>
            <div className="h-px w-full bg-border mb-5" />
            <p className="text-foreground/80 leading-relaxed">{day.summary}</p>
          </div>

          {/* 3. Riflessione e pratica */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#f0e4d6] border border-[rgba(107,76,53,0.18)]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a0623a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                  </svg>
                </div>
                <h3 className="font-display text-xl text-primary">Domande di riflessione</h3>
              </div>
              <ul className="space-y-4">
                {day.questions.map((q, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold">{i + 1}</span>
                    <p className="text-foreground/75 text-sm leading-relaxed">{q}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-card p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#f0e4d6] border border-[rgba(107,76,53,0.18)]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a0623a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <h3 className="font-display text-xl text-primary">Metti in pratica</h3>
              </div>
              <ul className="space-y-4">
                {day.practice.map((p, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                    <p className="text-foreground/75 text-sm leading-relaxed">{p}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Preghiera */}
          <div className="rounded-3xl bg-[#f7ede2] border border-[rgba(107,76,53,0.15)] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#f0e4d6] border border-[rgba(107,76,53,0.18)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a0623a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 1l-6 4-6-4"/><circle cx="6" cy="8" r="3"/><circle cx="18" cy="8" r="3"/><circle cx="12" cy="18" r="3"/>
                  <line x1="8.6" y1="9.8" x2="10.2" y2="15.5"/><line x1="15.4" y1="9.8" x2="13.8" y2="15.5"/>
                </svg>
              </div>
              <h3 className="font-display text-xl text-primary">Preghiera del giorno</h3>
            </div>
            <p className="font-serif italic text-foreground/80 leading-relaxed text-lg">{day.prayer}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              onClick={() => setSelected(Math.max(0, selected - 1))}
              disabled={selected === 0}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Giorno precedente
            </button>
            <button
              onClick={() => setSelected(Math.min(DAYS.length - 1, selected + 1))}
              disabled={selected === DAYS.length - 1}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Giorno successivo →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
