#!/usr/bin/env bash

set -e

# Poetry command to run Django management commands
RUN_MANAGE_PY='poetry run python -m backend.manage'
# INSERT INTO django_migrations (app, name, applied) VALUES ('validators', '0001_initial', NOW());
# INSERT INTO django_migrations (app, name, applied) VALUES ('validators', '0002_validatorhistory', NOW());
# $RUN_MANAGE_PY makemigrations --empty validators --name add_covered_field
# $RUN_MANAGE_PY migrate validators
# rm backend/apps/validators/migrations/000*


# Collect static files and run migrations
echo 'Collecting static files...'
$RUN_MANAGE_PY collectstatic --no-input

echo 'Running migrations...'
$RUN_MANAGE_PY migrate --no-input

# Start the server in the background
poetry run python -m backend.manage runserver 0.0.0.0:8000 &

# Wait for the server to start
echo 'Waiting for the server to start...'
until curl -sSf http://localhost:8000/api/validators > /dev/null; do
  sleep 15
done


# Define cron job schedule and command
CRON_ENTRY="*/15 * * * * /opt/project/fetch_validators.sh"

# Check if the cron service is running
if ! pgrep cron > /dev/null 2>&1; then
  echo 'Cron service is not running. Starting cron service...'
  service cron start
fi


# Add cron job using crontab command (safe and reliable)
current_crontab=$(crontab -l 2>/dev/null || true)
if echo "$current_crontab" | grep -q "$CRON_ENTRY"; then
  echo "Cron job already exists."
else
  (echo "$current_crontab"; echo "$CRON_ENTRY") | crontab -
  echo "Cron job added successfully!"
fi

# Verify the cron job has been added
echo "Current crontab:"
crontab -l

# Keep the script running to keep the server running
wait