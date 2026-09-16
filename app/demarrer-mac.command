#!/bin/bash
# Lance un serveur local (aucune connexion internet nécessaire)
# puis ouvre la borne dans le navigateur par défaut.
cd "$(dirname "$0")"
PORT=8642
open "http://localhost:$PORT/" &
python3 -m http.server "$PORT"
