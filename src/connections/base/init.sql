-- CREATE EXTENSION pg_redis;
-- ALTER SYSTEM SET pg_redis_host = 'redis';
-- ALTER SYSTEM SET pg_redis_port = 6379;
-- ALTER SYSTEM SET pg_redis_password = '<YOUR_REDIS_PASSWORD>';
-- ALTER SYSTEM SET pg_redis_db = 0;
-- SELECT pg_reload_conf();


DROP TABLE IF EXISTS USUARIOS;

CREATE TABLE USUARIOS (
    id SERIAL PRIMARY KEY,        -- Unique identifier for each user (automatically incrementing)
    username VARCHAR(50) UNIQUE NOT NULL, -- User's username (must be unique and not empty)
    email VARCHAR(100) UNIQUE NOT NULL,  -- User's email address (must be unique and not empty)
    password_hash VARCHAR(255) NOT NULL,   -- Hashed password for security
    first_name VARCHAR(50),           -- User's first name (optional)
    last_name VARCHAR(50),            -- User's last name (optional)
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() at time zone 'utc') -- Timestamp when the user was created, automatically set to current time.
);