import { useCallback, useEffect, useState } from "react";

const DISMISS_KEY = "defis-aout.install-masque";

export const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

function isStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

/*
 * Chrome émet `beforeinstallprompt` très tôt, souvent avant que React ait
 * monté et lancé ses effets. On écoute donc dès l'import du module, sinon
 * l'événement passe et le bouton « Installer » n'apparaît jamais.
 */
let pending = null;
let installedNow = isStandalone();
const subscribers = new Set();

function publish() {
  subscribers.forEach((fn) => fn());
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  pending = event;
  publish();
});

window.addEventListener("appinstalled", () => {
  pending = null;
  installedNow = true;
  publish();
});

/** Installation sur l'écran d'accueil : bouton natif si le navigateur l'offre. */
export function useInstall() {
  const [, force] = useState(0);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return window.localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const fn = () => force((n) => n + 1);
    subscribers.add(fn);
    fn(); // rattrape un événement survenu avant que l'effet ne tourne
    return () => subscribers.delete(fn);
  }, []);

  const install = useCallback(async () => {
    if (!pending) return;
    const event = pending;
    pending = null;
    publish();
    event.prompt();
    await event.userChoice;
  }, []);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* sans stockage, la bannière reviendra : sans conséquence */
    }
  }, []);

  const canPrompt = Boolean(pending);

  return {
    installed: installedNow,
    canPrompt,
    install,
    dismiss,
    // Bannière : seulement si l'installation est réellement possible et pas déjà faite.
    showBanner: !installedNow && !dismissed && (canPrompt || isIOS),
  };
}
