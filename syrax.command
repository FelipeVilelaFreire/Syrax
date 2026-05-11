#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# -------------------------------------------------------
# Detecta qual ambiente Python usar:
#   1. Conda com env "syrax"  (preferido)
#   2. venv em backend/.venv  (fallback)
# -------------------------------------------------------
ACTIVATE_CMD=""

if command -v conda &>/dev/null; then
    if conda env list 2>/dev/null | grep -q "^syrax"; then
        CONDA_BASE="$(conda info --base)"
        ACTIVATE_CMD="source '${CONDA_BASE}/etc/profile.d/conda.sh' && conda activate syrax"
    fi
fi

if [ -z "$ACTIVATE_CMD" ]; then
    if [ -f "$SCRIPT_DIR/backend/.venv/bin/activate" ]; then
        ACTIVATE_CMD="source '$SCRIPT_DIR/backend/.venv/bin/activate'"
    fi
fi

if [ -z "$ACTIVATE_CMD" ]; then
    echo ""
    echo "ERRO: Nenhum ambiente Python encontrado."
    echo "Execute setup.command primeiro para configurar o projeto."
    exit 1
fi

BACKEND_CMD="cd '$SCRIPT_DIR/backend' && $ACTIVATE_CMD && python manage.py runserver 8001 --settings=config.settings.development"
WEB_CMD="cd '$SCRIPT_DIR/web' && npm run dev"
ADMIN_CMD="cd '$SCRIPT_DIR/admin' && npm run dev"

# -------------------------------------------------------
# Abre 3 abas no Terminal do Mac via osascript
# -------------------------------------------------------
osascript <<EOF
tell application "Terminal"
    activate
    do script "$BACKEND_CMD"
    tell application "System Events" to keystroke "t" using command down
    delay 0.3
    do script "$WEB_CMD" in front window
    tell application "System Events" to keystroke "t" using command down
    delay 0.3
    do script "$ADMIN_CMD" in front window
end tell
EOF
