import { useCallback, useEffect, useMemo, useState } from "react";
import CalendarView from "./components/CalendarView.jsx";
import SettingsView from "./components/SettingsView.jsx";
import TabBar from "./components/TabBar.jsx";
import TodayView from "./components/TodayView.jsx";
import { useInstall } from "./install.js";
import {
  augustDayOf,
  clampDay,
  clearState,
  emptyState,
  loadState,
  saveState,
  toggle,
} from "./lib.js";

export default function App() {
  const [state, setState] = useState(() => loadState(new Date().getFullYear()));
  const [day, setDay] = useState(() => clampDay(augustDayOf(state.year) || 1));
  const [tab, setTab] = useState("today");
  const install = useInstall();

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Passage de minuit / retour d'arrière-plan : on suit la date réelle.
  // Le stamp ne change qu'au changement de jour, donc pas de rendu inutile.
  const [dateStamp, setDateStamp] = useState(() => new Date().toDateString());
  useEffect(() => {
    const refresh = () =>
      setDateStamp((prev) => {
        const now = new Date().toDateString();
        return prev === now ? prev : now;
      });
    const timer = setInterval(refresh, 60_000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  // 0 = août pas commencé, 1..31 = jour courant, 32 = mois terminé.
  // Calculé sur state.year : un import d'une autre année reste cohérent.
  const today = useMemo(() => augustDayOf(state.year), [state.year, dateStamp]);

  const onToggle = useCallback((d, habitId) => {
    setState((prev) => toggle(prev, d, habitId));
  }, []);

  const pickDay = useCallback((d) => {
    setDay(d);
    setTab("today");
  }, []);

  return (
    <div className="min-h-full bg-ink-deep">
      {/* Halo d'ambiance */}
      <div
        aria-hidden
        className="anim-glow pointer-events-none fixed inset-x-0 top-0 z-0 h-64 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(47,242,160,0.16),rgba(56,189,248,0.10)_45%,transparent_72%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-full max-w-md flex-col">
        {/* Bandeau d'identité : chaque onglet porte ensuite son propre titre. */}
        <header className="flex items-center justify-between px-5 pb-1 pt-[calc(0.875rem+env(safe-area-inset-top))]">
          <h1 className="text-[15px] font-bold tracking-tight text-white/90">Défis d'août</h1>
          <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-slate-400">
            {state.year}
          </span>
        </header>

        <main className="flex-1 px-4 pb-28">
          {tab === "today" && (
            <TodayView
              state={state}
              today={today}
              day={day}
              setDay={setDay}
              onToggle={onToggle}
              install={install}
            />
          )}
          {tab === "month" && (
            <CalendarView state={state} today={today} selected={day} onPick={pickDay} />
          )}
          {tab === "settings" && (
            <SettingsView
              state={state}
              install={install}
              onImport={(next) => setState(next)}
              onReset={() => {
                clearState();
                setState(emptyState(state.year));
              }}
            />
          )}
        </main>
      </div>

      <TabBar tab={tab} setTab={setTab} />
    </div>
  );
}
