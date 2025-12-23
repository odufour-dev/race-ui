-- Structure initiale de la base de données
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
    type TEXT,             -- 'stage' ou 'general'
    data JSON NOT NULL,
    PRIMARY KEY (stage_id, type)
);

-- On initialise la config avec un objet vide par défaut
INSERT OR IGNORE INTO race_info (id, config) VALUES (1, '{}');