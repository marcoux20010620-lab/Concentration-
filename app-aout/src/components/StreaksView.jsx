import { Flame, Trophy } from "lucide-react";
import { ACCENTS, DAYS_IN_MONTH, activeHabits, unlockDay } from "../data.js";
import { clampDay, isChecked, streaksOf } from "../lib.js";

// Réussite = vert, partout. Les couleurs d'accent servent à identifier le défi,
// jamais à qualifier le résultat (sinon un défi « rose » réussi se lit comme un échec).

/** Petite bande des 12 derniers jours actifs du défi. */
function DotStrip({ state, habit, today }) {
  const start = unlockDay(habit);
  const end = clampDay(today);
  const days = [];
  for (let d = Math.max(start, end - 11); d <= Math.max(end, start); d += 1) {
    if (d > DAYS_IN_MONTH) break;
    days.push(d);
  }

  return (
    <div className="flex items-center gap-1">
      {days.map((d) => {
        const on = isChecked(state, d, habit.id);
        return (
          <span
            key={d}
            title={`Jour ${d}`}
            className={
              "h-4 w-2 rounded-full transition-colors duration-300 " +
              (on ? "bg-emerald-400" : "bg-white/10")
            }
          />
        );
      })}
    </div>
  );
}

export default function StreaksView({ state, today }) {
  const day = clampDay(today);
  const habits = activeHabits(day);
  const locked = activeHabits(DAYS_IN_MONTH).length - habits.length;

  const rows = habits
    .map((habit) => ({ habit, ...streaksOf(state, habit, today) }))
    .sort((a, b) => b.current - a.current || b.best - a.best);

  const bestOverall = rows.reduce((m, r) => Math.max(m, r.best), 0);
  const totalCurrent = rows.reduce((s, r) => s + r.current, 0);

  return (
    <div className="anim-rise space-y-5">
      <header className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-white">Séries</h1>
        <p className="text-[13px] text-slate-500">
          Jours consécutifs réussis par défi, pour les défis déjà débloqués.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            <Flame className="size-3.5 text-orange-300" /> En cours
          </p>
          <p className="mt-1.5 text-2xl font-bold text-white">
            {totalCurrent}
            <span className="ml-1 text-[13px] font-medium text-slate-500">jours cumulés</span>
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            <Trophy className="size-3.5 text-amber-300" /> Record
          </p>
          <p className="mt-1.5 text-2xl font-bold text-white">
            {bestOverall}
            <span className="ml-1 text-[13px] font-medium text-slate-500">jours</span>
          </p>
        </div>
      </div>

      <section className="space-y-2">
        {rows.map(({ habit, current, best }) => {
          const accent = ACCENTS[habit.accent];
          const Icon = habit.icon;
          return (
            <div
              key={habit.id}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-3.5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-xl ${accent.soft} ${accent.text}`}
                >
                  <Icon className="size-4" strokeWidth={1.9} />
                </span>
                <p className="min-w-0 flex-1 truncate text-[15px] font-medium text-slate-100">
                  {habit.label}
                </p>
                <div className="flex shrink-0 items-baseline gap-3">
                  <span className="flex items-baseline gap-1">
                    <Flame
                      className={"size-4 " + (current > 0 ? "text-orange-300" : "text-slate-600")}
                    />
                    <span
                      className={
                        "text-lg font-bold " + (current > 0 ? "text-white" : "text-slate-600")
                      }
                    >
                      {current}
                    </span>
                  </span>
                  <span className="text-[12px] font-medium text-slate-500">record {best}</span>
                </div>
              </div>
              <div className="mt-3">
                <DotStrip state={state} habit={habit} today={today} />
              </div>
            </div>
          );
        })}
      </section>

      {locked > 0 && (
        <p className="px-1 text-[13px] text-slate-500">
          {locked} défi{locked > 1 ? "s" : ""} encore verrouillé{locked > 1 ? "s" : ""} : la série
          démarre au déblocage de la phase.
        </p>
      )}
    </div>
  );
}
