---
name: maj-contenu
description: Met à jour le contenu de la borne (app/config/chapters.json, audios et images) à partir des fichiers déposés dans ./sources. Utiliser quand on ajoute, remplace ou renomme un chapitre, un mp3 ou une illustration dans sources/, ou quand l'utilisateur dit "mets à jour le contenu", "resynchronise les sources", "j'ai ajouté un épisode".
---

# Mise à jour du contenu depuis ./sources

`./sources` est la source de vérité. `./app` est généré : ne jamais éditer
`app/config/chapters.json` ni les fichiers de `app/assets/` à la main.

## Structure attendue des sources

```
sources/
  chapitres/
    1 - Accroche.md          # titre du chapitre = premier titre H1 du fichier
    1 - Accroche.mp3         # audio du chapitre 1 (même préfixe numérique)
    2 - Jeunesse….md
    2 - Jeunesse….mp3
  images/
    1.JPG  2.JPG  …          # illustrations, triées par préfixe numérique
  mapping.json               # optionnel : {"1": "4.jpeg", "2": "1.JPG"}
```

Règles d'appariement :
- Le préfixe numérique (`N - `) fait l'identité du chapitre et son ordre d'affichage.
- `.md` et `.txt` donnent le titre ; extensions audio reconnues : mp3, m4a, wav, ogg.
- Sans `mapping.json`, les images sont attribuées dans l'ordre, en boucle si
  elles sont moins nombreuses que les chapitres.

## Procédure

1. Lancer une prévisualisation :
   ```bash
   python3 .claude/skills/maj-contenu/scripts/sync.py --dry-run
   ```
2. Lire le journal et les avertissements (chapitre sans audio, image manquante,
   entrée `mapping.json` invalide). Corriger les sources si besoin.
3. Appliquer :
   ```bash
   python3 .claude/skills/maj-contenu/scripts/sync.py
   ```
4. Vérifier que l'appli répond (serveur local sur le port 8642) :
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8642/config/chapters.json
   ```
   Si aucun serveur ne tourne : `cd app && python3 -m http.server 8642` en arrière-plan.
5. Résumer à l'utilisateur : nombre de chapitres, titres retenus, fichiers
   supprimés, avertissements restants.

## Ce que fait le script

- Copie chaque audio vers `app/assets/audio/NN-slug.ext`.
- Copie chaque image vers `app/assets/images/NN-slug.ext` et la redimensionne à
  1600 px sur le côté long via `sips` (macOS) quand il est disponible.
- Régénère `app/config/chapters.json` avec `id`, `titre`, `image`, `audio` et
  `source` (chemin du md d'origine).
- Conserve les réglages généraux existants : `titre`, `sousTitre`, `credits`,
  `autoplayALOuverture`. Ce sont les seules valeurs éditables à la main dans le
  JSON, et elles survivent aux regénérations.
- Supprime de `app/assets/audio/` et `app/assets/images/` tout fichier qui ne
  correspond plus à un chapitre source (nettoyage des placeholders et des
  anciens exports).

## Points d'attention

- Le texte des `.md` n'est pas affiché par la borne (`app/js/app.js` n'utilise
  que `id`, `titre`, `image`, `audio`). Il sert de source du titre et de
  référence. Pour l'afficher, il faudra d'abord modifier `app/js/app.js`.
- Les chapitres sans mp3 sont quand même écrits dans le JSON, sans champ
  `audio` : la borne affichera la vignette mais le lecteur restera muet. Le
  signaler à l'utilisateur.
- `sources/` est exclu du dépôt git (voir `.gitignore`) : les médias bruts ne
  sont pas versionnés, seuls les fichiers générés dans `app/` le sont.
