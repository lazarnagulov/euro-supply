CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_users_search
    ON users USING GIN(
        to_tsvector('simple',
            COALESCE(firstname, '') || ' ' ||
            COALESCE(lastname, '') || ' ' ||
            COALESCE(username, '') || ' ' ||
            COALESCE(email, '')
    )
);

CREATE INDEX IF NOT EXISTS idx_vehicle_registration_trgm
    ON vehicles USING GIN (registration_number gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_product_name_trgm
    ON products USING GIN (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_product_description_trgm
    ON products USING GIN (description gin_trgm_ops);