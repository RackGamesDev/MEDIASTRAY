#!/bin/bash
cat .env.example > .env
#cat .docker/postgresql-extra.conf > .docker/database/postgresql/postgresql.conf
#rm -rf .docker/database/postgresql
#rm -rf .docker/database/mongodb
#cat src/controllers/validaciones.js > frontend/src/libraries/validacionesBackend.js
npm install
cd frontend
npm install
npm run build
cat .env.example > .env
cd ..
docker compose -f ./docker-compose.yml down
docker compose -f ./docker-compose-dev.yml down
docker compose -f docker-compose.yml up --build #-d

#En producción, seguramente las bases de datos se desplieguen en AtlasDB, Redis Cloud y ElephantSQL usando las free tier (cualquier usuario usando este código es libre de usarlas de cualquier manera)