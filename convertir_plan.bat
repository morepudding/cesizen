@echo off
echo ================================================
echo   Conversion Plan de Maintenance Cesizen
echo   Markdown vers Word (DOCX)
echo ================================================
echo.

echo [1/3] Verification de Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Python n'est pas installe ou pas dans le PATH
    echo Installez Python depuis https://python.org
    pause
    exit /b 1
)
echo Python detecte ✓

echo.
echo [2/3] Installation des dependances...
pip install python-docx markdown
if errorlevel 1 (
    echo ERREUR: Echec de l'installation des dependances
    pause
    exit /b 1
)
echo Dependances installees ✓

echo.
echo [3/3] Conversion du document...
if not exist "plan_maintenance_cesizen.md" (
    echo ERREUR: Le fichier plan_maintenance_cesizen.md n'existe pas
    pause
    exit /b 1
)

python convert_md_to_docx.py
if errorlevel 1 (
    echo ERREUR: Echec de la conversion
    pause
    exit /b 1
)

echo.
echo ================================================
echo   CONVERSION TERMINEE AVEC SUCCES !
echo ================================================
echo.
echo Le fichier Plan_Maintenance_Cesizen.docx a ete cree.
echo.
pause
