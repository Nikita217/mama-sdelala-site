#!/usr/bin/env bash
# Выкладка сайта на хостинг reg.ru по SSH-ключу (без пароля).
# Запуск: bash deploy.sh
set -euo pipefail
HOST="u3660787@31.31.196.230"
KEY="$HOME/.ssh/mama_sdelala_deploy"
REMOTE_DIR="www/mama-sdelala-zefir.ru"

cd "$(dirname "$0")"
git diff --quiet && git diff --cached --quiet || { echo "Есть незакоммиченные изменения: сначала commit и push."; exit 1; }
git push -q
tar -C site -czf - . | ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" \
  "mkdir -p '$REMOTE_DIR' && tar -xzf - -C '$REMOTE_DIR' && rm -f '$REMOTE_DIR/index.php' '$REMOTE_DIR/index.html.bak'"
echo "Готово: https://mama-sdelala-zefir.ru/"
