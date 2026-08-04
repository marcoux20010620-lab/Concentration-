import { CalendarDays, ListChecks, Settings } from "lucide-react";

const TABS = [
  { id: "today", label: "Aujourd'hui", icon: ListChecks },
  { id: "month", label: "Bilan", icon: CalendarDays },
  { id: "settings", label: "Réglages", icon: Settings },
];

export default function TabBar({ tab, setTab }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-ink-deep">
      {/* Voile dégradé : le contenu s'efface avant d'atteindre la barre. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-ink-deep to-transparent"
      />
      <div className="relative mx-auto flex max-w-md items-stretch pb-[env(safe-area-inset-bottom)]">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center gap-1 py-2.5 transition active:scale-95"
            >
              <span
                className={
                  "absolute top-0 h-0.5 w-8 rounded-full transition-all duration-300 " +
                  (active ? "bg-gradient-to-r from-emerald-400 to-sky-400 opacity-100" : "opacity-0")
                }
              />
              <Icon
                className={
                  "size-5 transition-colors duration-200 " +
                  (active ? "text-emerald-300" : "text-slate-500")
                }
                strokeWidth={active ? 2.2 : 1.8}
              />
              <span
                className={
                  "text-[10px] font-semibold transition-colors duration-200 " +
                  (active ? "text-slate-100" : "text-slate-500")
                }
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
