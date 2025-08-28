-- Core links table
CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('redirect','ab','calendar')),
    slug TEXT UNIQUE NOT NULL,              -- short slug e.g. "abcd12"
    redirect TEXT,
    description TEXT,
    hits INTEGER DEFAULT 0,
    created TIMESTAMPTZ DEFAULT now(),
    created_by INTEGER NULL,
    updated TIMESTAMPTZ DEFAULT now(),
    updated_by INTEGER NULL
);

-- A/B variants (N rows per link)
CREATE TABLE IF NOT EXISTS experiment (
    id SERIAL PRIMARY KEY,
    short_id INTEGER REFERENCES links(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    redirect TEXT NOT NULL,
    weight INTEGER NOT NULL CHECK (weight > 0),
    hits INTEGER DEFAULT 0,
    status INTEGER,
    created TIMESTAMPTZ DEFAULT now()
);

-- Calendar rules (N rows per link)
-- Start/end are inclusive start, exclusive end. Use UTC in DB.
CREATE TABLE IF NOT EXISTS calendar (
    id SERIAL PRIMARY KEY,
    short_id INTEGER REFERENCES links(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date   TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    recurrence INTEGER,
    frequency TEXT,
    rinterval INTEGER,
    rcount INTEGER,
    created TIMESTAMPTZ DEFAULT now()
    CHECK (end_date > start_date)
);