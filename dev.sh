#!/bin/bash
cd frontend
npm install
cd ../backend
npm install
cd ..
docker compose -f ./docker-compose-dev.yml down
docker compose -f docker-compose-dev.yml up --build -d
docker exec -it mediastray-frontend /bin/sh
cd /usr/share/nginx/html/frontend/app
npm install
npm run dev