import { Download, Share, X } from "lucide-react";
import { isIOS } from "../install.js";

/** Invite à poser l'app sur l'écran d'accueil, une seule fois. */
export default function InstallBanner({ canPrompt, install, dismiss }) {
  return (
    <div className="relative flex items-start gap-3 rounded-2xl border border-sky-400/25 bg-sky-500/[0.08] p-3.5 pr-10">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-sky-500/15 text-sky-300">
        {canPrompt ? <Download className="size-4" /> : <Share className="size-4" />}
      </span>

      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-[13px] font-semibold text-white">Mets-la sur ton écran d'accueil</p>
        {canPrompt ? (
          <>
            <p className="text-[12px] leading-relaxed text-slate-400">
              Elle s'ouvrira en plein écran, comme une vraie app, même sans réseau.
            </p>
            <button
              type="button"
              onClick={install}
              className="rounded-xl border border-sky-400/30 bg-sky-500/15 px-3 py-1.5 text-[13px] font-semibold text-sky-200 transition active:scale-95"
            >
              Installer
            </button>
          </>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-400">
            {isIOS ? (
              <>
                Bouton <span className="font-semibold text-slate-200">Partager</span> en bas de
                Safari → <span className="font-semibold text-slate-200">Sur l'écran d'accueil</span>
                .
              </>
            ) : (
              <>
                Menu du navigateur →{" "}
                <span className="font-semibold text-slate-200">Installer l'application</span>.
              </>
            )}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Masquer"
        className="absolute right-2 top-2 grid size-7 place-items-center rounded-lg text-slate-500 transition active:scale-90"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
