import { useEffect, useRef, useState } from "react";
import { Flame, Lock } from "lucide-react";
import { ACCENTS, noteFor } from "../data.js";

/** Coche stylisée avec tracé animé. */
function Tick({ checked, burstKey }) {
  return (
    <span
      className={
        "relative grid size-8 shrink-0 place-items-center rounded-xl border transition-all duration-300 " +
        (checked
          ? "border-transparent bg-gradient-to-br from-emerald-400 to-sky-400 shadow-lg shadow-emerald-500/30"
          : "border-white/15 bg-white/5")
      }
    >
      {checked && (
        <svg viewBox="0 0 24 24" className="size-5">
          <path
            key={burstKey}
            d="M5 13l4 4L19 7"
            fill="none"
            stroke="#062016"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="anim-draw"
          />
        </svg>
      )}
    </span>
  );
}

export default function HabitCard({ habit, day, checked, onToggle, locked, unlockWeek, streak = 0 }) {
  const accent = ACCENTS[habit.accent];
  const Icon = habit.icon;
  const [burst, setBurst] = useState(0);
  const prev = useRef(checked);

  useEffect(() => {
    if (checked && !prev.current) {
      setBurst((n) => n + 1);
      navigator.vibrate?.(12);
    }
    prev.current = checked;
  }, [checked]);

  if (locked) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-3.5 py-3 opacity-60">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 text-slate-500">
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium text-slate-400">{habit.label}</p>
          <p className="truncate text-[13px] text-slate-600">{habit.note}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-[11px] font-semibold text-slate-500">
          <Lock className="size-3" />
          {unlockWeek}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={
        "relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border px-3.5 py-3 text-left transition-all duration-300 active:scale-[0.985] " +
        (checked
          ? `${accent.border} ${accent.soft} shadow-lg ${accent.ring}`
          : "border-white/10 bg-white/[0.035] hover:bg-white/[0.055]")
      }
    >
      <span
        className={
          "relative grid size-10 shrink-0 place-items-center rounded-xl transition-colors duration-300 " +
          (checked ? `${accent.soft} ${accent.text}` : "bg-white/5 text-slate-400")
        }
      >
        <Icon className="size-5" strokeWidth={1.9} />
        {burst > 0 && checked && (
          <span
            key={burst}
            className={`anim-ripple pointer-events-none absolute inset-0 rounded-xl ${accent.dot}`}
          />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={
            "block truncate text-[15px] font-medium transition-colors duration-300 " +
            (checked ? "text-white" : "text-slate-200")
          }
        >
          {habit.label}
        </span>
        <span className="block truncate text-[13px] text-slate-500">{noteFor(habit, day)}</span>
      </span>

      {/* La série n'apparaît qu'à partir de 2 jours : à 1 elle ne dit rien. */}
      {streak >= 2 && (
        <span className="flex shrink-0 items-center gap-0.5 text-[13px] font-bold text-orange-300">
          <Flame className="size-3.5" />
          {streak}
        </span>
      )}

      <span className={burst > 0 && checked ? "anim-pop" : undefined} key={`t${burst}`}>
        <Tick checked={checked} burstKey={burst} />
      </span>
    </button>
  );
}
