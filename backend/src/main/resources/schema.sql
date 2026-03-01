CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE users ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (
    to_tsvector('simple',
    COALESCE(firstname, '') || ' ' ||
    COALESCE(lastname, '') || ' ' ||
    COALESCE(email, '') || ' ' ||
    COALESCE(username, '')
    )
    ) STORED;

CREATE INDEX IF NOT EXISTS idx_users_search_vector
    ON users USING GIN(search_vector);

CREATE INDEX IF NOT EXISTS idx_users_manager_active
    ON users(role, is_suspended)
    WHERE role = 'MANAGER' AND is_suspended = false;

CREATE INDEX IF NOT EXISTS idx_vehicle_registration_trgm
    ON vehicles USING GIN (registration_number gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_product_name_trgm
    ON products USING GIN (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_product_description_trgm
    ON products USING GIN (description gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_factory_name_trgm
    ON factories USING GIN (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_factory_address_trgm
    ON factories USING GIN (address gin_trgm_ops);