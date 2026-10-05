# La Ponte Vecchio

Site de démonstration pour la pizzeria La Ponte Vecchio (Cesson-Sévigné).
Vite + TypeScript, animations GSAP (ScrollTrigger) et défilement fluide Lenis.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # vérification TypeScript + build dans dist/
npm run preview    # servir le build
```

## Mise en ligne (GitHub Pages)

Chaque `git push` sur `main` lance `.github/workflows/deploy.yml`, qui construit le site et le
publie sur https://azizbahloul.github.io/La-ponte-vecchio/. Réglage unique : dans le dépôt,
Settings → Pages → Source : **GitHub Actions**. Avancement : onglet Actions du dépôt.
Avec un domaine personnalisé, rien à changer dans le code : le chemin de base se règle tout seul.

## Modifier le contenu

Tout le contenu est dans `src/data/` :

| Fichier | Contenu |
|---|---|
| `restaurant.ts` | nom, téléphone, adresse, horaires, services, liens du menu |
| `menu.ts` | catégories, plats, prix, étiquettes (végétarienne, piquante…) |
| `content.ts` | plat du jour, étapes « De la pâte au four », galerie, avis, ingrédients |
| `booking.ts` | créneaux, envoi du formulaire (`endpoint` Formspree ou `email`) |

Les photos et vidéos sont dans `public/media/` (Unsplash, Pexels, Mixkit : licences libres).
Carte, prix, avis et photos sont **indicatifs** : à remplacer par ceux du restaurant.

La maquette d'origine et la feuille de route de mise en ligne sont dans `docs/`.
