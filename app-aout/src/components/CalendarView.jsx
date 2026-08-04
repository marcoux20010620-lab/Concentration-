import { Award, CalendarCheck, Flame, Layers, Target } from "lucide-react";
import { DAYS_IN_MONTH, PHASES, activeHabits, phaseOfDay } from "../data.js";
import {
  WEEKDAY_LABELS,
  dayStats,
  firstWeekdayOffset,
  monthStats,
  streaksOf,
  tierOf,
} from "../lib.js";

const TIER_STYLE = {
  green: "bg-emerald-500/85 text-emerald-950 border-emerald-300/40",
  amber: "bg-amber-500/85 text-amber-950 border-amber-300/40",
  red: "bg-rose-500/70 text-rose-950 border-rose-300/30",
};

function DayCell({ state, day, today, selected, onPick }) {
  const { done, total, ratio } = dayStats(state, day);
  const future = today >= 1 ? day > today : true;
  const isToday = day === today;

  let look = "border-white/10 bg-white/[0.03] text-slate-500";
  if (!future && done > 0) look = TIER_STYLE[tierOf(ratio)];
  else if (!future) look = "border-rose-400/20 bg-rose-500/10 text-rose-200/70";

  return (
    <button
      type="button"
      onClick={() => onPick(day)}
      className={
        "relative grid aspect-square place-items-center rounded-xl border text-[13px] font-semibold transition-all duration-200 active:scale-90 " +
        look +
        (selected ? " ring-2 ring-sky-300/80" : "") +
        (isToday && !selected ? " ring-1 ring-white/40" : "")
      }
      aria-label={`Jour ${day} : ${done} sur ${total}`}
    >
      {day}
      {isToday && (
        <span className="absolute bottom-1 size-1 rounded-full bg-current opacity-80" />
      )}
    </button>
  );
}

export default function CalendarView({ state, today, selected, onPick }) {
  const offset = firstWeekdayOffset(state.year);
  const stats = monthStats(state, today);

  return (
    <div className="anim-rise space-y-5">
      <header className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-white">Bilan d'août</h1>
        <p className="text-[13px] text-slate-500">
          Touche une journée pour l'ouvrir et ajuster ses cases.
        </p>
      </header>

      {/* Grille du mois */}
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-3.5">
        <div className="mb-2 grid grid-cols-7 gap-1.5">
          {WEEKDAY_LABELS.map((w, i) => (
            <span
              key={i}
              className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-600"
            >
              {w}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: offset }, (_, i) => (
            <span key={`pad${i}`} />
          ))}
          {Array.from({ length: DAYS_IN_MONTH }, (_, i) => (
            <DayCell
              key={i + 1}
              state={state}
              day={i + 1}
              today={today}
              selected={selected === i + 1}
              onPick={onPick}
            />
          ))}
        </div>

        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 border-t border-white/5 pt-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-emerald-500/85" /> ≥ 80 %
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-amber-500/85" /> 50-79 %
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-rose-500/70" /> &lt; 50 %
          </span>
        </div>
      </section>

      {/* Chiffres du mois */}
      <section className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-3 text-center">
          <Target className="mx-auto size-4 text-sky-300" />
          <p className="mt-1.5 text-xl font-bold text-white">{Math.round(stats.ratio * 100)}%</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            réussite
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-3 text-center">
          <CalendarCheck className="mx-auto size-4 text-emerald-300" />
          <p className="mt-1.5 text-xl font-bold text-white">{stats.green}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            jours verts
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-3 text-center">
          <Award className="mx-auto size-4 text-amber-300" />
          <p className="mt-1.5 text-xl font-bold text-white">{stats.perfect}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            parfaits
          </p>
        </div>
      </section>

      {/* Réussite et séries, par défi — une seule liste plutôt que deux écrans */}
      <section className="space-y-3.5 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Par défi
        </h2>
        {stats.perHabit.map(({ habit, hits, days, ratio }) => {
          const { current, best } = streaksOf(state, habit, today);
          return (
            <div key={habit.id} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[13px] text-slate-300">{habit.label}</span>
                <span className="shrink-0 text-[12px] font-semibold tabular-nums text-slate-500">
                  {days > 0 ? `${hits}/${days}` : "à venir"}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                {/* Barre toujours verte : la longueur dit la réussite, pas la teinte. */}
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-[width] duration-700"
                  style={{ width: `${Math.round(ratio * 100)}%` }}
                />
              </div>
              {days > 0 && (
                <p className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Flame
                    className={"size-3 " + (current > 0 ? "text-orange-300" : "text-slate-600")}
                  />
                  <span className={current > 0 ? "font-semibold text-slate-300" : ""}>
                    {current} en cours
                  </span>
                  · record {best}
                </p>
              )}
            </div>
          );
        })}
      </section>

      {/* Feuille de route des phases */}
      <section className="space-y-2 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          <Layers className="size-3" /> Les 4 phases
        </h2>
        {PHASES.map((p) => {
          const current = today >= 1 && phaseOfDay(today).id === p.id;
          const passed = today > p.to;
          return (
            <div
              key={p.id}
              className={
                "rounded-2xl border p-3 transition-colors " +
                (current
                  ? "border-emerald-400/30 bg-emerald-500/[0.08]"
                  : "border-white/5 bg-white/[0.02]")
              }
            >
              <div className="flex items-center justify-between gap-2">
                <p
                  className={
                    "text-[14px] font-semibold " + (current ? "text-emerald-200" : "text-slate-300")
                  }
                >
                  Phase {p.id} · {p.name}
                </p>
                <span className="shrink-0 rounded-lg bg-white/5 px-2 py-0.5 text-[11px] font-bold text-slate-400">
                  {p.total}/{activeHabits(DAYS_IN_MONTH).length}
                </span>
              </div>
              <p className="mt-0.5 text-[12px] text-slate-500">
                {p.week} · jours {p.from}-{p.to} · {p.tag}
                {passed ? " · terminée" : ""}
              </p>
              {p.extra && <p className="mt-1 text-[12px] text-violet-300/75">{p.extra}</p>}
            </div>
          );
        })}
      </section>
    </div>
  );
}
