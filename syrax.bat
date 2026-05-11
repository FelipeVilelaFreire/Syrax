@echo off
chcp 65001 > nul
title Syrax

for /d %%i in ("C:\Users\felip_x6n9d9e\OneDrive\Documentos\FELIPE\PROGRA*") do set "BASE_PATH=%%i"
set "PROJECT_PATH=%BASE_PATH%\Syrax"

wt -d "%PROJECT_PATH%" cmd /k "claude" ; ^
new-tab -d "%PROJECT_PATH%\backend" cmd /k "call conda activate syrax && python manage.py runserver 8001 --settings=config.settings.development" ; ^
split-pane -V -d "%PROJECT_PATH%\web" cmd /k "npm run dev" ; ^
split-pane -V -d "%PROJECT_PATH%\admin" cmd /k "npm run dev"

exit
