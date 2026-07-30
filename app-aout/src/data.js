import {
  BedDouble,
  BookOpen,
  Dumbbell,
  EyeOff,
  Footprints,
  Gamepad2,
  MoonStar,
  Shield,
  Smartphone,
  SprayCan,
} from "lucide-react";

export const DAYS_IN_MONTH = 31;

/** Les 4 phases : une nouvelle débloquée chaque semaine. */
export const PHASES = [
  {
    id: 1,
    week: "Semaine 1",
    name: "Fondations",
    from: 1,
    to: 7,
    total: 4,
    tag: "Les 4 piliers de base",
  },
  {
    id: 2,
    week: "Semaine 2",
    name: "Élan",
    from: 8,
    to: 14,
    total: 7,
    tag: "+3 défis · le corps se met en marche",
  },
  {
    id: 3,
    week: "Semaine 3",
    name: "Clarté",
    from: 15,
    to: 21,
    total: 9,
    tag: "+2 défis · la tête suit",
  },
  {
    id: 4,
    week: "Semaine 4",
    name: "Maîtrise",
    from: 22,
    to: 31,
    total: 10,
    tag: "100 % · les 10 défis",
    extra: "La coupure du soir passe à 45 min sans écran.",
  },
];

/**
 * accent : jeu de classes Tailwind écrit en clair pour que le scanner les garde.
 */
export const ACCENTS = {
  rose: {
    text: "text-rose-300",
    soft: "bg-rose-500/12",
    border: "border-rose-400/25",
    ring: "shadow-rose-500/25",
    dot: "bg-rose-400",
  },
  sky: {
    text: "text-sky-300",
    soft: "bg-sky-500/12",
    border: "border-sky-400/25",
    ring: "shadow-sky-500/25",
    dot: "bg-sky-400",
  },
  emerald: {
    text: "text-emerald-300",
    soft: "bg-emerald-500/12",
    border: "border-emerald-400/25",
    ring: "shadow-emerald-500/25",
    dot: "bg-emerald-400",
  },
  violet: {
    text: "text-violet-300",
    soft: "bg-violet-500/12",
    border: "border-violet-400/25",
    ring: "shadow-violet-500/25",
    dot: "bg-violet-400",
  },
  amber: {
    text: "text-amber-300",
    soft: "bg-amber-500/12",
    border: "border-amber-400/25",
    ring: "shadow-amber-500/25",
    dot: "bg-amber-400",
  },
};

/** Les 10 défis, dans l'ordre de déblocage. */
export const HABITS = [
  {
    id: "porn",
    phase: 1,
    icon: EyeOff,
    label: "Zéro porn",
    note: "Abstinence",
    accent: "rose",
  },
  {
    id: "mb",
    phase: 1,
    icon: Shield,
    label: "Pas de masturbation",
    note: "Abstinence",
    accent: "rose",
  },
  {
    id: "bed",
    phase: 1,
    icon: BedDouble,
    label: "Faire son lit",
    note: "Dès le réveil",
    accent: "sky",
  },
  {
    id: "clean",
    phase: 1,
    icon: SprayCan,
    label: "Ménage & rangement",
    note: "10 min",
    accent: "sky",
  },
  {
    id: "workout",
    phase: 2,
    icon: Dumbbell,
    label: "Routine entraînement",
    note: "Séance du jour",
    accent: "emerald",
  },
  {
    id: "walk",
    phase: 2,
    icon: Footprints,
    label: "Marche / plein air",
    note: "20-30 min",
    accent: "emerald",
  },
  {
    id: "cutoff",
    phase: 2,
    icon: MoonStar,
    label: "Coupure du soir",
    note: "30 min sans écran",
    noteByPhase: { 4: "45 min sans écran" },
    accent: "violet",
  },
  {
    id: "read",
    phase: 3,
    icon: BookOpen,
    label: "Lecture",
    note: "15-20 min",
    accent: "amber",
  },
  {
    id: "screen",
    phase: 3,
    icon: Smartphone,
    label: "Moins de screen time",
    note: "Limite resserrée",
    accent: "amber",
  },
  {
    id: "xbox",
    phase: 4,
    icon: Gamepad2,
    label: "Moins de Xbox",
    note: "Limite stricte",
    accent: "violet",
  },
];

/** Phase active pour un jour donné (1 → 4). */
export function phaseOfDay(day) {
  const d = Math.min(Math.max(day, 1), DAYS_IN_MONTH);
  return PHASES.find((p) => d >= p.from && d <= p.to) ?? PHASES[0];
}

/** Défis actifs ce jour-là. */
export function activeHabits(day) {
  const phase = phaseOfDay(day);
  return HABITS.filter((h) => h.phase <= phase.id);
}

/** Défis encore verrouillés ce jour-là. */
export function lockedHabits(day) {
  const phase = phaseOfDay(day);
  return HABITS.filter((h) => h.phase > phase.id);
}

/** Premier jour où le défi devient actif. */
export function unlockDay(habit) {
  return PHASES.find((p) => p.id === habit.phase).from;
}

/** Libellé du défi ajusté à la phase (ex. coupure du soir 30 → 45 min). */
export function noteFor(habit, day) {
  const phase = phaseOfDay(day);
  return habit.noteByPhase?.[phase.id] ?? habit.note;
}
