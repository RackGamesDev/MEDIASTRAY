-- CREATE EXTENSION pg_redis;
-- ALTER SYSTEM SET pg_redis_host = 'redis';
-- ALTER SYSTEM SET pg_redis_port = 6379;
-- ALTER SYSTEM SET pg_redis_password = '<YOUR_REDIS_PASSWORD>';
-- ALTER SYSTEM SET pg_redis_db = 0;
-- SELECT pg_reload_conf();


-- ACTUALMENTE ES UNA TABLA DE EJEMPLO

DROP TABLE IF EXISTS USUARIOS;

CREATE TABLE USUARIOS (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() at time zone 'utc')
);