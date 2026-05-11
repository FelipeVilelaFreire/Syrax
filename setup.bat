@echo off
chcp 65001 > nul
title Syrax - Setup / Reset (Aguarde...)

set "PROJECT_PATH=%~dp0"
set "PROJECT_PATH=%PROJECT_PATH:~0,-1%"

cd /d "%PROJECT_PATH%"

:: -------------------------------------------------------
:: Detecta ambiente Python disponivel (conda > venv)
:: -------------------------------------------------------
set "USE_CONDA=0"
where conda >nul 2>&1
if %errorlevel% == 0 set "USE_CONDA=1"

if "%USE_CONDA%"=="1" (
    echo [INFO] Conda detectado ^> usando env conda "syrax"
) else (
    echo [INFO] Conda nao encontrado ^> usando Python venv
    where python >nul 2>&1
    if errorlevel 1 (
        echo.
        echo ERRO: Python nao encontrado.
        echo Instale Python 3.12+ ^(python.org^) ou Conda ^(anaconda.com^) e tente novamente.
        pause
        exit /b 1
    )
)

echo.
echo [CHECK] Verificando Node.js / npm...
where npm >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERRO: Node.js / npm nao encontrado.
    echo Instale Node.js 18+ em https://nodejs.org e tente novamente.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('npm --version') do echo [OK] npm %%v encontrado

echo.
echo ==========================================
echo [1/5] Preparando ambiente Python...
echo ==========================================

if "%USE_CONDA%"=="1" (
    call conda deactivate >nul 2>&1
    call conda env remove -n syrax -y >nul 2>&1
    call conda create -n syrax python=3.12 -y
    if errorlevel 1 (
        echo ERRO ao criar env conda. Verifique sua instalacao do Conda.
        pause
        exit /b 1
    )
    call conda activate syrax
) else (
    cd /d "%PROJECT_PATH%\backend"
    if exist .venv rmdir /s /q .venv
    python -m venv .venv
    call "%PROJECT_PATH%\backend\.venv\Scripts\activate.bat"
)

echo.
echo ==========================================
echo [2/5] Backend (Django + SQLite)...
echo ==========================================
cd /d "%PROJECT_PATH%\backend"

python -m pip install --upgrade pip
python -m pip install -r requirements.txt

if not exist .env copy .env.example .env >nul

:: Garante __init__.py em cada pasta migrations/
if not exist "apps\core\migrations\__init__.py"         type nul > "apps\core\migrations\__init__.py"
if not exist "apps\users\migrations\__init__.py"        type nul > "apps\users\migrations\__init__.py"
if not exist "apps\companies\migrations\__init__.py"    type nul > "apps\companies\migrations\__init__.py"
if not exist "apps\leads\migrations\__init__.py"        type nul > "apps\leads\migrations\__init__.py"
if not exist "apps\integrations\migrations\__init__.py" type nul > "apps\integrations\migrations\__init__.py"
if not exist "apps\webhooks\migrations\__init__.py"     type nul > "apps\webhooks\migrations\__init__.py"

if exist db.sqlite3 del /q db.sqlite3

python manage.py makemigrations users companies leads integrations webhooks
python manage.py migrate

echo.
echo ==========================================
echo [3/5] Web (Next.js)...
echo ==========================================
cd /d "%PROJECT_PATH%\web"
if not exist .env.local copy .env.example .env.local >nul
if exist node_modules rmdir /s /q node_modules
call npm install

echo.
echo ==========================================
echo [4/5] Admin Panel (Vite)...
echo ==========================================
cd /d "%PROJECT_PATH%\admin"
if not exist .env.local copy .env.example .env.local >nul
if exist node_modules rmdir /s /q node_modules
call npm install

echo.
echo ==========================================
echo [5/5] Criar super-admin SYRAX
echo (Vai pedir Email, Name, Password, Password again.)
echo ==========================================
cd /d "%PROJECT_PATH%\backend"
python manage.py createsuperuser

echo.
echo ==========================================
echo TUDO PRONTO!
echo - Backend  : http://localhost:8001
echo - Web      : http://localhost:3000
echo - Admin    : http://localhost:5173
echo.
echo Aperte uma tecla para abrir os 3 servidores...
echo ==========================================
pause >nul

:: Monta comando de ativacao do backend conforme o ambiente detectado
if "%USE_CONDA%"=="1" (
    set "BACKEND_START=call conda activate syrax && python manage.py runserver 8001 --settings=config.settings.development"
) else (
    set "BACKEND_START=call %PROJECT_PATH%\backend\.venv\Scripts\activate.bat && python manage.py runserver 8001 --settings=config.settings.development"
)

wt -d "%PROJECT_PATH%" cmd /k "claude" ; ^
new-tab -d "%PROJECT_PATH%\backend" cmd /k "%BACKEND_START%" ; ^
split-pane -V -d "%PROJECT_PATH%\web" cmd /k "npm run dev" ; ^
split-pane -V -d "%PROJECT_PATH%\admin" cmd /k "npm run dev"

exit
