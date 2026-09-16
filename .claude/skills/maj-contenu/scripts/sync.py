#!/usr/bin/env python3
"""Synchronise le contenu de ./sources vers ./app.

- Apparie chaque chapitre source par son préfixe numérique : "N - Titre.md" + "N - Titre.mp3"
- Copie l'audio dans app/assets/audio/NN-slug.mp3
- Copie (et redimensionne) les images dans app/assets/images/
- Régénère app/config/chapters.json
- Supprime les fichiers orphelins des dossiers assets gérés

Usage : python3 sync.py [--dry-run] [--racine CHEMIN]
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import unicodedata

LARGEUR_MAX_IMAGE = 1600  # px, côté le plus long
EXT_IMAGES = (".jpg", ".jpeg", ".png", ".webp")
EXT_AUDIO = (".mp3", ".m4a", ".wav", ".ogg")


def slug(texte):
    texte = unicodedata.normalize("NFKD", texte)
    texte = "".join(c for c in texte if not unicodedata.combining(c))
    texte = re.sub(r"[^a-zA-Z0-9]+", "-", texte).strip("-").lower()
    return re.sub(r"-{2,}", "-", texte) or "chapitre"


def prefixe_num(nom):
    m = re.match(r"\s*(\d+)\s*[-–_.]\s*(.+)", nom)
    if not m:
        return None, nom
    return int(m.group(1)), m.group(2).strip()


def titre_depuis_md(chemin, repli):
    try:
        with open(chemin, encoding="utf-8") as f:
            for ligne in f:
                ligne = ligne.strip()
                if ligne.startswith("#"):
                    return ligne.lstrip("#").strip()
                if ligne:
                    break
    except OSError:
        pass
    return repli


def lister_chapitres(dossier):
    """Retourne [(num, titre, chemin_md|None, chemin_audio|None)] trié par num."""
    par_num = {}
    if not os.path.isdir(dossier):
        return []
    for nom in sorted(os.listdir(dossier)):
        base, ext = os.path.splitext(nom)
        ext = ext.lower()
        if ext not in EXT_AUDIO + (".md", ".txt"):
            continue
        num, reste = prefixe_num(base)
        if num is None:
            continue
        entree = par_num.setdefault(num, {"titre": reste, "md": None, "audio": None})
        chemin = os.path.join(dossier, nom)
        if ext in EXT_AUDIO:
            entree["audio"] = chemin
        else:
            entree["md"] = chemin
    sortie = []
    for num in sorted(par_num):
        e = par_num[num]
        titre = titre_depuis_md(e["md"], e["titre"]) if e["md"] else e["titre"]
        sortie.append((num, titre, e["md"], e["audio"]))
    return sortie


def lister_images(dossier):
    if not os.path.isdir(dossier):
        return []
    noms = [n for n in os.listdir(dossier) if n.lower().endswith(EXT_IMAGES)]

    def cle(n):
        num, _ = prefixe_num(os.path.splitext(n)[0])
        if num is None:
            m = re.match(r"\s*(\d+)", os.path.splitext(n)[0])
            num = int(m.group(1)) if m else 10**6
        return (num, n.lower())

    return [os.path.join(dossier, n) for n in sorted(noms, key=cle)]


def copier_image(src, dest, dry_run):
    if dry_run:
        return
    shutil.copy2(src, dest)
    if shutil.which("sips"):
        subprocess.run(
            ["sips", "-Z", str(LARGEUR_MAX_IMAGE), dest],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
        )


def nettoyer(dossier, gardes, dry_run, journal):
    if not os.path.isdir(dossier):
        return
    for nom in sorted(os.listdir(dossier)):
        if nom.startswith("."):
            continue
        if nom not in gardes:
            journal.append("supprimé  " + os.path.join(dossier, nom))
            if not dry_run:
                os.remove(os.path.join(dossier, nom))


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--racine", default=None)
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    racine = args.racine or os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "..")
    )
    sources = os.path.join(racine, "sources")
    app = os.path.join(racine, "app")
    dossier_audio = os.path.join(app, "assets", "audio")
    dossier_images = os.path.join(app, "assets", "images")
    chemin_config = os.path.join(app, "config", "chapters.json")

    if not os.path.isdir(sources):
        sys.exit("Dossier introuvable : " + sources)
    if not os.path.isdir(app):
        sys.exit("Dossier introuvable : " + app)

    chapitres_src = lister_chapitres(os.path.join(sources, "chapitres"))
    if not chapitres_src:
        sys.exit("Aucun chapitre trouvé dans sources/chapitres (attendu : 'N - Titre.md' / 'N - Titre.mp3')")
    images_src = lister_images(os.path.join(sources, "images"))

    # mapping manuel optionnel : sources/mapping.json -> {"1": "4.jpeg", ...}
    mapping = {}
    chemin_mapping = os.path.join(sources, "mapping.json")
    if os.path.isfile(chemin_mapping):
        with open(chemin_mapping, encoding="utf-8") as f:
            mapping = {str(k): v for k, v in json.load(f).items()}

    if not args.dry_run:
        os.makedirs(dossier_audio, exist_ok=True)
        os.makedirs(dossier_images, exist_ok=True)
        os.makedirs(os.path.dirname(chemin_config), exist_ok=True)

    journal = []
    audio_gardes, images_gardes = set(), set()
    chapitres = []
    avertissements = []

    for rang, (num, titre, chemin_md, chemin_audio) in enumerate(chapitres_src):
        ident = "%02d" % num
        base = ident + "-" + slug(titre)

        nom_audio = None
        if chemin_audio:
            nom_audio = base + os.path.splitext(chemin_audio)[1].lower()
            dest = os.path.join(dossier_audio, nom_audio)
            journal.append("audio     " + os.path.basename(chemin_audio) + "  ->  assets/audio/" + nom_audio)
            if not args.dry_run:
                shutil.copy2(chemin_audio, dest)
            audio_gardes.add(nom_audio)
        else:
            avertissements.append("Chapitre %s (%s) : aucun fichier audio dans les sources" % (ident, titre))

        src_img = None
        if str(num) in mapping:
            candidat = os.path.join(sources, "images", mapping[str(num)])
            if os.path.isfile(candidat):
                src_img = candidat
            else:
                avertissements.append("mapping.json : image introuvable %s (chapitre %s)" % (mapping[str(num)], ident))
        if src_img is None and images_src:
            src_img = images_src[rang % len(images_src)]

        nom_image = None
        if src_img:
            nom_image = base + os.path.splitext(src_img)[1].lower().replace(".jpeg", ".jpg")
            dest = os.path.join(dossier_images, nom_image)
            journal.append("image     " + os.path.basename(src_img) + "  ->  assets/images/" + nom_image)
            copier_image(src_img, dest, args.dry_run)
            images_gardes.add(nom_image)
        else:
            avertissements.append("Chapitre %s (%s) : aucune image disponible" % (ident, titre))

        chapitre = {"id": ident, "titre": titre}
        if nom_image:
            chapitre["image"] = "assets/images/" + nom_image
        if nom_audio:
            chapitre["audio"] = "assets/audio/" + nom_audio
        if chemin_md:
            chapitre["source"] = os.path.relpath(chemin_md, racine)
        chapitres.append(chapitre)

    nettoyer(dossier_audio, audio_gardes, args.dry_run, journal)
    nettoyer(dossier_images, images_gardes, args.dry_run, journal)

    # conserve les réglages généraux existants
    config = {
        "titre": "Sur les pas de saint Germain d'Auxerre",
        "sousTitre": "Touchez un chapitre pour l'écouter",
        "credits": "Église Saint-Germain-l'Auxerrois — parcours de visite",
        "autoplayALOuverture": False,
    }
    if os.path.isfile(chemin_config):
        try:
            with open(chemin_config, encoding="utf-8") as f:
                ancien = json.load(f)
            for cle in ("titre", "sousTitre", "credits", "autoplayALOuverture"):
                if cle in ancien:
                    config[cle] = ancien[cle]
        except (OSError, ValueError) as err:
            avertissements.append("Ancien chapters.json illisible (%s), valeurs par défaut utilisées" % err)

    config["_aide"] = (
        "Fichier généré par le skill maj-contenu depuis ./sources — "
        "ne pas éditer à la main : relancez le skill après avoir modifié les sources. "
        "Les réglages titre / sousTitre / credits / autoplayALOuverture sont conservés d'une génération à l'autre."
    )
    config["chapitres"] = chapitres

    journal.append("config    %d chapitre(s) -> config/chapters.json" % len(chapitres))
    if not args.dry_run:
        with open(chemin_config, "w", encoding="utf-8") as f:
            json.dump(config, f, ensure_ascii=False, indent=2)
            f.write("\n")

    prefixe = "[dry-run] " if args.dry_run else ""
    for ligne in journal:
        print(prefixe + ligne)
    if avertissements:
        print("\nAvertissements :")
        for a in avertissements:
            print("  ! " + a)
    print("\n%s%d chapitre(s) synchronisé(s)." % (prefixe, len(chapitres)))


if __name__ == "__main__":
    main()
