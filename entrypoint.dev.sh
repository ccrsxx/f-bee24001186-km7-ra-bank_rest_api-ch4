#!/bin/sh

echo "Installing dependencies for development environment..."

npm i

echo "Running migrations in development environment..."

npm run db:migrate

echo "Starting application in development mode..."

exec npm run dev
