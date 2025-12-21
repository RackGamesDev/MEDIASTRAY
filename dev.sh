#!/bin/bash
cat .env.example > .env
#cat .docker/postgresql-extra.conf > .docker/database/postgresql/postgresql.conf
#rm -rf .docker/database/postgresql
#rm -rf .docker/database/mongodb
npm install
cd frontend
cat .env.example > .env
npm install
npm run build
npm run dev -- --port 8520 &
cd ..
docker compose -f ./docker-compose-dev.yml down
docker compose -f ./docker-compose.yml down
docker compose -f docker-compose-dev.yml up --build
#docker exec -it mediastray-frontend /bin/sh
#cd /usr/share/nginx/html/frontend/app
#npm install
#npm run dev