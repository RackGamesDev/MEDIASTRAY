#!/bin/bash
cat .env.example > .env
cd frontend
cat .env.example > .env
cd ..
docker compose -f ./docker-compose.yml down
docker compose -f docker-compose.yml up --build