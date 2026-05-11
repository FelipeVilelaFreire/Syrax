#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================="
echo " Syrax - Setup / Reset"
echo "=========================================="

# -------------------------------------------------------
# Detecta ambiente Python (conda > venv)
# -------------------------------------------------------
USE_CONDA=0
if command -v conda &>/dev/null; then
    USE_CONDA=1
    echo "[INFO] Conda detectado → usando env conda 'syrax'"
else
    echo "[INFO] Conda não encontrado → usando Python venv"
    if ! command -v python3 &>/dev/null; then
        echo ""
        echo "ERRO: Python 3 não encontrado."
        echo "Instale Python 3.12+ em https://python.org ou Conda em https://anaconda.com"
        exit 1
    fi
    echo "[OK] Python $(python3 --version) encontrado"
fi

# -------------------------------------------------------
# Verifica Node.js / npm
# -------------------------------------------------------
echo ""
echo "[CHECK] Verificando Node.js / npm..."
if ! command -v npm &>/dev/null; then
    echo ""
    echo "ERRO: Node.js / npm não encontrado."
    echo "Instale Node.js 18+ em https://nodejs.org"
    exit 1
fi
echo "[OK] npm $(npm --version) encontrado"

# -------------------------------------------------------
# [1/5] Ambiente Python
# -------------------------------------------------------
echo ""
echo "=========================================="
echo "[1/5] Preparando ambiente Python..."
echo "=========================================="

if [ "$USE_CONDA" -eq 1 ]; then
    conda deactivate 2>/dev/null || true
    conda env remove -n syrax -y 2>/dev/null || true
    conda create -n syrax python=3.12 -y
    # shellcheck source=/dev/null
    source "$(conda info --base)/etc/profile.d/conda.sh"
    conda activate syrax
else
    cd "$SCRIPT_DIR/backend"
    rm -rf .venv
    python3 -m venv .venv
    # shellcheck source=/dev/null
    source "$SCRIPT_DIR/backend/.venv/bin/activate"
fi

# -------------------------------------------------------
# [2/5] Backend
# -------------------------------------------------------
echo ""
echo "=========================================="
echo "[2/5] Backend (Django + SQLite)..."
echo "=========================================="
cd "$SCRIPT_DIR/backend"

python -m pip install --upgrade pip
python -m pip install -r requirements.txt

[ ! -f .env ] && cp .env.example .env && echo "[OK] .env criado a partir de .env.example"

for app in core users companies leads integrations webhooks; do
    mkdir -p "apps/$app/migrations"
    touch "apps/$app/migrations/__init__.py"
done

[ -f db.sqlite3 ] && rm db.sqlite3

python manage.py makemigrations users companies leads integrations webhooks
python manage.py migrate

# -------------------------------------------------------
# [3/5] Web
# -------------------------------------------------------
echo ""
echo "=========================================="
echo "[3/5] Web (Next.js)..."
echo "=========================================="
cd "$SCRIPT_DIR/web"
[ ! -f .env.local ] && cp .env.example .env.local && echo "[OK] .env.local criado"
rm -rf node_modules
npm install

# -------------------------------------------------------
# [4/5] Admin
# -------------------------------------------------------
echo ""
echo "=========================================="
echo "[4/5] Admin Panel (Vite)..."
echo "=========================================="
cd "$SCRIPT_DIR/admin"
[ ! -f .env.local ] && cp .env.example .env.local && echo "[OK] .env.local criado"
rm -rf node_modules
npm install

# -------------------------------------------------------
# [5/5] Super-admin
# -------------------------------------------------------
echo ""
echo "=========================================="
echo "[5/5] Criar super-admin SYRAX"
echo "(Vai pedir: Email, Name, Password, Password again)"
echo "=========================================="
cd "$SCRIPT_DIR/backend"
python manage.py createsuperuser

echo ""
echo "=========================================="
echo " TUDO PRONTO!"
echo " - Backend : http://localhost:8001"
echo " - Web     : http://localhost:3000"
echo " - Admin   : http://localhost:5173"
echo ""
echo " Duplo clique em syrax.command para iniciar os servidores."
echo "=========================================="
