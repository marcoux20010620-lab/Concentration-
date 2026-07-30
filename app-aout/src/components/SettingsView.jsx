import { useRef, useState } from "react";
import {
  Check,
  CircleAlert,
  Copy,
  Download,
  Info,
  Share2,
  Trash2,
  Upload,
} from "lucide-react";
import { storageWorks } from "../lib.js";

function Card({ title, children }) {
  return (
    <section className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Btn({ children, onClick, tone = "neutral" }) {
  const tones = {
    neutral: "border-white/10 bg-white/5 text-slate-200",
    green: "border-emerald-400/25 bg-emerald-500/12 text-emerald-200",
    danger: "border-rose-400/25 bg-rose-500/10 text-rose-200",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-[14px] font-semibold transition active:scale-[0.98] ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export default function SettingsView({ state, onImport, onReset }) {
  const [flash, setFlash] = useState("");
  const [paste, setPaste] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const fileRef = useRef(null);

  const json = JSON.stringify(state, null, 2);
  const say = (msg) => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 2600);
  };

  const download = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `defis-aout-${state.year}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    say("Fichier exporté.");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      say("Sauvegarde copiée dans le presse-papier.");
    } catch {
      setShowPaste(true);
      setPaste(json);
      say("Copie automatique refusée : sélectionne le texte ci-dessous.");
    }
  };

  const share = async () => {
    try {
      const file = new File([json], `defis-aout-${state.year}.json`, {
        type: "application/json",
      });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Sauvegarde défis d'août" });
        return;
      }
      await navigator.share({ title: "Sauvegarde défis d'août", text: json });
    } catch {
      say("Partage indisponible sur cet appareil.");
    }
  };

  const applyImport = (text) => {
    try {
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object" || typeof parsed.entries !== "object") {
        say("Format non reconnu : il faut un export de cette app.");
        return;
      }
      onImport({
        v: 1,
        year: Number(parsed.year) || state.year,
        entries: parsed.entries ?? {},
      });
      say("Données importées.");
      setShowPaste(false);
      setPaste("");
    } catch {
      say("JSON invalide.");
    }
  };

  const pickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => applyImport(String(reader.result));
    reader.readAsText(file);
    e.target.value = "";
  };

  const daysFilled = Object.keys(state.entries).length;

  return (
    <div className="anim-rise space-y-5">
      <header className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-white">Réglages</h1>
        <p className="text-[13px] text-slate-500">
          Tout reste sur ton téléphone. Aucun compte, aucun serveur.
        </p>
      </header>

      {!storageWorks && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-500/[0.08] p-3.5">
          <CircleAlert className="mt-0.5 size-5 shrink-0 text-amber-300" />
          <p className="text-[13px] leading-relaxed text-amber-100/85">
            Ce navigateur bloque le stockage local : les cases seront perdues à la fermeture.
            Exporte ta sauvegarde avant de quitter, ou ouvre l'app depuis son adresse web.
          </p>
        </div>
      )}

      {flash && (
        <div className="anim-rise flex items-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-3 text-[13px] font-medium text-emerald-200">
          <Check className="size-4 shrink-0" />
          {flash}
        </div>
      )}

      <Card title="Sauvegarde">
        <p className="text-[13px] leading-relaxed text-slate-400">
          {daysFilled} journée{daysFilled > 1 ? "s" : ""} enregistrée
          {daysFilled > 1 ? "s" : ""} pour août {state.year}.
        </p>
        <div className="grid gap-2">
          <Btn onClick={download} tone="green">
            <Download className="size-4" /> Exporter en JSON
          </Btn>
          <div className="grid grid-cols-2 gap-2">
            <Btn onClick={copy}>
              <Copy className="size-4" /> Copier
            </Btn>
            <Btn onClick={share}>
              <Share2 className="size-4" /> Partager
            </Btn>
          </div>
        </div>
      </Card>

      <Card title="Importer">
        <div className="grid gap-2">
          <Btn onClick={() => fileRef.current?.click()}>
            <Upload className="size-4" /> Choisir un fichier JSON
          </Btn>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            onChange={pickFile}
            className="hidden"
          />
          <Btn onClick={() => setShowPaste((v) => !v)}>
            <Copy className="size-4" /> {showPaste ? "Masquer" : "Coller un code"}
          </Btn>
        </div>
        {showPaste && (
          <div className="space-y-2">
            <textarea
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              rows={6}
              spellCheck={false}
              placeholder="Colle ici le contenu JSON de ta sauvegarde…"
              className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-3 font-mono text-[12px] leading-relaxed text-slate-300 outline-none focus:border-sky-400/40"
            />
            <Btn onClick={() => applyImport(paste)} tone="green">
              <Check className="size-4" /> Remplacer mes données
            </Btn>
          </div>
        )}
      </Card>

      <Card title="Installer sur l'écran d'accueil">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 size-5 shrink-0 text-sky-300" />
          <div className="space-y-1.5 text-[13px] leading-relaxed text-slate-400">
            <p>
              <span className="font-semibold text-slate-200">iPhone :</span> Safari → bouton Partager
              → « Sur l'écran d'accueil ».
            </p>
            <p>
              <span className="font-semibold text-slate-200">Android :</span> Chrome → menu ⋮ →
              « Installer l'application ».
            </p>
            <p>L'app s'ouvre alors en plein écran et fonctionne hors-ligne.</p>
          </div>
        </div>
      </Card>

      <Card title="Zone rouge">
        <Btn
          tone="danger"
          onClick={() => {
            if (window.confirm("Effacer toutes les cases du mois ? C'est définitif.")) {
              onReset();
              say("Données effacées.");
            }
          }}
        >
          <Trash2 className="size-4" /> Tout effacer
        </Btn>
      </Card>

      <p className="pb-2 text-center text-[11px] text-slate-600">Défis d'août · v1.0</p>
    </div>
  );
}
