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
- `.github/workflows/pages.yml` — déploiement automatique sur GitHub Pages.
