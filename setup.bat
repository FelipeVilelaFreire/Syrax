@echo off
chcp 65001 > nul
title Syrax - Setup / Reset (Aguarde...)

:: Resolve o caminho do projeto (lida com PROGRAMAÇÃO)
for /d %%i in ("C:\Users\felip_x6n9d9e\OneDrive\Documentos\FELIPE\PROGRA*") do set "BASE_PATH=%%i"
set "PROJECT_PATH=%BASE_PATH%\Syrax"

cd /d "%PROJECT_PATH%"

echo.
echo ==========================================
echo [1/5] Resetando ambiente Conda (syrax)...
echo ==========================================
call conda deactivate >nul 2>&1
call conda env remove -n syrax -y >nul 2>&1
call conda create -n syrax python=3.12 -y
if errorlevel 1 (
  echo.
  echo ERRO ao criar env conda. Verifique se conda esta instalado.
  pause
  exit /b 1
)

echo.
echo ==========================================
echo [2/5] Backend (Django + SQLite)...
echo ==========================================
call conda activate syrax
cd /d "%PROJECT_PATH%\backend"

:: Usa "python -m pip" pra garantir que pip rode dentro do env syrax
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

:: Apaga DB antigo se existir (start limpo)
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
echo (Use um email e senha. Vai pedir Email, Name, Password, Password again.)
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

:: Abre Windows Terminal: aba Claude + aba com 3 paineis
wt -d "%PROJECT_PATH%" cmd /k "claude" ; ^
new-tab -d "%PROJECT_PATH%\backend" cmd /k "call conda activate syrax && python manage.py runserver 8001 --settings=config.settings.development" ; ^
split-pane -V -d "%PROJECT_PATH%\web" cmd /k "npm run dev" ; ^
split-pane -V -d "%PROJECT_PATH%\admin" cmd /k "npm run dev"

exit
