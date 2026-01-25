CREATE INDEX IF NOT EXISTS idx_users_search
    ON users USING GIN(
        to_tsvector('simple',
            COALESCE(firstname, '') || ' ' ||
            COALESCE(lastname, '') || ' ' ||
            COALESCE(username, '') || ' ' ||
            COALESCE(email, '')
    )
);