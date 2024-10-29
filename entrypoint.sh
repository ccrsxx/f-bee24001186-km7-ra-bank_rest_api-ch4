#!/bin/sh

echo "Running migrations in production environment..."

npm run db:deploy

echo "Starting application in production mode..."

exec npm run start
