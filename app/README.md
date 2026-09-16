# Sur les pas de saint Germain d'Auxerre — borne tactile

Application autonome (HTML/CSS/JS), sans dépendance internet, pour une
tablette de musée. Le visiteur touche un chapitre sur l'écran d'accueil,
regarde l'illustration et écoute le commentaire audio correspondant.

## Démarrer l'application

Les navigateurs bloquent par sécurité la lecture de fichiers `config/*.json`
quand on ouvre `index.html` directement par double-clic. Il faut donc lancer
un petit serveur **local** (aucune connexion internet requise — il ne fait
que servir les fichiers du dossier sur la machine elle-même) :

- **macOS / Linux** : double-cliquez sur `demarrer-mac.command`
  (la première fois, clic droit → Ouvrir, pour autoriser le script).
- **Windows** : double-cliquez sur `demarrer-windows.bat`.

Le script ouvre automatiquement le navigateur sur la borne. Pour un vrai
mode borne (plein écran, sans barre d'adresse), configurez le navigateur en
mode kiosque pointant vers `http://localhost:8642/` (ex. Chrome :
`chrome --kiosk http://localhost:8642/`).

Si votre solution de borne dispose déjà de son propre serveur local ou
lanceur, vous pouvez ignorer les scripts `.command` / `.bat` et simplement
pointer ce lanceur vers le dossier `sgda-borne`.

## Modifier les chapitres

Tout se règle dans **`config/chapters.json`** :

```json
{
  "id": "01",
  "titre": "Une jeunesse à Auxerre",
  "image": "assets/images/scene-1.jpg",
  "audio": "assets/audio/01-jeunesse.mp3"
}
```

- `titre` : texte affiché sur la vignette d'accueil et l'écran du chapitre.
- `image` : chemin vers l'illustration (dans `assets/images/`).
- `audio` : chemin vers le fichier son (dans `assets/audio/`, mp3 ou wav).
- L'ordre des chapitres dans le fichier = l'ordre d'affichage.
- Ajoutez ou supprimez des chapitres en ajoutant/retirant des blocs `{ }`
  dans le tableau `chapitres`.
- `titre` et `sousTitre` en haut du fichier règlent le titre général de
  l'écran d'accueil.
- `autoplayALOuverture` : mettez `true` si le son doit démarrer seul dès
  qu'on ouvre un chapitre (par défaut `false` : le visiteur touche play).

Après modification, enregistrez le fichier et rechargez la page — pas besoin
de relancer le serveur.

## Remplacer les sons

Les fichiers dans `assets/audio/` sont pour l'instant des **silences d'une
seconde** (placeholders), pour que l'application fonctionne dès l'ouverture.
Remplacez-les par vos véritables enregistrements en gardant le même nom de
fichier (ou changez le champ `audio` dans `chapters.json` si vous renommez).

## Remplacer ou ajouter des illustrations

Les trois images fournies en référence sont dans `assets/images/` :
`scene-1.jpg`, `scene-2.jpg`, `scene-3.jpg`. Plusieurs chapitres peuvent
pointer vers la même image (utile si une frise illustre plusieurs épisodes),
ou vous pouvez ajouter une image par chapitre en déposant de nouveaux
fichiers dans ce dossier et en mettant à jour `chapters.json`.

## Arborescence

```
sgda-borne/
├── index.html
├── demarrer-mac.command
├── demarrer-windows.bat
├── css/style.css
├── js/app.js
├── config/chapters.json
└── assets/
    ├── images/   (scene-1.jpg, scene-2.jpg, scene-3.jpg)
    └── audio/    (un fichier son par chapitre)
```

## Fonctionnalités

- Écran d'accueil avec sommaire illustré, touche pour ouvrir un chapitre.
- Un chapitre = une illustration + un titre + un lecteur audio (lecture,
  pause, barre de progression tactile, temps écoulé/total).
- Navigation entre chapitres par flèches, pastilles, glissement tactile
  (swipe) ou flèches du clavier.
- Bouton retour au sommaire toujours visible.
- Fonctionne entièrement hors-ligne une fois le serveur local lancé.
