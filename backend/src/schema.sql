-- Database initial structure
CREATE TABLE IF NOT EXISTS metadata (
    id TEXT PRIMARY KEY,
    name TEXT, 
);

CREATE TABLE IF NOT EXISTS racers (
    id INTEGER PRIMARY KEY,
    data JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS race_info (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    config JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS rankings (
    stage_id INTEGER,
    type TEXT,             -- 'stage' or 'general'
    data JSON NOT NULL,
    PRIMARY KEY (stage_id, type)
);

-- Initialize configuration with an empty object
INSERT OR IGNORE INTO race_info (id, config) VALUES (1, '{}');