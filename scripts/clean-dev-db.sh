#!/bin/bash
set -e

ENV_FILE=".env.development"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ $ENV_FILE not found"
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

psql "postgres://$DB_USERNAME:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" \
  -v ON_ERROR_STOP=1 \
  -v EXPECTED_DB="$DB_NAME" \
  -f scripts/utils/wipe-db.sql
