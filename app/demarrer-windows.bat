@echo off
REM Lance un serveur local (aucune connexion internet necessaire)
REM puis ouvre la borne dans le navigateur par defaut.
cd /d "%~dp0"
set PORT=8642
start "" "http://localhost:%PORT%/"
python -m http.server %PORT%
if errorlevel 1 (
  py -m http.server %PORT%
)
