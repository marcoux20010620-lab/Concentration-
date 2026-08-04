Ce dépôt contient deux applications web mobiles, indépendantes et 100 % hors-ligne.

| App | Adresse | Quoi |
| --- | --- | --- |
| **Défis d'août** | `…/Concentration-/aout/` | 10 défis du mois d'août, débloqués une phase par semaine |
| **Reprise** | `…/Concentration-/` | défi personnel 30 jours (version précédente) |

---

# Défis d'août

Suivi des 10 habitudes du mois d'août avec une rampe d'accès douce : une nouvelle phase se débloque chaque semaine. Interface sombre, mobile-first, moins de 30 secondes par jour.

## Sur le cell (le plus simple)

1. Ouvrir **https://marcoux20010620-lab.github.io/Concentration-/aout/** dans Safari (iPhone) ou Chrome (Android).
2. « Ajouter à l'écran d'accueil » / « Installer l'application ».
3. C'est tout : l'app s'ouvre en plein écran, fonctionne hors-ligne, et tout se sauvegarde sur le téléphone.

> Si la page ne répond pas encore : **Settings → Pages → Source → « GitHub Actions »**, puis relancer le workflow « Déployer sur GitHub Pages » (onglet Actions).

## Les 4 phases

| Phase | Jours | Défis actifs | Ce qui s'ajoute |
| --- | --- | --- | --- |
| 1 · Fondations | 1-7 | 4 | Zéro porn · Pas de masturbation · Faire son lit · Ménage 10 min |
| 2 · Élan | 8-14 | 7 | Entraînement · Marche 20-30 min · Coupure du soir 30 min |
| 3 · Clarté | 15-21 | 9 | Lecture 15-20 min · Moins de screen time |
| 4 · Maîtrise | 22-31 | 10 | Moins de Xbox · la coupure du soir passe à 45 min |

Les défis des semaines à venir restent visibles, grisés, dans « Déblocage prochain ».

## Fonctionnalités

Trois onglets, pas plus.

- **Aujourd'hui** : date, `Jour X / 31`, phase en cours, anneau de progression et compteur ajusté à la phase (`4/4` en S1, `10/10` en S4). La série en cours s'affiche directement sur chaque défi (dès 2 jours), donc aucun onglet à changer au quotidien. Flèches pour corriger une journée passée, et un rappel « Hier : 5/7 · Compléter » quand la veille a été commencée sans être finie.
- **Bilan** : grille du mois colorée (vert ≥ 80 %, orange 50-79 %, rouge < 50 %), taux de réussite, jours verts, journées parfaites, feuille de route des phases, et une liste unique « Par défi » réunissant réussite, série en cours et record. Un tap sur une journée l'ouvre pour l'ajuster.
- **Réglages** : bouton d'installation sur l'écran d'accueil, export / import JSON (fichier, copie ou partage), remise à zéro.
- Micro-animations à chaque validation, confettis sur une journée parfaite, vibration légère.

## Développement

Source dans `app-aout/` (Vite + React + Tailwind CSS v4 + Lucide). Le build sort dans `aout/`, publié tel quel par GitHub Pages — il est versionné pour que le site fonctionne sans étape de compilation.

```bash
cd app-aout
npm install
npm run dev     # aperçu local
npm run build   # régénère ../aout
```

Après un `npm run build`, penser à committer `aout/`. Si les fichiers de `aout/assets/` changent, incrémenter `CACHE` dans `app-aout/public/sw.js` pour forcer la mise à jour chez les appareils déjà installés.

---

# Reprise — Défi personnel 30 jours

Application mobile (web, 100 % hors-ligne) pour tenir un défi de 30 jours sans porno ni apps de rencontre.

## Utilisation

Ouvrir `index.html` dans un navigateur (téléphone ou ordinateur). Aucune installation, aucun serveur : toutes les données restent sur l'appareil.

Astuce téléphone : ouvrir la page puis « Ajouter à l'écran d'accueil » pour l'utiliser comme une vraie app installée (PWA), qui fonctionne hors-ligne.

## Adresse permanente (recommandé)

La sauvegarde automatique ne fonctionne que sur une vraie adresse web (pas dans l'aperçu Artifact, qui tourne dans un bac à sable bloquant le stockage). Pour l'activer une fois pour toutes :

1. Sur GitHub : **Settings → Pages → Build and deployment → Source → « GitHub Actions »**.
2. Relancer le workflow « Déployer sur GitHub Pages » (onglet Actions → Re-run jobs).
3. L'app devient disponible en permanence à `https://marcoux20010620-lab.github.io/Concentration-/` — ouvre ce lien sur ton cell et « Ajouter à l'écran d'accueil ». À partir de là, tout se sauvegarde automatiquement.

## Sauvegarde et persistance

- **Stockage automatique** en trois couches selon ce que le navigateur permet : `localStorage` → cookie → mémoire.
- Si le navigateur bloque tout stockage (cas de l'aperçu Artifact), une **bannière** l'annonce et un **code de sauvegarde** (`RPZ1.…`) permet de tout exporter/réimporter à la main (Réglages → Sauvegarde, ou l'onboarding).
- Le code contient l'intégralité du progrès et suit d'un appareil à l'autre.

## Fonctionnalités

- **Évolution de personnage** (pixel art) : le héros grandit avec les journées tenues — L'Ombre → L'Éveillé → L'Apprenti → Le Combattant → Le Chevalier → Le Champion → Le Souverain, avec écran d'évolution à chaque palier.
- **Un seul intrant obligatoire par jour** : valider sa journée (+20 pts).
- **Quêtes du jour** : 3 quêtes auto-générées (Corps, Esprit, Vie, Social) pensées pour un gars de 25 ans — entraînement, lecture, cuisine, appels, projet perso… +10 pts chacune, cochables d'un tap.
- **Bouclier (poka-yoke)** : guides pas à pas pour bloquer réellement le contenu adulte au niveau du téléphone (Temps d'écran iPhone, DNS privé Android, DNS familial maison, verrouillage de réinstallation d'apps), +15 pts par verrou.
- **SOS anti-envie** : respiration guidée 4-4-6, rappel des raisons, règle des 10 minutes avec minuteur et actions de diversion.
- **Récompenses réelles personnalisables** aux jalons 3, 7, 14, 21 et 30 journées tenues.
- **13 badges**, lignée d'évolution complète, calendrier des 30 jours, meilleure série, temps récupéré.
- **Raisons visuelles** affichées sur l'écran principal et dans le SOS.
- **Gestion compatissante des rechutes** : la série repart, pas le personnage ; déclencheur noté pour mieux se protéger.

## Fichiers

- `index.html` — version autonome complète, servie par GitHub Pages (à ouvrir directement).
- `app.html` — même contenu au format Artifact (sans squelette HTML), source de la version hébergée sur claude.ai.
- `manifest.webmanifest`, `sw.js`, `icon-*.png` — installation PWA et fonctionnement hors-ligne.

---

# Organisation du dépôt

- `index.html`, `app.html`, `manifest.webmanifest`, `sw.js`, `icon-*.png` — app **Reprise** (racine du site).
- `app-aout/` — code source de l'app **Défis d'août** (Vite + React + Tailwind).
- `aout/` — build publié de **Défis d'août**, généré par `npm run build` (à ne pas modifier à la main).
- `.github/workflows/pages.yml` — déploiement automatique de tout le dépôt sur GitHub Pages.
