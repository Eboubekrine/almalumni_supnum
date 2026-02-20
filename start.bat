@echo off
echo ========================================
echo    Démarrage du Frontend (Interface)
echo ========================================
echo.

cd /d "%~dp0"

REM Vérifier si node_modules existe
if not exist "node_modules\" (
    echo Installation des dépendances...
    call npm install
    echo.
)

echo Démarrage de l'interface sur http://localhost:5173
echo.
echo L'application s'ouvrira automatiquement dans votre navigateur
echo Appuyez sur Ctrl+C pour arrêter
echo.

npm run dev
