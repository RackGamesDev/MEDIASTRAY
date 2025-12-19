#!/bin/bash
cat .env.example > .env
cd frontend
cat .env.example > .env
cd ..
docker compose -f ./docker-compose-prod.yml down
docker compose -f docker-compose-prod.yml up --build