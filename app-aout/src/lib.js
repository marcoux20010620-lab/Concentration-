import { DAYS_IN_MONTH, activeHabits, unlockDay } from "./data.js";

export const AUGUST = 7; // index de mois JS pour août

/* ------------------------------------------------------------------ */
/* Stockage                                                            */
/* ------------------------------------------------------------------ */

const KEY = "defis-aout.v1";

/** Certains navigateurs (mode privé, iframe sandbox) bloquent localStorage. */
export const storageWorks = (() => {
  try {
    const probe = "__probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
})();

let memory = null;

export function emptyState(year) {
  return { v: 1, year, entries: {} };
}

export function loadState(year) {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && parsed.entries) {
        return { ...emptyState(year), ...parsed, entries: parsed.entries };
      }
    }
  } catch {
    /* stockage indisponible : on retombe sur la mémoire */
  }
  return memory ?? emptyState(year);
}

export function saveState(state) {
  memory = state;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* rien à faire : la session garde les données en mémoire */
  }
}

export function clearState() {
  memory = null;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Dates                                                              */
/* ------------------------------------------------------------------ */

export function dateKey(year, day) {
  return `${year}-08-${String(day).padStart(2, "0")}`;
}

/**
 * Position d'aujourd'hui par rapport au mois d'août de `year` :
 * 0 = pas encore commencé, 1..31 = jour en cours, 32 = mois terminé.
 */
export function augustDayOf(year, now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth();
  if (y < year || (y === year && m < AUGUST)) return 0;
  if (y > year || (y === year && m > AUGUST)) return DAYS_IN_MONTH + 1;
  return now.getDate();
}

/** Jour d'août sur lequel ouvrir l'app (borné à 1..31). */
export function clampDay(day) {
  return Math.min(Math.max(day, 1), DAYS_IN_MONTH);
}

/** Nombre de jours avant le 1er août (0 si août est commencé ou passé). */
export function daysUntilAugust(year, now = new Date()) {
  const start = new Date(year, AUGUST, 1);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((start - today) / 86400000);
  return diff > 0 ? diff : 0;
}

export function longDate(year, day) {
  return new Date(year, AUGUST, day).toLocaleDateString("fr-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** Jour de la semaine du 1er août (0 = dimanche). */
export function firstWeekdayOffset(year) {
  return new Date(year, AUGUST, 1).getDay();
}

export const WEEKDAY_LABELS = ["D", "L", "M", "M", "J", "V", "S"];

/* ------------------------------------------------------------------ */
/* Statistiques                                                        */
/* ------------------------------------------------------------------ */

export function isChecked(state, day, habitId) {
  return Boolean(state.entries[dateKey(state.year, day)]?.[habitId]);
}

export function toggle(state, day, habitId) {
  const key = dateKey(state.year, day);
  const day0 = state.entries[key] ?? {};
  const next = { ...day0 };
  if (next[habitId]) delete next[habitId];
  else next[habitId] = true;

  const entries = { ...state.entries };
  if (Object.keys(next).length === 0) delete entries[key];
  else entries[key] = next;

  return { ...state, entries };
}

/** { done, total, ratio } pour un jour, selon les défis actifs de sa phase. */
export function dayStats(state, day) {
  const habits = activeHabits(day);
  const done = habits.filter((h) => isChecked(state, day, h.id)).length;
  return { done, total: habits.length, ratio: done / habits.length };
}

/** Palier de couleur : vert ≥ 80 %, orange 50-79 %, rouge < 50 %. */
export function tierOf(ratio) {
  if (ratio >= 0.8) return "green";
  if (ratio >= 0.5) return "amber";
  return "red";
}

/**
 * Série en cours et record pour un défi.
 * La série en cours est ancrée sur aujourd'hui, et tolère que la journée
 * ne soit pas encore validée (on repart alors de la veille).
 */
export function streaksOf(state, habit, today) {
  const start = unlockDay(habit);
  let best = 0;
  let run = 0;
  for (let d = start; d <= DAYS_IN_MONTH; d += 1) {
    if (isChecked(state, d, habit.id)) {
      run += 1;
      if (run > best) best = run;
    } else {
      run = 0;
    }
  }

  let end = clampDay(today);
  if (end >= start && !isChecked(state, end, habit.id)) end -= 1;
  let current = 0;
  for (let d = end; d >= start; d -= 1) {
    if (!isChecked(state, d, habit.id)) break;
    current += 1;
  }

  return { current, best: Math.max(best, current) };
}

/** Bilan du mois jusqu'à `today` inclus. */
export function monthStats(state, today) {
  const last = Math.min(clampDay(today), DAYS_IN_MONTH);
  const started = today >= 1;

  let done = 0;
  let total = 0;
  let green = 0;
  let perfect = 0;

  for (let d = 1; d <= (started ? last : 0); d += 1) {
    const s = dayStats(state, d);
    done += s.done;
    total += s.total;
    if (s.ratio >= 0.8) green += 1;
    if (s.done === s.total) perfect += 1;
  }

  const perHabit = activeHabits(DAYS_IN_MONTH).map((h) => {
    const start = unlockDay(h);
    const upto = started ? last : start - 1;
    let hits = 0;
    let days = 0;
    for (let d = start; d <= upto; d += 1) {
      days += 1;
      if (isChecked(state, d, h.id)) hits += 1;
    }
    return { habit: h, hits, days, ratio: days ? hits / days : 0 };
  });

  return {
    done,
    total,
    ratio: total ? done / total : 0,
    green,
    perfect,
    perHabit,
  };
}
