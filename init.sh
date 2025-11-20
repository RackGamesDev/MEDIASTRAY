#!/bin/bash
docker compose down
mkdir .docker/database/elasticsearch
mkdir .docker/database/mongodb
mkdir .docker/database/postgresql
cd frontend
npm install
npm run build
cd ..
cd backend
npm install
cd ..
docker-compose up --build