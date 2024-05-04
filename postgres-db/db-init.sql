-- Create two users for the DB, ie postgres_write and postgres_read
DO $do$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres_write') THEN
        CREATE ROLE postgres_write;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres_read') THEN
        CREATE ROLE postgres_read;
        GRANT postgres_read TO postgres_write;
    END IF;
END
$do$;

-- Get the users passwords from env variables.
ALTER ROLE postgres_read WITH LOGIN PASSWORD 'password';
ALTER ROLE postgres_write WITH LOGIN PASSWORD 'password';
GRANT CONNECT ON DATABASE postgres_db TO postgres_read;
GRANT ALL PRIVILEGES ON DATABASE postgres_db TO postgres_write;

-- Connect to the database to run migrations.
\connect postgres_db;

-- Grant all read permissions to pq_read user
GRANT USAGE ON SCHEMA public TO postgres_read;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO postgres_read;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres_read;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO postgres_read;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO postgres_read;
ALTER DEFAULT PRIVILEGES FOR USER postgres_write IN SCHEMA public GRANT SELECT ON TABLES TO postgres_read;
ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public GRANT SELECT ON TABLES TO postgres_read;

-- Grant all read permissions to postgres_write user
GRANT CREATE ON SCHEMA public TO postgres_write;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres_write;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres_write;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO postgres_write;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO postgres_write;
ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO postgres_write;

-- Create all required tables below.
CREATE TABLE public.uploaded_images (
    id TEXT PRIMARY KEY,
    image_url TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    metadata TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.user_query_logs (
    id BIGSERIAL PRIMARY KEY,
    query TEXT,
    images TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
