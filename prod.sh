#!/bin/bash
cat .env.example > .env
#cat .docker/postgresql-extra.conf > .docker/database/postgresql/postgresql.conf
#rm -rf .docker/database/postgresql
#rm -rf .docker/database/mongodb
npm install
cd frontend
npm install
npm run build
cat .env.example > .env
cd ..
docker compose -f ./docker-compose.yml down
docker compose -f ./docker-compose-dev.yml down
docker compose -f docker-compose.yml up --build #-d