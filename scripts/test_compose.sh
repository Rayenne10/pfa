#!/usr/bin/env bash
set -euo pipefail
mkdir -p verification
cleanup() {
  docker compose start auth-service >/dev/null 2>&1 || true
  docker compose logs --no-color > verification/compose.log 2>&1 || true
  docker compose down --remove-orphans
}
trap cleanup EXIT
docker compose up -d --wait --wait-timeout 240
python scripts/smoke.py --output verification/compose-receipt.json
docker compose stop auth-service
python scripts/smoke.py --alert firing --output verification/compose-firing.json
docker compose start auth-service
python scripts/smoke.py --alert resolved --output verification/compose-resolved.json
