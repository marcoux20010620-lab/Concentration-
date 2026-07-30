import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Lock, PartyPopper, Rocket, Sparkles } from "lucide-react";
import { DAYS_IN_MONTH, PHASES, activeHabits, lockedHabits, phaseOfDay } from "../data.js";
import { dayStats, daysUntilAugust, isChecked, longDate } from "../lib.js";
import HabitCard from "./HabitCard.jsx";
import ProgressRing from "./ProgressRing.jsx";

const CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 5.6 + 5) % 96}%`,
  dx: `${((i % 5) - 2) * 22}px`,
  delay: `${(i % 6) * 70}ms`,
  color: ["#2ff2a0", "#38bdf8", "#fbbf24", "#a78bfa"][i % 4],
}));

function Celebration() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          className="anim-confetti absolute top-0 size-2 rounded-[2px]"
          style={{
            left: c.left,
            backgroundColor: c.color,
            animationDelay: c.delay,
            "--dx": c.dx,
          }}
        />
      ))}
    </div>
  );
}

export default function TodayView({ state, today, day, setDay, onToggle }) {
  const phase = phaseOfDay(day);
  const active = activeHabits(day);
  const locked = lockedHabits(day);
  const { done, total, ratio } = dayStats(state, day);
  const isToday = day === today;
  const isFuture = today >= 1 && today <= DAYS_IN_MONTH && day > today;
  const notStarted = today === 0;
  const monthOver = today > DAYS_IN_MONTH;
  const countdown = daysUntilAugust(state.year);

  const [party, setParty] = useState(false);
  const prev = useRef({ day, done });

  // Fête seulement au moment où la dernière case de la journée se coche.
  useEffect(() => {
    const was = prev.current;
    prev.current = { day, done };
    if (was.day === day && total > 0 && done === total && was.done < total) {
      setParty(true);
      navigator.vibrate?.([12, 60, 20]);
    }
  }, [day, done, total]);

  useEffect(() => {
    if (!party) return undefined;
    const t = setTimeout(() => setParty(false), 1900);
    return () => clearTimeout(t);
  }, [party]);

  return (
    <div className="anim-rise space-y-5">
      {party && <Celebration />}

      {/* En-tête : jour, date, phase */}
      <header className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setDay(Math.max(1, day - 1))}
            disabled={day <= 1}
            aria-label="Jour précédent"
            className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition active:scale-95 disabled:opacity-25"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="min-w-0 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Jour {day} / {DAYS_IN_MONTH}
            </p>
            <p className="truncate text-[15px] font-semibold text-white first-letter:uppercase">
              {longDate(state.year, day)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDay(Math.min(DAYS_IN_MONTH, day + 1))}
            disabled={day >= DAYS_IN_MONTH}
            aria-label="Jour suivant"
            className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition active:scale-95 disabled:opacity-25"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-[12px] font-semibold text-emerald-300">
            Phase {phase.id} · {phase.name}
          </span>
          {isToday && (
            <span className="rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[12px] font-semibold text-sky-300">
              Aujourd'hui
            </span>
          )}
          {!isToday && today >= 1 && today <= DAYS_IN_MONTH && (
            <button
              type="button"
              onClick={() => setDay(today)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] font-semibold text-slate-300 transition active:scale-95"
            >
              Revenir à aujourd'hui
            </button>
          )}
        </div>
      </header>

      {notStarted && (
        <div className="flex items-start gap-3 rounded-2xl border border-sky-400/20 bg-sky-500/[0.07] p-3.5">
          <Rocket className="mt-0.5 size-5 shrink-0 text-sky-300" />
          <p className="text-[13px] leading-relaxed text-slate-300">
            Le défi commence le 1<sup>er</sup> août
            {countdown > 0 && (
              <>
                {" "}
                — <span className="font-semibold text-sky-300">J-{countdown}</span>
              </>
            )}
            . Tu peux déjà explorer les phases et cocher pour t'exercer.
          </p>
        </div>
      )}

      {monthOver && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.07] p-3.5">
          <PartyPopper className="mt-0.5 size-5 shrink-0 text-emerald-300" />
          <p className="text-[13px] leading-relaxed text-slate-300">
            Août est terminé. Le bilan complet du mois t'attend dans l'onglet{" "}
            <span className="font-semibold text-emerald-300">Bilan</span>.
          </p>
        </div>
      )}

      {isFuture && !notStarted && (
        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-slate-400" />
          <p className="text-[13px] leading-relaxed text-slate-400">
            Journée à venir. Aperçu des défis qui seront actifs ce jour-là.
          </p>
        </div>
      )}

      {/* Compteur du jour */}
      <section className="flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5">
        <ProgressRing ratio={ratio}>
          <div>
            <p className="text-3xl font-bold leading-none tracking-tight text-white">
              {done}
              <span className="text-slate-500">/{total}</span>
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              validés
            </p>
          </div>
        </ProgressRing>

        <p className="text-center text-[13px] text-slate-400">
          {done === total ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
              <PartyPopper className="size-4" /> Journée parfaite
            </span>
          ) : (
            <>
              Encore <span className="font-semibold text-white">{total - done}</span>{" "}
              {total - done > 1 ? "défis" : "défi"} · {Math.round(ratio * 100)} %
            </>
          )}
        </p>
      </section>

      {/* Défis actifs */}
      <section className="space-y-2">
        <h2 className="px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Défis du jour · {total} actifs
        </h2>
        {active.map((h) => (
          <HabitCard
            key={h.id}
            habit={h}
            day={day}
            checked={isChecked(state, day, h.id)}
            onToggle={() => onToggle(day, h.id)}
          />
        ))}
        {phase.id === 4 && phase.extra && (
          <p className="px-1 pt-1 text-[12px] text-violet-300/80">↑ {phase.extra}</p>
        )}
      </section>

      {/* Déblocage prochain */}
      {locked.length > 0 && (
        <section className="space-y-2">
          <h2 className="flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <Lock className="size-3" /> Déblocage prochain
          </h2>
          {locked.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              day={day}
              locked
              unlockWeek={`S${PHASES.find((p) => p.id === h.phase).id}`}
            />
          ))}
          <p className="px-1 pt-1 text-[12px] leading-relaxed text-slate-500">
            {locked.length} défi{locked.length > 1 ? "s" : ""} arrive
            {locked.length > 1 ? "nt" : ""} d'ici la{" "}
            {PHASES.find((p) => p.id === phase.id + 1)?.week.toLowerCase()} — rien à faire pour
            l'instant.
          </p>
        </section>
      )}
    </div>
  );
}
