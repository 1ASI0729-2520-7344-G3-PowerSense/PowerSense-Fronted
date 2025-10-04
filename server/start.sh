#!/usr/bin/env bash
set -euo pipefail

# Start json-server on port 4000 (using v0.17.4 for routes support)
npx --yes json-server@0.17.4 --watch ./server/db.json --routes ./server/routes.json --port 4000 --host 0.0.0.0

