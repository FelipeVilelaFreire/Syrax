@echo off
chcp 65001 > nul
title Syrax

set "PROJECT_PATH=%~dp0"
set "PROJECT_PATH=%PROJECT_PATH:~0,-1%"

set "PORT_BACKEND=8347"
set "PORT_WEB=4923"
set "PORT_ADMIN=6711"

:: -------------------------------------------------------
:: Detecta qual ambiente Python usar:
::   1. Conda com env "syrax"  (preferido)
::   2. venv em backend\.venv  (fallback)
:: -------------------------------------------------------
set "BACKEND_START="

where conda >nul 2>&1
if %errorlevel% == 0 (
    conda env list 2>nul | findstr /B "syrax" >nul 2>&1
    if %errorlevel% == 0 (
        set "BACKEND_START=call conda activate syrax && python manage.py runserver %PORT_BACKEND% --settings=config.settings.development"
    )
)

if "%BACKEND_START%"=="" (
    if exist "%PROJECT_PATH%\backend\.venv\Scripts\activate.bat" (
        set "BACKEND_START=call %PROJECT_PATH%\backend\.venv\Scripts\activate.bat && python manage.py runserver %PORT_BACKEND% --settings=config.settings.development"
    )
)

if "%BACKEND_START%"=="" (
    echo.
    echo ERRO: Nenhum ambiente Python encontrado.
    echo Execute setup.bat primeiro para configurar o projeto.
    pause
    exit /b 1
)

wt -d "%PROJECT_PATH%" cmd /k "claude" ; ^
new-tab -d "%PROJECT_PATH%\backend" cmd /k "%BACKEND_START%" ; ^
split-pane -V -d "%PROJECT_PATH%\web" cmd /k "npm run dev -- --port %PORT_WEB%" ; ^
split-pane -V -d "%PROJECT_PATH%\admin" cmd /k "npm run dev -- --port %PORT_ADMIN%"

exit
