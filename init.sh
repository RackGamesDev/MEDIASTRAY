#!/bin/bash
docker compose -f docker-compose.yml down
docker compose -f docker-compose-monitorize.yml down
mkdir .docker/database/mongodb
mkdir .docker/database/postgresql
#cd frontend
#npm install
#npm run build
#cd ..
#cd backend
#npm install
#cd ..
docker compose -f docker-compose.yml up --build -d
docker compose -f docker-compose-monitorize.yml up --build -d


#docker compose -f docker-compose.yml down ; docker compose -f docker-compose.yml up --build
